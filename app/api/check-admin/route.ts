import { isAdmin } from '@/lib/server/admin-auth';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth(); // ✅ await here

    const admin = isAdmin(userId);  // ✅ works now
    return NextResponse.json({ isAdmin: admin });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
