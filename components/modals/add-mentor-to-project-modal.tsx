"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, X } from "lucide-react"
import { mentorsByCategory, type Mentor } from "@/data/mentors"
import { MentorCategories } from "@/components/mentor-categories"

interface ProjectMentor {
  id: string
  title: string // Changed from 'name' to 'title' to match Mentor interface
  avatar: string
  description: string
}

interface AddMentorToProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onMentorSelect: (mentor: ProjectMentor) => void
  onMentorDeselect?: (mentor: ProjectMentor) => void
  projectName: string
  existingMentors: ProjectMentor[]
}

export function AddMentorToProjectModal({
  isOpen,
  onClose,
  onMentorSelect,
  onMentorDeselect,
  projectName,
  existingMentors,
}: AddMentorToProjectModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    subject: "",
    audience: "",
  })

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

    // Filter by search query
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
  }

  const filteredMentors = getFilteredMentors()

  const handleMentorSelect = (mentor: Mentor) => {
    const projectMentor: ProjectMentor = {
      id: mentor.id.toString(),
      title: mentor.title, // Use 'title' instead of 'name'
      avatar: mentor.avatar,
      description: mentor.description,
    }
    onMentorSelect(projectMentor)
    setSearchQuery("")
  }

  const handleMentorClick = (mentor: Mentor) => {
    const projectMentor: ProjectMentor = {
      id: mentor.id.toString(),
      title: mentor.title,
      avatar: mentor.avatar,
      description: mentor.description,
    }
    if (isMentorAlreadyAdded(mentor.id)) {
      onMentorDeselect?.(projectMentor)
    } else {
      handleMentorSelect(mentor)
    }
  }

  const isMentorAlreadyAdded = (mentorId: number) => {
    return existingMentors.some((mentor) => {
      // Convert both to strings for comparison to handle type mismatches
      return mentor.id.toString() === mentorId.toString()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-[95vw] p-0 sm:p-0 gap-0"
        style={{
          height: "85vh",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
        hideCloseButton
        noPadding
      >
        {/* Header - same layout as New Project: flex row with title + close */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-border bg-background flex-shrink-0">
          <div className="flex flex-col gap-2">
            <DialogTitle className="sr-only">Add Agent {projectName ? `to ${projectName}` : ""}</DialogTitle>
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--sidebar-foreground)]">
              Add Agent {projectName ? `to ${projectName}` : ""}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content - same structure as New Project */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 sm:p-6 space-y-4 flex-shrink-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select an agent to add</label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div className="mb-4">
                <MentorCategories onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>
          <div className="flex-1 px-4 sm:px-6 pb-0 min-h-0 flex flex-col">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 pb-4 overflow-y-auto min-h-0">
                {existingMentors.length === 0 && (
                  <div className="text-center py-4 mb-4">
                    <p className="text-gray-600 text-sm">No agents assigned to this project yet.</p>
                    <p className="text-sm text-gray-500 mt-1">Select an agent below to add them to your project.</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredMentors.map((mentor) => {
                    const isAdded = isMentorAlreadyAdded(mentor.id)
                    return (
                      <div
                        key={mentor.id}
                        onClick={() => handleMentorClick(mentor)}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                          isAdded
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
                        {isAdded && (
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 bg-[#00A3EC] rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {filteredMentors.length === 0 && (
                    <div className="col-span-full flex items-center justify-center py-8 text-gray-500">
                      No agents found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg flex justify-end gap-3 sticky bottom-0">
          <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button onClick={onClose} className="px-6 text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 hover:text-white">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
