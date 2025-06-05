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
      harassment: "தொந்தரவு",
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

  // Sample rights
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

  // Create admin user
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
