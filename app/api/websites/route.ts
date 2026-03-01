import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      )
    }

    const website = await prisma.website.upsert({
  where: { domain },
  update: {},
  create: { domain }
})

    return NextResponse.json(website)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Website creation failed" },
      { status: 500 }
    )
  }
}