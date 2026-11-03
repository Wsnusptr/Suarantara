import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sanityClient } from '@/lib/sanity/client'
import {
  requireStaff,
  unauthorized,
  serverError,
  getClientIp,
  rateLimit,
  tooManyRequests,
  cleanString,
  slugify,
} from '@/lib/api-guard'

// ─── Sinkronisasi Manual Sanity → Supabase Postgres (Prisma) ─────────────────
// Tombol "Sinkronkan dari Sanity" di CMS memanggil rute ini agar seluruh naskah
// artikel di Sanity ditarik & di-upsert ke tabel Article — tidak bergantung pada
// webhook Sanity yang mungkin belum/tidak aktif. Idempotent (aman dipanggil ulang).

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PILLAR_CATEGORY_LABEL: Record<string, string> = {
  media: 'Warta Media',
  advokasi: 'Warta Advokasi',
  kajian: 'Kajian & Riset',
  program: 'Program',
  partners: 'Mitra',
}

// Ambil seluruh dokumen artikel dari Sanity (termasuk yang belum punya slug).
const ALL_ARTICLES_QUERY = `*[_type == "artikel"] | order(coalesce(publishedAt, _createdAt) desc){
  _id,
  _type,
  title,
  slug,
  pillar,
  excerpt,
  region,
  readingTime,
  publishedAt,
  isFeatured,
  isBreaking,
  tags,
  body,
  "authorName": author->name,
  "authorRole": author->bio,
  "coverImageUrl": coverImage.asset->url,
  "coverCaption": coverImage.caption,
  "categoryTitle": category->title,
  "categorySlug": category->slug.current
}`

/** Ubah Portable Text Sanity → teks paragraf polos (aman, tanpa HTML mentah). */
function portableTextToPlainText(body: unknown): string {
  if (!Array.isArray(body)) return ''
  const blocks: string[] = []
  for (const block of body) {
    if (!block || typeof block !== 'object') continue
    const b = block as { _type?: string; children?: unknown[] }
    if (b._type !== 'block' || !Array.isArray(b.children)) continue
    const text = b.children
      .map((child) => {
        if (child && typeof child === 'object') {
          const c = child as { text?: unknown }
          return typeof c.text === 'string' ? c.text : ''
        }
        return ''
      })
      .join('')
    if (text.trim()) blocks.push(text.trim())
  }
  return blocks.join('\n\n')
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string').map((v) => v.trim()).filter(Boolean)
}

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat menyinkronkan artikel Sanity.')

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:sanity-pull:${ip}`, 10, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const docs = (await sanityClient.fetch(ALL_ARTICLES_QUERY)) as Array<Record<string, unknown>> | null
    if (!Array.isArray(docs)) {
      return NextResponse.json({ success: true, pulled: 0, created: 0, updated: 0, skipped: 0 })
    }

    let created = 0
    let updated = 0
    let skipped = 0

    for (const doc of docs) {
      const id = cleanString(doc._id, 120)
      const title = cleanString(doc.title, 300)
      if (!id || !title) {
        skipped++
        continue
      }

      const rawSlug =
        typeof doc.slug === 'object' && doc.slug !== null
          ? (doc.slug as { current?: string }).current
          : (doc.slug as string | undefined)
      const slug = slugify(rawSlug) || slugify(title) || `artikel-${id}`

      const pillar = (cleanString(doc.pillar, 40) || 'media').toLowerCase()
      const categoryTitle = cleanString(doc.categoryTitle, 120)
      const categorySlug = cleanString(doc.categorySlug, 40)

      const data = {
        title,
        slug,
        leadExcerpt: cleanString(doc.excerpt, 600) || '',
        content: portableTextToPlainText(doc.body),
        category: categoryTitle || PILLAR_CATEGORY_LABEL[pillar] || 'Warta Media',
        categoryKey: categorySlug || 'umum',
        authorName: cleanString(doc.authorName, 160) || 'Redaksi Suarantara',
        authorRole: cleanString(doc.authorRole, 160),
        coverImageUrl: cleanString(doc.coverImageUrl, 1000) || null,
        coverCaption: cleanString(doc.coverCaption, 500),
        tags: JSON.stringify(toStringArray(doc.tags)),
        isHeadlineBanner: Boolean(doc.isFeatured),
        isTrending: Boolean(doc.isBreaking),
        status: 'PUBLISHED',
        externalId: id,
        source: 'sanity',
      }

      const existing = await db.article.findFirst({
        where: { OR: [{ externalId: id }, { slug }] },
        select: { id: true },
      })

      if (existing) {
        await db.article.update({ where: { id: existing.id }, data })
        updated++
      } else {
        await db.article.create({ data })
        created++
      }
    }

    return NextResponse.json({
      success: true,
      pulled: docs.length,
      created,
      updated,
      skipped,
    })
  } catch (error) {
    console.error('Failed to pull Sanity articles:', error)
    return serverError('Gagal menarik artikel dari Sanity.')
  }
}
