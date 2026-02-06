"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Plus, Check, X } from "lucide-react"

interface Skill {
  id: string
  name: string
  category?: string
}

interface AddSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSkill: (skill: Skill) => void
  type: "earned" | "desired" | "self-reported"
}

// Sample skills with categories
const sampleSkills: Skill[] = [
  { id: "1", name: "Project Management", category: "Management" },
  { id: "2", name: "Enrollment Management", category: "Management" },
  { id: "3", name: "Learning Management Systems", category: "Technical" },
  { id: "4", name: "Data Analysis", category: "Technical" },
  { id: "5", name: "Web Development", category: "Technical" },
  { id: "6", name: "Cloud Computing", category: "Technical" },
  { id: "7", name: "Cybersecurity", category: "Technical" },
  { id: "8", name: "Business Intelligence", category: "Business" },
  { id: "9", name: "Digital Marketing", category: "Marketing" },
  { id: "10", name: "Artificial Intelligence", category: "Technical" },
  { id: "11", name: "Leadership", category: "Soft Skills" },
  { id: "12", name: "Communication", category: "Soft Skills" },
  { id: "13", name: "Problem Solving", category: "Soft Skills" },
  { id: "14", name: "Critical Thinking", category: "Soft Skills" },
  { id: "15", name: "Team Building", category: "Management" },
]

export function AddSkillDialog({ open, onOpenChange, onAddSkill, type }: AddSkillDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get unique categories
  const categories = Array.from(new Set(sampleSkills.map((skill) => skill.category)))

  // Filter skills based on search query and active category
  const filteredSkills = sampleSkills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory ? skill.category === activeCategory : true
    return matchesSearch && matchesCategory
  })

  // Focus search input when dialog opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedSkill(null)
      setActiveCategory(null)
    }
  }, [open])

  const handleAddSkill = () => {
    if (selectedSkill) {
      onAddSkill(selectedSkill)
      onOpenChange(false)
    }
  }

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill)
  }

  const getDialogTitle = () => {
    switch (type) {
      case "earned":
        return "Add Earned Skill"
      case "desired":
        return "Add Desired Skill"
      case "self-reported":
        return "Add Self-Reported Skill"
      default:
        return "Add Skill"
    }
  }

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${open ? "block" : "hidden"}`}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] flex flex-col"
        style={{ maxHeight: "-webkit-fill-available" }}
      >
        {/* Fixed Header */}
        <div className="rounded-tl-lg rounded-tr-lg px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            {getDialogTitle()}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:opacity-80 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-4 sm:px-6 py-4 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Search input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 text-base sm:text-sm"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
                focusRingColor: "var(--primary-color)",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Skills list */}
          <div className="space-y-2">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill)}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedSkill?.id === skill.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  style={{
                    borderColor: selectedSkill?.id === skill.id ? "var(--primary-color)" : "var(--border-color)",
                    backgroundColor: selectedSkill?.id === skill.id ? "var(--accent-color)" : "transparent",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                        {skill.name}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedSkill?.id === skill.id ? "text-white" : "bg-gray-100 text-gray-400"
                    }`}
                    style={selectedSkill?.id === skill.id ? { background: "var(--gradient-bg)" } : {}}
                  >
                    {selectedSkill?.id === skill.id ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                <div className="mb-2">
                  <Search className="h-6 w-6 mx-auto" style={{ color: "var(--text-muted)" }} />
                </div>
                <p>No skills found matching "{searchQuery}"</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="rounded-bl-lg rounded-br-lg px-4 sm:px-6 py-4 flex justify-end flex-shrink-0">
          <button
            onClick={handleAddSkill}
            disabled={!selectedSkill}
            className={`px-6 py-2 rounded-md text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
              selectedSkill ? "hover:opacity-90" : "bg-gray-300 cursor-not-allowed"
            }`}
            style={selectedSkill ? { background: "var(--gradient-bg)" } : {}}
          >
            Add Skill
          </button>
        </div>
      </div>
    </div>
  )
}
