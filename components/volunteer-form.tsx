"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Megaphone, Flag, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import type { SiteTranslations } from "@/lib/translations"
import { t } from "@/lib/translations"

interface FormData {
  name: string
  email: string
  organization: string
  helpOptions: {
    translations: boolean
    recordings: boolean
    boards: boolean
    installations: boolean
  }
}

interface SubmissionState {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

interface VolunteerFormProps {
  translations: SiteTranslations
}

export default function VolunteerForm({ translations }: VolunteerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    helpOptions: {
      translations: false,
      recordings: false,
      boards: false,
      installations: false,
    },
  })

  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (option: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      helpOptions: {
        ...prev.helpOptions,
        [option]: checked,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSubmission({ status: 'loading', message: '' })
    
    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmission({
          status: 'success',
          message: data.message || t(translations, 'volunteer.form.success', 'Thank you for volunteering! We will be in touch soon.')
        })
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          organization: "",
          helpOptions: {
            translations: false,
            recordings: false,
            boards: false,
            installations: false,
          },
        })
      } else {
        setSubmission({
          status: 'error',
          message: data.error || t(translations, 'volunteer.form.error', 'Something went wrong. Please try again.')
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmission({
        status: 'error',
        message: t(translations, 'volunteer.form.network.error', 'Network error. Please check your connection and try again.')
      })
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e3c64] leading-tight">
              {t(translations, 'volunteer.title', 'Volunteer with Legal Saathi')}
            </h1>
          </div>
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
              <Image src="/logo.png" alt="Legal Saathi Logo" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submission.status === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{submission.message}</p>
          </div>
        )}
        
        {submission.status === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{submission.message}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg font-medium text-gray-800">
                    {t(translations, 'volunteer.form.name', 'Name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12 border-2 border-blue-200 focus:border-[#1e3c64] rounded-lg"
                    required
                    disabled={submission.status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-medium text-gray-800">
                    {t(translations, 'volunteer.form.email', 'Email')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 border-2 border-blue-200 focus:border-[#1e3c64] rounded-lg"
                    required
                    disabled={submission.status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-lg font-medium text-gray-800">
                    {t(translations, 'volunteer.form.organization', 'Organization')} <span className="text-gray-500">({t(translations, 'common.optional', 'optional')})</span>
                  </Label>
                  <Input
                    id="organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                    className="h-12 border-2 border-blue-200 focus:border-[#1e3c64] rounded-lg"
                    disabled={submission.status === 'loading'}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-800">
                    {t(translations, 'volunteer.form.help.question', 'How do you want to help?')}
                  </Label>
                  <div className="space-y-3">
                    {[
                      { 
                        id: "translations", 
                        label: t(translations, 'volunteer.form.help.translations', 'Help with translations')
                      },
                      { 
                        id: "recordings", 
                        label: t(translations, 'volunteer.form.help.recordings', 'Contribute recordings')
                      },
                      { 
                        id: "boards", 
                        label: t(translations, 'volunteer.form.help.boards', 'Request boards')
                      },
                      { 
                        id: "installations", 
                        label: t(translations, 'volunteer.form.help.installations', 'Track installations')
                      },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={option.id}
                          checked={formData.helpOptions[option.id as keyof typeof formData.helpOptions]}
                          onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                          className="w-5 h-5 border-2 border-blue-300"
                          disabled={submission.status === 'loading'}
                        />
                        <Label htmlFor={option.id} className="text-base text-gray-700 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto px-12 py-3 bg-[#304674] hover:bg-[#1e3c64] text-white font-semibold rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submission.status === 'loading'}
                  >
                    {submission.status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t(translations, 'volunteer.form.submitting', 'Submitting...')}
                      </>
                    ) : (
                      t(translations, 'volunteer.form.submit', 'Submit')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Why Join Us Section */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3c64]">
              {t(translations, 'volunteer.why.title', 'Why join us')}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#304674] rounded-full flex items-center justify-center mt-1">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <p className="text-lg text-[#1e3c64] leading-relaxed">
                  {t(translations, 'volunteer.why.awareness', 'Spread legal awareness to those who need it most')}
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#304674] rounded-full flex items-center justify-center mt-1">
                  <Megaphone className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg text-[#1e3c64] leading-relaxed">
                  {t(translations, 'volunteer.why.support', 'Support an initiative that is student-driven and worker-focused')}
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#304674] rounded-full flex items-center justify-center mt-1">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg text-[#1e3c64] leading-relaxed">
                  {t(translations, 'volunteer.why.expand', 'Help expand the mission nationwide')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}