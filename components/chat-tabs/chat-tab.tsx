"use client"

import Image from "next/image"

interface ChatTabProps {
  onPromptClick?: (prompt: string) => void
}

export function ChatTab({ onPromptClick }: ChatTabProps) {
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
          onClick={() => handlePromptClick("What activity makes this lesson engaging?")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/images/chat-tab-icon-1.webp"
              alt="Question icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              What activity makes this lesson engaging?
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Suggest a class activity.")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/images/chat-tab-icon-2.webp"
              alt="Menu icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Suggest a class activity.
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("What's a quick group activity?")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/images/chat-tab-icon-3.webp"
              alt="Puzzle icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              What's a quick group activity?
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer transition-colors duration-200 rounded-lg p-3 hover:bg-black/5"
          onClick={() => handlePromptClick("Can you suggest feedback I can give to students?")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/images/chat-tab-icon-4.webp"
              alt="Feedback icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="button-text leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
              Can you suggest feedback I can give to students?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
