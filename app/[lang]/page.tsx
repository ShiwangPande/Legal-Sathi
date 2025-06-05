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
    <div className="min-h-screen flex flex-col bg-[#d8e1e8] text-[#304674]">
      {/* Header */}
      <div className="mobile-header bg-gradient-to-r from-[#304674] to-[#98bad5] text-white p-4 shadow-md">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-white hover:text-[#c6d3e3] transition-colors"
          >
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
      <div className="p-6 md:p-10 flex-grow">
        <h2 className="text-xl md:text-2xl font-semibold text-[#304674] mb-6 text-center">
          {langCode === "hi" ? "श्रेणी चुनें" : "Choose Category"}
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

      {/* Footer */}
      <div className="mt-auto p-6 bg-[#c6d3e3] text-center text-[#304674]">
        <p className="text-sm font-medium">
          Legal Saathi • {language.name} • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
