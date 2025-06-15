import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  const stats = await Promise.all([
    prisma.right.count(),
    prisma.volunteer.count(),
    prisma.language.count(),
    prisma.category.count()
  ]);

  const [rightsCount, volunteersCount, languagesCount, categoriesCount] = stats;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and view statistics
        </p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Total Rights</h3>
              <p className="text-2xl font-bold">{rightsCount}</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Total Volunteers</h3>
              <p className="text-2xl font-bold">{volunteersCount}</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Supported Languages</h3>
              <p className="text-2xl font-bold">{languagesCount}</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Categories</h3>
              <p className="text-2xl font-bold">{categoriesCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 