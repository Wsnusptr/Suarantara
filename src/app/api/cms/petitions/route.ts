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

// Field yang boleh ditulis klien (mencegah mass-assignment kolom sistem)
const PETITION_FIELDS = {
  title: { type: 'string', max: 300 },
  desc: { type: 'string', max: 4000 },
  targetSignatures: { type: 'int' },
  currentSignatures: { type: 'int' },
  isUrgent: { type: 'boolean' },
  isActive: { type: 'boolean' },
} as const satisfies Record<string, FieldSpec>

// GET publik: kembalikan satu petisi aktif terbaru (atau null bila belum ada).
export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:petitions:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const petition = await db.petition.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ success: true, petition: petition ?? null })
  } catch (error) {
    console.error('Failed to fetch petition:', error)
    return serverError('Gagal mengambil data petisi')
  }
}

// POST (staf): buat petisi baru.
export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat petisi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:petitions:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, PETITION_FIELDS)
    const { title, desc } = fields

    if (!title || !desc) return badRequest('Judul dan deskripsi petisi wajib diisi')

    const petition = await db.petition.create({
      data: {
        ...fields,
        title,
        desc,
        targetSignatures: fields.targetSignatures ?? 10000,
        currentSignatures: fields.currentSignatures ?? 0,
        isUrgent: fields.isUrgent ?? false,
        isActive: fields.isActive ?? true,
      },
    })

    return NextResponse.json({ success: true, petition })
  } catch (error) {
    console.error('Failed to create petition:', error)
    return serverError('Gagal membuat petisi')
  }
}

// PUT (staf): perbarui petisi berdasarkan id.
export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengubah petisi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:petitions:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return badRequest('ID petisi wajib disertakan')

    const data = sanitizeFields(body, PETITION_FIELDS)
    if (Object.keys(data).length === 0) return badRequest('Tidak ada field valid untuk diperbarui')

    const petition = await db.petition.update({ where: { id }, data })
    return NextResponse.json({ success: true, petition })
  } catch (error) {
    console.error('Failed to update petition:', error)
    return serverError('Gagal memperbarui petisi')
  }
}

// DELETE (staf): hapus petisi berdasarkan ?id=
export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus petisi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:petitions:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return badRequest('ID petisi wajib disertakan')

    await db.petition.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Petisi berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete petition:', error)
    return serverError('Gagal menghapus petisi')
  }
}

// PATCH publik: tambah 1 tanda tangan pada petisi aktif.
export async function PATCH(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:petitions:sign:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return badRequest('ID petisi wajib disertakan')

    const existing = await db.petition.findUnique({ where: { id } })
    if (!existing) return badRequest('Petisi tidak ditemukan')
    if (!existing.isActive) return badRequest('Petisi sudah tidak aktif')

    const petition = await db.petition.update({
      where: { id },
      data: { currentSignatures: { increment: 1 } },
    })

    return NextResponse.json({ success: true, petition })
  } catch (error) {
    console.error('Failed to sign petition:', error)
    return serverError('Gagal menandatangani petisi')
  }
}
