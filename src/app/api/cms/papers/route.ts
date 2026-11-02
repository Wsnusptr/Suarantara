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

const PAPER_FIELDS = {
  paperCode: { type: 'string', max: 80 },
  type: { type: 'string', max: 80 },
  title: { type: 'string', max: 400 },
  slug: { type: 'slug' },
  authors: { type: 'string', max: 400 },
  institution: { type: 'string', max: 300 },
  category: { type: 'string', max: 60 },
  categoryLabel: { type: 'string', max: 120 },
  abstract: { type: 'string', max: 8000 },
  pages: { type: 'int' },
  dateDisplay: { type: 'string', max: 60 },
  downloads: { type: 'string', max: 60 },
  citations: { type: 'string', max: 60 },
  fileUrl: { type: 'string', max: 1000 },
  executiveSummary: { type: 'json' },
  recommendations: { type: 'json' },
  editionNumber: { type: 'string', max: 80 },
  isNationalHeadline: { type: 'boolean' },
} as const satisfies Record<string, FieldSpec>

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:papers:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const rawCategory = searchParams.get('category')
    const category = rawCategory && rawCategory.length <= 60 ? rawCategory : undefined

    const papers = await db.researchPaper.findMany({
      where: category && category !== 'semua' ? { category } : {},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, papers })
  } catch (error) {
    console.error('Failed to fetch papers:', error)
    return serverError('Gagal mengambil data kajian')
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat naskah kajian.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:papers:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, PAPER_FIELDS)
    const { paperCode, title } = fields

    if (!paperCode || !title) {
      return badRequest('Kode naskah dan judul wajib diisi')
    }

    const newPaper = await db.researchPaper.create({
      data: {
        ...fields,
        paperCode,
        title,
        slug: fields.slug ?? paperCode,
        type: fields.type ?? 'Policy Brief',
        authors: fields.authors ?? 'Dewan Riset Suarantara',
        institution: fields.institution ?? 'Aliansi BEM Se-Nusantara',
        category: fields.category ?? 'pendidikan',
        categoryLabel: fields.categoryLabel ?? 'Pendidikan & UKT',
        abstract: fields.abstract ?? '',
        pages: fields.pages ?? 18,
        dateDisplay: fields.dateDisplay ?? 'Baru Saja',
        fileUrl: fields.fileUrl ?? '/documents/policy-brief.pdf',
        executiveSummary: fields.executiveSummary ?? '[]',
        recommendations: fields.recommendations ?? '[]',
        editionNumber: fields.editionNumber ?? 'No. 01/2026',
        isNationalHeadline: fields.isNationalHeadline ?? false,
      },
    })

    return NextResponse.json({ success: true, paper: newPaper })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode naskah atau slug sudah digunakan')
    }
    console.error('Failed to create paper:', error)
    return serverError('Gagal membuat naskah kajian')
  }
}

export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengubah naskah kajian.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:papers:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return badRequest('ID naskah wajib disertakan')

    const data = sanitizeFields(body, PAPER_FIELDS)
    if (Object.keys(data).length === 0) return badRequest('Tidak ada field valid untuk diperbarui')

    const updated = await db.researchPaper.update({ where: { id }, data })
    return NextResponse.json({ success: true, paper: updated })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict('Kode naskah atau slug sudah digunakan')
    }
    console.error('Failed to update paper:', error)
    return serverError('Gagal memperbarui naskah kajian')
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus naskah kajian.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:papers:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return badRequest('ID naskah wajib disertakan')

    await db.researchPaper.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Naskah kajian berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete paper:', error)
    return serverError('Gagal menghapus naskah kajian')
  }
}
