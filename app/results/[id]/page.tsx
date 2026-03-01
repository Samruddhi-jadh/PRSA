import { prisma } from "@/lib/prisma"

export default async function Results({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const crawl = await prisma.crawlSession.findUnique({
    where: { id },
    include: {
      website: true,
    },
  })

  if (!crawl) {
    return <div style={{ padding: 40 }}>Crawl not found</div>
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>SEO Analysis Result</h1>

      <h2>Domain: {crawl.website.domain}</h2>
      <p>Status: {crawl.status}</p>

      <h3>Scores</h3>
      <ul>
        <li>Crawlability: {crawl.crawlabilityScore?.toFixed(2)}</li>
        <li>Indexability: {crawl.indexabilityScore?.toFixed(2)}</li>
        <li>On Page: {crawl.onPageScore?.toFixed(2)}</li>
        <li>Content: {crawl.contentScore?.toFixed(2)}</li>
        <li>Programmatic: {crawl.programmaticScore?.toFixed(2)}</li>
        <li><strong>Overall: {crawl.overallScore?.toFixed(2)}</strong></li>
      </ul>
    </div>
  )
}