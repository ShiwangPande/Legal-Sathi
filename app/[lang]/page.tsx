import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Info, ArrowRight } from "lucide-react";
import VolunteerForm from "@/components/volunteer-form";
import { getSiteTranslations, t } from "@/lib/translations";
import Navbar from "@/components/Navbar";

interface Props {
  params: { lang: string };
}

export default async function LanguagePage({ params }: Props) {
  const langCode = params.lang;

  const language = await prisma.language.findUnique({
    where: { code: langCode },
  });

  if (!language) return notFound();

  const translations = await getSiteTranslations(langCode);

  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: { languageCode: langCode },
      },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#d8e1e8] text-[#304674]">
      {/* Navbar */}
      <Navbar
        langCode={langCode}
        translations={translations}
        title={language.nativeName}
      />

      {/* Category Grid */}
      <main className="flex-grow p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
          {t(
            translations,
            "site.category.choose",
            langCode === "hi" ? "श्रेणी चुनें" : "Choose Category"
          )}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${langCode}/${category.key}`}
              className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#b2cbde] rounded-xl hover:border-[#304674] hover:shadow-lg min-h-[120px] transition-all duration-200"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <div className="text-center text-sm font-semibold leading-tight">
                {category.translations[0]?.name || category.key}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* About Section */}
      <section className="bg-[#c6d3e3] p-8 md:p-12 mt-8">
        <div className="max-w-4xl mx-auto text-center">
        <Link
  href={`/${langCode}/about`}
  className="group inline-block bg-white border-2 border-[#98bad5] rounded-xl px-6 py-4 shadow-sm hover:shadow-md hover:border-[#304674] transition"
>
  <div className="flex items-center justify-center gap-2">
    {/* 👉 shown only on desktop */}
    <span className="hidden md:inline text-2xl animate-bounce-slow">👉</span>

    <span className="text-lg md:text-xl font-semibold group-hover:underline">
      {t(translations, "site.about.title", "About Legal Saathi")}
    </span>

    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-[#304674] opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition" />
  </div>

  {/* 👉 for mobile hint only */}
  {/* 👉 mobile */}
  <div className="mt-2 text-sm text-gray-600 md:hidden animate-pulse">
    👉 {langCode === "hi" ? "जानिए कैसे मदद करता है" : "Tap to learn more"}
  </div>

  {/* 👉 desktop */}
  <div className="mt-2 hidden md:block text-sm text-gray-600 animate-pulse">
    👉 {langCode === "hi" ? "और जानिए कि यह कैसे मदद करता है" : "Click to explore more about Legal Saathi"}
  </div>

</Link>


          <p className="text-[#304674]/80 mt-4 max-w-2xl mx-auto">
            {t(
              translations,
              "site.about.description",
              "Legal Saathi helps daily wage workers understand their legal rights in a simple, accessible way."
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: "🔍",
                title: t(translations, "site.feature.understand", "Easy to Understand"),
                desc: t(
                  translations,
                  "site.feature.understand.desc",
                  "Simple language with audio explanations for better accessibility."
                ),
              },
              {
                icon: "🌐",
                title: t(translations, "site.feature.multilingual", "Multiple Languages"),
                desc: t(
                  translations,
                  "site.feature.multilingual.desc",
                  "Available in various Indian languages to reach more workers."
                ),
              },
              {
                icon: "📱",
                title: t(translations, "site.feature.offline", "Works Offline"),
                desc: t(
                  translations,
                  "site.feature.offline.desc",
                  "Access information even without an internet connection."
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5] text-left"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-[#304674]/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <VolunteerForm translations={translations} languageCode={langCode} />

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
