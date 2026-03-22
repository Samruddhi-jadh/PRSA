type Page = {
  id: string
  url: string
  title: string | null
  wordCount: number | null
  statusCode: number | null
  contentHash?: string | null
}

type Link = {
  sourceUrl: string
  targetUrl: string
}

type SiteInsights = {
  duplicateTitleCount: number
  thinContentRatio: number
  urlPatternScore: number
  duplicateContentCount: number
  orphanPagesCount: number
  crawlErrorRate: number
}

export function analyzeSite(
  pages: Page[],
  links: Link[]
): SiteInsights {

  /* =========================
     DUPLICATE TITLES
  ========================= */
  const titleMap: Record<string, number> = {}

  for (const page of pages) {
    if (!page.title) continue
    titleMap[page.title] = (titleMap[page.title] || 0) + 1
  }

  const duplicateTitleCount = Object.values(titleMap)
    .filter(c => c > 1)
    .reduce((a, b) => a + b, 0)

  /* =========================
     THIN CONTENT
  ========================= */
  const thinPages = pages.filter(p => (p.wordCount ?? 0) < 300).length
  const thinContentRatio = pages.length ? thinPages / pages.length : 0

  /* =========================
     URL PATTERN
  ========================= */
  const depths = pages.map(p => p.url.split("/").length)

  const avgDepth =
    depths.reduce((a, b) => a + b, 0) / depths.length

  const variance =
    depths.reduce((sum, d) => sum + Math.pow(d - avgDepth, 2), 0) / depths.length

  const urlPatternScore = variance < 2 ? 1 : 0.6

  /* =========================
     DUPLICATE CONTENT (HASH)
  ========================= */
  const hashMap: Record<string, number> = {}

  for (const p of pages) {
    if (!p.contentHash) continue
    hashMap[p.contentHash] = (hashMap[p.contentHash] || 0) + 1
  }

  const duplicateContentCount = Object.values(hashMap)
    .filter(c => c > 1)
    .reduce((a, b) => a + b, 0)

  /* =========================
     ORPHAN PAGES
  ========================= */
  const linked = new Set(links.map(l => l.targetUrl))

  const orphanPagesCount = pages.filter(
    p => !linked.has(p.url)
  ).length

  /* =========================
     CRAWL ERROR RATE
  ========================= */
  const errorPages = pages.filter(p => (p.statusCode ?? 0) >= 400).length

  const crawlErrorRate =
    pages.length ? errorPages / pages.length : 0

  return {
    duplicateTitleCount,
    thinContentRatio,
    urlPatternScore,
    duplicateContentCount,
    orphanPagesCount,
    crawlErrorRate
  }
}