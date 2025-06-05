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
