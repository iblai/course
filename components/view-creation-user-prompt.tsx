"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export interface ViewCreationUserPromptProps {
  courseTitle: string
}

export function ViewCreationUserPrompt({ courseTitle }: ViewCreationUserPromptProps) {
  return (
    <div className="min-h-0 flex items-start justify-center px-4 sm:px-6 pt-4">
      <div
        className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sidebar-foreground)]">
            Course Creation User Prompt
          </h1>
          <p className="text-sm text-gray-600 mt-2">{courseTitle}</p>
          <div className="border-b border-gray-200 my-5" />

          <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 px-4 sm:px-5 text-sm text-gray-800 leading-relaxed text-left">
            <p className="font-medium text-gray-700 mb-2">User prompt</p>
            <p>
              Create a comprehensive course on &quot;{courseTitle}&quot; covering key concepts, learning objectives, and assessment strategies. Include modules suitable for adult learners, with clear outcomes and optional assignments. Use a mix of text, examples, and discussion prompts where appropriate.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/courses">
              <Button
                className="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] hover:border-[#93C5FD] rounded-lg gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Course List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
