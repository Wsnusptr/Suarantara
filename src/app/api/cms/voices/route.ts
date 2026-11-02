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
  cleanString,
  isValidEmail,
  oneOf,
} from '@/lib/api-guard'

export const dynamic = 'force-dynamic'

const VOICE_STATUS = ['PENDING', 'DITERIMA', 'DITINJAU', 'DITOLAK'] as const

// GET: daftar aspirasi bersifat internal (memuat identitas pengirim) → khusus staf.
export async function GET(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat melihat daftar aspirasi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:voices:read:${ip}`, 120, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const voices = await db.voice.findMany({ orderBy: { createdAt: 'desc' }, take: 500 })
    return NextResponse.json({ success: true, voices })
  } catch (error) {
    console.error('Failed to fetch voices:', error)
    return serverError('Gagal mengambil data aspirasi')
  }
}

// POST: publik (form kirim-suara). Rate limit ketat untuk mencegah spam/abuse.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`voices:create:${ip}`, 5, 10 * 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const name = cleanString(body.name, 160)
    const email = cleanString(body.email, 254)
    const subject = cleanString(body.subject, 200)
    const message = cleanString(body.message, 5000)
    const campus = cleanString(body.campus, 160)
    const category = cleanString(body.category, 60)

    if (!name || !email || !subject || !message) {
      return badRequest('Nama, email, subjek, dan pesan aspirasi wajib diisi')
    }
    if (!isValidEmail(email)) {
      return badRequest('Format email tidak valid')
    }

    const newVoice = await db.voice.create({
      data: {
        // userId TIDAK diambil dari body (anti spoofing identitas)
        userId: null,
        name,
        email,
        campus: campus || 'STMIK Jayakarta',
        category: category || 'Umum',
        subject,
        message,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, voice: newVoice })
  } catch (error) {
    console.error('Failed to create voice ticket:', error)
    return serverError('Gagal mengirim aspirasi')
  }
}

// PUT: perubahan status aspirasi khusus staf (dengan validasi enum).
export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat memperbarui status aspirasi.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:voices:write:${ip}`, 120, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const id = cleanString(body.id, 64)
    const status = oneOf(body.status, VOICE_STATUS)

    if (!id || !status) {
      return badRequest('ID dan status aspirasi (valid) wajib disertakan')
    }

    const updated = await db.voice.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true, voice: updated })
  } catch (error) {
    console.error('Failed to update voice status:', error)
    return serverError('Gagal memperbarui status aspirasi')
  }
}
