"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, X, Send, Volume2, VolumeX, Loader2, Globe, AlertCircle, Copy, RefreshCw, Star, Settings, Minimize2, Maximize2, Bot, User, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  rating?: 'up' | 'down' | null;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

const SAMPLE_QUESTIONS = {
  en: [
    "What are minimum wage rates in India?",
    "How many hours can I work per day legally?",
    "What are my rights during termination?",
    "How to file complaint against employer?",
    "What benefits am I entitled to?",
    "How to handle workplace harassment?",
    "What is notice period requirement?"
  ],
  hi: [
    "भारत में न्यूनतम मजदूरी दर क्या है?",
    "मैं कानूनी रूप से प्रति दिन कितने घंटे काम कर सकता हूं?",
    "समाप्ति के दौरान मेरे अधिकार क्या हैं?",
    "नियोक्ता के खिलाफ शिकायत कैसे दर्ज करें?",
    "मैं किन लाभों का हकदार हूं?",
    "कार्यक्षेत्र में उत्पीड़न से कैसे निपटें?",
    "नोटिस अवधि की आवश्यकता क्या है?"
  ],
  bn: [
    "ভারতে সর্বনিম্ন মজুরির হার কত?",
    "আমি আইনত প্রতিদিন কত ঘন্টা কাজ করতে পারি?",
    "চাকরি অবসানের সময় আমার অধিকারগুলি কী?",
    "নিয়োগকর্তার বিরুদ্ধে অভিযোগ কীভাবে দায়ের করব?",
    "আমি কী সুবিধা পাওয়ার অধিকারী?",
    "কর্মক্ষেত্রে হয়রানি কীভাবে মোকাবেলা করব?",
    "নোটিশ পিরিয়ডের প্রয়োজনীয়তা কী?"
  ],
  gu: [
    "ભારતમાં લઘુત્તમ વેતન દર શું છે?",
    "હું કાયદેસર રીતે દરરોજ કેટલા કલાક કામ કરી શકું?",
    "ટર્મિનેશન દરમિયાન મારા અધિકારો શું છે?",
    "એમ્પ્લોયર સામે ફરિયાદ કેવી રીતે નોંધાવું?",
    "હું કયા લાભોનો હકદાર છું?",
    "કાર્યસ્થળ પર હેરાનગતિ સાથે કેવી રીતે વ્યવહાર કરવો?",
    "નોટિસ પીરિયડની જરૂરિયાત શું છે?"
  ],
  kn: [
    "ಭಾರತದಲ್ಲಿ ಕನಿಷ್ಠ ವೇತನ ದರಗಳು ಏನು?",
    "ನಾನು ಕಾನೂನುಬದ್ಧವಾಗಿ ದಿನಕ್ಕೆ ಎಷ್ಟು ಗಂಟೆಗಳು ಕೆಲಸ ಮಾಡಬಹುದು?",
    "ಉದ್ಯೋಗ ಕೊನೆಗೊಳಿಸುವ ಸಮಯದಲ್ಲಿ ನನ್ನ ಹಕ್ಕುಗಳು ಏನು?",
    "ಉದ್ಯೋಗದಾತರ ವಿರುದ್ಧ ದೂರು ಹೇಗೆ ದಾಖಲಿಸುವುದು?",
    "ನಾನು ಯಾವ ಪ್ರಯೋಜನಗಳಿಗೆ ಅರ್ಹನಾಗಿದ್ದೇನೆ?",
    "ಕಾರ್ಯಕ್ಷೇತ್ರದ ಕಿರುಕುಳವನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುವುದು?",
    "ನೋಟಿಸ್ ಅವಧಿಯ ಅವಶ್ಯಕತೆ ಏನು?"
  ],
  ml: [
    "ഇന്ത്യയിൽ മിനിമം വേതന നിരക്കുകൾ എന്താണ്?",
    "നിയമപ്രകാരം ഒരു ദിവസം എത്ര മണിക്കൂർ ജോലി ചെയ്യാം?",
    "ജോലി അവസാനിപ്പിക്കുമ്പോൾ എന്റെ അവകാശങ്ങൾ എന്തൊക്കെയാണ്?",
    "തൊഴിലുടമയ്‌ക്കെതിരെ പരാതി എങ്ങനെ ഫയൽ ചെയ്യാം?",
    "എനിക്ക് എന്ത് ആനുകൂല്യങ്ങൾക്ക് അർഹതയുണ്ട്?",
    "ജോലിസ്ഥലത്തെ പീഡനം എങ്ങനെ കൈകാര്യം ചെയ്യാം?",
    "നോട്ടീസ് കാലയളവിന്റെ ആവശ്യകത എന്താണ്?"
  ],
  mr: [
    "भारतात किमान वेतन दर काय आहेत?",
    "मी कायदेशीररित्या दिवसभर किती तास काम करू शकतो?",
    "नोकरी संपुष्टात आणताना माझे अधिकार काय आहेत?",
    "नियोक्त्याविरुद्ध तक्रार कशी नोंदवायची?",
    "मी कोणत्या फायद्यांसाठी पात्र आहे?",
    "कामाच्या ठिकाणी छळवणूक कशी हाताळायची?",
    "नोटीस कालावधीची आवश्यकता काय आहे?"
  ],
  pa: [
    "ਭਾਰਤ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਮਜ਼ਦੂਰੀ ਦਰ ਕੀ ਹਨ?",
    "ਮੈਂ ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਦਿਨ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "ਨੌਕਰੀ ਖਤਮ ਕਰਨ ਦੌਰਾਨ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?",
    "ਮਾਲਕ ਦੇ ਖਿਲਾਫ਼ ਸ਼ਿਕਾਇਤ ਕਿ൵ੇਂ ਦਰਜ਼ ਕਰਾਂ?",
    "ਮੈਂ ਕਿਹੜੇ ਲਾਭਾਂ ਦਾ ਹੱਕਦਾਰ ਹਾਂ?",
    "ਕੰਮ ਦੀ ਜਗ੍ਹਾ 'ਤੇ ਪਰੇਸ਼ਾਨੀ ਨਾਲ ਕਿർਨਾ ਜਾਵੇ?",
    "ਨੋਟਿਸ ਮਿਆਦ ਦੀ ਲੋੜ ਕੀ ਹੈ?"
  ],
  ta: [
    "இந்தியாவில் குறைந்தபட்ச ஊதிய விகிதங்கள் என்ன?",
    "நான் சட்டப்படி ஒரு நாளில் எத்தனை மணி நேரம் வேலை செய்யலாம்?",
    "வேலை நிறுத்தத்தின் போது எனது உரிமைகள் என்ன?",
    "முதலாளிக்கு எதிராக புகார் எப்படி பதிவு செய்வது?",
    "நான் எந்த நன்மைகளுக்கு தகுதியானவன்?",
    "பணியிட துன்புறுத்தலை எப்படி கையாள்வது?",
    "அறிவிப்பு காலத்தின் தேவை என்ன?"
  ],
  te: [
    "భారతదేశంలో కనీస వేతన రేట్లు ఏమిటి?",
    "నేను చట్టబద్ధంగా రోజుకు ఎన్ని గంటలు పని చేయగలను?",
    "ఉద్యోగం ముగిసే సమయంలో నా హక్కులు ఏమిటి?",
    "యజమానిపై ఫిర్యాదు ఎలా దాఖలు చేయాలి?",
    "నేను ఏ ప్రయోజనాలకు అర్హుడను?",
    "కార్యాలయంలో వేధింపులను ఎలా పరిష్కరించాలి?",
    "నోటీసు వ్యవధి అవసరం ఏమిటి?"
  ]
};

