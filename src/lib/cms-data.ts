import { db } from '@/lib/db'

// ─── MEDIA PILLAR QUERIES ────────────────────────────────────────────────────

export async function getHeadlineBannerArticle() {
  try {
    return await db.article.findFirst({
      where: { isHeadlineBanner: true, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching headline article:', err)
    return null
  }
}

export async function getGridArticles(limit = 27) {
  try {
    return await db.article.findMany({
      where: { isHeadlineBanner: false, isEditorPick: false, isTrending: false, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })
  } catch (err) {
    console.error('Error fetching grid articles:', err)
    return []
  }
}

export async function getRecommendedArticles(limit = 7) {
  try {
    return await db.article.findMany({
      where: { isEditorPick: true, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })
  } catch (err) {
    console.error('Error fetching recommended articles:', err)
    return []
  }
}

export async function getTrendingArticles(limit = 4) {
  try {
    return await db.article.findMany({
      where: { isTrending: true, status: 'PUBLISHED' },
      orderBy: { rankingNo: 'asc' },
      take: limit,
    })
  } catch (err) {
    console.error('Error fetching trending articles:', err)
    return []
  }
}

export async function getVideoReels() {
  try {
    return await db.videoReel.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching video reels:', err)
    return []
  }
}

export async function getActivePoll() {
  try {
    return await db.poll.findFirst({
      where: { isActive: true },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching poll:', err)
    return null
  }
}

export async function getQuoteAspiration() {
  try {
    return await db.quoteAspiration.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching quote aspiration:', err)
    return null
  }
}

// ─── ADVOCACY PILLAR QUERIES ─────────────────────────────────────────────────

export async function getNationalPriorityCase() {
  try {
    return await db.advocacyCase.findFirst({
      where: { isNationalPriority: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching national priority case:', err)
    return null
  }
}

export async function getAdvocacyCases(category?: string) {
  try {
    return await db.advocacyCase.findMany({
      where: {
        isNationalPriority: false,
        ...(category && category !== 'semua' ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching advocacy cases:', err)
    return []
  }
}

export async function getAdvocacyDocuments() {
  try {
    return await db.advocacyDocument.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching advocacy documents:', err)
    return []
  }
}

export async function getActivePetition() {
  try {
    return await db.petition.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching petition:', err)
    return null
  }
}

// ─── KAJIAN PILLAR QUERIES ───────────────────────────────────────────────────

export async function getResearchPapers(category?: string) {
  try {
    return await db.researchPaper.findMany({
      where: category && category !== 'semua' ? { category } : {},
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching research papers:', err)
    return []
  }
}

export async function getObservatoryIndicators() {
  try {
    return await db.observatoryIndicator.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching observatory indicators:', err)
    return []
  }
}

export async function getPolicyRecommendations() {
  try {
    return await db.policyRecommendationItem.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching policy recommendations:', err)
    return []
  }
}

export async function getResearchEvent() {
  try {
    return await db.researchEvent.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching research event:', err)
    return null
  }
}

// ─── PARTNERS & PROGRAM QUERIES ──────────────────────────────────────────────

export async function getPartners() {
  try {
    return await db.partner.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching partners:', err)
    return []
  }
}

export async function getPrograms(category?: string) {
  try {
    return await db.program.findMany({
      where: category && category !== 'Semua' ? { category } : {},
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching programs:', err)
    return []
  }
}

export async function getTickerItems() {
  try {
    return await db.tickerItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('Error fetching ticker items:', err)
    return []
  }
}
