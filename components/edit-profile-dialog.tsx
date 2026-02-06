"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"

interface Position {
  title: string
  company?: string
  period?: string
}

interface Education {
  institution: string
  degree?: string
  period?: string
}

interface ProfileInfo {
  positions: Position[]
  education: Education[]
}

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (info: ProfileInfo) => void
  initialInfo?: ProfileInfo
}

export function EditProfileDialog({ open, onOpenChange, onSave, initialInfo }: EditProfileDialogProps) {
  const [positions, setPositions] = useState<Position[]>(initialInfo?.positions || [{ title: "Operations Associate" }])
  const [education, setEducation] = useState<Education[]>(
    initialInfo?.education || [{ institution: "Boston University" }],
  )

  // Reset state when dialog opens with initialInfo
  useEffect(() => {
    if (open && initialInfo) {
      setPositions(initialInfo.positions || [{ title: "Operations Associate" }])
      setEducation(initialInfo.education || [{ institution: "Boston University" }])
    }
  }, [open, initialInfo])

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleAddPosition = () => {
    setPositions([...positions, { title: "" }])
  }

  const handleAddEducation = () => {
    setEducation([...education, { institution: "" }])
  }

  const handlePositionChange = (index: number, value: string) => {
    const updatedPositions = [...positions]
    updatedPositions[index].title = value
    setPositions(updatedPositions)
  }

  const handleEducationChange = (index: number, value: string) => {
    const updatedEducation = [...education]
    updatedEducation[index].institution = value
    setEducation(updatedEducation)
  }

  const handleSave = () => {
    onSave({ positions, education })
    onOpenChange(false)
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
          <h3 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
            Edit Profile Information
          </h3>
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
            {/* Current Position Section */}
            <div className="space-y-3">
              <h3 className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                Current Position
              </h3>
              {positions.map((position, index) => (
                <input
                  key={index}
                  type="text"
                  value={position.title}
                  onChange={(e) => handlePositionChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  style={{ color: "var(--text-primary)" }}
                  placeholder="Position title"
                />
              ))}
              <button
                onClick={handleAddPosition}
                className="flex items-center gap-2 font-medium text-sm transition-colors text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add new position
              </button>
            </div>

            {/* Education Section */}
            <div className="space-y-3">
              <h3 className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                Education
              </h3>
              {education.map((edu, index) => (
                <input
                  key={index}
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  style={{ color: "var(--text-primary)" }}
                  placeholder="Institution name"
                />
              ))}
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-2 font-medium text-sm transition-colors text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add new education
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Footer with buttons */}
        <div className="p-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3 bg-gradient-to-r from-blue-50 to-blue-100 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-md text-sm font-medium transition-all shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