const LEGAL_TOPICS = {
  en: [
    { icon: "⚖️", title: "Labor Rights", desc: "Working hours, wages, conditions" },
    { icon: "🏢", title: "Employment Law", desc: "Hiring, termination, contracts" },
    { icon: "🛡️", title: "Workplace Safety", desc: "Harassment, discrimination, safety" },
    { icon: "💰", title: "Compensation", desc: "Salary, benefits, bonuses" },
    { icon: "📋", title: "Legal Procedures", desc: "Filing complaints, documentation" },
    { icon: "🎯", title: "Rights & Duties", desc: "Employee rights and obligations" }
  ],
  hi: [
    { icon: "⚖️", title: "श्रम अधिकार", desc: "कार्य घंटे, मजदूरी, स्थितियां" },
    { icon: "🏢", title: "रोजगार कानून", desc: "भर्ती, समाप्ति, अनुबंध" },
    { icon: "🛡️", title: "कार्यक्षेत्र सुरक्षा", desc: "उत्पीड़न, भेदभाव, सुरक्षा" },
    { icon: "💰", title: "मुआवजा", desc: "वेतन, लाभ, बोनस" },
    { icon: "📋", title: "कानूनी प्रक्रियाएं", desc: "शिकायत दर्ज करना, प्रलेखन" },
    { icon: "🎯", title: "अधिकार और कर्तव्य", desc: "कर्मचारी अधिकार और दायित्व" }
  ],
  bn: [
    { icon: "⚖️", title: "শ্রম অধিকার", desc: "কাজের সময়, মজুরি, শর্তাবলী" },
    { icon: "🏢", title: "কর্মসংস্থান আইন", desc: "নিয়োগ, অবসান, চুক্তি" },
    { icon: "🛡️", title: "কর্মক্ষেত্র নিরাপত্তা", desc: "হয়রানি, বৈষম্য, নিরাপত্তা" },
    { icon: "💰", title: "ক্ষতিপূরণ", desc: "বেতন, সুবিধা, বোনাস" },
    { icon: "📋", title: "আইনি পদ্ধতি", desc: "অভিযোগ দায়ের, প্রমাণপত্র" },
    { icon: "🎯", title: "অধিকার ও কর্তব্য", desc: "কর্মচারী অধিকার এবং দায়বদ্ধতা" }
  ],
  gu: [
    { icon: "⚖️", title: "શ્રમ અધિકારો", desc: "કામના કલાકો, વેતન, શરતો" },
    { icon: "🏢", title: "રોજગાર કાયદો", desc: "નિમણૂક, સમાપ્તિ, કરાર" },
    { icon: "🛡️", title: "કાર્યસ્થળ સુરક્ષા", desc: "હેરાનગતિ, ભેદભાવ, સુરક્ષા" },
    { icon: "💰", title: "વળતર", desc: "પગાર, લાભો, બોનસ" },
    { icon: "📋", title: "કાનૂની પ્રક્રિયાઓ", desc: "ફરિયાદ નોંધાવવી, દસ્તાવેજીકરણ" },
    { icon: "🎯", title: "અધિકારો અને ફરજો", desc: "કર્મચારી અધિકારો અને જવાબદારીઓ" }
  ],
  kn: [
    { icon: "⚖️", title: "ಕಾರ್ಮಿಕ ಹಕ್ಕುಗಳು", desc: "ಕೆಲಸದ ಸಮಯ, ವೇತನ, ಷರತ್ತುಗಳು" },
    { icon: "🏢", title: "ಉದ್ಯೋಗ ಕಾನೂನು", desc: "ನೇಮಕಾತಿ, ಮುಕ್ತಾಯ, ಒಪ್ಪಂದಗಳು" },
    { icon: "🛡️", title: "ಕಾರ್ಯಕ್ಷೇತ್ರ ಸುರಕ್ಷತೆ", desc: "ಕಿರುಕುಳ, ತಾರತಮ್ಯ, ಸುರಕ್ಷತೆ" },
    { icon: "💰", title: "ಪರಿಹಾರ", desc: "ಸಂಬಳ, ಪ್ರಯೋಜನಗಳು, ಬೋನಸ್" },
    { icon: "📋", title: "ಕಾನೂನು ಕಾರ್ಯವಿಧಾನಗಳು", desc: "ದೂರು ದಾಖಲಿಸುವುದು, ದಾಖಲೀಕರಣ" },
    { icon: "🎯", title: "ಹಕ್ಕುಗಳು ಮತ್ತು ಕರ್ತವ್ಯಗಳು", desc: "ಉದ್ಯೋಗಿ ಹಕ್ಕುಗಳು ಮತ್ತು ಜವಾಬ್ದಾರಿಗಳು" }
  ],
  ml: [
    { icon: "⚖️", title: "തൊഴിൽ അവകാശങ്ങൾ", desc: "ജോലി സമയം, വേതനം, വ്യവസ്ഥകൾ" },
    { icon: "🏢", title: "തൊഴിൽ നിയമം", desc: "നിയമനം, അവസാനിപ്പിക്കൽ, കരാറുകൾ" },
    { icon: "🛡️", title: "ജോലിസ്ഥല സുരക്ഷ", desc: "പീഡനം, വിവേചനം, സുരക്ഷ" },
    { icon: "💰", title: "നഷ്ടപരിഹാരം", desc: "ശമ്പളം, ആനുകൂല്യങ്ങൾ, ബോണസ്" },
    { icon: "📋", title: "നിയമ നടപടിക്രമങ്ങൾ", desc: "പരാതി ഫയൽ ചെയ്യൽ, രേഖാമൂലം" },
    { icon: "🎯", title: "അവകാശങ്ങളും കർത്തവ്യങ്ങളും", desc: "ജീവനക്കാരുടെ അവകാശങ്ങളും ബാധ്യതകളും" }
  ],
  mr: [
    { icon: "⚖️", title: "कामगार हक्क", desc: "कामाचे तास, वेतन, अटी" },
    { icon: "🏢", title: "रोजगार कायदा", desc: "नियुक्ती, समाप्ती, करार" },
    { icon: "🛡️", title: "कामाच्या ठिकाणची सुरक्षा", desc: "छळवणूक, भेदभाव, सुरक्षा" },
    { icon: "💰", title: "भरपाई", desc: "पगार, फायदे, बोनस" },
    { icon: "📋", title: "कायदेशीर प्रक्रिया", desc: "तक्रार नोंदवणे, दस्तऐवजीकरण" },
    { icon: "🎯", title: "हक्क आणि कर्तव्ये", desc: "कर्मचारी हक्क आणि जबाबदाऱ्या" }
  ],
  pa: [
    { icon: "⚖️", title: "ਮਜ਼ਦੂਰ ਹੱਕ", desc: "ਕੰਮ ਦੇ ਘੰਟੇ, ਤਨਖਾਹ, ਸ਼ਰਤਾਂ" },
    { icon: "🏢", title: "ਰੁਜ਼ਗਾਰ ਕਾਨੂੰਨ", desc: "ਭਰਤੀ, ਸਮਾਪਤੀ, ਇਕਰਾਰਨਾਮੇ" },
    { icon: "🛡️", title: "ਕੰਮ ਦੀ ਜਗ੍ਹਾ ਸੁਰੱਖਿਆ", desc: "ਪਰੇਸ਼ਾਨੀ, ਭੇਦਭਾਵ, ਸੁਰੱਖਿਆ" },
    { icon: "💰", title: "ਮੁਆਵਜ਼ਾ", desc: "ਤਨਖਾਹ, ਫਾਇਦੇ, ਬੋਨਸ" },
    { icon: "📋", title: "ਕਾਨੂੰਨੀ ਪ੍ਰਕਿਰਿਆਵਾਂ", desc: "ਸ਼ਿਕਾਇਤ ਦਰਜ਼ ਕਰਨਾ, ਦਸਤਾਵੇਜ਼ੀਕਰਨ" },
    { icon: "🎯", title: "ਹੱਕ ਅਤੇ ਫ਼ਰਜ਼", desc: "ਕਰਮਚਾਰੀ ਹੱਕ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀਆਂ" }
  ],
  ta: [
    { icon: "⚖️", title: "தொழிலாளர் உரிமைகள்", desc: "வேலை நேரம், ஊதியம், நிபந்தனைகள்" },
    { icon: "🏢", title: "வேலைவாய்ப்பு சட்டம்", desc: "பணியமர்த்தல், பணி நீக்கம், ஒப்பந்தங்கள்" },
    { icon: "🛡️", title: "பணியிட பாதுகாப்பு", desc: "துன்புறுத்தல், பாகுபாடு, பாதுகாப்பு" },
    { icon: "💰", title: "இழப்பீடு", desc: "சம்பளம், நன்மைகள், போனஸ்" },
    { icon: "📋", title: "சட்ட நடைமுறைகள்", desc: "புகார் பதிவு, ஆவணப்படுத்தல்" },
    { icon: "🎯", title: "உரிமைகள் மற்றும் கடமைகள்", desc: "பணியாளர் உரிமைகள் மற்றும் பொறுப்புகள்" }
  ],
  te: [
    { icon: "⚖️", title: "కార్మిక హక్కులు", desc: "పని గంటలు, వేతనాలు, షరతులు" },
    { icon: "🏢", title: "ఉద్యోగ చట్టం", desc: "నియామకం, ముగింపు, ఒప్పందాలు" },
    { icon: "🛡️", title: "కార్యాలయ భద్రత", desc: "వేధింపులు, వివక్ష, భద్రత" },
    { icon: "💰", title: "పరిహారం", desc: "జీతం, ప్రయోజనాలు, బోనస్" },
    { icon: "📋", title: "చట్టపరమైన విధానాలు", desc: "ఫిర్యాదు దాఖలు చేయడం, డాక్యుమెంటేషన్" },
    { icon: "🎯", title: "హక్కులు మరియు కర్తవ్యాలు", desc: "ఉద్యోగి హక్కులు మరియు బాధ్యతలు" }
  ]
};

