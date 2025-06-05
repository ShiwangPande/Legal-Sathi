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
    const languageMatch = filterLanguage === "all" || right.language_code === filterLanguage
    const categoryMatch = filterCategory === "all" || right.category_id.toString() === filterCategory
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
    <Card>
      <CardHeader>
        <CardTitle>Manage Rights</CardTitle>
        <CardDescription>View and manage existing legal rights information</CardDescription>

        {/* Filters */}
        <div className="flex gap-4 pt-4">
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag_emoji} {lang.native_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.icon} {category.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRights.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No rights found matching the current filters.</p>
          ) : (
            filteredRights.map((right: any) => (
              <div key={right.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{right.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{right.language_name}</Badge>
                      <Badge variant="outline">
                        {right.category_icon} {right.category_key}
                      </Badge>
                      {right.audio_url && <Badge variant="default">🎵 Audio</Badge>}
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteRight(right.id)}>
                    Delete
                  </Button>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{right.script}</p>
                {right.learn_more_url && (
                  <a
                    href={right.learn_more_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
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
