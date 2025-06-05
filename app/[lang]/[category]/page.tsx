import { prisma } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"
import AudioPlayerWrapper from "@/components/AudioPlayerWrapper"
import { ChevronLeft } from "lucide-react"

async function getLanguage(code: string) {
  return await prisma.language.findUnique({
    where: {
      code: code,
    },
  })
}

async function getCategory(key: string, languageCode: string) {
  return await prisma.category.findUnique({
    where: {
      key: key,
    },
    include: {
      translations: {
        where: {
          languageCode: languageCode,
        },
      },
    },
  })
}

async function getRights(categoryKey: string, languageCode: string) {
  return await prisma.right.findMany({
    where: {
      category: {
        key: categoryKey,
      },
      languageCode: languageCode,
      isActive: true,
    },
    include: {
      category: true,
      language: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}

export default async function CategoryPage({
  params,
}: {
  params: { lang: string; category: string }
}) {
  const langCode = params.lang
  const categoryKey = params.category

  const language = await getLanguage(langCode)
  if (!language) {
    notFound()
  }

  const category = await getCategory(categoryKey, langCode)
  if (!category) {
    notFound()
  }

  const rights = await getRights(categoryKey, langCode)

  {rights.map((right) => {
  console.log("Audio URL:", right.audioUrl);
  return (
    <div key={right.id} className="rights-card ...">
      {/* rest of code */}
      {right.audioUrl && <AudioPlayerWrapper  src={right.audioUrl} />}
    </div>
  );
})}


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mobile-header bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href={`/${langCode}`} className="flex items-center text-white hover:text-gray-300 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <span>{category.icon}</span>
              {category.translations[0]?.name || category.key}
            </h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Rights List */}
      <div className="p-4 md:p-6 mobile-footer-padding">
        {rights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {langCode === "hi"
                ? "इस श्रेणी में अभी तक कोई जानकारी उपलब्ध नहीं है।"
                : "No information available in this category yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {rights.map((right) => (
              <div key={right.id} className="rights-card bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{right.title}</h3>

                {right.audioUrl && (
                  <div className="mb-4">
                    <AudioPlayerWrapper src={right.audioUrl} />
                  </div>
                )}
                

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base">{right.script}</p>
                </div>

                {right.learnMoreUrl && (
                  <div className="mt-4">
                    <a
                      href={right.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
    </div>
  )
}
