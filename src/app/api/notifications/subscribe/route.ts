import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  getClientIp,
  rateLimit,
  tooManyRequests,
  badRequest,
  serverError,
  cleanString,
  isValidFcmToken,
} from '@/lib/api-guard'

// Registrasi token FCM. Publik (dipanggil client), dibatasi rate limit ketat
// dan divalidasi bentuk tokennya. Token disimpan untuk pengiriman notifikasi.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`notifications:subscribe:${ip}`, 5, 10 * 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const token = cleanString(body.token, 4096)

    if (!isValidFcmToken(token)) {
      return badRequest('Token FCM tidak valid')
    }

    const userAgent = req.headers.get('user-agent')?.slice(0, 200) || null

    // Simpan / aktifkan kembali token perangkat (idempotent).
    await db.fcmToken.upsert({
      where: { token },
      update: { isActive: true, userAgent },
      create: { token, platform: 'web', userAgent, isActive: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Perangkat berhasil terdaftar untuk menerima notifikasi warta mahasiswa.',
    })
  } catch (error) {
    console.error('[FCM Subscribe API Error]:', error)
    return serverError('Gagal mendaftarkan perangkat')
  }
}
