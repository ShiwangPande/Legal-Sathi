import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuth(request)

  if (!auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    // Optional: check if right exists before deleting
    const existing = await prisma.right.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Right not found" }, { status: 404 })
    }

    await prisma.right.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting right:", error)
    return NextResponse.json({ error: "Failed to delete right" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuth(request)
  if (!auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }
  const data = await request.json()
  try {
    const existing = await prisma.right.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Right not found" }, { status: 404 })
    }
    const updated = await prisma.right.update({
      where: { id },
      data: {
        languageCode: data.languageCode,
        categoryId: Number(data.categoryId),
        title: data.title,
        script: data.script,
        audioUrl: data.audioUrl,
        learnMoreUrl: data.learnMoreUrl,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating right:", error)
    return NextResponse.json({ error: "Failed to update right" }, { status: 500 })
  }
}

export const PATCH = PUT
