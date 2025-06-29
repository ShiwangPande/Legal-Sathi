import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Providers } from "./providers"
import ChatBot from "@/components/ChatBot"
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Legal Saathi",
  description: "Empowering daily wage workers with legal knowledge",
  manifest: "/site.webmanifest",
  themeColor: "#98bad5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="Legal Saathi" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={`${inter.className} bg-[#d8e1e8] text-[#304674]`}>
          <Providers>
            {children}
            <Analytics />
            <ChatBot />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
