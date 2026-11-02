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

const TICKER_FIELDS = {
  text: { type: 'string', max: 300 },
  href: { type: 'string', max: 500 },
  isActive: { type: 'boolean' },
  sortOrder: { type: 'int' },
} as const satisfies Record<string, FieldSpec>

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:ticker:read:${ip}`, 240, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const items = await db.tickerItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('Failed to fetch ticker items:', error)
    return serverError('Gagal mengambil ticker')
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat warta ticker.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:ticker:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const fields = sanitizeFields(body, TICKER_FIELDS)
    const { text } = fields
    if (!text) return badRequest('Teks warta kilat wajib diisi')

    const item = await db.tickerItem.create({
      data: {
        ...fields,
        text,
        href: fields.href ?? '#media',
        isActive: fields.isActive ?? true,
        sortOrder: fields.sortOrder ?? 0,
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Failed to create ticker item:', error)
    return serverError('Gagal membuat warta ticker')
  }
}
