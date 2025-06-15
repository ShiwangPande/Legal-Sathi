// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface TranslationResult {
  success: boolean;
  error?: string;
  translatedText?: string;
  apiUsed?: string;
}

// Supported languages
const SUPPORTED_TRANSLATION_LANGUAGES = [
  'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'pa', 'en'
];

// User agents to rotate for better anonymity
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
];

// MyMemory endpoints
const MYMEMORY_ENDPOINTS = [
  'https://api.mymemory.translated.net/get',
  'https://mymemory.translated.net/api/get',
];

// Generate random delay
function getRandomDelay(min: number = 1000, max: number = 3000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get random user agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Generate random IP
function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Split text into chunks
function splitTextIntoChunks(text: string, maxLength: number = 400): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (sentence.length > maxLength) {
        const words = sentence.split(' ');
        let tempChunk = '';
        for (const word of words) {
          if (tempChunk.length + word.length + 1 > maxLength) {
            chunks.push(tempChunk.trim());
            tempChunk = word;
          } else {
            tempChunk += (tempChunk ? ' ' : '') + word;
          }
        }
        if (tempChunk) {
          currentChunk = tempChunk;
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Enhanced MyMemory API translation
async function translateWithMyMemoryEnhanced(text: string, targetLang: string): Promise<string> {
  const chunks = splitTextIntoChunks(text);
  const translatedChunks: string[] = [];

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    let success = false;
    let attempts = 0;
    const maxAttempts = MYMEMORY_ENDPOINTS.length * 2;

    while (!success && attempts < maxAttempts) {
      try {
        const endpointIndex = attempts % MYMEMORY_ENDPOINTS.length;
        const endpoint = MYMEMORY_ENDPOINTS[endpointIndex];

        const randomParams = {
          mt: Math.random() > 0.5 ? '1' : '0',
          onlyprivate: Math.random() > 0.7 ? '1' : '0',
          de: process.env.MYMEMORY_EMAIL || `user${Math.floor(Math.random() * 1000)}@example.com`
        };

        const url = new URL(endpoint);
        url.searchParams.set('q', chunk);
        url.searchParams.set('langpair', `en|${targetLang}`);
        
        Object.entries(randomParams).forEach(([key, value]) => {
          if (Math.random() > 0.5) {
            url.searchParams.set(key, value);
          }
        });

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://mymemory.translated.net/',
            'X-Forwarded-For': generateRandomIP(),
          }
        });

        if (!response.ok) {
          if (response.status === 429 || response.status === 403) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(2000, 5000)));
            continue;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
          translatedChunks.push(data.responseData.translatedText);
          success = true;
        } else if (data.responseStatus === 403 || data.responseStatus === 429) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, getRandomDelay(3000, 6000)));
          continue;
        } else {
          throw new Error(`Translation failed: ${data.responseDetails || 'Unknown error'}`);
        }

      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          const delay = getRandomDelay(2000 * attempts, 4000 * attempts);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (!success) {
      throw new Error(`Failed to translate chunk after ${maxAttempts} attempts`);
    }

    if (chunkIndex < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, getRandomDelay(1500, 3500)));
    }
  }

  return translatedChunks.join(' ');
}

// LibreTranslate with multiple endpoints
async function translateWithLibreTranslate(text: string, targetLang: string): Promise<string> {
  const endpoints = [
    'https://libretranslate.de/translate',
    'https://translate.argosopentech.com/translate',
    'https://libretranslate.com/translate',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': getRandomUserAgent(),
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 503) {
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.translatedText) {
        return data.translatedText;
      }
    } catch (error) {
      console.error(`LibreTranslate error (${endpoint}):`, error);
      continue;
    }
  }

  throw new Error('All LibreTranslate endpoints failed');
}

// Google Translate free
async function translateWithGoogleFree(text: string, targetLang: string): Promise<string> {
  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data[0] && Array.isArray(data[0])) {
      return data[0].map((item: any) => item[0]).join('');
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Google Translate error:', error);
    throw error;
  }
}

// Translation APIs with fallback
const translationAPIs = [
  { name: 'MyMemoryEnhanced', translate: translateWithMyMemoryEnhanced },
  { name: 'GoogleFree', translate: translateWithGoogleFree },
  { name: 'LibreTranslate', translate: translateWithLibreTranslate },
];

// Main translation function
async function translateText(text: string, targetLang: string): Promise<TranslationResult> {
  if (!text || !targetLang) {
    return { success: false, error: 'Missing text or target language' };
  }

  if (targetLang === 'en') {
    return { success: true, translatedText: text, apiUsed: 'none' };
  }

  if (!SUPPORTED_TRANSLATION_LANGUAGES.includes(targetLang)) {
    return { success: false, error: `Unsupported target language: ${targetLang}` };
  }

  for (const api of translationAPIs) {
    try {
      console.log(`Attempting translation with ${api.name}...`);
      const translatedText = await api.translate(text, targetLang);
      
      return {
        success: true,
        translatedText,
        apiUsed: api.name
      };
    } catch (error) {
      console.error(`Translation failed with ${api.name}:`, error);
      continue;
    }
  }

  return {
    success: false,
    error: 'All translation APIs failed',
  };
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { success: false, error: 'Missing text or target language' },
        { status: 400 }
      );
    }

    const result = await translateText(text, targetLang);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}