import { groq } from 'next-sanity'

// ─── Artikel (semua pilar) ────────────────────────────────────────────────────

export const allArticlesQuery = groq`
  *[_type == "artikel"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    pillar,
    excerpt,
    publishedAt,
    "author": author->{ name, image },
    "coverImage": coverImage.asset->url,
    tags
  }
`

export const articlesByPillarQuery = groq`
  *[_type == "artikel" && pillar == $pillar] | order(publishedAt desc) {
    _id,
    title,
    slug,
    pillar,
    excerpt,
    publishedAt,
    "author": author->{ name, image },
    "coverImage": coverImage.asset->url,
    tags
  }
`

export const articleBySlugQuery = groq`
  *[_type == "artikel" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    pillar,
    body,
    excerpt,
    publishedAt,
    "author": author->{ name, image, bio },
    "coverImage": coverImage.asset->url,
    tags
  }
`

export const featuredArticlesQuery = groq`
  *[_type == "artikel" && featured == true] | order(publishedAt desc)[0..2] {
    _id,
    title,
    slug,
    pillar,
    excerpt,
    publishedAt,
    "coverImage": coverImage.asset->url
  }
`

// ─── Struktur Organisasi ──────────────────────────────────────────────────────

export const pengurusQuery = groq`
  *[_type == "pengurus"] | order(order asc) {
    _id,
    name,
    jabatan,
    divisi,
    "photo": photo.asset->url,
    instagram,
    linkedin
  }
`

// ─── Halaman Statis ───────────────────────────────────────────────────────────

export const tentangKamiQuery = groq`
  *[_type == "tentangKami"][0] {
    visi,
    misi,
    sejarah,
    "heroImage": heroImage.asset->url
  }
`
