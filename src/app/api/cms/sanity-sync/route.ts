import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sanityClient } from '@/lib/sanity/client'
import {
  getClientIp,
  rateLimit,
  tooManyRequests,
  badRequest,
  serverError,
  unauthorized,
  cleanString,
  slugify,
} from '@/lib/api-guard'

// ─── Sinkronisasi Sanity → Supabase Postgres (Prisma) ────────────────────────
// Dipanggil oleh Sanity Webhook (create/update/delete dokumen `artikel`).
// Alur aman & idempotent:
//   1. Verifikasi SHARED SECRET (header x-sanity-webhook-secret atau ?secret=).
//   2. Ambil ULANG dokumen penuh dari Sanity API (bukan sekadar payload webhook)
//      agar data selalu lengkap & tidak bisa dipalsukan oleh payload parsial.
//   3. Upsert ke tabel Article berdasarkan `externalId` (= _id Sanity) atau slug.
//   4. Update tampil di web otomatis karena web membaca langsung dari tabel Article.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PILLAR_CATEGORY_LABEL: Record<string, string> = {
  media: 'Warta Media',
  advokasi: 'Warta Advokasi',
  kajian: 'Kajian & Riset',
  program: 'Program',
  partners: 'Mitra',
}

const DOC_QUERY = `*[_id == $id][0]{
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
  // 1. Verifikasi shared secret
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return serverError('Webhook Sanity belum dikonfigurasi (SANITY_WEBHOOK_SECRET kosong).')
  }
  const provided =
    req.headers.get('x-sanity-webhook-secret') ||
    new URL(req.url).searchParams.get('secret') ||
    ''
  if (provided !== secret) {
    return unauthorized('Signature webhook tidak valid.')
  }

  const ip = getClientIp(req)
  const rl = rateLimit(`cms:sanity-sync:${ip}`, 30, 60 * 1000)
  if (!rl.ok) return tooManyRequests(rl.retryAfter)

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const id = cleanString(body._id || body.documentId, 120)
  const type = cleanString(body._type, 40)
  const operation = (cleanString(body.operation || body.action, 40) || '').toLowerCase()

  if (!id) return badRequest('ID dokumen Sanity (_id) wajib ada.')
  if (type && type !== 'artikel') {
    return NextResponse.json({ success: true, skipped: true, reason: 'Bukan dokumen artikel' })
  }

  try {
    // 2a. Operasi hapus → hapus baris terkait
    if (operation === 'delete') {
      await db.article.deleteMany({ where: { externalId: id } })
      return NextResponse.json({ success: true, deleted: true })
    }

    // 2b. Ambil dokumen penuh terbaru dari Sanity (sumber kebenaran)
    const doc = (await sanityClient.fetch(DOC_QUERY, { id })) as Record<string, unknown> | null
    if (!doc) {
      return NextResponse.json({ success: true, skipped: true, reason: 'Dokumen tidak ditemukan di Sanity' })
    }

    const title = cleanString(doc.title, 300)
    if (!title) return badRequest('Dokumen Sanity tidak memiliki judul.')

    const rawSlug =
      typeof doc.slug === 'object' && doc.slug !== null
        ? (doc.slug as { current?: string }).current
        : (doc.slug as string | undefined)
    const slug = slugify(rawSlug) || slugify(title) || `artikel-${id}`

    const pillar = (cleanString(doc.pillar, 40) || 'media').toLowerCase()
    const categoryTitle = cleanString(doc.categoryTitle, 120)
    const categorySlug = cleanString(doc.categorySlug, 40)

    const tags = toStringArray(doc.tags)
    const content = portableTextToPlainText(doc.body)
    const coverImageUrl = cleanString(doc.coverImageUrl, 1000) || null
    const excerpt = cleanString(doc.excerpt, 600) || ''

    const data = {
      title,
      slug,
      leadExcerpt: excerpt,
      content,
      category: categoryTitle || PILLAR_CATEGORY_LABEL[pillar] || 'Warta Media',
      categoryKey: categorySlug || 'umum',
      authorName: cleanString(doc.authorName, 160) || 'Redaksi Suarantara',
      authorRole: cleanString(doc.authorRole, 160),
      coverImageUrl,
      coverCaption: cleanString(doc.coverCaption, 500),
      tags: JSON.stringify(tags),
      isHeadlineBanner: Boolean(doc.isFeatured),
      isTrending: Boolean(doc.isBreaking),
      status: 'PUBLISHED',
      externalId: id,
      source: 'sanity',
    }

    // 3. Upsert idempotent: cari berdasarkan externalId, lalu slug
    const existing = await db.article.findFirst({
      where: { OR: [{ externalId: id }, { slug }] },
      select: { id: true },
    })

    const article = existing
      ? await db.article.update({ where: { id: existing.id }, data })
      : await db.article.create({ data })

    return NextResponse.json({ success: true, articleId: article.id, slug: article.slug })
  } catch (error) {
    console.error('Failed to sync Sanity article:', error)
    return serverError('Gagal menyinkronkan artikel dari Sanity.')
  }
}
