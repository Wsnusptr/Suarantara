import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import DetailAdvokasiClient from './DetailAdvokasiClient'

// Konten kasus advokasi berasal dari CMS → selalu render dinamis (fresh).
export const dynamic = 'force-dynamic'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
const FALLBACK_COVER = '/tentang-kami-mahasiswa.jpeg'

async function getCases() {
  try {
    return await db.advocacyCase.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  } catch {
    return []
  }
}

function matchCase<T extends { slug: string; caseCode: string; id: string }>(
  list: T[],
  slug: string
): T | null {
  return list.find((c) => c.slug === slug || c.caseCode === slug || c.id === slug) || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cases = await getCases()
  const item = matchCase(cases, slug)
  if (!item) {
    return { title: 'Kasus Advokasi tidak ditemukan — Suarantara' }
  }

  const description = `Advokasi ${item.categoryLabel} di ${item.campus}. ${item.lastUpdate}`.trim()
  const url = `${SITE_URL}/advokasi/${item.slug}`

  return {
    title: item.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description,
      url,
      siteName: 'Suarantara',
      type: 'article',
      locale: 'id_ID',
      images: [{ url: FALLBACK_COVER, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      images: [FALLBACK_COVER],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cases = await getCases()
  const item = matchCase(cases, slug)
  if (!item) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.lastUpdate || undefined,
    image: [FALLBACK_COVER],
    author: { '@type': 'Organization', name: 'Suarantara' },
    publisher: { '@type': 'Organization', name: 'Suarantara' },
    mainEntityOfPage: `${SITE_URL}/advokasi/${item.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailAdvokasiClient initialCase={item} />
    </>
  )
}
