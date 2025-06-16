import { prisma } from "@/lib/db";
import RightsPageClient from "./page.client";

export default async function RightsPage() {
  // Fetch all required data in parallel
  const [rights, categories, languages] = await Promise.all([
    prisma.right.findMany({
      include: {
        category: true,
        language: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.category.findMany(),
    prisma.language.findMany({
      where: {
        isActive: true,
      },
    }),
  ]);

  return <RightsPageClient rights={rights} categories={categories} languages={languages} />;
}
