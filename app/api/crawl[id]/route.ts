import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const crawl = await prisma.crawlSession.findUnique({
      where: { id: params.id },
      include: {
        website: true
      }
    })

    if (!crawl) {
      return NextResponse.json(
        { error: "Crawl not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(crawl)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch crawl" },
      { status: 500 }
    )
  }
}