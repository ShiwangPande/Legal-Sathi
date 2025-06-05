import { PrismaClient, type Language, type Category, type CategoryTranslation, type Right } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Export types for use in components
export type {
  Language,
  Category,
  CategoryTranslation,
  Right,
  AdminUser,
} from "@prisma/client"

// Extended types with relations
export type CategoryWithTranslation = Category & {
  translations: CategoryTranslation[]
}

export type RightWithRelations = Right & {
  category: Category
  language: Language
}
