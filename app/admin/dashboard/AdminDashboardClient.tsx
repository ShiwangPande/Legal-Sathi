"use client"

import { useState } from "react"
import { AddRightForm } from "@/components/add-right-form"
import { RightsTable } from "@/components/rights-table"
import type { Language, Category, Right } from "@/lib/db"

interface AdminDashboardClientProps {
  languages: Language[];
  categories: Category[];
  rights: Right[];
}

export default function AdminDashboardClient({ languages, categories, rights }: AdminDashboardClientProps) {
  const [editingRight, setEditingRight] = useState<Right | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add/Edit Right Form */}
      <div className="lg:col-span-1">
        <AddRightForm
          languages={languages}
          categories={categories}
          right={editingRight}
          onCancelEdit={() => setEditingRight(null)}
        />
      </div>
      {/* Rights Table */}
      <div className="lg:col-span-2">
        <RightsTable
          rights={rights}
          languages={languages}
          categories={categories}
          onEdit={setEditingRight}
        />
      </div>
    </div>
  )
} 