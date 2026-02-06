"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FiltersState {
  category: string | null
  subject: string | null
  audience: string | null
  type: string | null
  llm: string | null
}

interface MentorCategoriesProps {
  onFiltersChange: (filters: FiltersState) => void
}

const categoryOptions = ["Business", "Technology", "Science", "Arts", "Health", "Education"]
const subjectOptions = [
  "Economics",
  "Information Systems",
  "Philosophy",
  "Business",
  "Computer Science",
  "Humanities",
  "Math",
  "Nursing",
  "Science",
  "Social Sciences",
]
const audienceOptions = ["Students", "Professionals", "Researchers", "Educators"]
const typeOptions = ["Tutor", "Assistant", "Coach", "Mentor", "Expert"]
const llmOptions = ["GPT-4", "GPT-3.5", "Claude", "Gemini", "Llama"]

const filterButtonClass =
  "gap-2 text-sm font-normal bg-white border border-gray-200 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm"

export function MentorCategories({ onFiltersChange }: MentorCategoriesProps) {
  const [filters, setFilters] = useState<FiltersState>({
    category: null,
    subject: null,
    audience: null,
    type: null,
    llm: null,
  })

  const handleFilterChange = (key: keyof FiltersState, value: string | null) => {
    const newFilters = {
      ...filters,
      [key]: filters[key] === value ? null : value,
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md" asChild>
          <Button variant="outline" className={filterButtonClass}>
            {filters.category || "Category"}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categoryOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleFilterChange("category", option)}
              className={filters.category === option ? "bg-accent" : ""}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md" asChild>
          <Button variant="outline" className={filterButtonClass}>
            {filters.subject || "Subject"}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {subjectOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleFilterChange("subject", option)}
              className={filters.subject === option ? "bg-accent" : ""}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md" asChild>
          <Button variant="outline" className={filterButtonClass}>
            {filters.audience || "Audience"}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {audienceOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleFilterChange("audience", option)}
              className={filters.audience === option ? "bg-accent" : ""}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md" asChild>
          <Button variant="outline" className={filterButtonClass}>
            {filters.type || "Type"}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {typeOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleFilterChange("type", option)}
              className={filters.type === option ? "bg-accent" : ""}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md" asChild>
          <Button variant="outline" className={filterButtonClass}>
            {filters.llm || "LLM"}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {llmOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleFilterChange("llm", option)}
              className={filters.llm === option ? "bg-accent" : ""}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {(filters.category || filters.subject || filters.audience || filters.type || filters.llm) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const clearedFilters = { category: null, subject: null, audience: null, type: null, llm: null }
            setFilters(clearedFilters)
            onFiltersChange(clearedFilters)
          }}
          className="text-sm text-gray-500"
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}
