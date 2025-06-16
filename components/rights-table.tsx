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
  onEdit?: (right: any) => void
}

export function RightsTable({ rights, languages, categories, onEdit }: RightsTableProps) {
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
    <Card className="bg-white border border-gray-300 rounded-md shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-black text-xl font-semibold">Manage Rights</CardTitle>
        <CardDescription className="text-gray-700 text-sm">
          View and manage existing legal rights information
        </CardDescription>

        {/* Filters */}
        <div className="flex gap-4 pt-4">
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-48 border border-gray-400 bg-white text-black placeholder:text-gray-500" aria-label="Filter by Language">
              <SelectValue placeholder="Filter by Language" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="all" className="hover:bg-gray-200">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="hover:bg-gray-200">
                  {lang.flagEmoji} {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 border border-gray-400 bg-white text-black placeholder:text-gray-500" aria-label="Filter by Category">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="all" className="hover:bg-gray-200">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()} className="hover:bg-gray-200">
                  {category.icon} {category.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="max-h-[80vh] overflow-y-auto scroll-smooth">
        <div className="space-y-4">
          {filteredRights.length === 0 ? (
            <p className="text-gray-600 text-center py-8 opacity-70">
              No rights found matching the current filters.
            </p>
          ) : (
            filteredRights.map((right: any) => (
              <div key={right.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-black">{right.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="bg-gray-200 text-black">
                        {right.language_name}
                      </Badge>
                      <Badge variant="outline" className="border-gray-400 text-black">
                        {right.category_icon} {right.category_key}
                      </Badge>
                      {right.audio_url && (
                        <Badge variant="default" className="bg-gray-300 text-black">
                          🎵 Audio
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit && onEdit(right)}
                      className="bg-gray-200 text-black border border-gray-600"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRight(right.id)}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-gray-800 text-sm line-clamp-3">{right.script}</p>
                {right.learn_more_url && (
                  <a
                    href={right.learn_more_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline text-sm mt-2 inline-block"
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
