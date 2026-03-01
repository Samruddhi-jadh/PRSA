import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { websiteId } = await req.json()

    if (!websiteId) {
      return NextResponse.json(
        { error: "websiteId is required" },
        { status: 400 }
      )
    }

    const crawl = await prisma.crawlSession.create({
      data: {
        websiteId,
        status: "completed", // mock complete
        crawlabilityScore: Math.random() * 100,
        indexabilityScore: Math.random() * 100,
        onPageScore: Math.random() * 100,
        contentScore: Math.random() * 100,
        programmaticScore: Math.random() * 100,
        overallScore: Math.random() * 100,
      }
    })

    return NextResponse.json(crawl)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Crawl creation failed" },
      { status: 500 }
    )
  }
}