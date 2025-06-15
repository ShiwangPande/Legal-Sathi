import { prisma } from "@/lib/db";
import { RightsTable } from "@/components/rights-table";
import { AddRightForm } from "@/components/add-right-form";

export default async function RightsPage() {
  const [rights, categories, languages] = await Promise.all([
    prisma.right.findMany({
      include: {
        category: true,
        language: true
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.category.findMany(),
    prisma.language.findMany({
      where: {
        isActive: true
      }
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rights Management</h2>
        <p className="text-muted-foreground">
          Manage legal rights and their translations
        </p>
      </div>
      <div className="grid gap-8">
        <AddRightForm categories={categories} languages={languages} />
        <RightsTable rights={rights} categories={categories} languages={languages} />
      </div>
    </div>
  );
} 