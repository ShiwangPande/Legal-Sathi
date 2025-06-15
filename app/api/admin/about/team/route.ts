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
    const { title, description, content, imageUrl, languageCode, team, socialLinks, email, contactNumber } = body;

    if (!title || !description || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name: title,
        role: description,
        bio: content,
        imageUrl,
        languageCode,
        team: team || "content",
        email,
        contactNumber,
        socialLinks: socialLinks || {}
      }
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const languageCode = searchParams.get("languageCode");

    if (!languageCode) {
      return NextResponse.json(
        { error: "Language code is required" },
        { status: 400 }
      );
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        languageCode: languageCode,
      },
      select: {
        id: true,
        name: true,
        role: true,
        bio: true,
        imageUrl: true,
        team: true,
        languageCode: true,
        email: true,
        contactNumber: true,
        socialLinks: true,
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { title, description, content, imageUrl, languageCode, id, team, email, contactNumber } = body;

    if (!id || !title || !description || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the existing team member to compare imageUrl
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (existing && existing.imageUrl && existing.imageUrl !== imageUrl) {
      await deleteImageFromUploadThing(existing.imageUrl);
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: title,
        role: description,
        bio: content,
        imageUrl,
        languageCode,
        team: team || "content",
        email,
        contactNumber
      }
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}