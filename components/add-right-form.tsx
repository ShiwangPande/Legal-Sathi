"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Language, Category } from "@/lib/db"
import { uploadFiles } from "@/lib/uploadthing-client"

interface AddRightFormProps {
  languages: Language[]
  categories: Category[]
}

export function AddRightForm({ languages, categories }: AddRightFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    languageCode: "",
    categoryId: "",
    title: "",
    script: "",
    audioFile: null as File | null,
    learnMoreUrl: "",
  })
  const router = useRouter()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
      let audioUrl = ""

    // If user selected an audio file, upload it first
    if (formData.audioFile) {
      const uploadResult = await uploadFiles("audioUploader", { files: [formData.audioFile] })
      // uploadResult usually contains info about uploaded files
      // Adjust this based on your UploadThing API
      audioUrl = uploadResult[0].url || ""
    }
    const payload = {
      languageCode: formData.languageCode,
      categoryId: formData.categoryId,
      title: formData.title,
      script: formData.script,
      audioUrl, // if no audio file uploaded yet
      learnMoreUrl: formData.learnMoreUrl,
    }

    const response = await fetch("/api/admin/rights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error("Failed to add right")

    setFormData({
      languageCode: "",
      categoryId: "",
      title: "",
      script: "",
      audioFile: null,
      learnMoreUrl: "",
    })
    router.refresh()
  } catch (error) {
    console.error("Error adding right:", error)
    alert("Failed to add right. Please try again.")
  } finally {
    setIsLoading(false)
  }
}


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Right</CardTitle>
        <CardDescription>Add legal rights information for workers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select
              value={formData.languageCode}
              onValueChange={(value) => setFormData({ ...formData, languageCode: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                {lang.flagEmoji} {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon} {category.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Script/Content"
              value={formData.script}
              onChange={(e) => setFormData({ ...formData, script: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setFormData({ ...formData, audioFile: e.target.files?.[0] || null })}
            />
            <p className="text-sm text-gray-500 mt-1">Optional: Upload audio file (MP3 recommended)</p>
          </div>

          <div>
            <Input
              placeholder="Learn More URL (optional)"
              value={formData.learnMoreUrl}
              onChange={(e) => setFormData({ ...formData, learnMoreUrl: e.target.value })}
              type="url"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading || !formData.languageCode || !formData.categoryId || !formData.title || !formData.script
            }
          >
            {isLoading ? "Adding..." : "Add Right"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
