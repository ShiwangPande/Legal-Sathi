// lib/server/admin-auth.ts
'use server';

import { auth } from '@clerk/nextjs/server';

export const isAdmin = async () => {
  try {
    const { userId } = await auth();
    
    if (!userId) return false;

    // ✅ Option 1: Use env variable with comma-separated user IDs
    const adminUserIds = (process.env.ADMIN_USER_IDS || "").split(",").map(id => id.trim());

    const isAdmin = adminUserIds.includes(userId);

    return isAdmin;
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
};
