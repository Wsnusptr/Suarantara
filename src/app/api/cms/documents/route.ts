import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getClientIp, rateLimit, tooManyRequests, serverError } from '@/lib/api-guard'

// Bank dokumen & panduan advokasi — dibaca publik, dikelola lewat seed/CMS internal.
export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:documents:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const documents = await db.advocacyDocument.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error('Failed to fetch advocacy documents:', error)
    return serverError('Gagal mengambil bank dokumen advokasi')
  }
}
