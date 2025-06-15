import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteImageFromUploadThing } from "@/lib/uploadthing";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // First find the team member to get its name, creation time, and image URL
    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!teamMember) {
      return new NextResponse("Team member not found", { status: 404 });
    }

    // Delete the image from UploadThing if it exists
    await deleteImageFromUploadThing(teamMember.imageUrl);

    // Delete all translations of this team member by matching name and creation time
    await prisma.teamMember.deleteMany({
      where: {
        name: teamMember.name,
        createdAt: teamMember.createdAt
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TEAM_DELETE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 