"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Search, Plus, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface Mentor {
  id: string
  name: string
  llm: string
  provider: string
  description: string
  updatedOn: string
  featured: boolean
}

const initialMentors: Mentor[] = [
  {
    id: "1",
    name: "Cloud Computer Assistant",
    llm: "Llama 3",
    provider: "OpenAI",
    description: "You are an upbeat, encouraging tutor who helps students understand concepts.",
    updatedOn: "12/11/2024",
    featured: true,
  },
  {
    id: "2",
    name: "Math Teacher",
    llm: "Google Palm",
    provider: "Google",
    description: "First, ask them what they would like to learn about. Wait for the response. Then ask",
    updatedOn: "12/11/2024",
    featured: true,
  },
  {
    id: "3",
    name: "Coding Instructor",
    llm: "Open AI",
    provider: "OpenAI",
    description: "Given this information, help students understand the topic.",
    updatedOn: "12/11/2024",
    featured: true,
  },
  {
    id: "4",
    name: "Gen AI Expert",
    llm: "Claude",
    provider: "OpenAI",
    description: "Give students explanations, examples, and analogies about the concept to help.",
    updatedOn: "12/11/2024",
    featured: true,
  },
  {
    id: "5",
    name: "History Teacher",
    llm: "Falcon",
    provider: "Groq",
    description: "You are an upbeat, encouraging tutor who helps students understand concepts by..",
    updatedOn: "12/11/2024",
    featured: true,
  },
]

const mentors = initialMentors; // Declare the mentors variable

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [mounted, setMounted] = React.useState(false)
  const [mentors, setMentors] = React.useState<Mentor[]>(initialMentors)

  const handleFeaturedToggle = (mentorId: string, checked: boolean) => {
    setMentors((prev) =>
      prev.map((mentor) => (mentor.id === mentorId ? { ...mentor, featured: checked } : mentor))
    )
  }

  const itemsPerPage = 5
  const totalPages = Math.ceil(mentors.length / itemsPerPage)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const filteredMentors = mentors.filter((mentor) => mentor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const currentMentors = filteredMentors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleMentorNameClick = (mentorId: string) => {
    // Edit mentor functionality removed
  }

  if (!open || !mounted) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 z-[99]"
          onClick={handleClose}
        />
        <div
          className="relative bg-background rounded-lg shadow-xl w-full max-w-6xl h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] flex flex-col z-[100] border"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-600">Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground mr-2">Manage your AI mentors and customize your experience</p>
            </div>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search mentors..."
                    className="pl-9 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#38A1E5] to-[#7284FF] text-white hover:opacity-90 hover:text-white text-sm"
                  onClick={() => {
                    // Create agent functionality removed
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Agent</span>
                </Button>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">LLM</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Provider</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Updated On</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Featured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentMentors.map((mentor) => (
                      <tr key={mentor.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div
                            className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                            onClick={() => handleMentorNameClick(mentor.id)}
                          >
                            {mentor.name}
                          </div>
                        </td>
                        <td className="p-3 text-sm">{mentor.llm}</td>
                        <td className="p-3 text-sm">{mentor.provider}</td>
                        <td className="p-3">
                          <div
                            className="text-sm text-muted-foreground max-w-[250px] truncate"
                            title={mentor.description}
                          >
                            {mentor.description}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{mentor.updatedOn}</td>
                        <td className="p-3">
                          <Switch 
                            checked={mentor.featured} 
                            onCheckedChange={(checked) => handleFeaturedToggle(mentor.id, checked)}
                            className="data-[state=checked]:bg-blue-600" 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-3">
                {currentMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-gradient-to-br from-[#F5F8FF] to-[#EEF4FF] border border-[#D0E0FF] rounded-lg p-4 flex flex-col"
                  >
                    <div
                      className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 mb-2"
                      onClick={() => handleMentorNameClick(mentor.id)}
                    >
                      {mentor.name}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">LLM:</span>
                      <span className="text-sm">{mentor.llm}</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Provider:</span>
                      <span className="text-sm">{mentor.provider}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200">
                      <div className="text-xs text-muted-foreground">{mentor.updatedOn}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Featured</span>
                        <Switch 
                          checked={mentor.featured} 
                          onCheckedChange={(checked) => handleFeaturedToggle(mentor.id, checked)}
                          className="data-[state=checked]:bg-blue-600" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentMentors.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No mentors found</h3>
                  <p className="text-muted-foreground mb-4">Create your first AI mentor to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {currentMentors.length > 0 && (
            <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/50 rounded-b-lg">
              <div className="flex flex-1 items-center justify-between">
                <div className="hidden sm:block">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredMentors.length)}</span>{" "}
                    of <span className="font-medium">{filteredMentors.length}</span> mentors
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md hidden sm:flex bg-transparent"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronFirst className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 sm:p-0 flex items-center justify-center rounded-md text-xs sm:text-sm bg-transparent"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0" />
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <span className="text-xs sm:text-sm text-muted-foreground mx-1 sm:mx-2 px-2">
                    <span className="hidden sm:inline">Page </span>
                    {currentPage} <span className="hidden sm:inline">of</span>
                    <span className="inline sm:hidden"> / </span>
                    {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 sm:p-0 flex items-center justify-center rounded-md text-xs sm:text-sm bg-transparent"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1 sm:ml-0" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md hidden sm:flex bg-transparent"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}
