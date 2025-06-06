// app/api/check-admin/route.ts
import { isAdmin } from '@/lib/server/admin-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const admin = await isAdmin();
    return NextResponse.json({ isAdmin: admin });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}