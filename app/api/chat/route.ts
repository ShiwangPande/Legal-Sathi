import { NextResponse } from 'next/server';

// Predefined responses for common legal questions in different languages
const LEGAL_RESPONSES = {
  en: {
    "minimum wage": "According to the Minimum Wages Act, 1948, minimum wages vary by state and skill level. For unskilled workers, it typically ranges from ₹300-₹500 per day. Please check your state's official minimum wage notification for exact rates.",
    "working hours": "Under the Factories Act, 1948, the maximum working hours are 9 hours per day and 48 hours per week. Overtime work is allowed but must be paid at double the normal rate.",
    "leave": "Workers are entitled to:\n- Weekly rest day (usually Sunday)\n- National holidays\n- Annual leave (typically 15 days per year)\n- Sick leave (usually 15 days per year)\n- Maternity leave (26 weeks for women)",
    "safety": "Employers must provide:\n- Safe working conditions\n- Protective equipment\n- First aid facilities\n- Clean drinking water\n- Proper ventilation and lighting",
    "harassment": "Workplace harassment is illegal under the Sexual Harassment of Women at Workplace Act, 2013. You can:\n1. File a complaint with your employer's Internal Committee\n2. Contact the Local Complaints Committee\n3. File a police complaint\n4. Seek legal aid from government legal services",
    "unpaid wages": "If your wages are unpaid:\n1. Keep all employment records\n2. File a complaint with the Labor Commissioner\n3. Contact the Wage Inspector\n4. You can also approach the Labor Court",
    "termination": "For termination:\n- Notice period must be given\n- Reason must be provided\n- Final settlement within 2 days\n- No discrimination allowed",
    "contract": "Always ensure your employment contract includes:\n- Job description\n- Working hours\n- Wages and payment schedule\n- Leave entitlements\n- Termination conditions",
    "benefits": "Common benefits include:\n- Provident Fund (if applicable)\n- ESI (if applicable)\n- Gratuity (after 5 years)\n- Bonus (if applicable)",
    "rights": "Your basic rights include:\n- Fair wages\n- Safe working conditions\n- Regular working hours\n- Leave entitlements\n- Protection from harassment\n- Social security benefits"
  },
  hi: {
    "minimum wage": "न्यूनतम मजदूरी अधिनियम, 1948 के अनुसार, न्यूनतम मजदूरी राज्य और कौशल स्तर के अनुसार अलग-अलग होती है। अकुशल श्रमिकों के लिए, यह आमतौर पर ₹300-₹500 प्रति दिन होती है। सटीक दरों के लिए अपने राज्य की आधिकारिक न्यूनतम मजदूरी अधिसूचना देखें।",
    "working hours": "फैक्ट्री अधिनियम, 1948 के तहत, अधिकतम कार्य घंटे प्रति दिन 9 घंटे और प्रति सप्ताह 48 घंटे हैं। ओवरटाइम काम की अनुमति है लेकिन सामान्य दर से दोगुना भुगतान किया जाना चाहिए।",
    "leave": "श्रमिकों को निम्नलिखित अवकाश का अधिकार है:\n- साप्ताहिक आराम का दिन (आमतौर पर रविवार)\n- राष्ट्रीय अवकाश\n- वार्षिक अवकाश (आमतौर पर प्रति वर्ष 15 दिन)\n- बीमारी अवकाश (आमतौर पर प्रति वर्ष 15 दिन)\n- मातृत्व अवकाश (महिलाओं के लिए 26 सप्ताह)",
    "safety": "नियोक्ताओं को प्रदान करना होगा:\n- सुरक्षित कार्य परिस्थितियां\n- सुरक्षात्मक उपकरण\n- प्राथमिक चिकित्सा सुविधाएं\n- स्वच्छ पेयजल\n- उचित वेंटिलेशन और प्रकाश व्यवस्था",
    "harassment": "कार्यस्थल पर उत्पीड़न महिलाओं के कार्यस्थल पर यौन उत्पीड़न अधिनियम, 2013 के तहत अवैध है। आप:\n1. अपने नियोक्ता की आंतरिक समिति में शिकायत दर्ज कर सकते हैं\n2. स्थानीय शिकायत समिति से संपर्क कर सकते हैं\n3. पुलिस में शिकायत दर्ज कर सकते हैं\n4. सरकारी कानूनी सेवाओं से सहायता ले सकते हैं",
    "unpaid wages": "यदि आपकी मजदूरी का भुगतान नहीं किया गया है:\n1. सभी रोजगार रिकॉर्ड रखें\n2. श्रम आयुक्त के पास शिकायत दर्ज करें\n3. मजदूरी निरीक्षक से संपर्क करें\n4. आप श्रम न्यायालय का भी रुख कर सकते हैं",
    "termination": "नौकरी से निकाले जाने पर:\n- नोटिस अवधि दी जानी चाहिए\n- कारण बताया जाना चाहिए\n- 2 दिनों के भीतर अंतिम निपटान\n- भेदभाव की अनुमति नहीं है",
    "contract": "सुनिश्चित करें कि आपका रोजगार अनुबंध शामिल करता है:\n- नौकरी का विवरण\n- कार्य घंटे\n- मजदूरी और भुगतान कार्यक्रम\n- अवकाश अधिकार\n- समाप्ति की शर्तें",
    "benefits": "सामान्य लाभों में शामिल हैं:\n- भविष्य निधि (यदि लागू हो)\n- ईएसआई (यदि लागू हो)\n- ग्रेच्युटी (5 वर्षों के बाद)\n- बोनस (यदि लागू हो)",
    "rights": "आपके बुनियादी अधिकारों में शामिल हैं:\n- उचित मजदूरी\n- सुरक्षित कार्य परिस्थितियां\n- नियमित कार्य घंटे\n- अवकाश अधिकार\n- उत्पीड़न से सुरक्षा\n- सामाजिक सुरक्षा लाभ"
  }
  // Add other languages here
};

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    if (!language || !LEGAL_RESPONSES[language as keyof typeof LEGAL_RESPONSES]) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // Convert message to lowercase for matching
    const lowerMessage = message.toLowerCase();
    
    // Get responses for the selected language
    const languageResponses = LEGAL_RESPONSES[language as keyof typeof LEGAL_RESPONSES];
    
    // Find matching response
    let response = language === 'en' 
      ? "I understand you're asking about your legal rights. While I can provide general information, please consult a qualified lawyer for specific legal advice. "
      : "मैं समझता हूं कि आप अपने कानूनी अधिकारों के बारे में पूछ रहे हैं। जबकि मैं सामान्य जानकारी प्रदान कर सकता हूं, कृपया विशिष्ट कानूनी सलाह के लिए एक योग्य वकील से परामर्श करें। ";
    
    // Check for keywords in the message
    for (const [key, value] of Object.entries(languageResponses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // If no specific match found, provide general guidance
    if (response.includes("I understand") || response.includes("मैं समझता हूं")) {
      response += language === 'en'
        ? "You can ask me about:\n- Minimum wages\n- Working hours\n- Leave entitlements\n- Workplace safety\n- Harassment\n- Unpaid wages\n- Termination\n- Employment contracts\n- Benefits\n- Basic rights"
        : "आप मुझसे पूछ सकते हैं:\n- न्यूनतम मजदूरी\n- कार्य घंटे\n- अवकाश अधिकार\n- कार्यस्थल सुरक्षा\n- उत्पीड़न\n- अवैतनिक मजदूरी\n- नौकरी से निकालना\n- रोजगार अनुबंध\n- लाभ\n- बुनियादी अधिकार";
    }

    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        error: "I apologize, but I'm having trouble processing your request. Please try again later.",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 