import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Legal Saathi - Know Your Rights",
  description: "Legal rights information for daily wage workers in India",
  manifest: "/site.webmanifest", // make consistent with link tag below
  themeColor: "#98bad5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Legal Saathi" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} bg-[#d8e1e8] text-[#304674]`}>
        <Providers>
          <ClerkLoading>
            <div className="flex h-screen w-full items-center justify-center bg-[#d8e1e8]">
              <Loader2 className="h-10 w-10 animate-spin text-[#304674]" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </Providers>
      </body>
    </html>
  )
}
