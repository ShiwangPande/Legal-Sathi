import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { deleteImageFromUploadThing } from "@/lib/uploadthing";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, imageUrl, languageCode, id } = body;

    if (!title || !description || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const acknowledgement = await prisma.acknowledgement.create({
      data: {
        name: title,
        contribution: description,
        imageUrl,
        languageCode
      }
    });

    return NextResponse.json(acknowledgement);
  } catch (error) {
    console.error("Error creating acknowledgement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const languageCode = searchParams.get("languageCode");

    // For admin dashboard, return all acknowledgements
    if (!languageCode) {
      const acknowledgements = await prisma.acknowledgement.findMany({
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(acknowledgements);
    }

    // For public pages, filter by language
    const acknowledgements = await prisma.acknowledgement.findMany({
      where: { languageCode },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(acknowledgements);
  } catch (error) {
    console.error("Error fetching acknowledgements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { title, description, content, imageUrl, languageCode, id } = body;

    if (!id || !title || !description || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the existing acknowledgement to compare imageUrl
    const existing = await prisma.acknowledgement.findUnique({ where: { id } });
    if (existing && existing.imageUrl && existing.imageUrl !== imageUrl) {
      await deleteImageFromUploadThing(existing.imageUrl);
    }

    const acknowledgement = await prisma.acknowledgement.update({
      where: { id },
      data: {
        name: title,
        contribution: description,
        imageUrl,
        languageCode
      }
    });

    return NextResponse.json(acknowledgement);
  } catch (error) {
    console.error("Error updating acknowledgement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
