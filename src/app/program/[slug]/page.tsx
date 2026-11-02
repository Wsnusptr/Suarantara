import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import DetailProgramClient from './DetailProgramClient'

// Konten program berasal dari CMS → selalu render dinamis (fresh) & aman saat build.
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

function firstParagraph(text?: string | null, max = 200): string {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

async function getPrograms() {
  try {
    return await db.program.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  } catch {
    return []
  }
}

function matchProgram<T extends { slug: string; programCode: string; id: string }>(
  list: T[],
  slug: string
): T | null {
  return list.find((p) => p.slug === slug || p.programCode === slug || p.id === slug) || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const programs = await getPrograms()
  const program = matchProgram(programs, slug)
  if (!program) {
    return { title: 'Program tidak ditemukan — Suarantara' }
  }

  const description = firstParagraph(program.leadBackground || program.backgroundBody)
  const image = normalizeImage(program.coverImageUrl)
  const url = `${SITE_URL}/program/${program.slug}`

  return {
    title: program.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: program.title,
      description,
      url,
      siteName: 'Suarantara',
      type: 'article',
      locale: 'id_ID',
      images: [{ url: image, width: 1200, height: 630, alt: program.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: program.title,
      description,
      images: [image],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const programs = await getPrograms()
  const program = matchProgram(programs, slug)
  if (!program) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: program.title,
    description: program.leadBackground || undefined,
    image: [normalizeImage(program.coverImageUrl)],
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: program.locationVenue },
    organizer: { '@type': 'Organization', name: program.hostOrganizer || 'Suarantara' },
    url: `${SITE_URL}/program/${program.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailProgramClient initialProgram={program} initialPrograms={programs} />
    </>
  )
}
