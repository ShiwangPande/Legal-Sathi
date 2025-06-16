"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, X, Send, Volume2, VolumeX, Loader2, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mr', name: 'मराठी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
];

const SAMPLE_QUESTIONS = {
  en: [
    "What are minimum wage rates in India?",
    "How many hours can I work per day legally?",
    "What are my rights during termination?",
    "How to file complaint against employer?",
    "What benefits am I entitled to?"
  ],
  hi: [
    "भारत में न्यूनतम मजदूरी दर क्या है?",
    "मैं कानूनी रूप से प्रति दिन कितने घंटे काम कर सकता हूं?",
    "समाप्ति के दौरान मेरे अधिकार क्या हैं?",
    "नियोक्ता के खिलाफ शिकायत कैसे दर्ज करें?",
    "मैं किन लाभों का हकदार हूं?"
  ],
  bn: [
    "ভারতে ন্যূনতম মজুরির হার কত?",
    "আমি আইনত প্রতিদিন কত ঘন্টা কাজ করতে পারি?",
    "চাকরি ছাড়ার সময় আমার অধিকার কী?",
    "নিয়োগকর্তার বিরুদ্ধে অভিযোগ কীভাবে দায়ের করব?",
    "আমি কোন সুবিধাগুলির অধিকারী?"
  ],
  gu: [
    "ભારતમાં લઘુત્તમ વેતન દર શું છે?",
    "હું કાયદેસર રોજ કેટલા કલાક કામ કરી શકું?",
    "નોકરી છોડતી વખતે મારા અધિકારો શું છે?",
    "નિયોજક સામે ફરિયાદ કેવી રીતે કરવી?",
    "મને કયા લાભો મળવા જોઈએ?"
  ],
  kn: [
    "ಭಾರತದಲ್ಲಿ ಕನಿಷ್ಠ ವೇತನ ದರ ಎಷ್ಟು?",
    "ನಾನು ಕಾನೂನುಬದ್ಧವಾಗಿ ದಿನಕ್ಕೆ ಎಷ್ಟು ಗಂಟೆಗಳ ಕೆಲಸ ಮಾಡಬಹುದು?",
    "ಉದ್ಯೋಗ ಕೊನೆಗೊಳ್ಳುವಾಗ ನನ್ನ ಹಕ್ಕುಗಳು ಯಾವುವು?",
    "ನೌಕರಿದಾರರ ವಿರುದ್ಧ ದೂರು ಹೇಗೆ ನೀಡುವುದು?",
    "ನನಗೆ ಯಾವ ಪ್ರಯೋಜನಗಳು ಸಿಗಬೇಕು?"
  ],
  ml: [
    "ഇന്ത്യയിൽ ഏറ്റവും കുറഞ്ഞ വേതന നിരക്ക് എന്താണ്?",
    "നിയമപരമായി എനിക്ക് ഒരു ദിവസം എത്ര മണിക്കൂർ ജോലി ചെയ്യാൻ കഴിയും?",
    "ജോലി നഷ്ടപ്പെടുമ്പോൾ എന്റെ അവകാശങ്ങൾ എന്തൊക്കെയാണ്?",
    "ജോലിക്കാരനെതിരെ പരാതി എങ്ങനെ നൽകാം?",
    "എനിക്ക് എന്തൊക്കെ ആനുകൂല്യങ്ങൾ ലഭിക്കണം?"
  ],
  mr: [
    "भारतात किमान वेतन दर किती आहे?",
    "मी कायदेशीररित्या दररोज किती तास काम करू शकतो?",
    "नोकरी संपवताना माझे अधिकार काय आहेत?",
    "नियोक्त्याविरुद्ध तक्रार कशी दाखल करावी?",
    "मला कोणते फायदे मिळावेत?"
  ],
  pa: [
    "ਭਾਰਤ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਮਜ਼ਦੂਰੀ ਦਰ ਕੀ ਹੈ?",
    "ਮੈਂ ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਰੋਜ਼ਾਨਾ ਕਿੰਨੇ ਘੰਟੇ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "ਨੌਕਰੀ ਛੱਡਣ ਦੇ ਦੌਰਾਨ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?",
    "ਨਿਯੋਜਕ ਦੇ ਵਿਰੁੱਧ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰੀਏ?",
    "ਮੈਨੂੰ ਕਿਹੜੇ ਲਾਭ ਮਿਲਣੇ ਚਾਹੀਦੇ ਹਨ?"
  ],
  ta: [
    "இந்தியாவில் குறைந்தபட்ச ஊதிய விகிதம் என்ன?",
    "சட்டப்படி நான் ஒரு நாளைக்கு எத்தனை மணி நேரம் வேலை செய்ய முடியும்?",
    "பணி நீக்கப்படும்போது எனது உரிமைகள் என்ன?",
    "முதலாளிக்கு எதிராக புகார் எவ்வாறு செய்வது?",
    "எனக்கு என்ன நன்மைகள் கிடைக்க வேண்டும்?"
  ],
  te: [
    "భారతదేశంలో కనీస వేతన రేటు ఎంత?",
    "నేను చట్టపరంగా రోజుకు ఎన్ని గంటలు పని చేయవచ్చు?",
    "ఉద్యోగం ముగిసినప్పుడు నా హక్కులు ఏమిటి?",
    "యజమానిపై ఫిర్యాదు ఎలా చేయాలి?",
    "నాకు ఏ ప్రయోజనాలు లభించాలి?"
  ]
};

