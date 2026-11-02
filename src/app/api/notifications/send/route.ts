import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  requireStaff,
  unauthorized,
  badRequest,
  getClientIp,
  rateLimit,
  tooManyRequests,
  serverError,
  cleanString,
} from '@/lib/api-guard'
import { isFcmSenderConfigured, sendToTokens } from '@/lib/firebase/admin'

// ─── Kirim notifikasi push (FCM) ke seluruh perangkat terdaftar — khusus staf ─
// Body JSON: { title, body, url? }. Token yang sudah tidak valid otomatis
// dinonaktifkan (isActive=false) agar tidak terus dicoba.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengirim notifikasi.')

  if (!isFcmSenderConfigured()) {
    return serverError('Pengirim FCM belum dikonfigurasi (FIREBASE_SERVICE_ACCOUNT_BASE64 kosong).')
  }

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`notifications:send:${ip}`, 20, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const title = cleanString(payload.title, 160)
    const body = cleanString(payload.body, 500)
    const url = cleanString(payload.url, 1000)
    if (!title || !body) return badRequest('Judul dan isi notifikasi wajib diisi.')

    const tokens = await db.fcmToken.findMany({
      where: { isActive: true },
      select: { token: true },
    })
    if (tokens.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'Tidak ada perangkat terdaftar.' })
    }

    const results = await sendToTokens(
      tokens.map((t) => t.token),
      { title, body, url: url || undefined }
    )

    const sent = results.filter((r) => r.ok).length
    const failed = results.filter((r) => !r.ok)
    const unregistered = failed.filter((r) => r.unregistered).map((r) => r.token)

    if (unregistered.length > 0) {
      await db.fcmToken.updateMany({
        where: { token: { in: unregistered } },
        data: { isActive: false },
      })
    }

    return NextResponse.json({
      success: true,
      total: tokens.length,
      sent,
      failed: failed.length - unregistered.length,
      deactivated: unregistered.length,
    })
  } catch (error) {
    console.error('Failed to send FCM notification:', error)
    return serverError('Gagal mengirim notifikasi.')
  }
}