const TOPIC_HEADER = {
  en: "🏛️ Legal Topics I Can Help With",
  hi: "🏛️ मैं जिन कानूनी विषयों में मदद कर सकता हूं",
  bn: "🏛️ আমি যে আইনি বিষয়ে সাহায্য করতে পারি",
  gu: "🏛️ હું જે કાનૂની વિષયોમાં મદદ કરી શકું છું",
  kn: "🏛️ ನಾನು ಸಹಾಯ ಮಾಡಬಹುದಾದ ಕಾನೂನು ವಿಷಯಗಳು",
  ml: "🏛️ എനിക്ക് സഹായിക്കാൻ കഴിയുന്ന നിയമ വിഷയങ്ങൾ",
  mr: "🏛️ मी ज्या कायदेशीर विषयांमध्ये मदत करू शकतो",
  pa: "🏛️ ਜਿਨ੍ਹਾਂ ਕਾਨੂੰਨੀ ਵਿਸ਼ਿਆਂ ਵਿੱਚ ਮੈਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ",
  ta: "🏛️ நான் உதவக்கூடிய சட்ட தலைப்புகள்",
  te: "🏛️ నేను సహాయం చేయగల చట్టపరమైన అంశాలు"
};

const TOPIC_QUESTIONS = {
  en: "Tell me about",
  hi: "मुझे बताएं",
  bn: "আমাকে বলুন",
  gu: "મને જણાવો",
  kn: "ನನಗೆ ಹೇಳಿ",
  ml: "എന്നോട് പറയൂ",
  mr: "मला सांगा",
  pa: "ਮੈਨੂੰ ਦੱਸੋ",
  ta: "எனக்கு சொல்லுங்கள்",
  te: "నాకు చెప్పండి"
};

