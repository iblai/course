"use client"

import type React from "react"
import { Paperclip, Mic } from "lucide-react"
import { TooltipFlowbite } from "@/components/ui/tooltip-flowbite"
import { cn } from "@/lib/utils"

interface ChatPromptBoxProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  onVoiceClick?: () => void
  isListening?: boolean
}

export function ChatPromptBox({ inputValue, onInputChange, onSubmit, onVoiceClick, isListening = false }: ChatPromptBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="p-4 pt-3 pb-4">
      <div className="border border-gray-200 rounded-xl p-3 bg-white relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "" : "Ask a question or prompt"}
          className={cn(
            "w-full bg-transparent text-base outline-none placeholder:text-gray-400 mb-6",
            isListening && "pr-2"
          )}
        />
        {isListening && (
          <div className="absolute top-3 left-3 flex items-center gap-1 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: "#00A6F1",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
            <span className="ml-2 text-gray-500 text-sm">Listening...</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <TooltipFlowbite content="Attach file" position="top">
            <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
          </TooltipFlowbite>
          <TooltipFlowbite content="Voice input" position="top">
            <button
              type="button"
              onClick={onVoiceClick ?? onSubmit}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg text-white transition-all hover:opacity-90",
                isListening && "opacity-90"
              )}
              style={
                isListening
                  ? { backgroundColor: "#00A6F1" }
                  : { background: "var(--gradient-bg)" }
              }
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </TooltipFlowbite>
        </div>
      </div>
    </div>
  )
}
