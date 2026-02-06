"use client"

import { PenTool, FileEdit, Presentation, NotebookPen } from "lucide-react"

interface CreateTabProps {
  onPromptClick?: (prompt: string) => void
}

export function CreateTab({ onPromptClick }: CreateTabProps) {
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
          onClick={() => handlePromptClick("Help me write an essay on this topic.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <PenTool className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Help me write an essay on this topic.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Create study notes from this lesson.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <FileEdit className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Create study notes from this lesson.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Generate a presentation outline.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Presentation className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Generate a presentation outline.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Help me draft a project proposal.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <NotebookPen className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Help me draft a project proposal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
