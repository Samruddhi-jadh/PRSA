import { prisma } from "@/lib/prisma"
import { fetchPage } from "./fetchPage"
import { extractLinks } from "./linkExtractor"
import { normalizeUrl } from "./urlNormalizer"
import { QueueItem } from "@/types/crawl.types"
import { analyzePage } from "@/parameters/analyzer/analyzePage"
import { ParameterResult } from "@/types/parameter.types"
import { generateSEOParameters } from "@/services/seoAnalyzer"
import { isBlockedByRobots } from "@/services/robotsParser"
import { generateContentHash } from "@/services/contentHash"

export async function crawlEngine(
  domain: string,
  crawlSessionId: string,
  robotsTxt?: string | null   // ✅ FIXED
) {

  if (!domain.startsWith("http")) {
    domain = "https://" + domain
  }

  const MAX_PAGES = 25
  const visited = new Set<string>()

  const queue: QueueItem[] = [
    { url: domain, depth: 0 }
  ]

  console.log("Starting crawl for:", domain)

  while (queue.length > 0 && visited.size < MAX_PAGES) {

    const { url, depth } = queue.shift()!

    if (visited.has(url)) continue
    visited.add(url)

    try {

      const result = await fetchPage(url)

      if (!result.html) continue

      const analysis = analyzePage(result.html)

      const title = analysis.metadata.title ?? null
      const metaDescription = analysis.metadata.metaDescription ?? null
      const wordCount = analysis.metadata.wordCount ?? 0

      if (wordCount < 50) continue

      /* CREATE PAGE */

      const page = await prisma.page.create({
        data: {
          crawlSessionId,
          url,
          statusCode: result.statusCode,
          loadTimeMs: result.loadTimeMs,
          crawlDepth: depth,
          title,
          metaDescription,
          wordCount
        }
      })

      /* SAFE PAGE */

      const safePage = {
        ...page,
        statusCode: page.statusCode ?? 0,
        crawlDepth: page.crawlDepth ?? 0,
        wordCount: page.wordCount ?? 0,
        loadTimeMs: page.loadTimeMs ?? 0
      }

      /* BASIC ANALYZER PARAMS */

      const baseParams: ParameterResult[] =
        (analysis.results ?? []).map((r) => ({
          parameterName: r.parameterName,
          category: r.category ?? "onpage",
          score: r.score,
          passed: r.passed
        }))

      /* SEO PARAMETERS */

      const seoParams = await generateSEOParameters(safePage, result.html)

      const allParams = [...baseParams, ...seoParams]

      if (allParams.length > 0) {
        await prisma.parameterResult.createMany({
          data: allParams.map(p => ({
            pageId: page.id,
            parameterName: p.parameterName,
            category: p.category,
            score: p.score,
            passed: p.passed
          }))
        })
      }

      /* ROBOTS CHECK */

      const blocked = robotsTxt
        ? isBlockedByRobots(robotsTxt, url)
        : false

      await prisma.parameterResult.create({
        data: {
          pageId: page.id,
          parameterName: "robots_blocked",
          category: "crawlability",
          score: blocked ? 0 : 1,
          passed: !blocked
        }
      })

      /* BROKEN LINK CHECK */

      const isBroken = result.statusCode >= 400

      await prisma.parameterResult.create({
        data: {
          pageId: page.id,
          parameterName: "broken_link",
          category: "crawlability",
          score: isBroken ? 0 : 1,
          passed: !isBroken
        }
      })

      /* CONTENT HASH (ONLY if field exists in DB) */

      try {
        const hash = generateContentHash(result.html)

        await prisma.page.update({
          where: { id: page.id },
          data: { contentHash: hash }   // ⚠ requires schema update
        })
      } catch {
        // ignore if column not present
      }
        /* DUPLICATE CONTENT PARAM */

  await prisma.parameterResult.create({
    data: {
      pageId: page.id,
      parameterName: "duplicate_content",
      category: "content",
      score: 1, // default, will be evaluated at site level
      passed: true
    }
  })

      /* LINKS */

      const links = extractLinks(result.html)

      const internalLinks = []

      for (const link of links) {

        const normalized = normalizeUrl(link, domain)

        if (!normalized) continue
        if (!normalized.startsWith(domain)) continue
        if (visited.has(normalized)) continue
        if (queue.find(q => q.url === normalized)) continue

        queue.push({ url: normalized, depth: depth + 1 })

        internalLinks.push({
          crawlSessionId,
          sourceUrl: url,
          targetUrl: normalized
        })
      }

      if (internalLinks.length > 0) {
        await prisma.internalLink.createMany({
          data: internalLinks
        })
      }

      console.log(`Fetched: ${url}`)

    } catch (error) {
      console.error(`Error crawling ${url}:`, error)
    }
  }

  console.log("Crawl complete.")
}