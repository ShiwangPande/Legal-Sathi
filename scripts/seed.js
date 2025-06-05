const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create languages
  const languages = await Promise.all([
    prisma.language.upsert({
      where: { code: "hi" },
      update: {},
      create: {
        code: "hi",
        name: "Hindi",
        nativeName: "हिंदी",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "mr" },
      update: {},
      create: {
        code: "mr",
        name: "Marathi",
        nativeName: "मराठी",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "ta" },
      update: {},
      create: {
        code: "ta",
        name: "Tamil",
        nativeName: "தமிழ்",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "te" },
      update: {},
      create: {
        code: "te",
        name: "Telugu",
        nativeName: "తెలుగు",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "bn" },
      update: {},
      create: {
        code: "bn",
        name: "Bengali",
        nativeName: "বাংলা",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "gu" },
      update: {},
      create: {
        code: "gu",
        name: "Gujarati",
        nativeName: "ગુજરાતી",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "kn" },
      update: {},
      create: {
        code: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "ml" },
      update: {},
      create: {
        code: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "pa" },
      update: {},
      create: {
        code: "pa",
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ",
        flagEmoji: "🇮🇳",
      },
    }),
    prisma.language.upsert({
      where: { code: "en" },
      update: {},
      create: {
        code: "en",
        name: "English",
        nativeName: "English",
        flagEmoji: "🇮🇳",
      },
    }),
  ])

  console.log("✅ Languages created")

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { key: "wages-hours" },
      update: {},
      create: {
        key: "wages-hours",
        icon: "💰",
      },
    }),
    prisma.category.upsert({
      where: { key: "harassment" },
      update: {},
      create: {
        key: "harassment",
        icon: "🛑",
      },
    }),
    prisma.category.upsert({
      where: { key: "maternity" },
      update: {},
      create: {
        key: "maternity",
        icon: "👶",
      },
    }),
    prisma.category.upsert({
      where: { key: "safety" },
      update: {},
      create: {
        key: "safety",
        icon: "⚠️",
      },
    }),
    prisma.category.upsert({
      where: { key: "child-labor" },
      update: {},
      create: {
        key: "child-labor",
        icon: "🚫",
      },
    }),
    prisma.category.upsert({
      where: { key: "notice-period" },
      update: {},
      create: {
        key: "notice-period",
        icon: "📜",
      },
    }),
    prisma.category.upsert({
      where: { key: "govt-schemes" },
      update: {},
      create: {
        key: "govt-schemes",
        icon: "🏛️",
      },
    }),
  ])

  console.log("✅ Categories created")

  // Create category translations for Hindi
  const hindiTranslations = [
    { categoryKey: "wages-hours", name: "मजदूरी और घंटे" },
    { categoryKey: "harassment", name: "उत्पीड़न" },
    { categoryKey: "maternity", name: "मातृत्व" },
    { categoryKey: "safety", name: "सुरक्षा" },
    { categoryKey: "child-labor", name: "बाल श्रम" },
    { categoryKey: "notice-period", name: "नोटिस अवधि" },
    { categoryKey: "govt-schemes", name: "सरकारी योजनाएं" },
  ]

  for (const translation of hindiTranslations) {
    const category = categories.find((c) => c.key === translation.categoryKey)
    if (category) {
      await prisma.categoryTranslation.upsert({
        where: {
          categoryId_languageCode: {
            categoryId: category.id,
            languageCode: "hi",
          },
        },
        update: {},
        create: {
          categoryId: category.id,
          languageCode: "hi",
          name: translation.name,
        },
      })
    }
  }

  // Create category translations for English
  const englishTranslations = [
    { categoryKey: "wages-hours", name: "Wages & Hours" },
    { categoryKey: "harassment", name: "Harassment" },
    { categoryKey: "maternity", name: "Maternity" },
    { categoryKey: "safety", name: "Safety" },
    { categoryKey: "child-labor", name: "Child Labor" },
    { categoryKey: "notice-period", name: "Notice Period" },
    { categoryKey: "govt-schemes", name: "Govt Schemes" },
  ]

  for (const translation of englishTranslations) {
    const category = categories.find((c) => c.key === translation.categoryKey)
    if (category) {
      await prisma.categoryTranslation.upsert({
        where: {
          categoryId_languageCode: {
            categoryId: category.id,
            languageCode: "en",
          },
        },
        update: {},
        create: {
          categoryId: category.id,
          languageCode: "en",
          name: translation.name,
        },
      })
    }
  }

  console.log("✅ Category translations created")

  // Create sample rights for Hindi
  const wagesCategory = categories.find((c) => c.key === "wages-hours")
  const safetyCategory = categories.find((c) => c.key === "safety")
  const harassmentCategory = categories.find((c) => c.key === "harassment")

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
          script: "कोई भी आपको परेशान नहीं कर सकता। अगर कोई गलत बात कहता है या छूता है तो यह गलत है। आप तुरंत शिकायत कर सकते हैं।",
        },
      }),
    ])
  }

  console.log("✅ Sample rights created")

  // Create admin user (password: admin123)
  const hashedPassword = await bcrypt.hash("admin123", 10)
  await prisma.adminUser.upsert({
    where: { email: "admin@legalsaathi.com" },
    update: {},
    create: {
      email: "admin@legalsaathi.com",
      passwordHash: hashedPassword,
      name: "Admin User",
    },
  })

  console.log("✅ Admin user created")
  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
