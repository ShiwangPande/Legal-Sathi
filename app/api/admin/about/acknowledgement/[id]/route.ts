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

    // First find the acknowledgement to get its name, creation time, and image URL
    const acknowledgement = await prisma.acknowledgement.findUnique({
      where: { id }
    });

    if (!acknowledgement) {
      return new NextResponse("Acknowledgement not found", { status: 404 });
    }

    // Delete the image from UploadThing if it exists
    await deleteImageFromUploadThing(acknowledgement.imageUrl);

    // Delete all translations of this acknowledgement by matching name and creation time
    await prisma.acknowledgement.deleteMany({
      where: {
        name: acknowledgement.name,
        createdAt: acknowledgement.createdAt
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ACKNOWLEDGEMENT_DELETE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 