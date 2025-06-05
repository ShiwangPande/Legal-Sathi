import { prisma } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

async function getLanguages() {
  return await prisma.language.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export default async function HomePage() {
  const languages = await getLanguages()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 text-center shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Legal Saathi</h1>
        <p className="text-lg md:text-xl opacity-90">अपने अधिकार जानें • Know Your Rights</p>
      </div>

      {/* Language Selection */}
      <div className="p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 text-center">
          अपनी भाषा चुनें • Choose Your Language
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {languages.map((language) => (
            <Link
              key={language.code}
              href={`/${language.code}`}
              className="language-card flex flex-col items-center justify-center p-6 bg-white text-black border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-lg"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-3">{language.flagEmoji}</div>
                <div className="text-lg font-semibold text-gray-900">{language.nativeName}</div>
                <div className="text-sm text-gray-600">{language.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 p-8 md:p-12 mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">About Legal Saathi</h2>
          <p className="text-gray-700 text-center mb-6">
            Legal Saathi helps daily wage workers understand their legal rights in a simple, accessible way.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3 text-primary">🔍</div>
              <h3 className="font-semibold text-lg mb-2">Easy to Understand</h3>
              <p className="text-gray-600 text-sm">Simple language with audio explanations for better accessibility.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3 text-primary">🌐</div>
              <h3 className="font-semibold text-lg mb-2">Multiple Languages</h3>
              <p className="text-gray-600 text-sm">Available in various Indian languages to reach more workers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3 text-primary">📱</div>
              <h3 className="font-semibold text-lg mb-2">Works Offline</h3>
              <p className="text-gray-600 text-sm">Access information even without an internet connection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Link */}
      <div className="p-6 text-center">
        <Link href="/sign-in" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
          Admin Access <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-900 text-center text-white">
        <p className="text-sm">Made with ❤️ for daily wage workers across India</p>
      </div>
    </div>
  )
}
