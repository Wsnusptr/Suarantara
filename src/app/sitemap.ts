import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

// Sitemap dibuat dinamis (selalu menyertakan konten terbaru dari CMS).
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/kirim-suara`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]

  let articleRoutes: MetadataRoute.Sitemap = []
  let programRoutes: MetadataRoute.Sitemap = []
  let advocacyRoutes: MetadataRoute.Sitemap = []

  try {
    const [articles, programs, cases] = await Promise.all([
      db.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: 1000,
      }),
      db.program.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      db.advocacyCase.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
    ])

    articleRoutes = articles.map((a) => ({
      url: `${SITE_URL}/berita/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    programRoutes = programs.map((p) => ({
      url: `${SITE_URL}/program/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    advocacyRoutes = cases.map((c) => ({
      url: `${SITE_URL}/advokasi/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Bila DB belum siap, kembalikan rute statis saja (sitemap tetap valid).
  }

  return [...staticRoutes, ...articleRoutes, ...programRoutes, ...advocacyRoutes]
}
