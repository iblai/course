"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ToolField {
  id: string
  label: string
  type: "select" | "textarea" | "text"
  required: boolean
  options?: string[]
  defaultValue?: string
  placeholder?: string
}

interface ToolData {
  name: string
  description: string
  icon: string
  fields: ToolField[]
}

interface ToolCustomizationFlowProps {
  toolData: ToolData
  toolSlug: string
}

export function ToolCustomizationFlow({ toolData, toolSlug }: ToolCustomizationFlowProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    toolData.fields.forEach((field) => {
      if (field.defaultValue) {
        initial[field.id] = field.defaultValue
      }
    })
    return initial
  })

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - could send to API or navigate with data
    console.log("Form submitted:", formData)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{toolData.name}</h1>
              <p className="text-sm text-gray-500">{toolData.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {toolData.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.type === "select" && field.options && (
                <Select
                  value={formData[field.id] || field.defaultValue || ""}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase().replace(":", "")}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-[100px] bg-white"
                  required={field.required}
                />
              )}

              {field.type === "text" && (
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white"
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}
              className="text-white"
            >
              Generate
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
