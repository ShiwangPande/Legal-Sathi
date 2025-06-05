import { prisma } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"

interface Props {
  params: { lang: string }
}

export default async function LanguagePage({ params }: Props) {
  const langCode = params.lang

  const language = await prisma.language.findUnique({
    where: { code: langCode },
  })

  if (!language) return notFound()

  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: { languageCode: langCode },
      },
    },
    orderBy: { id: "asc" },
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mobile-header bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/" className="flex items-center text-white hover:text-gray-300 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold">Legal Saathi</h1>
            <p className="text-sm opacity-90">{language.nativeName}</p>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 text-center">
          {langCode === "hi" ? "श्रेणी चुनें" : "Choose Category"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${langCode}/${category.key}`}
              className="category-card flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-lg min-h-[120px]"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 leading-tight">
                  {category.translations[0]?.name || category.key}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-6 bg-gray-50 text-center text-gray-600">
        <p className="text-sm">
          Legal Saathi • {language.name} • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
