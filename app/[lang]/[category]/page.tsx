import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getSiteTranslations, t } from "@/lib/translations";
import Navbar from "@/components/Navbar";

interface Props {
  params: { lang: string; category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
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

  const translations = await getSiteTranslations(langCode);

  return (
    <div className="min-h-screen flex flex-col bg-[#d8e1e8] text-[#304674]">
      <Navbar 
        langCode={langCode}
        translations={translations}
        title={category.translations[0]?.name || category.key}
        backUrl={`/${langCode}`}
      />

      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {category.translations[0]?.name || category.key}
          </h1>
          
          {/* Add your category content here */}
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
