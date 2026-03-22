import { NextResponse } from "next/server"
import { startCrawl } from "@/services/crawlService"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const websiteId = body.websiteId

    if (!websiteId) {
      return NextResponse.json(
        { error: "websiteId required" },
        { status: 400 }
      )
    }

    const crawl = await startCrawl(websiteId)

    return NextResponse.json({
      success: true,
      crawlId: crawl.id
    })

  } catch (error) {

    console.error("Crawl API error:", error)

    return NextResponse.json(
      { error: "Crawl failed" },
      { status: 500 }
    )
  }
}