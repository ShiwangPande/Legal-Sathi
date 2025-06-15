import { prisma } from "@/lib/db";

export default async function LanguagesPage() {
  const languages = await prisma.language.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Languages</h2>
        <p className="text-muted-foreground">
          Manage supported languages and their translations
        </p>
      </div>
      <div className="grid gap-8">
        <div className="rounded-md border">
          <div className="p-4">
            <h3 className="text-lg font-medium">Language List</h3>
            <div className="mt-4">
              {languages.length === 0 ? (
                <p className="text-muted-foreground">No languages configured yet.</p>
              ) : (
                <div className="space-y-4">
                  {languages.map((language) => (
                    <div key={language.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flagEmoji}</span>
                        <div>
                          <p className="font-medium">{language.name}</p>
                          <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{language.code}</span>
                        {language.isActive ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 