const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create languages
  const languages = await Promise.all([
    prisma.language.upsert({
      where: { code: "hi" },
      update: {},
      create: { code: "hi", name: "Hindi", nativeName: "हिंदी", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "mr" },
      update: {},
      create: { code: "mr", name: "Marathi", nativeName: "मराठी", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "ta" },
      update: {},
      create: { code: "ta", name: "Tamil", nativeName: "தமிழ்", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "te" },
      update: {},
      create: { code: "te", name: "Telugu", nativeName: "తెలుగు", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "bn" },
      update: {},
      create: { code: "bn", name: "Bengali", nativeName: "বাংলা", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "gu" },
      update: {},
      create: { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "kn" },
      update: {},
      create: { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "ml" },
      update: {},
      create: { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "pa" },
      update: {},
      create: { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flagEmoji: "🇮🇳" },
    }),
    prisma.language.upsert({
      where: { code: "en" },
      update: {},
      create: { code: "en", name: "English", nativeName: "English", flagEmoji: "🇮🇳" },
    }),
  ]);

  console.log("✅ Languages created");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { key: "wages-hours" },
      update: {},
      create: { key: "wages-hours", icon: "💰" },
    }),
    prisma.category.upsert({
      where: { key: "harassment" },
      update: {},
      create: { key: "harassment", icon: "🛑" },
    }),
    prisma.category.upsert({
      where: { key: "maternity" },
      update: {},
      create: { key: "maternity", icon: "👶" },
    }),
    prisma.category.upsert({
      where: { key: "safety" },
      update: {},
      create: { key: "safety", icon: "⚠️" },
    }),
    prisma.category.upsert({
      where: { key: "child-labor" },
      update: {},
      create: { key: "child-labor", icon: "🚫" },
    }),
    prisma.category.upsert({
      where: { key: "notice-period" },
      update: {},
      create: { key: "notice-period", icon: "📜" },
    }),
    prisma.category.upsert({
      where: { key: "govt-schemes" },
      update: {},
      create: { key: "govt-schemes", icon: "🏛️" },
    }),
  ]);

  console.log("✅ Categories created");

  // Multilingual category translations
  const translationsByLanguage = {
    hi: {
      "wages-hours": "मजदूरी और घंटे",
      harassment: "उत्पीड़न",
      maternity: "मातृत्व",
      safety: "सुरक्षा",
      "child-labor": "बाल श्रम",
      "notice-period": "नोटिस अवधि",
      "govt-schemes": "सरकारी योजनाएं",
    },
    en: {
      "wages-hours": "Wages & Hours",
      harassment: "Harassment",
      maternity: "Maternity",
      safety: "Safety",
      "child-labor": "Child Labor",
      "notice-period": "Notice Period",
      "govt-schemes": "Govt Schemes",
    },
    mr: {
      "wages-hours": "वेतन आणि तास",
      harassment: "छळवणूक",
      maternity: "प्रसूती",
      safety: "सुरक्षा",
      "child-labor": "बालकामगार",
      "notice-period": "सूचना कालावधी",
      "govt-schemes": "सरकारी योजना",
    },
    ta: {
      "wages-hours": "ஊதியம் மற்றும் நேரங்கள்",
      harassment: "தொந்தரவு",
      maternity: "மாதவிடாய்",
      safety: "பாதுகாப்பு",
      "child-labor": "குழந்தை வேலை",
      "notice-period": "அறிவிப்பு காலம்",
      "govt-schemes": "அரசுத் திட்டங்கள்",
    },
    te: {
      "wages-hours": "జీతాలు మరియు గంటలు",
      harassment: "హింస",
      maternity: "గర్భవతి",
      safety: "భద్రత",
      "child-labor": "పిల్లల కృషి",
      "notice-period": "నోటీసు కాలం",
      "govt-schemes": "ప్రభుత్వ పథకాలు",
    },
    bn: {
      "wages-hours": "মজুরি ও সময়",
      harassment: "হয়রানি",
      maternity: "মাতৃত্ব",
      safety: "নিরাপত্তা",
      "child-labor": "শিশু শ্রম",
      "notice-period": "নোটিশ সময়কাল",
      "govt-schemes": "সরকারি প্রকল্প",
    },
    gu: {
      "wages-hours": "વેતન અને કલાકો",
      harassment: "હેરાનગતિ",
      maternity: "માતૃત્વ",
      safety: "સુરક્ષા",
      "child-labor": "બાળ શ્રમ",
      "notice-period": "નોટિસ પિરિયડ",
      "govt-schemes": "સરકારી યોજનાઓ",
    },
    kn: {
      "wages-hours": "ವೇತನಗಳು ಮತ್ತು ಗಂಟೆಗಳು",
      harassment: "ಹಿಂಸೆ",
      maternity: "ಗರ್ಭಧರಣೆ",
      safety: "ಭದ್ರತೆ",
      "child-labor": "ಮಕ್ಕಳ ಕಾರ್ಮಿಕರು",
      "notice-period": "ಸೂಚನೆ ಅವಧಿ",
      "govt-schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    },
    ml: {
      "wages-hours": "ജോളിയും മണിക്കൂറുകളും",
      harassment: "പീഡനം",
      maternity: "ഗര്‍ഭധാരണം",
      safety: "സുരക്ഷ",
      "child-labor": "കുട്ടികള്‍ ജോലി",
      "notice-period": "അറിയിപ്പ് കാലം",
      "govt-schemes": "സര്‍ക്കാര്‍ പദ്ധതികള്‍",
    },
    pa: {
      "wages-hours": "ਵੇਤਨ ਤੇ ਘੰਟੇ",
      harassment: "ਹੈਰਾਸਮੈਂਟ",
      maternity: "ਮਾਤਾ ਬਣਨ",
      safety: "ਸੁਰੱਖਿਆ",
      "child-labor": "ਬੱਚਿਆਂ ਦੀ ਮਿਹਨਤ",
      "notice-period": "ਨੋਟਿਸ ਅਵਧੀ",
      "govt-schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    },
  };

  // Create site translations table and populate it
  const siteTranslations = {
    // English translations
    en: {
      // Homepage
      "site.title": "Your Legal Rights",
      "site.tagline": "Choose Your Language",
      "site.about.title": "About Legal Saathi",
      "site.about.description": "Legal Saathi helps daily wage workers understand their legal rights in a simple, accessible way.",
      "site.feature.understand": "Easy to Understand",
      "site.feature.understand.desc": "Simple language with audio explanations for better accessibility.",
      "site.feature.multilingual": "Multiple Languages",
      "site.feature.multilingual.desc": "Available in various Indian languages to reach more workers.",
      "site.feature.offline": "Works Offline",
      "site.feature.offline.desc": "Access information even without an internet connection.",
      "site.admin.access": "Admin Access",
      "site.footer": "Made with ❤️ for daily wage workers across India",
      
      // Volunteer Form
      "volunteer.title": "Volunteer with Legal Saathi",
      "volunteer.form.name": "Name",
      "volunteer.form.email": "Email",
      "volunteer.form.organization": "Organization (optional)",
      "volunteer.form.help.question": "How do you want to help?",
      "volunteer.form.help.translations": "Help with translations",
      "volunteer.form.help.recordings": "Contribute recordings",
      "volunteer.form.help.boards": "Request boards",
      "volunteer.form.help.installations": "Track installations",
      "volunteer.form.submit": "Submit",
      "volunteer.form.submitting": "Submitting...",
      "volunteer.form.success": "Thank you for volunteering! We will be in touch soon.",
      "volunteer.form.error": "Something went wrong. Please try again.",
      "volunteer.why.title": "Why join us",
      "volunteer.why.awareness": "Spread legal awareness to those who need it most",
      "volunteer.why.support": "Support an initiative that is student-driven and worker-focused",
      "volunteer.why.expand": "Help expand the mission nationwide",
      
      // Common
      "common.required": "*",
      "common.optional": "(optional)"
    },
    // Hindi translations
    hi: {
      // Homepage
      "site.title": "आपके कानूनी अधिकार",
      "site.tagline": "अपनी भाषा चुनें",
      "site.about.title": "लीगल साथी के बारे में",
      "site.about.description": "लीगल साथी दैनिक मजदूरों को उनके कानूनी अधिकारों को सरल और सुलभ तरीके से समझने में मदद करता है।",
      "site.feature.understand": "समझने में आसान",
      "site.feature.understand.desc": "बेहतर पहुंच के लिए ऑडियो स्पष्टीकरण के साथ सरल भाषा।",
      "site.feature.multilingual": "कई भाषाएं",
      "site.feature.multilingual.desc": "अधिक श्रमिकों तक पहुंचने के लिए विभिन्न भारतीय भाषाओं में उपलब्ध।",
      "site.feature.offline": "ऑफलाइन काम करता है",
      "site.feature.offline.desc": "इंटरनेट कनेक्शन के बिना भी जानकारी तक पहुंच।",
      "site.admin.access": "एडमिन एक्सेस",
      "site.footer": "भारत भर के दैनिक मजदूरों के लिए ❤️ के साथ बनाया गया",
      
      // Volunteer Form
      "volunteer.title": "लीगल साथी के साथ स्वयंसेवा करें",
      "volunteer.form.name": "नाम",
      "volunteer.form.email": "ईमेल",
      "volunteer.form.organization": "संस्था (वैकल्पिक)",
      "volunteer.form.help.question": "आप कैसे मदद करना चाहते हैं?",
      "volunteer.form.help.translations": "अनुवाद में मदद करें",
      "volunteer.form.help.recordings": "रिकॉर्डिंग में योगदान दें",
      "volunteer.form.help.boards": "बोर्ड का अनुरोध करें",
      "volunteer.form.help.installations": "इंस्टॉलेशन ट्रैक करें",
      "volunteer.form.submit": "जमा करें",
      "volunteer.form.submitting": "जमा कर रहे हैं...",
      "volunteer.form.success": "स्वयंसेवा के लिए धन्यवाद! हम जल्द ही संपर्क करेंगे।",
      "volunteer.form.error": "कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
      "volunteer.why.title": "हमसे क्यों जुड़ें",
      "volunteer.why.awareness": "उन लोगों तक कानूनी जागरूकता फैलाएं जिन्हें इसकी सबसे ज्यादा जरूरत है",
      "volunteer.why.support": "एक ऐसी पहल का समर्थन करें जो छात्र-संचालित और श्रमिक-केंद्रित है",
      "volunteer.why.expand": "मिशन को राष्ट्रव्यापी विस्तार में मदद करें"
    },
    // Marathi translations
    mr: {
      // Homepage
      "site.title": "आपले कायदेशीर हक्क",
      "site.tagline": "आपली भाषा निवडा",
      "site.about.title": "लीगल साथी बद्दल",
      "site.about.description": "लीगल साथी दैनंदिन मजुरांना त्यांचे कायदेशीर हक्क सोप्या आणि सुलभ पद्धतीने समजून घेण्यास मदत करते.",
      "site.feature.understand": "समजणे सोपे",
      "site.feature.understand.desc": "चांगल्या प्रवेशक्षमतेसाठी ऑडिओ स्पष्टीकरणासह सोपी भाषा.",
      "site.feature.multilingual": "बहुविध भाषा",
      "site.feature.multilingual.desc": "अधिक कामगारांपर्यंत पोहोचण्यासाठी विविध भारतीय भाषांमध्ये उपलब्ध.",
      "site.feature.offline": "ऑफलाइन कार्य करते",
      "site.feature.offline.desc": "इंटरनेट कनेक्शनशिवायही माहितीमध्ये प्रवेश.",
      "site.admin.access": "प्रशासक प्रवेश",
      "site.footer": "भारतातील दैनंदिन मजुरांसाठी ❤️ ने बनवले",
      
      // Volunteer Form
      "volunteer.title": "लीगल साथीसह स्वयंसेवा करा",
      "volunteer.form.name": "नाव",
      "volunteer.form.email": "ईमेल",
      "volunteer.form.organization": "संस्था (पर्यायी)",
      "volunteer.form.help.question": "तुम्ही कशी मदत करू इच्छिता?",
      "volunteer.form.help.translations": "भाषांतरात मदत करा",
      "volunteer.form.help.recordings": "रेकॉर्डिंगमध्ये योगदान द्या",
      "volunteer.form.help.boards": "बोर्डची विनंती करा",
      "volunteer.form.help.installations": "इन्स्टॉलेशन ट्रॅक करा",
      "volunteer.form.submit": "सबमिट करा",
      "volunteer.form.submitting": "सबमिट करत आहे...",
      "volunteer.form.success": "स्वयंसेवेबद्दल धन्यवाद! आम्ही लवकरच संपर्क साधू.",
      "volunteer.form.error": "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
      "volunteer.why.title": "आमच्यात का सामील व्हा",
      "volunteer.why.awareness": "ज्यांना सर्वात जास्त गरज आहे त्यांच्यापर्यंत कायदेशीर जागरूकता पोहोचवा",
      "volunteer.why.support": "विद्यार्थी-संचालित आणि कामगार-केंद्रित उपक्रमाला पाठिंबा द्या",
      "volunteer.why.expand": "मिशनचा देशव्यापी विस्तार करण्यास मदत करा"
    },
    // Tamil translations
    ta: {
      // Homepage
      "site.title": "உங்கள் சட்ட உரிமைகள்",
      "site.tagline": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
      "site.about.title": "சட்ட தோழர் பற்றி",
      "site.about.description": "சட்ட தோழர் தினசரி ஊதிய தொழிலாளர்களுக்கு அவர்களது சட்ட உரிமைகளை எளிதாக, அணுகக்கூடிய முறையில் புரிந்துகொள்ள உதவுகிறது.",
      "site.feature.understand": "எளிதில் புரிந்துகொள்ளலாம்",
      "site.feature.understand.desc": "மேலதிக அணுகுமுறைக்கான ஒலி விளக்கங்களுடன் எளிய மொழி.",
      "site.feature.multilingual": "பல மொழிகள்",
      "site.feature.multilingual.desc": "மேலும் தொழிலாளர்களை அடைய பல்வேறு இந்திய மொழிகளில் கிடைக்கிறது.",
      "site.feature.offline": "ஆஃப்லைனில் செயல்படுகிறது",
      "site.feature.offline.desc": "இணைய இணைப்பு இல்லாமல் கூட தகவல்களை அணுகவும்.",
      "site.admin.access": "நிர்வாக அணுகல்",
      "site.footer": "இந்தியாவின் தினசரி ஊதிய தொழிலாளர்களுக்காக ❤️ மூலம் உருவாக்கப்பட்டது",
      
      // Volunteer Form
      "volunteer.title": "சட்ட தோழருடன் தன்னார்வலராக இருங்கள்",
      "volunteer.form.name": "பெயர்",
      "volunteer.form.email": "மின்னஞ்சல்",
      "volunteer.form.organization": "அமைப்பு (விருப்பமானது)",
      "volunteer.form.help.question": "நீங்கள் எவ்வாறு உதவ விரும்புகிறீர்கள்?",
      "volunteer.form.help.translations": "மொழிபெயர்ப்புகளில் உதவுங்கள்",
      "volunteer.form.help.recordings": "பதிவுகளில் பங்களிக்கவும்",
      "volunteer.form.help.boards": "குழாய்களை கோருங்கள்",
      "volunteer.form.help.installations": "நிறுவல்களை கண்காணிக்கவும்",
      "volunteer.form.submit": "சமர்ப்பிக்கவும்",
      "volunteer.form.submitting": "சமர்ப்பிக்கப்படுகிறது...",
      "volunteer.form.success": "தன்னார்வத்திற்கு நன்றி! விரைவில் நாங்கள் தொடர்பு கொள்வோம்.",
      "volunteer.form.error": "சில தவறு ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      "volunteer.why.title": "எங்களுடன் ஏன் சேர வேண்டும்",
      "volunteer.why.awareness": "அதிக தேவை உள்ளவர்களுக்கு சட்ட விழிப்புணர்வை பரப்புங்கள்",
      "volunteer.why.support": "மாணவர் இயக்கம் மற்றும் தொழிலாளர் மையமான முயற்சியை ஆதரிக்கவும்",
      "volunteer.why.expand": "பணியை நாடு முழுவதும் விரிவாக்க உதவுங்கள்",
    },
    // Telugu translations
    te: {
      // Homepage
      "site.title": "మీ చట్టపరమైన హక్కులు",
      "site.tagline": "మీ భాషను ఎంచుకోండి",
      "site.about.title": "లీగల్ సాథి గురించి",
      "site.about.description": "లీగల్ సాథి రోజువారీ వేతన కార్మికులకు వారి చట్టపరమైన హక్కులను సులభంగా, అందుబాటులో ఉన్న విధంగా అర్థం చేసుకోవడంలో సహాయపడుతుంది.",
      "site.feature.understand": "అర్థం చేసుకోవడం సులభం",
      "site.feature.understand.desc": "మరింత అందుబాటులో ఉండటానికి ఆడియో వివరణలతో సరళమైన భాష.",
      "site.feature.multilingual": "బహుభాషలు",
      "site.feature.multilingual.desc": "మరిన్ని కార్మికులను చేరుకోవడానికి వివిధ భారతీయ భాషల్లో అందుబాటులో ఉంది.",
      "site.feature.offline": "ఆఫ్‌లైన్‌లో పనిచేస్తుంది",
      "site.feature.offline.desc": "ఇంటర్నెట్ కనెక్షన్ లేకుండా కూడా సమాచారాన్ని యాక్సెస్ చేయండి.",
      "site.admin.access": "అడ్మిన్ యాక్సెస్",
      "site.footer": "భారతదేశంలోని రోజువారీ వేతన కార్మికుల కోసం ❤️ తో రూపొందించబడింది",
      
      // Volunteer Form
      "volunteer.title": "లీగల్ సాథితో వాలంటీర్ అవ్వండి",
      "volunteer.form.name": "పేరు",
      "volunteer.form.email": "ఇమెయిల్",
      "volunteer.form.organization": "సంస్థ (ఐచ్ఛికం)",
      "volunteer.form.help.question": "మీరు ఎలా సహాయం చేయాలనుకుంటున్నారు?",
      "volunteer.form.help.translations": "అనువాదాలలో సహాయం చేయండి",
      "volunteer.form.help.recordings": "రికార్డింగ్‌లలో భాగస్వామ్యం చేయండి",
      "volunteer.form.help.boards": "బోర్డులను అభ్యర్థించండి",
      "volunteer.form.help.installations": "ఇన్‌స్టాలేషన్లను ట్రాక్ చేయండి",
      "volunteer.form.submit": "సమర్పించండి",
      "volunteer.form.submitting": "సమర్పణ జరుగుతోంది...",
      "volunteer.form.success": "వాలంటీర్‌గా చేరినందుకు ధన్యవాదాలు! మేము త్వరలో మీతో సంప్రదిస్తాము.",
      "volunteer.form.error": "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      "volunteer.why.title": "మాతో ఎందుకు చేరాలి",
      "volunteer.why.awareness": "అత్యంత అవసరమైన వారికి చట్టపరమైన అవగాహనను వ్యాప్తి చేయండి",
      "volunteer.why.support": "విద్యార్థి-నడిపిత మరియు కార్మిక-కేంద్రిత ప్రయత్నాన్ని మద్దతు ఇవ్వండి",
      "volunteer.why.expand": "మిషన్‌ను దేశవ్యాప్తంగా విస్తరించడంలో సహాయపడండి",
    },
    // Bengali translations
    bn: {
      // Homepage
      "site.title": "আপনার আইনগত অধিকার",
      "site.tagline": "আপনার ভাষা বেছে নিন",
      "site.about.title": "লিগ্যাল সাথী সম্পর্কে",
      "site.about.description": "লিগ্যাল সাথী দৈনিক মজুরদের তাদের আইনগত অধিকার সহজ, প্রবেশযোগ্য উপায়ে বুঝতে সাহায্য করে।",
      "site.feature.understand": "বুঝতে সহজ",
      "site.feature.understand.desc": "আরও প্রবেশযোগ্যতার জন্য অডিও ব্যাখ্যার সাথে সহজ ভাষা।",
      "site.feature.multilingual": "বহুভাষিক",
      "site.feature.multilingual.desc": "আরও শ্রমিকদের কাছে পৌঁছাতে বিভিন্ন ভারতীয় ভাষায় উপলব্ধ।",
      "site.feature.offline": "অফলাইন কাজ করে",
      "site.feature.offline.desc": "ইন্টারনেট সংযোগ ছাড়াই তথ্য অ্যাক্সেস করুন।",
      "site.admin.access": "অ্যাডমিন অ্যাক্সেস",
      "site.footer": "ভারতের দৈনিক মজুরদের জন্য ❤️ দিয়ে তৈরি",
      
      // Volunteer Form
      "volunteer.title": "লিগ্যাল সাথীর সাথে স্বেচ্ছাসেবক হন",
      "volunteer.form.name": "নাম",
      "volunteer.form.email": "ইমেইল",
      "volunteer.form.organization": "সংস্থা (ঐচ্ছিক)",
      "volunteer.form.help.question": "আপনি কীভাবে সাহায্য করতে চান?",
      "volunteer.form.help.translations": "অনুবাদে সাহায্য করুন",
      "volunteer.form.help.recordings": "রেকর্ডিংয়ে অবদান রাখুন",
      "volunteer.form.help.boards": "বোর্ডের অনুরোধ করুন",
      "volunteer.form.help.installations": "ইনস্টলেশন ট্র্যাক করুন",
      "volunteer.form.submit": "জমা দিন",
      "volunteer.form.submitting": "জমা দেওয়া হচ্ছে...",
      "volunteer.form.success": "স্বেচ্ছাসেবক হওয়ার জন্য ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।",
      "volunteer.form.error": "কিছু ভুল হয়েছে। দয়া করে আবার চেষ্টা করুন।",
      "volunteer.why.title": "আমাদের সাথে কেন যোগদান করবেন",
      "volunteer.why.awareness": "যাদের সবচেয়ে বেশি প্রয়োজন তাদের কাছে আইনগত সচেতনতা ছড়িয়ে দিন",
      "volunteer.why.support": "একটি ছাত্র-চালিত এবং শ্রমিক-কেন্দ্রিক উদ্যোগকে সমর্থন করুন",
      "volunteer.why.expand": "মিশনকে দেশব্যাপী সম্প্রসারণে সহায়তা করুন",
    },
    // Gujarati translations
    gu: {
      // Homepage
      "site.title": "તમારા કાયદેસર હક્કો",
      "site.tagline": "તમારી ભાષા પસંદ કરો",
      "site.about.title": "લીગલ સાથી વિશે",
      "site.about.description": "લીગલ સાથી દૈનિક વેતન કામદારોને તેમના કાયદેસર હક્કોને સરળ, સગવડભર્યા રીતે સમજવામાં મદદ કરે છે.",
      "site.feature.understand": "સમજવામાં સરળ",
      "site.feature.understand.desc": "વધુ સગવડ માટે ઓડિયો સ્પષ્ટીકરણ સાથે સરળ ભાષા.",
      "site.feature.multilingual": "બહુભાષી",
      "site.feature.multilingual.desc": "વધુ કામદારો સુધી પહોંચવા માટે વિવિધ ભારતીય ભાષાઓમાં ઉપલબ્ધ.",
      "site.feature.offline": "ઑફલાઇન કાર્ય કરે છે",
      "site.feature.offline.desc": "ઇન્ટરનેટ કનેક્શન વિના માહિતી ઍક્સેસ કરો.",
      "site.admin.access": "એડમિન ઍક્સેસ",
      "site.footer": "ભારતના દૈનિક વેતન કામદારો માટે ❤️ થી બનાવેલ",
      
      // Volunteer Form
      "volunteer.title": "લીગલ સાથી સાથે સ્વયંસેવક બનો",
      "volunteer.form.name": "નામ",
      "volunteer.form.email": "ઇમેઇલ",
      "volunteer.form.organization": "સંસ્થા (વૈકલ્પિક)",
      "volunteer.form.help.question": "તમે કેવી રીતે મદદ કરવા માંગો છો?",
      "volunteer.form.help.translations": "ભાષાંતરમાં મદદ કરો",
      "volunteer.form.help.recordings": "રેકોર્ડિંગમાં યોગદાન આપો",
      "volunteer.form.help.boards": "બોર્ડની વિનંતી કરો",
      "volunteer.form.help.installations": "ઇન્સ્ટોલેશન ટ્રેક કરો",
      "volunteer.form.submit": "સબમિટ કરો",
      "volunteer.form.submitting": "સબમિટ કરી રહ્યા છીએ...",
      "volunteer.form.success": "સ્વયંસેવક બનવા બદલ આભાર! અમે ટૂંક સમયમાં સંપર્ક કરીશું.",
      "volunteer.form.error": "કંઈક ભૂલ થઈ છે. કૃપા કરીને ફરી પ્રયાસ કરો.",
      "volunteer.why.title": "અમારા સાથે શા માટે જોડાવું",
      "volunteer.why.awareness": "જેઓને સૌથી વધુ જરૂર છે તેમના માટે કાયદેસર જાગૃતિ ફેલાવો",
      "volunteer.why.support": "વિદ્યાર્થી-ચાલિત અને કામદારો-કેન્દ્રિત પહેલને સમર્થન આપો",
      "volunteer.why.expand": "મિશનને રાષ્ટ્રીય સ્તરે વિસ્તરણમાં મદદ કરો",
    },
    // Kannada translations
    kn: {
      // Homepage
      "site.title": "ನಿಮ್ಮ ಕಾನೂನು ಹಕ್ಕುಗಳು",
      "site.tagline": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      "site.about.title": "ಲೀಗಲ್ ಸಾಥಿ ಬಗ್ಗೆ",
      "site.about.description": "ಲೀಗಲ್ ಸಾಥಿ ದಿನಸಿ ವೇತನ ಕಾರ್ಮಿಕರಿಗೆ ಅವರ ಕಾನೂನು ಹಕ್ಕುಗಳನ್ನು ಸುಲಭ, ಪ್ರವೇಶಿಸಬಹುದಾದ ರೀತಿಯಲ್ಲಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      "site.feature.understand": "ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸುಲಭ",
      "site.feature.understand.desc": "ಹೆಚ್ಚಿನ ಪ್ರವೇಶಕ್ಕೆ ಆಡಿಯೋ ವಿವರಣೆಗಳೊಂದಿಗೆ ಸರಳ ಭಾಷೆ.",
      "site.feature.multilingual": "ಬಹುಭಾಷಾ",
      "site.feature.multilingual.desc": "ಹೆಚ್ಚಿನ ಕಾರ್ಮಿಕರನ್ನು ತಲುಪಲು ವಿವಿಧ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.",
      "site.feature.offline": "ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
      "site.feature.offline.desc": "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲದೆ ಮಾಹಿತಿಯನ್ನು ಪ್ರವೇಶಿಸಿ.",
      "site.admin.access": "ನಿರ್ವಾಹಕ ಪ್ರವೇಶ",
      "site.footer": "ಭಾರತದ ದಿನಸಿ ವೇತನ ಕಾರ್ಮಿಕರಿಗಾಗಿ ❤️ ನಿಂದ ರಚಿಸಲಾಗಿದೆ",
      
      // Volunteer Form
      "volunteer.title": "ಲೀಗಲ್ ಸಾಥಿಯೊಂದಿಗೆ ಸ್ವಯಂಸೇವಕವಾಗಿರಿ",
      "volunteer.form.name": "ಹೆಸರು",
      "volunteer.form.email": "ಇಮೇಲ್",
      "volunteer.form.organization": "ಸಂಸ್ಥೆ (ಐಚ್ಛಿಕ)",
      "volunteer.form.help.question": "ನೀವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
      "volunteer.form.help.translations": "ಭಾಷಾಂತರಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಿ",
      "volunteer.form.help.recordings": "ರೆಕಾರ್ಡಿಂಗ್‌ಗಳಲ್ಲಿ ಕೊಡುಗೆ ನೀಡಿ",
      "volunteer.form.help.boards": "ಬೋರ್ಡ್‌ಗಳನ್ನು ವಿನಂತಿಸಿ",
      "volunteer.form.help.installations": "ಸ್ಥಾಪನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "volunteer.form.submit": "ಸಮರ್ಪಿಸಿ",
      "volunteer.form.submitting": "ಸಮರ್ಪಿಸಲಾಗುತ್ತಿದೆ...",
      "volunteer.form.success": "ಸ್ವಯಂಸೇವಕವಾಗಲು ಧನ್ಯವಾದಗಳು! ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
      "volunteer.form.error": "ಏನಾದರೂ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.",
      "volunteer.why.title": "ನಮ್ಮೊಂದಿಗೆ ಏಕೆ ಸೇರಬೇಕು",
      "volunteer.why.awareness": "ಅತ್ಯಂತ ಅಗತ್ಯವಿರುವವರಿಗೆ ಕಾನೂನು ಜಾಗೃತಿ ಹರಡಿ",
      "volunteer.why.support": "ವಿದ್ಯಾರ್ಥಿ-ನಡಿತ ಮತ್ತು ಕಾರ್ಮಿಕ-ಕೇಂದ್ರಿತ ಪ್ರಯತ್ನವನ್ನು ಬೆಂಬಲಿಸಿ",
      "volunteer.why.expand": "ಮಿಷನ್ ಅನ್ನು ದೇಶಾದ್ಯಾಂತ ವಿಸ್ತರಿಸಲು ಸಹಾಯ ಮಾಡಿ",
    },
    // Malayalam translations
    ml: {
      // Homepage
      "site.title": "നിങ്ങളുടെ നിയമപരമായ അവകാശങ്ങൾ",
      "site.tagline": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
      "site.about.title": "ലീഗൽ സാത്തി കുറിച്ച്",
      "site.about.description": "ലീഗൽ സാത്തി ദിനംപ്രതി വേതനം തൊഴിലാളികൾക്ക് അവരുടെ നിയമപരമായ അവകാശങ്ങൾ എളുപ്പത്തിൽ, ആക്സസിബിള്‍ രീതിയിൽ മനസ്സിലാക്കാൻ സഹായിക്കുന്നു.",
      "site.feature.understand": "അർത്ഥമാക്കാൻ എളുപ്പം",
      "site.feature.understand.desc": "കൂടുതൽ ആക്സസിബിലിറ്റിക്ക് ഓഡിയോ വിശദീകരണങ്ങളോടുകൂടിയ ലളിതമായ ഭാഷ.",
      "site.feature.multilingual": "ബഹുഭാഷ",
      "site.feature.multilingual.desc": "കൂടുതൽ തൊഴിലാളികളെ എത്തിക്കാൻ വിവിധ ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യമാണ്.",
      "site.feature.offline": "ഓഫ്‌ലൈൻ പ്രവർത്തിക്കുന്നു",
      "site.feature.offline.desc": "ഇന്റർനെറ്റ് കണക്ഷൻ ഇല്ലാതെ വിവരങ്ങൾ ആക്സസ് ചെയ്യുക.",
      "site.admin.access": "അഡ്മിൻ ആക്സസ്",
      "site.footer": "ഇന്ത്യയിലെ ദിനംപ്രതി വേതനം തൊഴിലാളികൾക്കായി ❤️ നാൽ നിർമ്മിതമാണ്",
      
      // Volunteer Form
      "volunteer.title": "ലീഗൽ സാത്തിയുമായി സ്വയംസേവകൻ ആകുക",
      "volunteer.form.name": "പേര്",
      "volunteer.form.email": "ഇമെയിൽ",
      "volunteer.form.organization": "സംഘടനം (ഐച്ഛികം)",
      "volunteer.form.help.question": "നിങ്ങൾ എങ്ങനെ സഹായിക്കണമെന്ന് ആഗ്രഹിക്കുന്നു?",
      "volunteer.form.help.translations": "ഭാഷാന്തരങ്ങളിൽ സഹായിക്കുക",
      "volunteer.form.help.recordings": "റെക്കോർഡിംഗുകളിൽ സംഭാവന ചെയ്യുക",
      "volunteer.form.help.boards": "ബോർഡുകൾ അഭ്യർത്ഥിക്കുക",
      "volunteer.form.help.installations": "ഇൻസ്റ്റാളേഷനുകൾ ട്രാക്ക് ചെയ്യുക",
      "volunteer.form.submit": "സമർപ്പിക്കുക",
      "volunteer.form.submitting": "സമർപ്പിക്കുകയാണ്...",
      "volunteer.form.success": "സ്വയംസേവകനാകുന്നതിന് നന്ദി! ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.",
      "volunteer.form.error": "എന്തെങ്കിലും തെറ്റായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
      "volunteer.why.title": "ഞങ്ങളുമായി എന്തുകൊണ്ട് ചേരണം",
      "volunteer.why.awareness": "ഏറ്റവും ആവശ്യമുള്ളവരിലേക്ക് നിയമ ബോധവൽക്കരണം വ്യാപിപ്പിക്കുക",
      "volunteer.why.support": "വിദ്യാർത്ഥി-നടത്തിയ, തൊഴിലാളി-കേന്ദ്രിതമായ ശ്രമത്തെ പിന്തുണയ്ക്കുക",
      "volunteer.why.expand": "മിഷനെ രാജ്യവ്യാപകമായി വ്യാപിപ്പിക്കാൻ സഹായിക്കുക",
    },
    // Punjabi translations
    pa: {
      // Homepage
      "site.title": "ਤੁਹਾਡੇ ਕਾਨੂੰਨੀ ਹੱਕ",
      "site.tagline": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
      "site.about.title": "ਲੀਗਲ ਸਾਥੀ ਬਾਰੇ",
      "site.about.description": "ਲੀਗਲ ਸਾਥੀ ਦਿਨਾਨੁਸਾਰ ਮਜ਼ਦੂਰੀ ਕਰਨ ਵਾਲਿਆਂ ਨੂੰ ਉਹਨਾਂ ਦੇ ਕਾਨੂੰਨੀ ਹੱਕਾਂ ਨੂੰ ਆਸਾਨ, ਪਹੁੰਚਯੋਗ ਢੰਗ ਨਾਲ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
      "site.feature.understand": "ਸਮਝਣ ਵਿੱਚ ਆਸਾਨ",
      "site.feature.understand.desc": "ਹੋਰ ਪਹੁੰਚ ਲਈ ਆਡੀਓ ਵਿਆਖਿਆਵਾਂ ਨਾਲ ਸਧਾਰਨ ਭਾਸ਼ਾ।",
      "site.feature.multilingual": "ਬਹੁਭਾਸ਼ੀ",
      "site.feature.multilingual.desc": "ਹੋਰ ਮਜ਼ਦੂਰਾਂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਵੱਖ-ਵੱਖ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ।",
      "site.feature.offline": "ਆਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ",
      "site.feature.offline.desc": "ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਦੇ ਬਿਨਾਂ ਜਾਣਕਾਰੀ ਤੱਕ ਪਹੁੰਚ ਕਰੋ।",
      "site.admin.access": "ਐਡਮਿਨ ਐਕਸੈਸ",
      "site.footer": "ਭਾਰਤ ਦੇ ਦਿਨਾਨੁਸਾਰ ਮਜ਼ਦੂਰਾਂ ਲਈ ❤️ ਨਾਲ ਬਣਾਇਆ ਗਿਆ",
      
      // Volunteer Form
      "volunteer.title": "ਲੀਗਲ ਸਾਥੀ ਨਾਲ ਵੋਲੰਟੀਅਰ ਬਣੋ",
      "volunteer.form.name": "ਨਾਮ",
      "volunteer.form.email": "ਈਮੇਲ",
      "volunteer.form.organization": "ਸੰਗਠਨ (ਵਿਕਲਪਿਕ)",
      "volunteer.form.help.question": "ਤੁਸੀਂ ਕਿਵੇਂ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
      "volunteer.form.help.translations": "ਅਨੁਵਾਦਾਂ ਵਿੱਚ ਮਦਦ ਕਰੋ",
      "volunteer.form.help.recordings": "ਰਿਕਾਰਡਿੰਗ ਵਿੱਚ ਯੋਗਦਾਨ ਦਿਓ",
      "volunteer.form.help.boards": "ਬੋਰਡਾਂ ਦੀ ਬੇਨਤੀ ਕਰੋ",
      "volunteer.form.help.installations": "ਇੰਸਟਾਲੇਸ਼ਨਾਂ ਨੂੰ ਟਰੈਕ ਕਰੋ",
      "volunteer.form.submit": "ਜਮ੍ਹਾਂ ਕਰੋ",
      "volunteer.form.submitting": "ਜਮ੍ਹਾਂ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
      "volunteer.form.success": "ਵੋਲੰਟੀਅਰ ਬਣਨ ਲਈ ਧੰਨਵਾਦ! ਅਸੀਂ ਜਲਦੀ ਹੀ ਸੰਪਰਕ ਕਰਾਂਗੇ।",
      "volunteer.form.error": "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      "volunteer.why.title": "ਸਾਡੇ ਨਾਲ ਕਿਉਂ ਜੁੜਨਾ ਹੈ",
      "volunteer.why.awareness": "ਜਿਨ੍ਹਾਂ ਨੂੰ ਸਭ ਤੋਂ ਵੱਧ ਜ਼ਰੂਰਤ ਹੈ ਉਨ੍ਹਾਂ ਤੱਕ ਕਾਨੂੰਨੀ ਜਾਗਰੂਕਤਾ ਫੈਲਾਓ",
      "volunteer.why.support": "ਵਿਦਿਆਰਥੀ-ਚਲਾਇਆ ਅਤੇ ਮਜ਼ਦੂਰ-ਕੇਂਦਰਿਤ ਯਤਨ ਦਾ ਸਮਰਥਨ ਕਰੋ",
      "volunteer.why.expand": "ਮਿਸ਼ਨ ਨੂੰ ਦੇਸ਼ ਭਰ ਵਿੱਚ ਫੈਲਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰੋ",
    },

  };

  // Create site translations
  await prisma.siteTranslation.deleteMany({}); // Clear existing translations
  
  for (const [langCode, texts] of Object.entries(siteTranslations)) {
    for (const [key, value] of Object.entries(texts)) {
      await prisma.siteTranslation.create({
        data: {
          languageCode: langCode,
          key,
          value,
        },
      });
    }
  }

  console.log("✅ Site translations created");

  // Create category translations (existing logic)
  for (const [langCode, translations] of Object.entries(translationsByLanguage)) {
    for (const [categoryKey, name] of Object.entries(translations)) {
      const category = categories.find((c) => c.key === categoryKey);
      if (category) {
        await prisma.categoryTranslation.upsert({
          where: {
            categoryId_languageCode: {
              categoryId: category.id,
              languageCode: langCode,
            },
          },
          update: {},
          create: {
            categoryId: category.id,
            languageCode: langCode,
            name,
          },
        });
      }
    }
  }

  console.log("✅ All category translations created");

  // Sample rights (existing logic)
  const wagesCategory = categories.find((c) => c.key === "wages-hours");
  const safetyCategory = categories.find((c) => c.key === "safety");
  const harassmentCategory = categories.find((c) => c.key === "harassment");

  if (wagesCategory && safetyCategory && harassmentCategory) {
    await Promise.all([
      prisma.right.upsert({
        where: { id: 1 },
        update: {},
        create: {
          categoryId: wagesCategory.id,
          languageCode: "hi",
          title: "न्यूनतम मजदूरी का अधिकार",
          script:
            "आपको कानून के अनुसार न्यूनतम मजदूरी पाने का पूरा अधिकार है। कोई भी मालिक आपको इससे कम पैसे नहीं दे सकता। अगर कोई कम पैसे देता है तो आप शिकायत कर सकते हैं।",
        },
      }),
      prisma.right.upsert({
        where: { id: 2 },
        update: {},
        create: {
          categoryId: safetyCategory.id,
          languageCode: "hi",
          title: "कार्यस्थल पर सुरक्षा",
          script:
            "आपके काम करने की जगह सुरक्षित होनी चाहिए। मालिक को आपको सुरक्षा के सामान देने होंगे जैसे हेलमेट, दस्ताने। अगर काम खतरनाक है तो आप मना कर सकते हैं।",
        },
      }),
      prisma.right.upsert({
        where: { id: 3 },
        update: {},
        create: {
          categoryId: harassmentCategory.id,
          languageCode: "hi",
          title: "उत्पीड़न से सुरक्षा",
          script:
            "कोई भी आपको परेशान नहीं कर सकता। अगर कोई गलत बात कहता है या छूता है तो यह गलत है। आप तुरंत शिकायत कर सकते हैं।",
        },
      }),
    ]);
  }

  console.log("✅ Sample rights created");

  // Create admin user (existing logic)
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@legalsaathi.com" },
    update: {},
    create: {
      email: "admin@legalsaathi.com",
      passwordHash: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("✅ Admin user created");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });