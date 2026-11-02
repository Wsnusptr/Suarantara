import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  requireStaff,
  unauthorized,
  badRequest,
  conflict,
  serverError,
  isUniqueConstraintError,
  getClientIp,
  rateLimit,
  tooManyRequests,
  sanitizeFields,
  type FieldSpec,
} from '@/lib/api-guard'

export const dynamic = 'force-dynamic'

// Field yang boleh ditulis klien (mencegah mass-assignment kolom sistem)
const CASE_FIELDS = {
  caseCode: { type: 'string', max: 80 },
  title: { type: 'string', max: 300 },
  slug: { type: 'slug' },
  campus: { type: 'string', max: 200 },
  category: { type: 'string', max: 60 },
  categoryLabel: { type: 'string', max: 120 },
  status: { type: 'string', max: 60 },
  statusLabel: { type: 'string', max: 160 },
  statusColor: { type: 'string', max: 200 },
  affectedCount: { type: 'string', max: 120 },
  lastUpdate: { type: 'string', max: 240 },
  progressPercent: { type: 'int' },
  dateDisplay: { type: 'string', max: 60 },
  isNationalPriority: { type: 'boolean' },
  alliedCount: { type: 'string', max: 120 },
  supportersCount: { type: 'string', max: 120 },
  leadBackground: { type: 'string', max: 4000 },
  coverImageUrl: { type: 'string', max: 600 },
  coverCaption: { type: 'string', max: 300 },
  coverCredit: { type: 'string', max: 300 },
  legalCounsel: { type: 'string', max: 200 },
  urgencyLevel: { type: 'string', max: 120 },
  timelineSteps: { type: 'string', max: 20000 },
  legalViolations: { type: 'string', max: 20000 },
  demands: { type: 'string', max: 20000 },
} as const satisfies Record<string, FieldSpec>

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:advocacy:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const rawCategory = searchParams.get('category')
    const category = rawCategory && rawCategory.length <= 60 ? rawCategory : undefined

    const cases = await db.advocacyCase.findMany({
      where: category && category !== 'semua' ? { category } : {},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, cases })
  } catch (error) {
    console.error('Failed to fetch advocacy cases:', error)
    return serverError('Gagal mengambil data advokasi')
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat kasus advokasi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:advocacy:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, CASE_FIELDS)
    const { caseCode, title, campus } = fields

    if (!caseCode || !title || !campus) {
      return badRequest('Kode kasus, judul, dan nama kampus wajib diisi')
    }

    const newCase = await db.advocacyCase.create({
      data: {
        ...fields,
        caseCode,
        title,
        campus,
        slug: fields.slug ?? caseCode,
        progressPercent: fields.progressPercent ?? 0,
        category: fields.category ?? 'ukt',
        categoryLabel: fields.categoryLabel ?? 'UKT & Biaya',
        status: fields.status ?? 'investigasi',
        statusLabel: fields.statusLabel ?? 'Tahap Investigasi',
        statusColor: fields.statusColor ?? 'bg-amber-100 text-amber-800 border-amber-300',
        affectedCount: fields.affectedCount ?? 'Dalam Pendataan',
        lastUpdate: fields.lastUpdate ?? '',
        dateDisplay: fields.dateDisplay ?? 'Baru Saja',
        isNationalPriority: fields.isNationalPriority ?? false,
      },
    })

    return NextResponse.json({ success: true, advocacyCase: newCase })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode kasus atau slug sudah digunakan')
    }
    console.error('Failed to create advocacy case:', error)
    return serverError('Gagal membuat kasus advokasi')
  }
}

export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengubah kasus advokasi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:advocacy:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return badRequest('ID kasus wajib disertakan')

    const data = sanitizeFields(body, CASE_FIELDS)
    if (Object.keys(data).length === 0) return badRequest('Tidak ada field valid untuk diperbarui')

    const updated = await db.advocacyCase.update({ where: { id }, data })
    return NextResponse.json({ success: true, advocacyCase: updated })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode kasus atau slug sudah digunakan')
    }
    console.error('Failed to update advocacy case:', error)
    return serverError('Gagal memperbarui kasus advokasi')
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus kasus advokasi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:advocacy:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return badRequest('ID kasus wajib disertakan')

    await db.advocacyCase.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Kasus advokasi berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete advocacy case:', error)
    return serverError('Gagal menghapus kasus advokasi')
  }
}
