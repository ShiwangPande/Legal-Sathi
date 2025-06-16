import { prisma } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import VolunteerForm from "@/components/volunteer-form"
import Image from "next/image"

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
    <div className="min-h-screen bg-gradient-to-br from-[#d8e1e8] via-[#edf2f7] to-[#d8e1e8] text-[#304674] flex flex-col">
      {/* Header */}
      <header className="bg-[#1e3c64] text-white py-12 px-4 shadow-md">
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="Legal Saathi Logo"
            className="w-28 h-28 mb-4 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Legal Rights</h1>
          <p className="text-sm md:text-base opacity-90">
            Empowering daily wage workers with accessible legal knowledge
          </p>
        </div>
      </header>

      {/* Language Selection */}
      <main className="flex-grow p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
          अपनी भाषा चुनें • Choose Your Language
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {languages.map((language) => (
            <Link
              key={language.code}
              href={`/${language.code}`}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-[#b2cbde] hover:border-[#304674] shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out"
            >
              {/* Mobile View - Emoji Flag */}
              <div
                className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform md:hidden"
                style={{
                  fontFamily: "'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', 'Twemoji Mozilla', sans-serif",
                  lineHeight: 1
                }}
              >
                {language.flagEmoji}
              </div>
              
              {/* Desktop View - Image Flag */}
              <div className="hidden md:block mb-3 group-hover:scale-110 transition-transform">
                <Image
                  src={`https://flagcdn.com/w80/in.png`}
                  alt={`${language.name} Flag`}
                  width={40}
                  height={30}
                  className="rounded shadow-sm"
                />
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold group-hover:text-[#1e3c64]">
                  {language.nativeName}
                </div>
                <div className="text-sm text-[#304674]/70">{language.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#304674] text-white py-4 text-center text-sm">
        Made with ❤️ for India's working class
      </footer>
    </div>
  )
}
