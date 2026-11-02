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

const REEL_FIELDS = {
  title: { type: 'string', max: 300 },
  creator: { type: 'string', max: 160 },
  views: { type: 'string', max: 40 },
  duration: { type: 'string', max: 20 },
  category: { type: 'string', max: 80 },
  thumbnailUrl: { type: 'string', max: 1000 },
  videoUrl: { type: 'string', max: 1000 },
  thumbnailGradient: { type: 'string', max: 200 },
  sortOrder: { type: 'int' },
} as const satisfies Record<string, FieldSpec>

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:reels:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const reels = await db.videoReel.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, reels })
  } catch (error) {
    console.error('Failed to fetch video reels:', error)
    return serverError('Gagal mengambil data reels')
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat video reel.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:reels:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, REEL_FIELDS)
    const { title } = fields
    if (!title) return badRequest('Judul video reel wajib diisi')

    const reel = await db.videoReel.create({
      data: {
        ...fields,
        title,
        creator: fields.creator ?? 'Redaksi Suarantara',
        views: fields.views ?? '10K',
        duration: fields.duration ?? '1:00',
        category: fields.category ?? 'Liputan Langsung',
        thumbnailGradient: fields.thumbnailGradient ?? 'from-navy-950 via-navy-900 to-stone-900',
        sortOrder: fields.sortOrder ?? 0,
      },
    })

    return NextResponse.json({ success: true, reel })
  } catch (error) {
    console.error('Failed to create reel:', error)
    return serverError('Gagal membuat video reel')
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus video reel.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:reels:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return badRequest('ID reel diperlukan')

    await db.videoReel.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Reel berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete reel:', error)
    return serverError('Gagal menghapus reel')
  }
}
