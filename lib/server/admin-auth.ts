// lib/server/admin-auth.ts
'use server';

export const isAdmin = async (userId: string | null | undefined): Promise<boolean> => {
  if (!userId) return false;

  const adminUserIds = (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map(id => id.trim());

  return adminUserIds.includes(userId);
};
