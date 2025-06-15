// app/api/admin/about/founder/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";


export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, imageUrl, languageCode, socialLinks, email, contactNumber } = body;

    if (!title || !description || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const founder = await prisma.founder.create({
      data: {
        name: title,
        title: description,
        bio: content,
        imageUrl,
        languageCode,
        email,
        contactNumber,
        socialLinks: socialLinks || {}
      }
    });

    return NextResponse.json(founder);
  } catch (error) {
    console.error("Error creating founder:", error);
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

    const founders = await prisma.founder.findMany({
      where: {
        languageCode: languageCode,
      },
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        imageUrl: true,
        languageCode: true,
        email: true,
        contactNumber: true,
        socialLinks: true,
      },
    });

    // Log the founders data to check social links
    console.log('Founders data:', JSON.stringify(founders, null, 2));

    return NextResponse.json(founders);
  } catch (error) {
    console.error("Error fetching founders:", error);
    return NextResponse.json(
      { error: "Failed to fetch founders" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, imageUrl, languageCode, id, socialLinks, email, contactNumber } = body;

    if (!id || !title || !description || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const founder = await prisma.founder.update({
      where: { id },
      data: {
        name: title,
        title: description,
        bio: content,
        imageUrl,
        languageCode,
        email,
        contactNumber,
        socialLinks: socialLinks || {}
      }
    });

    return NextResponse.json(founder);
  } catch (error) {
    console.error("Error updating founder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