// OpenAI API Key Manager - Client-side version
class OpenAIManager {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/chat';
  }

  async createCompletion(messages: any[], options: any = {}): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get response');
    }

    return response.json();
  }

  hasApiKeys(): boolean {
    return true; // We'll let the server handle API key validation
  }

  getApiKeyCount(): number {
    return 1; // We'll let the server handle API key count
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [apiError, setApiError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize OpenAI Manager
  const openaiManager = useRef(new OpenAIManager());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if API keys are available
    if (!openaiManager.current.hasApiKeys()) {
      setApiError('No API keys configured. Please check your environment variables.');
    }
  }, []);

  const speakText = (text: string) => {
    if (!isAudioEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language codes to proper BCP 47 language tags
    const languageMap: { [key: string]: string } = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN',
      'ta': 'ta-IN',
      'te': 'te-IN'
    };

    utterance.lang = languageMap[selectedLanguage] || 'en-IN';
    utterance.rate = 0.9;
    
    // Try to find a voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(selectedLanguage)) || 
                 voices.find(v => v.lang.startsWith('en')) || 
                 voices[0];
    
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const getLanguageName = (code: string): string => {
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
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setApiError('');
    
    const userMsg: Message = {
      id: Date.now() + '_user',
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: selectedLanguage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botMsg: Message = {
        id: Date.now() + '_bot',
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      if (isAudioEnabled) {
        speakText(data.response);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setApiError(errorMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + '_error',
        text: "I'm having trouble connecting to the AI service. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestions = SAMPLE_QUESTIONS[selectedLanguage as keyof typeof SAMPLE_QUESTIONS] || SAMPLE_QUESTIONS.en;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[350px] md:w-[400px] h-[600px] bg-white shadow-xl rounded-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Legal Assistant</h3>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                {openaiManager.current.getApiKeyCount()} Keys
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="p-3 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{apiError}</span>
              </div>
            </div>
          )}

          {/* Language Selector */}
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Language</span>
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Ask me about your legal rights as a worker in India
                </p>
                <div className="space-y-2">
                  {currentQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left text-sm h-auto py-2 px-3 justify-start"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      message.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <p className="whitespace-pre-wrap flex-1">{message.text}</p>
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-70 hover:opacity-100"
                          onClick={() => speakText(message.text)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading || !openaiManager.current.hasApiKeys()}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !openaiManager.current.hasApiKeys()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}