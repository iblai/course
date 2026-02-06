"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

const availableCourses = [
  { id: 1, title: "Leadership Course", image: "/images/course-1.png" },
  { id: 2, title: "Project Management Course", image: "/images/course-2.png" },
  { id: 3, title: "Cybersecurity Course", image: "/images/course-3.png" },
  { id: 4, title: "Data Analytics Course", image: "/images/course-4.png" },
  { id: 5, title: "Communication Skills", image: "/images/leadership-development.png" },
  { id: 6, title: "Team Building", image: "/images/teamwork-growth.png" },
  { id: 7, title: "Strategic Planning", image: "/images/strategic-leadership.png" },
  { id: 8, title: "Innovation Management", image: "/images/coaching-culture.png" },
]

interface CreatePathwayDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  onSave?: (pathwayData: { name: string; courses: any[] }) => void
}

const CreatePathwayDialog = ({ open, onOpenChange, onClose, onSave }: CreatePathwayDialogProps) => {
  const [pathwayName, setPathwayName] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])

  const handlePathwayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPathwayName(event.target.value)
  }

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const handleCreatePathway = () => {
    if (pathwayName.trim()) {
      const selectedCourseData = availableCourses.filter((course) => selectedCourses.includes(course.id))
      onSave?.({ name: pathwayName, courses: selectedCourseData })
      setPathwayName("")
      setSelectedCourses([])
      onClose?.()
      onOpenChange?.(false)
    }
  }

  const handleCloseDialog = () => {
    setPathwayName("")
    setSelectedCourses([])
    onClose?.()
    onOpenChange?.(false)
  }

  const handleClose = () => {
    handleCloseDialog()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} onClick={handleClose} />
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] flex flex-col"
        style={{ 
          backgroundColor: "var(--background)",
          maxHeight: "-webkit-fill-available",
        }}
      >
        {/* Dialog Header - Fixed to top */}
        <div
          className="p-4 border-b rounded-t-lg flex justify-between items-center flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          <h3 className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            Create New Pathway
          </h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dialog Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-4 sm:px-6 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="mb-6">
            <label htmlFor="pathway-name" className="block button-text mb-2" style={{ color: "var(--text-primary)" }}>
              Pathway Name
            </label>
            <input
              id="pathway-name"
              type="text"
              className="w-full px-3 py-2 border rounded-md button-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
              }}
              value={pathwayName}
              onChange={handlePathwayNameChange}
              placeholder="Enter pathway name"
              autoFocus
            />
          </div>

          <div>
            <h3 className="button-text mb-4" style={{ color: "var(--text-primary)" }}>
              Select Courses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className={`rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedCourses.includes(course.id) ? "ring-2 ring-blue-500" : "hover:shadow-md"
                  }`}
                  style={{
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--card-bg)",
                  }}
                  onClick={() => handleCourseSelect(course.id)}
                >
                  <div className="relative h-24 w-full overflow-hidden">
                    <Image
                      src={course.image || "/placeholder.svg?height=96&width=200&query=course"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {selectedCourses.includes(course.id) && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center opacity-40">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="button-text font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {course.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dialog Actions - Fixed to bottom */}
        <div
          className="p-4 rounded-b-lg border-t flex justify-end gap-3 flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-md text-sm font-medium hover:opacity-80 transition-colors shadow-sm"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePathway}
            disabled={!pathwayName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            style={{ background: "var(--gradient-bg)" }}
          >
            Create Pathway
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePathwayDialog
