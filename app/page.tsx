import { prisma } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import VolunteerForm from "@/components/volunteer-form"

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
     <div className="min-h-screen bg-[#d8e1e8]">
      {/* Header */}
<div className="bg-[#1e3c64] text-white py-10 px-4 flex flex-col items-center">
  <img
    src="/logo.png"
    alt="Legal Saathi Logo"
    className="w-28 h-28 mb-4 rounded-full border-4 border-white shadow-lg"
  />
  <h1 className="text-3xl md:text-4xl font-bold text-center">Your Legal Rights</h1>
</div>

      {/* Language Selection */}
      <div className="p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-[#304674] mb-8 text-center">
          अपनी भाषा चुनें • Choose Your Language
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {languages.map((language) => (
            <Link
              key={language.code}
              href={`/${language.code}`}
              className="flex flex-col items-center justify-center p-6 bg-[#b2cbde] text-[#304674] border-2 border-[#98bad5] rounded-xl hover:shadow-lg transition"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-3">{language.flagEmoji}</div>
                <div className="text-lg font-semibold">{language.nativeName}</div>
                <div className="text-sm text-[#304674]/70">{language.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section
      <div className="bg-[#c6d3e3] p-8 md:p-12 mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#304674] mb-4 text-center">About Legal Saathi</h2>
          <p className="text-[#304674]/80 text-center mb-6">
            Legal Saathi helps daily wage workers understand their legal rights in a simple, accessible way.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5]">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-2 text-[#304674]">Easy to Understand</h3>
              <p className="text-sm text-[#304674]/70">Simple language with audio explanations for better accessibility.</p>
            </div>

            <div className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5]">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold text-lg mb-2 text-[#304674]">Multiple Languages</h3>
              <p className="text-sm text-[#304674]/70">Available in various Indian languages to reach more workers.</p>
            </div>

            <div className="bg-[#b2cbde] p-6 rounded-xl shadow-sm border border-[#98bad5]">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2 text-[#304674]">Works Offline</h3>
              <p className="text-sm text-[#304674]/70">Access information even without an internet connection.</p>
            </div>
          </div>
        </div>
      </div>

      // {/* Admin Login Link */}
      {/* <div className="p-6 text-center">
        <Link href="/sign-in" className="inline-flex items-center text-[#304674] hover:opacity-80 font-medium">
          Admin Access <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

          <VolunteerForm/>
      Footer
      <div className="p-6 bg-[#304674] text-center text-white">
        <p className="text-sm">Made with ❤️ for daily wage workers across India</p>
      </div> */}
    </div>
  )
}
