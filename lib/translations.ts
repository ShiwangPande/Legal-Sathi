// lib/translations.ts (Updated client-side functions)
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

interface TranslationResult {
  success: boolean;
  error?: string;
  translatedText?: string;
  apiUsed?: string;
}

interface Language {
  code: string;
  name: string;
}

// Define supported languages for translation
const SUPPORTED_TRANSLATION_LANGUAGES = [
  'hi', // Hindi
  'mr', // Marathi
  'ta', // Tamil
  'te', // Telugu
  'bn', // Bengali
  'gu', // Gujarati
  'kn', // Kannada
  'ml', // Malayalam
  'pa', // Punjabi
  'en'  // English
];

// Updated translateText function to use API route
export async function translateText(text: string, targetLang: string): Promise<TranslationResult> {
  if (!text || !targetLang) {
    return { success: false, error: 'Missing text or target language' };
  }

  if (targetLang === 'en') {
    return { success: true, translatedText: text, apiUsed: 'none' };
  }

  if (!SUPPORTED_TRANSLATION_LANGUAGES.includes(targetLang)) {
    return { success: false, error: `Unsupported target language: ${targetLang}` };
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Translation request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Translation request failed'
    };
  }
}

// Helper function to delete content in all languages
async function deleteContentInAllLanguages(
  type: "founder" | "team" | "acknowledgement",
  englishId: number
) {
  try {
    let englishContent;
    switch (type) {
      case 'founder':
        englishContent = await prisma.founder.findUnique({
          where: { id: englishId }
        });
        break;
      case 'team':
        englishContent = await prisma.teamMember.findUnique({
          where: { id: englishId }
        });
        break;
      case 'acknowledgement':
        englishContent = await prisma.acknowledgement.findUnique({
          where: { id: englishId }
        });
        break;
    }

    if (!englishContent) {
      throw new Error('Content not found');
    }

    const deleteCondition = {
      name: englishContent.name,
      createdAt: englishContent.createdAt
    };

    switch (type) {
      case 'founder':
        await prisma.founder.deleteMany({
          where: deleteCondition
        });
        break;
      case 'team':
        await prisma.teamMember.deleteMany({
          where: deleteCondition
        });
        break;
      case 'acknowledgement':
        await prisma.acknowledgement.deleteMany({
          where: deleteCondition
        });
        break;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting content:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Enhanced batch translation with API route
export async function translateAndSaveContent(
  type: "founder" | "team" | "acknowledgement",
  content: {
    title: string;
    description: string;
    content?: string;
    imageUrl: string;
    id?: number;
    team?: string;
    email?: string;
    contactNumber?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      website?: string;
    };
  }
) {
  try {
    if (content.id) {
      const deleteResult = await deleteContentInAllLanguages(type, content.id);
      if (!deleteResult.success) {
        throw new Error(`Failed to delete existing translations: ${deleteResult.error}`);
      }
    }

    // Save English content first
    const response = await fetch(`/api/admin/about/${type}`, {
      method: content.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...content,
        languageCode: "en"
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save ${type}`);
    }

    const englishContent = await response.json();
    const nonEnglishLanguages = SUPPORTED_TRANSLATION_LANGUAGES.filter(lang => lang !== 'en');

    const successful: { lang: string; apisUsed: any[] }[] = [];
    const failed = [];

    // Process translations with better spacing and retry logic
    for (let i = 0; i < nonEnglishLanguages.length; i++) {
      const lang = nonEnglishLanguages[i];
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Processing language: ${lang} (attempt ${retryCount + 1}/${maxRetries})`);
          
          // Stagger the translation requests to avoid overwhelming APIs
          const delays = [0, 2000, 4000]; // 0s, 2s, 4s delays
          
          // For acknowledgements, we only need to translate title and description
          const translations = type === "acknowledgement" 
            ? await Promise.all([
                new Promise(resolve => setTimeout(resolve, delays[0])).then(() => translateText(content.title, lang)),
                new Promise(resolve => setTimeout(resolve, delays[1])).then(() => translateText(content.description, lang))
              ])
            : await Promise.all([
                new Promise(resolve => setTimeout(resolve, delays[0])).then(() => translateText(content.title, lang)),
                new Promise(resolve => setTimeout(resolve, delays[1])).then(() => translateText(content.description, lang)),
                new Promise(resolve => setTimeout(resolve, delays[2])).then(() => translateText(content.content || "", lang))
              ]);
          
          // Check if all translations succeeded
          if (translations.some(t => !t.success)) {
            const errors = translations
              .map((t, index) => !t.success ? `${index === 0 ? 'Title' : index === 1 ? 'Description' : 'Content'}: ${t.error}` : null)
              .filter(Boolean)
              .join('; ');
            
            throw new Error(errors);
          }

          // Save the translation
          const saveResponse = await fetch(`/api/admin/about/${type}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: translations[0].translatedText,
              description: translations[1].translatedText,
              ...(type !== "acknowledgement" && translations[2]?.translatedText && { content: translations[2].translatedText }),
              imageUrl: content.imageUrl,
              languageCode: lang,
              team: content.team,
              email: content.email,
              contactNumber: content.contactNumber,
              socialLinks: content.socialLinks,
              id: englishContent.id
            }),
          });

          if (!saveResponse.ok) {
            throw new Error(`Failed to save ${lang} translation`);
          }

          successful.push({ 
            lang, 
            apisUsed: translations.map(t => t.apiUsed).filter((api, index, self) => api && self.indexOf(api) === index)
          });
          
          // Successfully processed this language, break retry loop
          break;
          
        } catch (error) {
          retryCount++;
          console.error(`Error processing language ${lang} (attempt ${retryCount}):`, error);
          
          if (retryCount >= maxRetries) {
            failed.push({ 
              lang, 
              error: error instanceof Error ? error.message : 'Unknown error',
              attempts: maxRetries
            });
          } else {
            // Progressive delay for retries
            const retryDelay = 5000 * retryCount;
            console.log(`Retrying language ${lang} in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
      
      // Add delay between languages
      if (i < nonEnglishLanguages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    return {
      success: true,
      englishContent,
      translations: {
        successful,
        failed,
        total: nonEnglishLanguages.length,
        successRate: Math.round((successful.length / nonEnglishLanguages.length) * 100)
      }
    };

  } catch (error) {
    console.error('Error in translateAndSaveContent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to get supported languages
export function getSupportedTranslationLanguages(): Language[] {
  const languageNames: { [key: string]: string } = {
    'hi': 'Hindi',
    'mr': 'Marathi', 
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi',
    'en': 'English'
  };
  
  return SUPPORTED_TRANSLATION_LANGUAGES.map(code => ({
    code,
    name: languageNames[code] || code.toUpperCase()
  }));
}