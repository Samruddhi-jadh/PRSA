import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const crawl = await prisma.crawlSession.findUnique({

    where: {
      id: params.id
    },

    include: {
      website: true,

      pages: {
        include: {
          parameters: true
        }
      }

    }

  })

  if (!crawl) {

    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    )

  }

  return NextResponse.json(crawl)

}