import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import DetailBeritaClient from './DetailBeritaClient'

// Konten artikel berasal dari CMS → selalu render dinamis (fresh) & aman saat build.
export const dynamic = 'force-dynamic'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
const FALLBACK_COVER = '/tentang-kami-mahasiswa.jpeg'

/** Normalisasi URL gambar: absolut (http/https) atau path lokal; selain itu fallback. */
function normalizeImage(url?: string | null): string {
  const t = String(url || '').trim()
  if (!t) return FALLBACK_COVER
  if (t.startsWith('http://') || t.startsWith('https://') || t.startsWith('/')) return t
  return FALLBACK_COVER
}

async function getPublishedArticle(slug: string) {
  try {
    return await db.article.findFirst({ where: { slug, status: 'PUBLISHED' } })
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) {
    return { title: 'Warta tidak ditemukan — Suarantara' }
  }

  const description = (article.leadExcerpt || article.content || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)
  const image = normalizeImage(article.coverImageUrl)
  const url = `${SITE_URL}/berita/${article.slug}`

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      siteName: 'Suarantara',
      type: 'article',
      locale: 'id_ID',
      publishedTime: article.publishedAt?.toISOString?.(),
      modifiedTime: article.updatedAt?.toISOString?.(),
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [image],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.leadExcerpt || undefined,
    image: [normalizeImage(article.coverImageUrl)],
    datePublished: article.publishedAt?.toISOString?.(),
    dateModified: article.updatedAt?.toISOString?.(),
    author: { '@type': 'Person', name: article.authorName },
    publisher: { '@type': 'Organization', name: 'Suarantara' },
    mainEntityOfPage: `${SITE_URL}/berita/${article.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailBeritaClient initialArticle={article} />
    </>
  )
}
