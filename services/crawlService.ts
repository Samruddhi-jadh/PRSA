import { prisma } from "@/lib/prisma"
import { crawlEngine } from "@/crawler/crawlEngine"
import { computeScores } from "@/services/scoreServices"
import { normalizeDomain } from "@/utils/domainUtils"
import { fetchRobots, fetchSitemap } from "@/services/technicalSEO"

export async function startCrawl(websiteId: string) {

  // 1️⃣ Get website
  const website = await prisma.website.findUnique({
    where: { id: websiteId }
  })

  if (!website) {
    throw new Error("Website not found")
  }

  // 2️⃣ Normalize domain
  const normalizedDomain = normalizeDomain(website.domain)

  // 3️⃣ Create crawl session
  const crawl = await prisma.crawlSession.create({
    data: {
      websiteId,
      status: "running"
    }
  })

  // 4️⃣ BACKGROUND JOB
  ;(async () => {

    try {

      console.log("🚀 Background crawl started:", crawl.id)

      // ✅ STEP A: Fetch technical SEO FIRST
      const robots = await fetchRobots(normalizedDomain)
      const sitemap = await fetchSitemap(normalizedDomain)

      console.log("📄 Robots:", !!robots)
      console.log("🗺 Sitemap:", !!sitemap)

      // 👉 OPTIONAL: store in crawlSession (BEST PRACTICE)
      await prisma.crawlSession.update({
        where: { id: crawl.id },
        data: {
          robotsTxt: robots ?? null,
          sitemapXml: sitemap ?? null
        }
      })

      // ✅ STEP B: Crawl pages
      await crawlEngine(normalizedDomain, crawl.id)

      console.log("✅ Crawling done:", crawl.id)

      // ✅ STEP C: Compute scores
      const scores = await computeScores(crawl.id)

      console.log("📊 Score computed:", scores)

      // ✅ FINAL UPDATE
      await prisma.crawlSession.update({
        where: { id: crawl.id },
        data: {
          status: "completed",
          crawlabilityScore: scores.crawlability,
          indexabilityScore: scores.indexability,
          onPageScore: scores.onPage,
          contentScore: scores.content,
          programmaticScore: scores.programmatic,
          overallScore: scores.overall
        }
      })

      console.log("🎉 Crawl completed:", crawl.id)

    } catch (error) {

      console.error("❌ Background crawl error:", error)

      await prisma.crawlSession.update({
        where: { id: crawl.id },
        data: { status: "failed" }
      })

    }

  })()

  return crawl
}