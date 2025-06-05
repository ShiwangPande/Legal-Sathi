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
<Card
  className="bg-[#d8e1e8] border border-[#b2cbde] rounded-md shadow-md"
>
  <CardHeader className="mb-4">
    <CardTitle className="text-[#304674] text-xl font-semibold">
      Add New Right
    </CardTitle>
    <CardDescription className="text-[#304674] text-sm">
      Enter legal information to be shown to workers
    </CardDescription>
  </CardHeader>

  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language */}
      <Select
        value={formData.languageCode}
        onValueChange={(value) =>
          setFormData({ ...formData, languageCode: value })
        }
      >
        <SelectTrigger
          className="border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder:text-[#b2cbde]"
          aria-label="Select Language"
        >
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="bg-[#c6d3e3] text-[#304674]">
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

      {/* Category */}
      <Select
        value={formData.categoryId}
        onValueChange={(value) =>
          setFormData({ ...formData, categoryId: value })
        }
      >
        <SelectTrigger
          className="border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder:text-[#b2cbde]"
          aria-label="Select Category"
        >
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent className="bg-[#c6d3e3] text-[#304674]">
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

      {/* Title */}
      <Input
        placeholder="Title"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        required
     
        className="border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder-text-[#b2cbde]"
      />

      {/* Script */}
      <Textarea
        placeholder="Script/Content"
        value={formData.script}
        onChange={(e) =>
          setFormData({ ...formData, script: e.target.value })
        }
        rows={6}
        required
        className="border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder-text-[#b2cbde]"
      />

      {/* Audio Upload */}
      <Input
        type="file"
        accept="audio/*"
        onChange={(e) =>
          setFormData({ ...formData, audioFile: e.target.files?.[0] || null })
        }
        className="border border-[#98bad5] bg-[#c6d3e3] text-[#304674]"
      />
      <p className="text-sm text-[#304674] opacity-80">
        Optional: Upload audio file (MP3, WAV)
      </p>

      {/* Learn More URL */}
      <Input
        placeholder="Learn More URL (optional)"
        type="url"
        value={formData.learnMoreUrl}
        onChange={(e) =>
          setFormData({ ...formData, learnMoreUrl: e.target.value })
        }
        className="border border-[#98bad5] bg-[#c6d3e3] text-[#304674] placeholder-text-[#b2cbde]"
      />

      <Button
        type="submit"
        className="w-full bg-[#304674] hover:bg-[#182a49] text-white font-semibold"
        disabled={
          isLoading ||
          !formData.languageCode ||
          !formData.categoryId ||
          !formData.title ||
          !formData.script
        }
      >
        {isLoading ? "Adding..." : "Add Right"}
      </Button>
    </form>
  </CardContent>
</Card>

  )
}
