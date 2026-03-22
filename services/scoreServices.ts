import { prisma } from "@/lib/prisma"
import { analyzeSite } from "./siteAnalyzer"

type ScoreMap = {
  crawlability: number | null
  indexability: number | null
  onPage: number | null
  content: number | null
  programmatic: number | null
}

export async function computeScores(crawlSessionId: string) {

  /* 1️⃣ FETCH DATA */

  const pages = await prisma.page.findMany({
    where: { crawlSessionId },
    include: { parameters: true }
  })

  const links = await prisma.internalLink.findMany({
    where: { crawlSessionId }
  })

  /* 2️⃣ SITE INSIGHTS */

  const siteInsights = analyzeSite(pages, links)

  /* 3️⃣ GROUP SCORES */

  const categoryMap: Record<string, number[]> = {
    crawlability: [],
    indexability: [],
    onpage: [],
    content: [],
    programmatic: []
  }

  for (const page of pages) {
    for (const param of page.parameters) {
      const cat = param.category.toLowerCase()
      if (categoryMap[cat]) {
        categoryMap[cat].push(param.score)
      }
    }
  }

  /* 4️⃣ AVG */

  const avg = (arr: number[]): number | null =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null

  /* 5️⃣ BASE */

  let crawlabilityScore = avg(categoryMap.crawlability)   // ✅ FIXED
  const indexabilityScore = avg(categoryMap.indexability)
  let onPageScore = avg(categoryMap.onpage)
  let contentScore = avg(categoryMap.content)
  let programmaticScore = avg(categoryMap.programmatic)

  /* 6️⃣ REAL SEO LOGIC */

  if (contentScore !== null) {
    contentScore = contentScore * (1 - siteInsights.thinContentRatio)
  }

  if (programmaticScore !== null) {
    programmaticScore =
      (programmaticScore + siteInsights.urlPatternScore) / 2
  }

  if (onPageScore !== null && siteInsights.duplicateTitleCount > 0) {
    const penalty = Math.min(0.2, siteInsights.duplicateTitleCount * 0.02)
    onPageScore = Math.max(0, onPageScore - penalty)
  }

  // 🔥 NEW
  if (contentScore !== null && siteInsights.duplicateContentCount > 0) {
    const penalty = Math.min(0.3, siteInsights.duplicateContentCount * 0.02)
    contentScore = Math.max(0, contentScore - penalty)
  }

  if (crawlabilityScore !== null && siteInsights.orphanPagesCount > 0) {
    const penalty = Math.min(0.2, siteInsights.orphanPagesCount * 0.01)
    crawlabilityScore = Math.max(0, crawlabilityScore - penalty)
  }
  // ❗ Duplicate content penalty
if (contentScore !== null && siteInsights.duplicateContentCount > 0) {
  const penalty = Math.min(0.3, siteInsights.duplicateContentCount * 0.02)
  contentScore = Math.max(0, contentScore - penalty)
}

// ❗ Orphan pages penalty (crawlability)
let finalCrawlability = crawlabilityScore

if (finalCrawlability !== null && siteInsights.orphanPagesCount > 0) {
  const penalty = Math.min(0.2, siteInsights.orphanPagesCount * 0.01)
  finalCrawlability = Math.max(0, finalCrawlability - penalty)
}

// ❗ Crawl error penalty
if (finalCrawlability !== null && siteInsights.crawlErrorRate > 0) {
  finalCrawlability =
    finalCrawlability * (1 - siteInsights.crawlErrorRate)
}

  /* 7️⃣ FINAL */

 const scores: ScoreMap = {
  crawlability: finalCrawlability,
  indexability: indexabilityScore,
  onPage: onPageScore,
  content: contentScore,
  programmatic: programmaticScore
}

  /* 8️⃣ WEIGHTS */

  const weights = {
    crawlability: 0.30,
    indexability: 0.25,
    onPage: 0.25,
    content: 0.10,
    programmatic: 0.10
  }

  const overall =
    (scores.crawlability ?? 0) * weights.crawlability +
    (scores.indexability ?? 0) * weights.indexability +
    (scores.onPage ?? 0) * weights.onPage +
    (scores.content ?? 0) * weights.content +
    (scores.programmatic ?? 0) * weights.programmatic

  const finalOverall = Number(overall.toFixed(3))

  /* 9️⃣ STORE */

  await prisma.crawlSession.update({
    where: { id: crawlSessionId },
    data: {
      crawlabilityScore: scores.crawlability,
      indexabilityScore: scores.indexability,
      onPageScore: scores.onPage,
      contentScore: scores.content,
      programmaticScore: scores.programmatic,
      overallScore: finalOverall
    }
  })
  

  return {
    ...scores,
    overall: finalOverall
  }
}