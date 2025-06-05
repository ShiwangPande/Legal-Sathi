import { prisma } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { ArrowRight } from "lucide-react"
import VolunteerForm from "@/components/volunteer-form"
import { getSiteTranslations, t } from "@/lib/translations"

interface Props {
  params: { lang: string }
}

export default async function LanguagePage({ params }: Props) {
  const langCode = params.lang

  const language = await prisma.language.findUnique({
    where: { code: langCode },
  })

  if (!language) return notFound()

  // Get site translations for the selected language
  const translations = await getSiteTranslations(langCode)

  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: { languageCode: langCode },
      },
    },
    orderBy: { id: "asc" },
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#d8e1e8] text-[#304674]">
      {/* Header */}
      <div className="mobile-header bg-gradient-to-r from-[#304674] to-[#98bad5] text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-white hover:text-[#c6d3e3] transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>{t(translations, 'common.back', 'Back')}</span>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold">Legal Saathi</h1>
            <p className="text-sm opacity-90">{language.nativeName}</p>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6 md:p-10 flex-grow">
        <h2 className="text-xl md:text-2xl font-semibold text-[#304674] mb-6 text-center">
          {t(translations, 'site.category.choose', langCode === "hi" ? "श्रेणी चुनें" : "Choose Category")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${langCode}/${category.key}`}
              className="category-card flex flex-col items-center justify-center p-6 bg-white border-2 border-[#b2cbde] rounded-xl hover:border-[#98bad5] hover:shadow-lg min-h-[120px] transition-all duration-200 ease-in-out"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <div className="text-center">
                <div className="text-sm font-semibold text-[#304674] leading-tight">
                  {category.translations[0]?.name || category.key}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-[#c6d3e3] p-8 md:p-12 mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#304674] mb-4 text-center">
            {t(translations, 'site.about.title', 'About Legal Saathi')}
          </h2>
          <p className="text-[#304674]/80 text-center mb-6">
            {t(translations, 'site.about.description', 'Legal Saathi helps daily wage workers understand their legal rights in a simple, accessible way.')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5]">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-2 text-[#304674]">
                {t(translations, 'site.feature.understand', 'Easy to Understand')}
              </h3>
              <p className="text-sm text-[#304674]/70">
                {t(translations, 'site.feature.understand.desc', 'Simple language with audio explanations for better accessibility.')}
              </p>
            </div>

            <div className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5]">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold text-lg mb-2 text-[#304674]">
                {t(translations, 'site.feature.multilingual', 'Multiple Languages')}
              </h3>
              <p className="text-sm text-[#304674]/70">
                {t(translations, 'site.feature.multilingual.desc', 'Available in various Indian languages to reach more workers.')}
              </p>
            </div>

            <div className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5]">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2 text-[#304674]">
                {t(translations, 'site.feature.offline', 'Works Offline')}
              </h3>
              <p className="text-sm text-[#304674]/70">
                {t(translations, 'site.feature.offline.desc', 'Access information even without an internet connection.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Link */}
      <div className="p-6 text-center">
        <Link href="/sign-in" className="inline-flex items-center text-[#304674] hover:opacity-80 font-medium">
          {t(translations, 'site.admin.access', 'Admin Access')} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {/* Volunteer Form */}
      <VolunteerForm translations={translations} languageCode={langCode} />

      {/* Footer */}
      <div className="p-6 bg-[#304674] text-center text-white">
        <p className="text-sm">
          {t(translations, 'site.footer', 'Made with ❤️ for daily wage workers across India')}
        </p>
      </div>

      {/* Language Footer */}
      <div className="mt-auto p-6 bg-[#c6d3e3] text-center text-[#304674]">
        <p className="text-sm font-medium">
          Legal Saathi • {language.name} • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}