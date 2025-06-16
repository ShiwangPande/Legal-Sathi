import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a knowledgeable legal assistant specializing in Indian employment and labor law. When users ask about employment law topics, provide detailed, practical information covering:

- Minimum wage laws and salary regulations
- Working hours, overtime, and break requirements
- Leave entitlements (casual, sick, maternity, etc.)
- Workplace safety standards and regulations
- Sexual harassment prevention and grievance procedures
- Wrongful termination and layoff procedures
- Employment contract terms and conditions
- Provident Fund, ESI, and other benefits
- Labor court procedures and dispute resolution
- Government schemes for workers (MGNREGA, etc.)

Provide specific, actionable information with relevant sections of laws when applicable. Always conclude by advising users to consult a qualified employment lawyer for case-specific legal advice.`;

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
          max_tokens: 1000, // Increased for more detailed responses
          temperature: 0.3, // Lower temperature for more consistent legal advice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API call failed:', response.status, errorData);
        throw new Error(`API Error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Successfully completed API call');
      console.log('Response preview:', data.choices[0]?.message?.content?.substring(0, 100));
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
    console.log('User message:', message);

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

    const data = await openaiManager.createCompletion(messages);

    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('No response content from OpenAI');
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    console.log('AI Response length:', aiResponse.length);
    console.log('AI Response preview:', aiResponse.substring(0, 200));

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
    
    if (error.message.includes('rate limited')) {
      errorMessage = "Our service is experiencing high demand. Please try again shortly.";
      statusCode = 429;
    } else if (error.message.includes('quota exceeded')) {
      errorMessage = "Service temporarily unavailable due to usage limits. Please try again later.";
      statusCode = 503;
    } else if (error.message.includes('insufficient_quota')) {
      errorMessage = "API quota exceeded. Please check your OpenAI billing.";
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