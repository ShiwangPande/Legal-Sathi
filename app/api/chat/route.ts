import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a helpful legal assistant specializing in Indian labor law and workers' rights. Provide accurate, practical advice about:
- Minimum wage laws
- Working hours and overtime
- Leave entitlements
- Workplace safety
- Harassment and discrimination
- Termination and layoffs
- Employment contracts
- Benefits and social security
- Government schemes for workers

Always remind users to consult a qualified lawyer for specific legal matters. Keep responses concise but informative.`;

// OpenAI API Key Manager - Server-side version
class OpenAIManager {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // Use only the main API key
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async createCompletion(messages: any[], options: any = {}): Promise<any> {
    try {
      console.log('Attempting API call with gpt-3.5-turbo');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 200, // Reduced token limit for cost savings
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API call failed:', response.status, errorData);
        throw new Error(`API Error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Successfully completed API call');
      return data;
      
    } catch (error: any) {
      console.error('API error:', error.message);
      throw error;
    }
  }

  hasApiKeys(): boolean {
    return Boolean(this.apiKey);
  }

  getApiKeyCount(): number {
    return this.apiKey ? 1 : 0;
  }
}

// Create a singleton instance
const openaiManager = new OpenAIManager();

export async function POST(req: Request) {
  let language = 'en';
  
  try {
    const { message, language: reqLanguage } = await req.json();
    language = reqLanguage || 'en';

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Check if we have API keys
    if (!openaiManager.hasApiKeys()) {
      console.error('No OpenAI API keys configured');
      return NextResponse.json(
        { 
          error: "Service configuration error. Please contact support.",
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    console.log(`Processing request in ${getLanguageName(language)} with ${openaiManager.getApiKeyCount()} available API keys`);

    const messages = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT} ${language !== 'en' ? `Respond in ${getLanguageName(language)} language.` : ''}`
      },
      {
        role: 'user',
        content: message
      }
    ];

    const data = await openaiManager.createCompletion(messages, {
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      apiKeysAvailable: openaiManager.getApiKeyCount()
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    // Handle specific error types
    let errorMessage = "I'm having trouble processing your request. Please try again later.";
    let statusCode = 500;
    
    if (error.message.includes('All') && error.message.includes('API keys exhausted')) {
      errorMessage = "All our AI services are currently busy. Please try again in a few moments.";
      statusCode = 503;
    } else if (error.message.includes('rate limited')) {
      errorMessage = "Our service is experiencing high demand. Please try again shortly.";
      statusCode = 429;
    } else if (error.message.includes('quota exceeded')) {
      errorMessage = "Service temporarily unavailable due to usage limits. Please try again later.";
      statusCode = 503;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

function getLanguageName(code: string): string {
  const languages = {
    'hi': 'Hindi',
    'bn': 'Bengali',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'mr': 'Marathi',
    'pa': 'Punjabi',
    'ta': 'Tamil',
    'te': 'Telugu'
  };
  return languages[code as keyof typeof languages] || 'English';
}