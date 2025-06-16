import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getSiteTranslations, t } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import AudioPlayerWrapper from "@/components/AudioPlayerWrapper";

interface Props {
  params: { lang: string; category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params }: Props) {
  const { lang: langCode, category: categoryKey } = params;

  const language = await prisma.language.findUnique({
    where: { code: langCode },
  });

  if (!language) return notFound();

  const category = await prisma.category.findFirst({
    where: { key: categoryKey },
    include: {
      translations: {
        where: { languageCode: langCode },
      },
    },
  });

  if (!category) return notFound();

  const rights = await prisma.right.findMany({
    where: {
      category: { key: categoryKey },
      languageCode: langCode,
      isActive: true,
    },
    include: {
      category: true,
      language: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const translations = await getSiteTranslations(langCode);

  return (
    <div className="min-h-screen flex flex-col bg-[#d8e1e8] text-[#304674]">
      {/* Navbar */}
      <Navbar
        langCode={langCode}
        translations={translations}
        title={category.translations[0]?.name || category.key}
        backUrl={`/${langCode}`}
      />

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          {rights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#304674] text-opacity-70">
                {t(
                  translations,
                  "no.info",
                  "No information available in this category yet."
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rights.map((right) => (
                <div
                  key={right.id}
                  className="rights-card bg-[#fefefe] border border-[#b2cbde] rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-[#304674] mb-4">
                    {right.title}
                  </h3>

                  {right.audioUrl && (
                    <div className="mb-4">
                      <AudioPlayerWrapper src={right.audioUrl} />
                    </div>
                  )}

                  <div className="text-[#304674] text-base leading-relaxed whitespace-pre-wrap">
                    {right.script}
                  </div>

                  {right.learnMoreUrl && (
                    <div className="mt-4">
                      <a
                        href={right.learnMoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-[#98bad5] text-white rounded-lg hover:bg-[#c6d3e3] transition-colors"
                      >
                        {langCode === "hi" ? "और जानें" : "Learn More"} →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#304674] text-white py-4 text-center">
        <p className="text-sm">
          {t(
            translations,
            "site.footer",
            "Made with ❤️ for daily wage workers across India"
          )}
        </p>
      </footer>

      {/* Language Footer */}
      <div className="bg-[#c6d3e3] py-4 text-center text-[#304674] text-sm font-medium">
        Legal Saathi • {language.name} • {new Date().getFullYear()}
      </div>
    </div>
  );
}
