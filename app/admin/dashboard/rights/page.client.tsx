"use client"

import { useState } from "react"
import { RightsTable } from "@/components/rights-table";
import { AddRightForm } from "@/components/add-right-form";
import type { Right, Language, Category } from "@/lib/db"

interface RightsPageClientProps {
  rights: Right[]
  categories: Category[]
  languages: Language[]
}

export default function RightsPageClient({ rights: initialRights, categories, languages }: RightsPageClientProps) {
  const [rights, setRights] = useState(initialRights)
  const [editingRight, setEditingRight] = useState<Right | null>(null)

  const handleEdit = (right: Right) => {
    setEditingRight(right)
  }

  const handleCancelEdit = () => {
    setEditingRight(null)
  }

  return (
    <main className="min-h-screen bg-[#f2f5f8] px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* 📌 Page Heading */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#304674]">
            Rights Management
          </h1>
          <p className="text-sm md:text-base text-[#304674]/70">
            Add, edit, or manage legal rights and their translations across multiple languages.
          </p>
        </header>

        {/* ➕ Add Right Form & 📋 Rights Table */}
        <section className="space-y-12">
          <AddRightForm 
            categories={categories} 
            languages={languages} 
            right={editingRight}
            onCancelEdit={handleCancelEdit}
          />
          <RightsTable
            rights={rights}
            categories={categories}
            languages={languages}
            onEdit={handleEdit}
          />
        </section>

      </div>
    </main>
  );
} 