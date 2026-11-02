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

const PARTNER_FIELDS = {
  partnerCode: { type: 'string', max: 80 },
  name: { type: 'string', max: 300 },
  shortName: { type: 'string', max: 120 },
  category: { type: 'string', max: 80 },
  joinDate: { type: 'string', max: 80 },
  status: { type: 'string', max: 120 },
  badgeType: { type: 'string', max: 80 },
  campusFullName: { type: 'string', max: 300 },
  campusShortName: { type: 'string', max: 120 },
  campusAddress: { type: 'string', max: 300 },
  campusCity: { type: 'string', max: 120 },
  campusProvince: { type: 'string', max: 120 },
  campusWebsite: { type: 'string', max: 500 },
  presmaName: { type: 'string', max: 200 },
  presmaTitle: { type: 'string', max: 160 },
  wapresmaName: { type: 'string', max: 200 },
  wapresmaTitle: { type: 'string', max: 160 },
  cabinetName: { type: 'string', max: 200 },
  periodYear: { type: 'string', max: 40 },
  collaborationScopes: { type: 'json' },
  officialQuote: { type: 'string', max: 1000 },
  logoUrl: { type: 'string', max: 1000 },
  studentsRepresented: { type: 'string', max: 80 },
  casesHandled: { type: 'string', max: 80 },
  papersContributed: { type: 'string', max: 80 },
  isIn3DCarousel: { type: 'boolean' },
  sortOrder: { type: 'int' },
} as const satisfies Record<string, FieldSpec>

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:partners:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const partners = await db.partner.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, partners })
  } catch (error) {
    console.error('Failed to fetch partners:', error)
    return serverError('Gagal mengambil data mitra')
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menambah mitra.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:partners:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, PARTNER_FIELDS)
    const { partnerCode, name } = fields

    if (!partnerCode || !name) {
      return badRequest('Kode mitra dan nama organisasi wajib diisi')
    }

    const shortName = fields.shortName ?? name
    const newPartner = await db.partner.create({
      data: {
        ...fields,
        partnerCode,
        name,
        shortName,
        category: fields.category ?? 'BEM Kampus',
        joinDate: fields.joinDate ?? '15 Oktober 2026',
        status: fields.status ?? 'Aktif & Terverifikasi',
        badgeType: fields.badgeType ?? 'Mitra Kampus',
        campusFullName: fields.campusFullName ?? name,
        campusShortName: fields.campusShortName ?? shortName,
        campusAddress: fields.campusAddress ?? 'Sekretariat BEM',
        campusCity: fields.campusCity ?? 'Jakarta',
        campusProvince: fields.campusProvince ?? 'DKI Jakarta',
        presmaName: fields.presmaName ?? 'Presiden Mahasiswa',
        presmaTitle: fields.presmaTitle ?? 'Presiden Mahasiswa',
        cabinetName: fields.cabinetName ?? 'Kabinet Perjuangan',
        periodYear: fields.periodYear ?? '2026 / 2027',
        collaborationScopes: fields.collaborationScopes ?? '[]',
        officialQuote: fields.officialQuote ?? '',
        logoUrl: fields.logoUrl ?? '/partners/bem-stmik-jayakarta.svg',
        isIn3DCarousel: fields.isIn3DCarousel ?? true,
        sortOrder: fields.sortOrder ?? 0,
      },
    })

    return NextResponse.json({ success: true, partner: newPartner })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode mitra sudah digunakan')
    }
    console.error('Failed to create partner:', error)
    return serverError('Gagal membuat profil mitra')
  }
}

export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengubah mitra.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:partners:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return badRequest('ID mitra wajib disertakan')

    const data = sanitizeFields(body, PARTNER_FIELDS)
    if (Object.keys(data).length === 0) return badRequest('Tidak ada field valid untuk diperbarui')

    const updated = await db.partner.update({ where: { id }, data })
    return NextResponse.json({ success: true, partner: updated })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode mitra sudah digunakan')
    }
    console.error('Failed to update partner:', error)
    return serverError('Gagal memperbarui profil mitra')
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus mitra.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:partners:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return badRequest('ID mitra wajib disertakan')

    await db.partner.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Mitra berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete partner:', error)
    return serverError('Gagal menghapus mitra')
  }
}
