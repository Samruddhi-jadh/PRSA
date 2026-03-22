type PageData = {
  url: string
  statusCode: number
  crawlDepth: number
  wordCount: number
  loadTimeMs: number
  title?: string | null
  metaDescription?: string | null
}

type SEOParam = {
  parameterName: string
  category: string
  score: number
  passed: boolean
}

export async function generateSEOParameters(
  page: PageData,
  html: string
): Promise<SEOParam[]> {

  const results: SEOParam[] = []

  /* CRAWLABILITY */

  results.push({
    parameterName: "status_code",
    category: "crawlability",
    score: page.statusCode === 200 ? 1 : 0,
    passed: page.statusCode === 200
  })

  results.push({
    parameterName: "crawl_depth",
    category: "crawlability",
    score: page.crawlDepth <= 2 ? 1 : 0.7,
    passed: true
  })

  /* INDEXABILITY */

  const canonicalMatch = html.match(
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
  )

  let canonicalValid = true

  if (canonicalMatch) {
    const canonicalUrl = canonicalMatch[1].replace(/\/$/, "")
    const pageUrl = page.url.replace(/\/$/, "")
    canonicalValid = canonicalUrl === pageUrl
  }

  results.push({
    parameterName: "canonical_valid",
    category: "indexability",
    score: canonicalValid ? 1 : 0,
    passed: canonicalValid
  })

  const isNoindex = /noindex/i.test(html)

  results.push({
    parameterName: "noindex",
    category: "indexability",
    score: isNoindex ? 0 : 1,
    passed: !isNoindex
  })

  /* ONPAGE */

  const hasTitle = /<title>(.*?)<\/title>/i.test(html)
  const hasMeta = /meta name="description"/i.test(html)

  results.push({
    parameterName: "title_tag",
    category: "onpage",
    score: hasTitle ? 1 : 0,
    passed: hasTitle
  })

  results.push({
    parameterName: "meta_description",
    category: "onpage",
    score: hasMeta ? 1 : 0,
    passed: hasMeta
  })

  /* CONTENT */

  results.push({
    parameterName: "word_count",
    category: "content",
    score: page.wordCount > 800 ? 1 : page.wordCount > 300 ? 0.7 : 0.4,
    passed: page.wordCount > 300
  })

  results.push({
    parameterName: "page_speed",
    category: "content",
    score: page.loadTimeMs < 2000 ? 1 : 0.7,
    passed: true
  })

  /* PROGRAMMATIC */

  results.push({
    parameterName: "url_pattern",
    category: "programmatic",
    score: page.url.split("/").length > 3 ? 1 : 0.6,
    passed: true
  })
    /* =========================
    TITLE OPTIMIZATION
  ========================= */

  const title = page.title || ""
  const titleLength = title.length

  let titleScore = 0

  if (titleLength >= 50 && titleLength <= 60) {
    titleScore = 1
  } else if (titleLength >= 30) {
    titleScore = 0.7
  } else if (titleLength > 0) {
    titleScore = 0.4
  }

  results.push({
    parameterName: "title_optimization",
    category: "onpage",
    score: titleScore,
    passed: titleScore >= 0.7
  })
    /* =========================
    META DESCRIPTION QUALITY
  ========================= */

  const meta = page.metaDescription || ""
  const metaLength = meta.length

  let metaScore = 0

  if (metaLength >= 120 && metaLength <= 160) {
    metaScore = 1
  } else if (metaLength >= 70) {
    metaScore = 0.7
  } else if (metaLength > 0) {
    metaScore = 0.4
  }

  results.push({
    parameterName: "meta_quality",
    category: "onpage",
    score: metaScore,
    passed: metaScore >= 0.7
  })
    /* =========================
    INTERNAL LINK DENSITY
  ========================= */

  const internalLinks = (html.match(/<a\s+href="/g) || []).length

  let linkScore = 0

  if (internalLinks >= 20) linkScore = 1
  else if (internalLinks >= 10) linkScore = 0.7
  else if (internalLinks > 0) linkScore = 0.4

  results.push({
    parameterName: "internal_link_density",
    category: "onpage",
    score: linkScore,
    passed: linkScore >= 0.7
  })
    /* =========================
    SEMANTIC COVERAGE SCORE
  ========================= */

  const text = html.replace(/<[^>]*>/g, " ").toLowerCase()
  const words = text.split(/\s+/).filter(w => w.length > 3)

  const uniqueWords = new Set(words)

  const diversity = uniqueWords.size / words.length

  let semanticScore = 0

  if (diversity > 0.6) semanticScore = 1
  else if (diversity > 0.4) semanticScore = 0.7
  else semanticScore = 0.4

  results.push({
    parameterName: "semantic_coverage",
    category: "content",
    score: semanticScore,
    passed: semanticScore >= 0.7
  })

  return results
}