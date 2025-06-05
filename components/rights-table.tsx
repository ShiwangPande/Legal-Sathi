"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Right, Language, Category } from "@/lib/db"

interface RightsTableProps {
  rights: Right[]
  languages: Language[]
  categories: Category[]
}

export function RightsTable({ rights, languages, categories }: RightsTableProps) {
  const [filterLanguage, setFilterLanguage] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredRights = rights.filter((right) => {
    const languageMatch = filterLanguage === "all" || right.languageCode === filterLanguage
    const categoryMatch = filterCategory === "all" || right.categoryId.toString() === filterCategory
    return languageMatch && categoryMatch
  })

  const deleteRight = async (id: number) => {
    if (!confirm("Are you sure you want to delete this right?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/rights/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.reload()
      } else {
        throw new Error("Failed to delete right")
      }
    } catch (error) {
      console.error("Error deleting right:", error)
      alert("Failed to delete right. Please try again.")
    }
  }

  return (
  <Card className="bg-[#d8e1e8] border border-[#b2cbde] rounded-md shadow-md ">
  <CardHeader className="pb-4">
    <CardTitle className="text-[#304674] text-xl font-semibold">
      Manage Rights
    </CardTitle>
    <CardDescription className="text-[#304674] text-sm">
      View and manage existing legal rights information
    </CardDescription>

    {/* Filters */}
    <div className="flex gap-4 pt-4">
      <Select value={filterLanguage} onValueChange={setFilterLanguage}>
        <SelectTrigger
          className="w-48 border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder:text-[#b2cbde]"
          aria-label="Filter by Language"
        >
          <SelectValue placeholder="Filter by Language" />
        </SelectTrigger>
        <SelectContent className="bg-[#c6d3e3] text-[#304674]">
          <SelectItem
            value="all"
            className="hover:bg-[#98bad5]"
          >
            All Languages
          </SelectItem>
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="hover:bg-[#98bad5]"
            >
              {lang.flagEmoji} {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger
          className="w-48 border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder:text-[#b2cbde]"
          aria-label="Filter by Category"
        >
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent className="bg-[#c6d3e3] text-[#304674]">
          <SelectItem
            value="all"
            className="hover:bg-[#98bad5]"
          >
            All Categories
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
              className="hover:bg-[#98bad5]"
            >
              {category.icon} {category.key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </CardHeader>

  <CardContent className="max-h-[80vh] overflow-y-auto scroll-smooth ">
    <div className="space-y-4">
      {filteredRights.length === 0 ? (
        <p className="text-[#304674] text-center py-8 opacity-70">
          No rights found matching the current filters.
        </p>
      ) : (
        filteredRights.map((right: any) => (
          <div
            key={right.id}
            className="border border-[#98bad5] rounded-lg p-4 bg-[#c6d3e3]"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#304674]">
                  {right.title}
                </h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-[#b2cbde] text-[#304674]">
                    {right.language_name}
                  </Badge>
                  <Badge variant="outline" className="border-[#98bad5] text-[#304674]">
                    {right.category_icon} {right.category_key}
                  </Badge>
                  {right.audio_url && (
                    <Badge variant="default" className="bg-[#98bad5] text-[#304674]">
                      🎵 Audio
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteRight(right.id)}
                className="bg-[#304674] hover:bg-[#182a49] text-white"
              >
                Delete
              </Button>
            </div>
            <p className="text-[#304674] text-sm line-clamp-3">{right.script}</p>
            {right.learn_more_url && (
              <a
                href={right.learn_more_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#304674] hover:underline text-sm mt-2 inline-block"
              >
                Learn More →
              </a>
            )}
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>

  )
}
