import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getClientIp, rateLimit, tooManyRequests, badRequest, cleanString } from '@/lib/api-guard'

// Bangun representasi poll lengkap dengan total suara & persentase yang dihitung
// dari kolom `votes` (PollOption) — sumber kebenaran tunggal.
function serializePoll(
  poll:
    | (Awaited<ReturnType<typeof db.poll.findFirst>> & {
        options: { id: string; label: string; votes: number; sortOrder: number }[]
      })
    | null
) {
  if (!poll) return null
  const options = Array.isArray(poll.options) ? poll.options : []
  const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
  return {
    id: poll.id,
    question: poll.question,
    totalRespondents: poll.totalRespondents,
    isActive: poll.isActive,
    totalVotes,
    options: options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      votes: opt.votes,
      percent: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
      sortOrder: opt.sortOrder,
    })),
  }
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:widgets:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const [poll, quote] = await Promise.all([
      db.poll.findFirst({
        where: { isActive: true },
        include: { options: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.quoteAspiration.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return NextResponse.json({
      success: true,
      poll: serializePoll(poll as never),
      quote: quote
        ? {
            id: quote.id,
            quoteText: quote.quoteText,
            figureName: quote.figureName,
            figureRole: quote.figureRole,
            avatarInitials: quote.avatarInitials,
          }
        : null,
    })
  } catch (error) {
    console.error('Failed to fetch widgets data:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data widgets' }, { status: 500 })
  }
}

// Vote on a poll option (publik, dibatasi rate limit per IP)
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`widgets:vote:${ip}`, 20, 10 * 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = await req.json().catch(() => ({}))
    const optionId = cleanString(body?.optionId, 64)
    if (!optionId) return badRequest('Option ID diperlukan')

    const option = await db.pollOption.findUnique({ where: { id: optionId } })
    if (!option) return badRequest('Opsi polling tidak ditemukan')

    await db.pollOption.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } },
    })

    const poll = await db.poll.findUnique({
      where: { id: option.pollId },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    })

    return NextResponse.json({ success: true, poll: serializePoll(poll as never) })
  } catch (error) {
    console.error('Failed to cast vote:', error)
    return NextResponse.json({ success: false, error: 'Gagal mencatat voting' }, { status: 500 })
  }
}
