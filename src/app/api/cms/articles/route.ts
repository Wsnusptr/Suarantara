import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  requireStaff,
  unauthorized,
  badRequest,
  getClientIp,
  rateLimit,
  tooManyRequests,
  cleanString,
  slugify,
} from '@/lib/api-guard'

export const dynamic = 'force-dynamic'

const ARTICLE_STATUS = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const

// Field yang boleh ditulis klien (mencegah mass-assignment / penulisan kolom sistem)
const WRITABLE_FIELDS = [
  'title',
  'slug',
  'leadExcerpt',
  'content',
  'kickerBadge',
  'editionBadge',
  'category',
  'categoryKey',
  'authorName',
  'authorRole',
  'authorAvatar',
  'dateDisplay',
  'coverImageUrl',
  'coverCaption',
  'coverCredit',
  'imageGrad',
  'iconColor',
  'iconType',
  'isHeadlineBanner',
  'isEditorPick',
  'isTrending',
  'rankingNo',
  'recommendationTag',
  'status',
  'tags',
] as const

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const slug = searchParams.get('slug')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100)

    // Hanya staf redaksi yang boleh melihat naskah non-publik (DRAFT/IN_REVIEW/ARCHIVED)
    const staff = await requireStaff()
    const requestedStatus = status && ARTICLE_STATUS.includes(status as never) ? status : undefined

    const where = {
      ...(category && category !== 'semua' ? { categoryKey: category } : {}),
      ...(slug ? { slug } : {}),
      // Publik: paksa hanya PUBLISHED. Staf: hormati filter bila ada.
      ...(staff ? (requestedStatus ? { status: requestedStatus } : {}) : { status: 'PUBLISHED' }),
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: slug ? 1 : limit,
    })

    if (slug) {
      return NextResponse.json({ success: true, article: articles[0] || null, articles })
    }
    return NextResponse.json({ success: true, articles })
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data artikel' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat membuat artikel.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:articles:write:${ip}`, 60, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const body = await req.json().catch(() => ({}))

    const title = cleanString(body?.title, 300)
    const category = cleanString(body?.category, 120)
    const slug = slugify(body?.slug) || slugify(title)
    if (!title || !slug || !category) {
      return badRequest('Judul, slug, dan kategori wajib diisi')
    }

    const status = ARTICLE_STATUS.includes(body?.status) ? body.status : 'PUBLISHED'

    const newArticle = await db.article.create({
      data: {
        title,
        slug,
        category,
        status,
        leadExcerpt: cleanString(body?.leadExcerpt, 600) ?? '',
        content: cleanString(body?.content, 100000) ?? '',
        kickerBadge: cleanString(body?.kickerBadge, 120) ?? null,
        editionBadge: cleanString(body?.editionBadge, 120) ?? null,
        categoryKey: cleanString(body?.categoryKey, 40) || 'umum',
        authorName: cleanString(body?.authorName, 160) || 'Redaksi Suarantara',
        authorRole: cleanString(body?.authorRole, 160) ?? null,
        authorAvatar: cleanString(body?.authorAvatar, 500) ?? null,
        dateDisplay: cleanString(body?.dateDisplay, 60) || 'Baru Saja',
        coverImageUrl: cleanString(body?.coverImageUrl, 1000) ?? null,
        coverCaption: cleanString(body?.coverCaption, 500) ?? null,
        coverCredit: cleanString(body?.coverCredit, 200) || 'Foto: Biro Dokumentasi',
        imageGrad: cleanString(body?.imageGrad, 120) || 'from-navy-950 via-navy-900 to-stone-900',
        iconColor: cleanString(body?.iconColor, 60) || 'text-gold',
        iconType: cleanString(body?.iconType, 40) || 'newspaper',
        isHeadlineBanner: Boolean(body?.isHeadlineBanner),
        isEditorPick: Boolean(body?.isEditorPick),
        isTrending: Boolean(body?.isTrending),
        rankingNo: cleanString(body?.rankingNo, 10) ?? null,
        recommendationTag: cleanString(body?.recommendationTag, 80) ?? null,
        tags: typeof body?.tags === 'string' ? body.tags : JSON.stringify(Array.isArray(body?.tags) ? body.tags : []),
      },
    })

    return NextResponse.json({ success: true, article: newArticle })
  } catch (error: unknown) {
    if (isUniqueError(error)) {
      return NextResponse.json({ success: false, error: 'Slug artikel sudah digunakan' }, { status: 409 })
    }
    console.error('Failed to create article:', error)
    return NextResponse.json({ success: false, error: 'Gagal membuat artikel' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengubah artikel.')

  try {
    const body = await req.json().catch(() => ({}))
    const id = cleanString(body?.id, 64)
    if (!id) return badRequest('ID artikel wajib disertakan')

    // Whitelist: hanya field konten yang boleh diubah
    const data: Record<string, unknown> = {}
    for (const key of WRITABLE_FIELDS) {
      if (!(key in body)) continue
      const value = body[key]
      if (key === 'status') {
        if (ARTICLE_STATUS.includes(value)) data.status = value
        continue
      }
      if (key.startsWith('is')) {
        data[key] = Boolean(value)
        continue
      }
      if (key === 'tags') {
        data.tags = typeof value === 'string' ? value : JSON.stringify(Array.isArray(value) ? value : [])
        continue
      }
      if (key === 'slug') {
        const s = slugify(value)
        if (s) data.slug = s
        continue
      }
      if (typeof value === 'string') {
        data[key] = cleanString(value, 100000)
      }
    }
    if (Object.keys(data).length === 0) return badRequest('Tidak ada field valid untuk diperbarui')

    const updated = await db.article.update({ where: { id }, data })
    return NextResponse.json({ success: true, article: updated })
  } catch (error: unknown) {
    if (isUniqueError(error)) {
      return NextResponse.json({ success: false, error: 'Slug artikel sudah digunakan' }, { status: 409 })
    }
    console.error('Failed to update article:', error)
    return NextResponse.json({ success: false, error: 'Gagal memperbarui artikel' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menghapus artikel.')

  try {
    const { searchParams } = new URL(req.url)
    const id = cleanString(searchParams.get('id'), 64)
    if (!id) return badRequest('ID artikel wajib disertakan')

    await db.article.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' })
  } catch (error) {
    console.error('Failed to delete article:', error)
    return NextResponse.json({ success: false, error: 'Gagal menghapus artikel' }, { status: 500 })
  }
}

function isUniqueError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2002'
}
