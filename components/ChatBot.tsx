"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, X, Send, Volume2, VolumeX, Loader2, AlertCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  error?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
];

const recommendedQuestions = {
  en: [
    "What are my rights as a daily wage worker?",
    "How can I file a complaint against my employer?",
    "What documents do I need for legal action?",
    "What is minimum wage in my state?",
    "How to report workplace harassment?",
    "What are my rights during layoffs?",
    "How to claim unpaid wages?",
    "What are my rights regarding working hours?",
    "What government schemes are available for workers?",
    "How to get legal aid for free?",
  ],
  hi: [
    "दैनिक मजदूरी कर्मचारी के रूप में मेरे क्या अधिकार हैं?",
    "मैं अपने नियोक्ता के खिलाफ शिकायत कैसे दर्ज कर सकता हूं?",
    "कानूनी कार्रवाई के लिए मुझे किन दस्तावेजों की आवश्यकता है?",
    "मेरे राज्य में न्यूनतम मजदूरी क्या है?",
    "कार्यस्थल पर उत्पीड़न की रिपोर्ट कैसे करें?",
    "छंटनी के दौरान मेरे क्या अधिकार हैं?",
    "अवैतनिक मजदूरी का दावा कैसे करें?",
    "कार्य घंटों के संबंध में मेरे क्या अधिकार हैं?",
    "श्रमिकों के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं?",
    "मुफ्त कानूनी सहायता कैसे प्राप्त करें?",
  ],
  bn: [
    "দৈনিক মজুরি কর্মী হিসেবে আমার অধিকার কী?",
    "আমি কিভাবে আমার নিয়োগকর্তার বিরুদ্ধে অভিযোগ দায়ের করতে পারি?",
    "আইনি ব্যবস্থা নেওয়ার জন্য আমার কী কী কাগজপত্র প্রয়োজন?",
    "আমার রাজ্যে ন্যূনতম মজুরি কত?",
    "কর্মক্ষেত্রে হয়রানির রিপোর্ট কিভাবে করব?",
    "ছাঁটাইয়ের সময় আমার অধিকার কী?",
    "অবৈতনিক মজুরির দাবি কিভাবে করব?",
    "কাজের সময়ের ক্ষেত্রে আমার অধিকার কী?",
    "শ্রমিকদের জন্য কী কী সরকারি প্রকল্প আছে?",
    "বিনামূল্যে আইনি সহায়তা কিভাবে পাব?",
  ],
  gu: [
    "દૈનિક મજૂરી કામદાર તરીકે મારા અધિકારો શું છે?",
    "હું મારા એમ્પ્લોયર સામે ફરિયાદ કેવી રીતે કરી શકું?",
    "કાનૂની કાર્યવાહી માટે મને કયા દસ્તાવેજોની જરૂર છે?",
    "મારા રાજ્યમાં લઘુત્તમ મજૂરી કેટલી છે?",
    "વર્કપ્લેસ હેરાસમેન્ટની રિપોર્ટ કેવી રીતે કરવી?",
    "લેઆફ દરમિયાન મારા અધિકારો શું છે?",
    "બિનચૂકવેલા વેતનનો દાવો કેવી રીતે કરવો?",
    "કામના કલાકો સંબંધિત મારા અધિકારો શું છે?",
    "કામદારો માટે કઈ સરકારી યોજનાઓ ઉપલબ્ધ છે?",
    "મફત કાનૂની સહાય કેવી રીતે મેળવવી?",
  ],
  kn: [
    "ದೈನಂದಿನ ವೇತನ ಕೆಲಸಗಾರನಾಗಿ ನನ್ನ ಹಕ್ಕುಗಳು ಯಾವುವು?",
    "ನನ್ನ ಉದ್ಯೋಗದಾತರ ವಿರುದ್ಧ ದೂರು ಹೇಗೆ ನೀಡಬಹುದು?",
    "ಕಾನೂನು ಕ್ರಮಕ್ಕೆ ನನಗೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?",
    "ನನ್ನ ರಾಜ್ಯದಲ್ಲಿ ಕನಿಷ್ಠ ವೇತನ ಎಷ್ಟು?",
    "ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ಕಿರುಕುಳದ ವರದಿ ಹೇಗೆ ಮಾಡುವುದು?",
    "ಉದ್ಯೋಗ ಕಡಿತದ ಸಮಯದಲ್ಲಿ ನನ್ನ ಹಕ್ಕುಗಳು ಯಾವುವು?",
    "ಬಾಕಿ ವೇತನದ ಹಕ್ಕು ಹೇಗೆ ಪಡೆಯುವುದು?",
    "ಕೆಲಸದ ಗಂಟೆಗಳ ಬಗ್ಗೆ ನನ್ನ ಹಕ್ಕುಗಳು ಯಾವುವು?",
    "ಕೆಲಸಗಾರರಿಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ?",
    "ಉಚಿತ ಕಾನೂನು ಸಹಾಯ ಹೇಗೆ ಪಡೆಯುವುದು?",
  ],
  ml: [
    "ദൈനംദിന കൂലി തൊഴിലാളിയായി എന്റെ അവകാശങ്ങൾ എന്തൊക്കെയാണ്?",
    "എന്റെ ജോലിക്കാരനെതിരെ എങ്ങനെ പരാതി നൽകാം?",
    "നിയമ നടപടിക്ക് എനിക്ക് എന്ത് രേഖകൾ വേണം?",
    "എന്റെ സംസ്ഥാനത്ത് ഏറ്റവും കുറഞ്ഞ കൂലി എത്രയാണ്?",
    "ജോലിസ്ഥലത്ത് ശല്യപ്പെടുത്തലിനെതിരെ എങ്ങനെ പരാതി നൽകാം?",
    "ജോലി നഷ്ടപ്പെടുമ്പോൾ എന്റെ അവകാശങ്ങൾ എന്തൊക്കെയാണ്?",
    "ശമ്പളം വാങ്ങാത്തതിനെതിരെ എങ്ങനെ നടപടി എടുക്കാം?",
    "ജോലി സമയങ്ങളെ സംബന്ധിച്ച് എന്റെ അവകാശങ്ങൾ എന്തൊക്കെയാണ്?",
    "തൊഴിലാളരെ എന്ത് സർക്കാർ പദ്ധതികൾ ലഭ്യമാണ്?",
    "സൗജന്യ നിയമ സഹായം എങ്ങനെ ലഭിക്കും?",
  ],
  mr: [
    "दैनिक मजुरी कामगार म्हणून माझे अधिकार काय आहेत?",
    "मी माझ्या नियोक्त्याविरुद्ध तक्रार कशी दाखल करू शकतो?",
    "कायदेशीर कारवाईसाठी मला कोणत्या कागदपत्रांची आवश्यकता आहे?",
    "माझ्या राज्यात किमान वेतन किती आहे?",
    "कार्यस्थळावरील छळाची तक्रार कशी करावी?",
    "कामातून काढून टाकण्याच्या वेळी माझे अधिकार काय आहेत?",
    "न भरलेल्या वेतनाची मागणी कशी करावी?",
    "कामाच्या तासांसंबंधी माझे अधिकार काय आहेत?",
    "कामगारांसाठी कोणत्या सरकारी योजना उपलब्ध आहेत?",
    "मोफत कायदेशीर मदत कशी मिळवावी?",
  ],
  pa: [
    "ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ ਕਰਮਚਾਰੀ ਵਜੋਂ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?",
    "ਮੈਂ ਆਪਣੇ ਨਿਯੁਕਤਕਰਤਾ ਦੇ ਖਿਲਾਫ਼ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "ਕਾਨੂੰਨੀ ਕਾਰਵਾਈ ਲਈ ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਲੋੜ ਹੈ?",
    "ਮੇਰੇ ਰਾਜ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਮਜ਼ਦੂਰੀ ਕਿੰਨੀ ਹੈ?",
    "ਕੰਮ ਦੀ ਥਾਂ ਤੇ ਪਰੇਸ਼ਾਨੀ ਦੀ ਰਿਪੋਰਟ ਕਿਵੇਂ ਕਰੀਏ?",
    "ਕੰਮ ਤੋਂ ਹਟਾਉਣ ਦੇ ਸਮੇਂ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?",
    "ਬਿਨਾਂ ਭੁਗਤਾਨੀ ਮਜ਼ਦੂਰੀ ਦਾ ਦਾਅਵਾ ਕਿਵੇਂ ਕਰੀਏ?",
    "ਕੰਮ ਦੇ ਘੰਟਿਆਂ ਬਾਰੇ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?",
    "ਕਰਮਚਾਰੀਆਂ ਲਈ ਕਿਹੜੀਆਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਉਪਲਬਧ ਹਨ?",
    "ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ?",
  ],
  ta: [
    "தினசரி கூலி தொழிலாளியாக எனது உரிமைகள் என்ன?",
    "எனது முதலாளிக்கு எதிராக எப்படி புகார் செய்வது?",
    "சட்ட நடவடிக்கைக்கு எனக்கு என்ன ஆவணங்கள் தேவை?",
    "எனது மாநிலத்தில் குறைந்தபட்ச ஊதியம் எவ்வளவு?",
    "பணியிட துன்புறுத்தலுக்கு எதிராக எப்படி புகார் செய்வது?",
    "வேலையிலிருந்து நீக்கப்படும்போது எனது உரிமைகள் என்ன?",
    "சம்பளம் செலுத்தப்படாததற்கு எதிராக எப்படி நடவடிக்கை எடுப்பது?",
    "பணி நேரங்கள் தொடர்பான எனது உரிமைகள் என்ன?",
    "தொழிலாளர்களுக்கு என்ன அரசு திட்டங்கள் கிடைக்கின்றன?",
    "இலவச சட்ட உதவி எப்படி பெறுவது?",
  ],
  te: [
    "రోజువారీ కూలి కార్మికుడిగా నా హక్కులు ఏమిటి?",
    "నా యజమానిపై ఫిర్యాదు ఎలా చేయాలి?",
    "చట్టపరమైన చర్యకు నాకు ఏ పత్రాలు అవసరం?",
    "నా రాష్ట్రంలో కనీస వేతనం ఎంత?",
    "పనిస్థలంలో హింసకు వ్యతిరేకంగా ఎలా ఫిర్యాదు చేయాలి?",
    "ఉద్యోగం నుండి తొలగించబడినప్పుడు నా హక్కులు ఏమిటి?",
    "చెల్లించని వేతనం కోసం ఎలా దావా వేయాలి?",
    "పని గంటలకు సంబంధించిన నా హక్కులు ఏమిటి?",
    "కార్మికులకు ఏ ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి?",
    "ఉచిత చట్ట సహాయం ఎలా పొందాలి?",
  ]
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  const speakText = (text: string) => {
    if (!isAudioEnabled || !speechSynthesis || !selectedLanguage) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = `${selectedLanguage}-IN`;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Store the current utterance
    currentUtterance.current = utterance;

    // Add event listeners
    utterance.onend = () => {
      currentUtterance.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      currentUtterance.current = null;
    };

    speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (isAudioEnabled && speechSynthesis) {
      speechSynthesis.cancel();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedLanguage) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const messageId = Date.now().toString();
    const userMsg: Message = {
      id: messageId + '_user',
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        id: messageId + '_bot',
        text: data.response,
        isUser: false,
        timestamp: new Date(data.timestamp),
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      // Only speak if audio is enabled
      if (isAudioEnabled) {
        speakText(data.response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: messageId + '_error',
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setMessages([]); // Clear messages when language changes
  };

  const renderLanguageSelector = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-[#304674] mb-4">
        <Globe className="h-5 w-5" />
        <h3 className="font-semibold">Select Language</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant="outline"
            className={cn(
              "justify-start text-left h-auto py-2 px-3 text-sm",
              selectedLanguage === lang.code
                ? "bg-[#304674] text-white hover:bg-[#1d2c3a] hover:text-white"
                : "hover:bg-[#c6d3e3] hover:text-[#304674]"
            )}
            onClick={() => handleLanguageSelect(lang.code)}
          >
            {lang.name}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-[#304674] hover:bg-[#1d2c3a] text-white shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[350px] md:w-[400px] h-[600px] bg-white shadow-xl rounded-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-[#304674] text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Legal Saathi Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={toggleAudio}
                title={isAudioEnabled ? "Mute" : "Unmute"}
              >
                {isAudioEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              {selectedLanguage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => setSelectedLanguage(null)}
                  title="Change Language"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              )}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!selectedLanguage ? (
              renderLanguageSelector()
            ) : (
              <div className="p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 text-center">
                      Ask me anything about your legal rights as a daily wage worker
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {(recommendedQuestions[selectedLanguage as keyof typeof recommendedQuestions] || recommendedQuestions.en).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start text-left h-auto py-2 px-3 text-sm hover:bg-[#c6d3e3] hover:text-[#304674]"
                          onClick={() => handleQuestionClick(question)}
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
                          "max-w-[80%] rounded-lg p-3",
                          message.isUser
                            ? "bg-[#304674] text-white"
                            : message.error
                            ? "bg-red-50 border border-red-200 text-red-800"
                            : "bg-[#c6d3e3] text-[#304674]"
                        )}
                      >
                        {message.error && (
                          <div className="flex items-center gap-1 mb-1">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Error</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <p className="text-sm whitespace-pre-wrap flex-1">{message.text}</p>
                          {!message.isUser && !message.error && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-[#304674] hover:bg-[#304674] hover:text-white"
                              onClick={() => speakText(message.text)}
                              title="Listen again"
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
                    <div className="bg-[#c6d3e3] text-[#304674] rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          {selectedLanguage && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98bad5] text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#304674] hover:bg-[#1d2c3a] text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}