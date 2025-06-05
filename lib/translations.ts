// lib/translations.ts
import { prisma } from "@/lib/db"

export interface SiteTranslations {
  [key: string]: string
}

export async function getSiteTranslations(languageCode: string): Promise<SiteTranslations> {
  const translations = await prisma.siteTranslation.findMany({
    where: { languageCode },
  })

  const translationMap: SiteTranslations = {}
  translations.forEach((t) => {
    translationMap[t.key] = t.value
  })

  return translationMap
}

export function t(translations: SiteTranslations, key: string, fallback?: string): string {
  return translations[key] || fallback || key
}