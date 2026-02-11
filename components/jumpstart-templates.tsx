"use client"

import type React from "react"

import { FileText, Lightbulb, Star, List, Globe } from "lucide-react"


interface Template {
  id: string
  question: string
  icon: React.ReactNode
}

const templates: Template[] = [
  {
    id: "explain-simply",
    question: "Create a course about AI for Business",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "relate-to-life",
    question: "Explain in a few lessons the Agentic economy",
    icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "important-examples",
    question: "Provide a syllabus for learning React Native",
    icon: <Star className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "step-by-step",
    question: "I need a step-by-step explanation about Claude Code",
    icon: <List className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "questions-to-ask",
    question: "What should I ask to better understand what crypto is",
    icon: <Globe className="h-5 w-5 text-blue-500" />,
  },
]

interface JumpstartTemplatesProps {
  onTemplateSelect?: (question: string) => void
  platformId?: string
  mentorId?: string
}

export function JumpstartTemplates({
  onTemplateSelect,
  platformId = "tenantA",
  mentorId = "mentorA",
}: JumpstartTemplatesProps) {

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-hide sm:pb-1 sm:justify-center">
          {templates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-[#F5F8FF] to-[#EEF4FF] border border-[#D0E0FF] rounded-lg p-3 flex flex-col flex-shrink-0 w-full sm:w-[180px] sm:min-w-[180px] min-h-0 sm:min-h-[92px]"
              onClick={() => onTemplateSelect?.(template.question)}
            >
              <p className="text-sm text-gray-700 italic leading-relaxed mb-auto line-clamp-3">{template.question}</p>
              <div className="flex items-center justify-start mt-2.5 pt-2.5 border-t border-gray-200">{template.icon}</div>
            </div>
          ))}
        </div>
      </div>

    </>
  )
}
