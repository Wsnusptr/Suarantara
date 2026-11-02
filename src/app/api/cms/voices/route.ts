import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import {
  requireStaff,
  unauthorized,
  badRequest,
  serverError,
  getClientIp,
  rateLimit,
  tooManyRequests,
  cleanString,
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

// POST: kirim aspirasi. WAJIB login.
// Identitas (nama/email/userId) diambil dari SESI terverifikasi — bukan dari
// body — sehingga pengirim tidak dapat memalsukan identitas (anti-spoofing).
export async function POST(req: NextRequest) {
  const session = await auth()
  const sessionUser = session?.user as
    | { id?: string; name?: string | null; email?: string | null }
    | undefined

  if (!sessionUser?.email) {
    return unauthorized('Anda harus masuk terlebih dahulu untuk mengirim aspirasi.')
  }

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`voices:create:${sessionUser.id || ip}`, 5, 10 * 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const subject = cleanString(body.subject, 200)
    const message = cleanString(body.message, 5000)
    const campus = cleanString(body.campus, 160)
    const category = cleanString(body.category, 60)

    // Identitas dari sesi (disanitasi untuk berjaga-jaga bila nama panjang dsb).
    const email = cleanString(sessionUser.email, 254)
    const name = cleanString(sessionUser.name, 160) || email?.split('@')[0] || 'Mahasiswa Nusantara'

    if (!subject || !message) {
      return badRequest('Subjek dan pesan aspirasi wajib diisi')
    }
    if (!email) {
      return unauthorized('Sesi tidak menyertakan email yang valid. Silakan masuk ulang.')
    }

    const newVoice = await db.voice.create({
      data: {
        userId: sessionUser.id ?? null,
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
