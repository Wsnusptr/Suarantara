import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  requireStaff,
  unauthorized,
  badRequest,
  serverError,
  getClientIp,
  rateLimit,
  tooManyRequests,
  sanitizeFields,
  type FieldSpec,
} from '@/lib/api-guard'

// ─── OBSERVATORIUM DATA: Metrik empiris lapangan ─────────────────────────────
const INDICATOR_FIELDS = {
  name: { type: 'string', max: 200 },
  metricValue: { type: 'string', max: 60 },
  metricSuffix: { type: 'string', max: 40 },
  statusNote: { type: 'string', max: 600 },
  textColor: { type: 'string', max: 60 },
  sortOrder: { type: 'int' },
} as const satisfies Record<string, FieldSpec>

// ─── REKOMENDASI KEBIJAKAN UTAMA ─────────────────────────────────────────────
const RECOMMENDATION_FIELDS = {
  title: { type: 'string', max: 200 },
  desc: { type: 'string', max: 1000 },
  sortOrder: { type: 'int' },
} as const satisfies Record<string, FieldSpec>

// ─── AGENDA MIMBAR RISET ─────────────────────────────────────────────────────
const EVENT_FIELDS = {
  title: { type: 'string', max: 400 },
  eventDatetime: { type: 'string', max: 120 },
  speakers: { type: 'string', max: 400 },
  eventType: { type: 'string', max: 120 },
  registrationUrl: { type: 'string', max: 1000 },
  isActive: { type: 'boolean' },
} as const satisfies Record<string, FieldSpec>

/**
 * GET /api/cms/research-meta
 * Mengambil seluruh metadata pilar Kajian: indikator observatorium,
 * rekomendasi kebijakan, dan agenda mimbar riset aktif.
 */
export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:research-meta:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const [indicators, recommendations, event] = await Promise.all([
      db.observatoryIndicator.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.policyRecommendationItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.researchEvent.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    ])

    return NextResponse.json({
      success: true,
      indicators,
      recommendations,
      event: event ?? null,
    })
  } catch (error) {
    console.error('Failed to fetch research meta:', error)
    return serverError('Gagal mengambil metadata kajian')
  }
}

// ─── WRITE HANDLERS (staf redaksi) ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menambah data kajian.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:research-meta:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const kind = typeof body.kind === 'string' ? body.kind : ''
    const payload = (body.data ?? {}) as Record<string, unknown>

    if (kind === 'indicator') {
      const data = sanitizeFields(payload, INDICATOR_FIELDS)
      if (!data.name || !data.metricValue) return badRequest('Nama indikator dan nilai metrik wajib diisi')
      const created = await db.observatoryIndicator.create({
        data: {
          name: data.name,
          metricValue: data.metricValue,
          metricSuffix: data.metricSuffix,
          statusNote: data.statusNote ?? '',
          textColor: data.textColor ?? 'text-navy',
          sortOrder: data.sortOrder ?? 0,
        },
      })
      return NextResponse.json({ success: true, item: created })
    }

    if (kind === 'recommendation') {
      const data = sanitizeFields(payload, RECOMMENDATION_FIELDS)
      if (!data.title || !data.desc) return badRequest('Judul dan deskripsi rekomendasi wajib diisi')
      const created = await db.policyRecommendationItem.create({
        data: {
          title: data.title,
          desc: data.desc,
          sortOrder: data.sortOrder ?? 0,
        },
      })
      return NextResponse.json({ success: true, item: created })
    }

    if (kind === 'event') {
      const data = sanitizeFields(payload, EVENT_FIELDS)
      if (!data.title) return badRequest('Judul agenda wajib diisi')
      const created = await db.researchEvent.create({
        data: {
          title: data.title,
          eventDatetime: data.eventDatetime ?? '',
          speakers: data.speakers ?? '',
          eventType: data.eventType ?? 'Webinar Terbuka',
          registrationUrl: data.registrationUrl ?? '#daftar',
          isActive: data.isActive ?? true,
        },
      })
      return NextResponse.json({ success: true, item: created })
    }

    return badRequest('Jenis data kajian tidak dikenali')
  } catch (error) {
    console.error('Failed to create research meta:', error)
    return serverError('Gagal menambah data kajian')
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus data kajian.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:research-meta:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const kind = searchParams.get('kind')
    const id = searchParams.get('id')
    if (!kind || !id) return badRequest('Jenis data dan ID wajib disertakan')

    if (kind === 'indicator') {
      await db.observatoryIndicator.delete({ where: { id } })
    } else if (kind === 'recommendation') {
      await db.policyRecommendationItem.delete({ where: { id } })
    } else if (kind === 'event') {
      await db.researchEvent.delete({ where: { id } })
    } else {
      return badRequest('Jenis data kajian tidak dikenali')
    }

    return NextResponse.json({ success: true, message: 'Data kajian berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete research meta:', error)
    return serverError('Gagal menghapus data kajian')
  }
}