// Enhanced OpenAI Manager with better error handling
class OpenAIManager {
  private baseUrl: string;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    this.baseUrl = '/api/chat';
  }

  async createCompletion(messages: any[], options: any = {}): Promise<any> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
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
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  hasApiKeys(): boolean {
    return true;
  }

  getApiKeyCount(): number {
    return 1;
  }
}

const styles = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-8px); }
    70% { transform: translateY(-4px); }
    90% { transform: translateY(-2px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(48, 70, 116, 0.3); }
    50% { box-shadow: 0 0 30px rgba(48, 70, 116, 0.6); }
  }

  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
  }

  .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
  .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
  .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-bounce-custom { animation: bounce 2s infinite; }
  .animate-pulse-custom { animation: pulse 2s infinite; }
  .animate-glow { animation: glow 2s infinite; }
  .animate-typing { animation: typing 1.4s infinite; }

  .gradient-border {
    background: linear-gradient(45deg, #304674, #1e3a5f, #4a6fa5, #2c5aa0);
    background-size: 400% 400%;
    animation: gradientShift 3s ease infinite;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .message-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export default function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [apiError, setApiError] = useState<string>('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showTopics, setShowTopics] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openaiManager = useRef(new OpenAIManager());

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const speakText = (text: string) => {
    if (!isAudioEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const languageMap: { [key: string]: string } = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'gu': 'gu-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'mr': 'mr-IN', 'pa': 'pa-IN',
      'ta': 'ta-IN', 'te': 'te-IN'
    };

    utterance.lang = languageMap[selectedLanguage] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(selectedLanguage)) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];

    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    if ('speechSynthesis' in window && isAudioEnabled) {
      // Remove markdown formatting for speech
      const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const rateMessage = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
  
    const userMessage = input.trim();
    setInput('');
    setApiError('');
    setShowTopics(false);
  
    const userMsg: Message = {
      id: Date.now() + '_user',
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
  
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setIsTyping(true);
  
    try {
      // Make actual API call to your backend
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
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (!data.response) {
        throw new Error('No response received from the API');
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
      
      // Show user-friendly error message based on error type
      let userErrorMessage = "I'm experiencing technical difficulties. Please try again in a moment.";
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        userErrorMessage = "Unable to connect to the service. Please check your internet connection and try again.";
      } else if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable')) {
        userErrorMessage = "The service is temporarily unavailable. Please try again in a few moments.";
      } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        userErrorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        userErrorMessage = "The service is temporarily unavailable due to usage limits. Please try again later.";
      }
  
      setMessages(prev => [...prev, {
        id: Date.now() + '_error',
        text: userErrorMessage,
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowTopics(true);
    setApiError('');
  };

  const currentQuestions = SAMPLE_QUESTIONS[selectedLanguage as keyof typeof SAMPLE_QUESTIONS] || SAMPLE_QUESTIONS.en;
  const currentLanguage = LANGUAGES.find(lang => lang.code === selectedLanguage);

// Markdown renderer component
const MarkdownRenderer = ({ text }) => {
  const renderMarkdown = (text) => {
    // Convert markdown to HTML
    let html = text
      // Bold text **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic text *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Code blocks ```code```
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
      // Inline code `code`
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br/>')
      .replace(/^\* (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

    return html;
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <>
      <style>{styles}</style>
      <div className="fixed bottom-6 right-6 z-50 sm:bottom-6 sm:right-6 mt-16 sm:mt-0">
        {!isOpen ? (
          <div className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-[#304674] to-[#1e3a5f] hover:from-[#1e3a5f] hover:to-[#304674] text-white shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-110 group animate-glow"
            >
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-md transition-transform duration-300 group-hover:scale-110 animate-bounce-custom" />
            </Button>
            
            {showWelcomeMessage && (
              <div className="absolute bottom-20 right-0 sm:bottom-24 sm:right-2">
                <div className="relative animate-slide-in-right">
                  <div className="bg-gradient-to-br from-[#304674]/90 to-[#1e3a5f]/90 backdrop-blur-lg rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl max-w-[280px] w-[90vw] sm:w-[300px] transition-transform transform hover:scale-105 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-semibold text-sm">Legal Assistant Online</span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Hi there! 👋 I'm your AI legal assistant.<br /> Need help with employment law or worker rights in India? Click to start!
                    </p>
                  </div>
                  <div className="absolute top-full right-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#1e3a5f]"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className={cn(
            "w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-slide-up gradient-border",
            isMinimized ? "h-16" : "h-[calc(100vh-6rem)] sm:h-[700px]"
          )}>
            {/* Header */}
            <div className="p-3 sm:p-4 flex items-center justify-between bg-gradient-to-r from-[#304674] to-[#1e3a5f] text-white rounded-t-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse-custom"></div>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Legal Assistant AI</h3>
                  <p className="text-[10px] sm:text-xs text-white/80">
                    {currentLanguage?.flag} {currentLanguage?.name} • Online
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20 transition-colors"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  title={isAudioEnabled ? "Disable audio" : "Enable audio"}
                >
                  {isAudioEnabled ? <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20 transition-colors"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Language Selector */}
                <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Language</span>
                    </div>
                    {messages.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] sm:text-xs text-gray-600 hover:text-gray-800"
                        onClick={clearChat}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Clear Chat
                      </Button>
                    )}
                  </div>
                  
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white scrollbar-thin">
                  {messages.length === 0 ? (
                    <div className="text-center space-y-6 animate-fade-in">
                      {/* Legal Topics */}
                      {showTopics && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            {TOPIC_HEADER[selectedLanguage as keyof typeof TOPIC_HEADER]}
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {LEGAL_TOPICS[selectedLanguage as keyof typeof LEGAL_TOPICS].map((topic, index) => (
                              <div
                                key={index}
                                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                                onClick={() => setInput(`${TOPIC_QUESTIONS[selectedLanguage as keyof typeof TOPIC_QUESTIONS]} ${topic.title}`)}
                              >
                                <div className="text-lg mb-1">{topic.icon}</div>
                                <div className="text-sm font-medium text-gray-800">{topic.title}</div>
                                <div className="text-xs text-gray-600">{topic.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sample Questions */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">💬 Common Questions</h4>
                        <div className="space-y-2">
                          {currentQuestions.slice(0, 4).map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full text-left text-sm py-3 px-4 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 justify-start transition-all duration-200 hover:scale-[1.02] rounded-lg"
                              onClick={() => setInput(question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex animate-slide-in group",
                          message.isUser ? "justify-end" : "justify-start"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3 max-w-[85%]">
                          {!message.isUser && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#304674] to-[#1e3a5f] flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div
                              className={cn(
                                "rounded-2xl p-4 text-sm transition-all duration-200 message-hover",
                                message.isUser
                                  ? "bg-gradient-to-r from-[#304674] to-[#1e3a5f] text-white ml-auto"
                                  : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                              )}
                            >
                             {message.isUser ? (
                                <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                              ) : (
                                <MarkdownRenderer text={message.text} />
                              )}
                              
                              {!message.isUser && (
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs opacity-70 hover:opacity-100"
                                      onClick={() => copyToClipboard(message.text)}
                                    >
                                      <Copy className="h-3 w-3 mr-1" />
                                      Copy
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs opacity-70 hover:opacity-100"
                                      onClick={() => speakText(message.text)}
                                    >
                                      <Volume2 className="h-3 w-3 mr-1" />
                                      Read
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-7 w-7 p-0",
                                        message.rating === 'up' ? "text-green-600" : "text-gray-400 hover:text-green-600"
                                      )}
                                      onClick={() => rateMessage(message.id, 'up')}
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-7 w-7 p-0",
                                        message.rating === 'down' ? "text-red-600" : "text-gray-400 hover:text-red-600"
                                      )}
                                      onClick={() => rateMessage(message.id, 'down')}
                                    >
                                      <ThumbsDown className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              {message.isUser ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                              <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>

                          {message.isUser && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#304674] to-[#1e3a5f] flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                            <span className="ml-2 text-sm text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t bg-white">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="💬 Ask me anything about Indian labor law..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-500"
                        disabled={isLoading}
                      />
                      
                      {input && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 text-gray-400 hover:text-gray-600"
                          onClick={() => setInput('')}
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#304674] to-[#1e3a5f] hover:from-[#1e3a5f] hover:to-[#304674] text-white rounded-xl transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">Send</span>
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>AI Assistant Online</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Press Enter to send</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        onClick={() => setInput("What are my basic rights as an employee in India?")}
                      >
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <span className="text-sm sm:text-base">💼</span>
                          <span>Employee Rights</span>
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        onClick={() => setInput("How do I file a complaint against workplace harassment?")}
                      >
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <span className="text-sm sm:text-base">🛡️</span>
                          <span>Harassment Help</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}