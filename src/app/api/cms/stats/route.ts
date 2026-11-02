import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff, unauthorized, serverError, getClientIp, rateLimit, tooManyRequests } from '@/lib/api-guard'

export const dynamic = 'force-dynamic'

// Statistik internal CMS → khusus staf.
export async function GET(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengakses statistik CMS.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:stats:read:${ip}`, 120, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const [
      articlesCount,
      casesCount,
      papersCount,
      programsCount,
      partnersCount,
      voicesCount,
      reelsCount,
    ] = await Promise.all([
      db.article.count(),
      db.advocacyCase.count(),
      db.researchPaper.count(),
      db.program.count(),
      db.partner.count(),
      db.voice.count(),
      db.videoReel.count(),
    ])

    return NextResponse.json({
      success: true,
      stats: {
        articles: articlesCount,
        cases: casesCount,
        papers: papersCount,
        programs: programsCount,
        partners: partnersCount,
        voices: voicesCount,
        reels: reelsCount,
      },
    })
  } catch (error) {
    console.error('Failed to fetch CMS stats:', error)
    return serverError('Gagal mengambil statistik CMS')
  }
}
