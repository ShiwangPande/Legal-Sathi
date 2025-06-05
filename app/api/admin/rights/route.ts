import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { languageCode, categoryId, title, script, audioUrl, learnMoreUrl } = data

    const right = await prisma.right.create({
      data: {
        categoryId: Number.parseInt(categoryId),
        languageCode,
        title,
        script,
        audioUrl,
        learnMoreUrl,
      },
    })

    return NextResponse.json(right, { status: 201 })
  } catch (error) {
    
    console.error("Error creating right:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
