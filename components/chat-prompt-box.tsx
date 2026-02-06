"use client"

import type React from "react"
import { Paperclip, Mic } from "lucide-react"
import { TooltipFlowbite } from "@/components/ui/tooltip-flowbite"

interface ChatPromptBoxProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: () => void
}

export function ChatPromptBox({ inputValue, onInputChange, onSubmit }: ChatPromptBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="p-4 pt-3 pb-4">
      <div className="border border-gray-200 rounded-xl p-3 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or prompt"
          className="w-full bg-transparent text-base outline-none placeholder:text-gray-400 mb-6"
        />
        <div className="flex items-center justify-between">
          <TooltipFlowbite content="Attach file" position="top">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
          </TooltipFlowbite>
          <TooltipFlowbite content="Voice input" position="top">
            <button
              onClick={onSubmit}
              className="p-2.5 text-white transition-all hover:opacity-90 rounded-lg"
              style={{ background: "var(--gradient-bg)" }}
            >
              <Mic className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </TooltipFlowbite>
        </div>
      </div>
    </div>
  )
}
