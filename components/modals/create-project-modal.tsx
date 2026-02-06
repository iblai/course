"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { mentorsByCategory, type Mentor } from "@/data/mentors"
import { MentorCategories } from "@/components/mentor-categories"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject?: (projectName: string, selectedMentors: Mentor[]) => void
}

export function CreateProjectModal({ isOpen, onClose, onCreateProject }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    subject: "",
    audience: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const mentorsPerPage = 8 // Show 8 mentors per page (4x2 grid)

  const getFilteredMentors = () => {
    let allMentors: Mentor[] = []

    // Get all mentors from all categories
    Object.values(mentorsByCategory).forEach((categoryMentors) => {
      allMentors = [...allMentors, ...categoryMentors]
    })

    // Remove duplicates
    allMentors = allMentors.filter((mentor, index, self) => index === self.findIndex((m) => m.id === mentor.id))

    // Apply filters
    if (filters.subject || filters.category || filters.audience) {
      allMentors = allMentors.filter((mentor) => {
        const mentorText = `${mentor.title} ${mentor.description}`.toLowerCase()

        let matches = true

        if (filters.subject) {
          const subjectMatches =
            mentorText.includes(filters.subject.toLowerCase()) ||
            (filters.subject === "Business" && mentorText.includes("business")) ||
            (filters.subject === "Computer Science" &&
              (mentorText.includes("computer") ||
                mentorText.includes("programming") ||
                mentorText.includes("coding"))) ||
            (filters.subject === "Economics" && mentorText.includes("economic")) ||
            (filters.subject === "Math" && (mentorText.includes("math") || mentorText.includes("statistics"))) ||
            (filters.subject === "Science" && mentorText.includes("science")) ||
            (filters.subject === "Humanities" && (mentorText.includes("writing") || mentorText.includes("literature")))
          matches = matches && subjectMatches
        }

        if (filters.category) {
          const categoryMatches =
            mentorText.includes(filters.category.toLowerCase()) ||
            (filters.category === "Learning" && (mentorText.includes("learn") || mentorText.includes("teach"))) ||
            (filters.category === "Grading" && mentorText.includes("grade")) ||
            (filters.category === "Advising" && (mentorText.includes("advise") || mentorText.includes("mentor")))
          matches = matches && categoryMatches
        }

        if (filters.audience) {
          const audienceMatches =
            mentorText.includes(filters.audience.toLowerCase()) ||
            (filters.audience === "Learner" && (mentorText.includes("student") || mentorText.includes("learn"))) ||
            (filters.audience === "Instructor" && (mentorText.includes("teacher") || mentorText.includes("instructor")))
          matches = matches && audienceMatches
        }

        return matches
      })
    }

    if (searchQuery.trim()) {
      allMentors = allMentors.filter(
        (mentor) =>
          mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return allMentors
  }

  const handleFiltersChange = (newFilters: { category: string; subject: string; audience: string }) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const toggleMentorSelection = (mentor: Mentor) => {
    setSelectedMentors((prev) => {
      const isSelected = prev.some((m) => m.id === mentor.id)
      if (isSelected) {
        return prev.filter((m) => m.id !== mentor.id)
      } else {
        return [...prev, mentor]
      }
    })
  }

  const handleCreate = () => {
    if (projectName.trim() && selectedMentors.length > 0) {
      onCreateProject?.(projectName.trim(), selectedMentors)
      setProjectName("")
      setSelectedMentors([])
      setSearchQuery("")
      setFilters({ category: "", subject: "", audience: "" })
      setCurrentPage(1)
      onClose()
    }
  }

  const handleCancel = () => {
    setProjectName("")
    setSelectedMentors([])
    setSearchQuery("")
    setFilters({ category: "", subject: "", audience: "" })
    setCurrentPage(1)
    onClose()
  }

  const filteredMentors = getFilteredMentors()
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage)
  const startIndex = (currentPage - 1) * mentorsPerPage
  const endIndex = startIndex + mentorsPerPage
  const currentMentors = filteredMentors.slice(startIndex, endIndex)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-[95vw] p-0 gap-0"
        style={{
          height: "85vh",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">New Project</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-2 space-y-4 flex-shrink-0">
            {/* Project Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <Input
                placeholder="E.g. Project Planning"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-base h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-gray-200 focus:ring-0 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate()
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Agents <span className="text-red-500">*</span>
                {selectedMentors.length > 0 && (
                  <span className="text-blue-600 font-normal ml-2">({selectedMentors.length} selected)</span>
                )}
              </label>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-0"
                />
              </div>

              <div className="mb-4">
                <MentorCategories onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>
          <div className="flex-1 px-6 pb-0 min-h-0 flex flex-col">
            <div className="flex-1 flex flex-col min-h-0">
              {/* Agents Grid - Scrollable area */}
              <div className="flex-1 pb-4 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentMentors.map((mentor) => {
                    const isSelected = selectedMentors.some((m) => m.id === mentor.id)
                    return (
                      <div
                        key={mentor.id}
                        onClick={() => toggleMentorSelection(mentor)}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#00A3EC] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={mentor.avatar || "/placeholder.svg"}
                          alt={mentor.title}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{mentor.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{mentor.description}</p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 bg-[#00A3EC] rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {currentMentors.length === 0 && (
                    <div className="col-span-full flex items-center justify-center py-8 text-gray-500">
                      No agents found matching your search.
                    </div>
                  )}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="px-2 py-3 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0 sticky bottom-0">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredMentors.length)} of {filteredMentors.length}{" "}
                    agents
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-700 px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 sticky bottom-0">
          <Button variant="outline" onClick={handleCancel} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!projectName.trim() || selectedMentors.length === 0}
            className={`px-6 text-white ${
              projectName.trim() && selectedMentors.length > 0
                ? "bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 hover:text-white"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
