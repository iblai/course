"use client"

import { HelpCircle, Target, Brain, Dumbbell } from "lucide-react"

interface PracticeTabProps {
  onPromptClick?: (prompt: string) => void
}

export function PracticeTab({ onPromptClick }: PracticeTabProps) {
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
          onClick={() => handlePromptClick("Give me a practice question on this topic.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <HelpCircle className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Give me a practice question on this topic.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Quiz me on the key concepts.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Quiz me on the key concepts.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Help me understand this better with examples.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Brain className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Help me understand this better with examples.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Create a flashcard set for this lesson.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Dumbbell className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Create a flashcard set for this lesson.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
