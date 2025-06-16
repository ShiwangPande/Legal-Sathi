"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import type { Language, Category } from "@/lib/db"
import { uploadFiles } from "@/lib/uploadthing-client"

interface AddRightFormProps {
  languages: Language[]
  categories: Category[]
  right?: any
  onCancelEdit?: () => void
}

export function AddRightForm({
  languages,
  categories,
  right,
  onCancelEdit
}: AddRightFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    languageCode: right?.languageCode || "",
    categoryId: right?.categoryId?.toString() || "",
    title: right?.title || "",
    script: right?.script || "",
    audioFile: null as File | null,
    audioUrl: right?.audioUrl || "",
    learnMoreUrl: right?.learnMoreUrl || ""
  })

  const router = useRouter()

  useEffect(() => {
    if (right) {
      setFormData({
        languageCode: right.languageCode || "",
        categoryId: right.categoryId?.toString() || "",
        title: right.title || "",
        script: right.script || "",
        audioFile: null,
        audioUrl: right.audioUrl || "",
        learnMoreUrl: right.learnMoreUrl || ""
      })
    } else {
      setFormData((f) => ({ ...f, audioUrl: "", audioFile: null }))
    }
  }, [right])

  const handleRemoveAudio = () => {
    setFormData((f) => ({ ...f, audioFile: null, audioUrl: "" }))
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mp4']
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid audio file (MP3, WAV, OGG, MP4)")
        e.target.value = ""
        return
      }
  
      // Check file size (32MB = 33,554,432 bytes)
      const maxSize = 32 * 1024 * 1024
      if (file.size > maxSize) {
        alert("File size must be less than 32MB")
        e.target.value = ""
        return
      }
  
      setFormData({ ...formData, audioFile: file })
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let audioUrl = formData.audioUrl || ""

      if (formData.audioFile) {
        const uploadResult = await uploadFiles("audioUploader", {
          files: [formData.audioFile]
        })
        audioUrl = uploadResult[0].url || ""
      }

      const payload = {
        languageCode: formData.languageCode,
        categoryId: formData.categoryId,
        title: formData.title,
        script: formData.script,
        audioUrl,
        learnMoreUrl: formData.learnMoreUrl
      }

      const response = await fetch(
        right ? `/api/admin/rights/${right.id}` : "/api/admin/rights",
        {
          method: right ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) throw new Error()

      setFormData({
        languageCode: "",
        categoryId: "",
        title: "",
        script: "",
        audioFile: null,
        audioUrl: "",
        learnMoreUrl: ""
      })

      router.refresh()
      if (onCancelEdit) onCancelEdit()
    } catch (error) {
      console.error(error)
      alert(right ? "Failed to update right." : "Failed to add right.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white border border-gray-300 shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="text-black text-xl font-bold">
          {right ? "Edit Right" : "Add New Right"}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          {right
            ? "Edit the legal information below"
            : "Enter legal information to be shown to workers"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Language Selector */}
          <Select
            value={formData.languageCode}
            onValueChange={(value) =>
              setFormData({ ...formData, languageCode: value })
            }
          >
            <SelectTrigger className="bg-white text-black border border-gray-300">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {languages.map((lang) => (
                <SelectItem
                  key={lang.code}
                  value={lang.code}
                  className="hover:bg-gray-100"
                >
                  {lang.flagEmoji} {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Selector */}
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger className="bg-white text-black border border-gray-300">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  className="hover:bg-gray-100"
                >
                  {category.icon} {category.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Title Input */}
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="bg-white text-black border border-gray-300 placeholder:text-gray-500"
          />

          {/* Script Input */}
          <Textarea
            placeholder="Script/Content"
            value={formData.script}
            onChange={(e) =>
              setFormData({ ...formData, script: e.target.value })
            }
            rows={6}
            required
            className="bg-white text-black border border-gray-300 placeholder:text-gray-500"
          />

          {/* Audio Upload Preview or Upload */}
          {(formData.audioFile || formData.audioUrl) ? (
            <div className="relative bg-gray-50 border border-gray-300 p-3 rounded-md">
              <div className="flex flex-col">
                <span className="text-xs text-gray-800 mb-1">Audio Preview</span>
                {formData.audioFile ? (
                  <span className="text-sm text-black">{formData.audioFile.name}</span>
                ) : (
                  <audio controls src={formData.audioUrl} className="w-full mt-1 rounded" />
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleRemoveAudio}
                className="absolute top-1 right-2 text-black text-lg"
              >
                ×
              </Button>
            </div>
          ) : (
            <>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="bg-white text-black border border-gray-300 file:text-black"
              />
              <p className="text-sm text-gray-600">Optional: Upload audio file (MP3, WAV)</p>
            </>
          )}

          {/* Learn More URL */}
          <Input
            type="url"
            placeholder="Learn More URL (optional)"
            value={formData.learnMoreUrl}
            onChange={(e) =>
              setFormData({ ...formData, learnMoreUrl: e.target.value })
            }
            className="bg-white text-black border border-gray-300 placeholder:text-gray-500"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-gray-800 font-medium"
          >
            {isLoading
              ? right
                ? "Saving..."
                : "Adding..."
              : right
                ? "Save Changes"
                : "Add Right"}
          </Button>

          {/* Cancel Button */}
          {right && onCancelEdit && (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onCancelEdit}
              className="w-full mt-2 border-black text-black hover:bg-gray-100"
            >
              Cancel
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
