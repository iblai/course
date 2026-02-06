"use client"

import { BookOpen, FileText, ListChecks, Lightbulb } from "lucide-react"

interface SummarizeTabProps {
  onPromptClick?: (prompt: string) => void
}

export function SummarizeTab({ onPromptClick }: SummarizeTabProps) {
  const handlePromptClick = (prompt: string) => {
    if (onPromptClick) {
      onPromptClick(prompt)
    }
  }

  return (
    <div className="space-y-2">
      <div
        className="rounded-lg p-4 space-y-2 px-0 py-0"
        style={{
          backgroundColor: "var(--accent-color)",
        }}
      >
        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Summarize this lesson in simple terms.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Summarize this lesson in simple terms.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("What are the key takeaways from this content?")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              What are the key takeaways from this content?
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Create a bullet point summary.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <ListChecks className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Create a bullet point summary.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Explain the main concepts in this lesson.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Lightbulb className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Explain the main concepts in this lesson.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
