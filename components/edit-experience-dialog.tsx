"use client"

import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"

interface Experience {
  id?: string
  title: string
  company: string
  location?: string
  startMonth: string
  startYear: string
  endMonth?: string
  endYear?: string
  current: boolean
  description?: string
}

interface EditExperienceDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  experience?: Experience | null
  onSave: (experience: Experience) => void
  onDelete: (id: string) => void
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

export function EditExperienceDialog({ open, onOpenChange, onClose, experience, onSave, onDelete }: EditExperienceDialogProps) {
  const [formData, setFormData] = useState<Experience>({
    title: "",
    company: "",
    location: "",
    startMonth: "January",
    startYear: currentYear.toString(),
    endMonth: "January",
    endYear: currentYear.toString(),
    current: false,
    description: "",
  })

  // Reset form when dialog opens with new experience data
  useEffect(() => {
    if (open && experience) {
      setFormData({
        id: experience.id,
        title: experience.title || "",
        company: experience.company || "",
        location: experience.location || "",
        startMonth: experience.startMonth || "January",
        startYear: experience.startYear || currentYear.toString(),
        endMonth: experience.endMonth || "January",
        endYear: experience.endYear || currentYear.toString(),
        current: experience.current || false,
        description: experience.description || "",
      })
    }
  }, [open, experience])

  const handleInputChange = (field: keyof Experience, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose?.()
    onOpenChange?.(false)
  }

  const handleDelete = () => {
    if (formData.id) {
      onDelete(formData.id)
      onClose?.()
      onOpenChange?.(false)
    }
  }

  const handleCancel = () => {
    onClose?.()
    onOpenChange?.(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div 
        className="bg-white rounded-lg max-w-lg w-full flex flex-col h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh]"
        style={{ maxHeight: "-webkit-fill-available" }}
      >
        {/* Fixed Header */}
        <div className="p-4 border-b rounded-t-lg border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-800">{experience?.id ? "Edit Experience" : "Add Experience"}</h3>
          <button
            onClick={handleCancel}
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 transition-colors bg-blue-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6" style={{ WebkitOverflowScrolling: "touch" }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-800">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-800">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                placeholder="e.g. Google"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-800">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-800">Start Date *</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.startMonth}
                  onChange={(e) => handleInputChange("startMonth", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.startYear}
                  onChange={(e) => handleInputChange("startYear", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Position Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => handleInputChange("current", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-800">
                I currently work here
              </label>
            </div>

            {/* End Date */}
            {!formData.current && (
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2 text-gray-800">End Date</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.endMonth}
                    onChange={(e) => handleInputChange("endMonth", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.endYear}
                    onChange={(e) => handleInputChange("endYear", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-gray-800">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                placeholder="Describe your role and achievements..."
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer with buttons */}
        <div className="p-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3 bg-gradient-to-r from-blue-50 to-blue-100 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          {experience?.id && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-500 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!formData.title || !formData.company}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-md text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
