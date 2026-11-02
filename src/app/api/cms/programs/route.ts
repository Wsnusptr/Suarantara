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

const PROGRAM_FIELDS = {
  programCode: { type: 'string', max: 80 },
  title: { type: 'string', max: 300 },
  slug: { type: 'slug' },
  category: { type: 'string', max: 80 },
  status: { type: 'string', max: 80 },
  statusColor: { type: 'string', max: 200 },
  statusNote: { type: 'string', max: 200 },
  dateRange: { type: 'string', max: 120 },
  duration: { type: 'string', max: 160 },
  locationVenue: { type: 'string', max: 200 },
  hostOrganizer: { type: 'string', max: 200 },
  quota: { type: 'string', max: 160 },
  cost: { type: 'string', max: 200 },
  author: { type: 'string', max: 160 },
  editionNumber: { type: 'string', max: 80 },
  dateDisplay: { type: 'string', max: 80 },
  headlineImageGrad: { type: 'string', max: 200 },
  iconColor: { type: 'string', max: 60 },
  iconType: { type: 'string', max: 40 },
  coverImageUrl: { type: 'string', max: 600 },
  coverCaption: { type: 'string', max: 600 },
  coverCredit: { type: 'string', max: 200 },
  leadBackground: { type: 'string', max: 8000 },
  backgroundBody: { type: 'string', max: 20000 },
  highlights: { type: 'json' },
  modules: { type: 'json' },
  requirements: { type: 'json' },
  facilities: { type: 'json' },
  timeline: { type: 'json' },
  isHeadlineProgram: { type: 'boolean' },
  sortOrder: { type: 'int' },
} as const satisfies Record<string, FieldSpec>

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:programs:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const rawCategory = searchParams.get('category')
    const category = rawCategory && rawCategory.length <= 80 ? rawCategory : undefined

    const programs = await db.program.findMany({
      where: category && category !== 'Semua' ? { category } : {},
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, programs })
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    return serverError('Gagal mengambil data program')
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat program.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:programs:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, PROGRAM_FIELDS)
    const { programCode, title } = fields

    if (!programCode || !title) {
      return badRequest('Kode program dan judul wajib diisi')
    }

    const newProgram = await db.program.create({
      data: {
        ...fields,
        programCode,
        title,
        slug: fields.slug ?? programCode,
        category: fields.category ?? 'Media & Pers',
        status: fields.status ?? 'Registrasi Dibuka',
        statusColor: fields.statusColor ?? 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dateRange: fields.dateRange ?? 'Segera Diumumkan',
        locationVenue: fields.locationVenue ?? 'Jakarta',
        hostOrganizer: fields.hostOrganizer ?? 'Redaksi Suarantara',
        headlineImageGrad: fields.headlineImageGrad ?? 'from-navy-950 via-navy-900 to-stone-900',
        iconColor: fields.iconColor ?? 'text-gold',
        iconType: fields.iconType ?? 'newspaper',
        leadBackground: fields.leadBackground ?? '',
        highlights: fields.highlights ?? '[]',
        author: fields.author ?? 'Redaksi Suarantara',
        editionNumber: fields.editionNumber ?? 'Edisi No. 01/2026',
        isHeadlineProgram: fields.isHeadlineProgram ?? false,
        sortOrder: fields.sortOrder ?? 0,
      },
    })

    return NextResponse.json({ success: true, program: newProgram })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode program atau slug sudah digunakan')
    }
    console.error('Failed to create program:', error)
    return serverError('Gagal membuat program')
  }
}

export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengubah program.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:programs:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return badRequest('ID program wajib disertakan')

    const data = sanitizeFields(body, PROGRAM_FIELDS)
    if (Object.keys(data).length === 0) return badRequest('Tidak ada field valid untuk diperbarui')

    const updated = await db.program.update({ where: { id }, data })
    return NextResponse.json({ success: true, program: updated })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode program atau slug sudah digunakan')
    }
    console.error('Failed to update program:', error)
    return serverError('Gagal memperbarui program')
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus program.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:programs:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return badRequest('ID program wajib disertakan')

    await db.program.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Program berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete program:', error)
    return serverError('Gagal menghapus program')
  }
}
