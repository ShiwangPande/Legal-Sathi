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

    // First find the founder to get its name, creation time, and image URL
    const founder = await prisma.founder.findUnique({
      where: { id }
    });

    if (!founder) {
      return new NextResponse("Founder not found", { status: 404 });
    }

    // Delete the image from UploadThing if it exists
    await deleteImageFromUploadThing(founder.imageUrl);

    // Delete all translations of this founder by matching name and creation time
    await prisma.founder.deleteMany({
      where: {
        name: founder.name,
        createdAt: founder.createdAt
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FOUNDER_DELETE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 