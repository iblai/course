"use client"

import { useState, useEffect } from "react"
import { PortableVoicePromptBox } from "./portable-voice-prompt-box"
import { PortableVoiceAvatar } from "./portable-voice-avatar"
import { Copy, Volume2, Undo2, RotateCcw, X, FileUp } from "lucide-react"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"

export interface VoiceMessage {
  id: number
  type: "user" | "assistant"
  content: string
  sender?: string
  timestamp?: string
  attachments?: { name: string; type: string }[]
}

interface VoiceColumnProps {
  onClose: () => void
  isMobile?: boolean
  messages?: VoiceMessage[]
  onCanvasClick?: () => void
}

// Set CSS variable when component mounts/unmounts
const useVoiceSidebarCSSVariable = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--voice-sidebar-open", "1")
    return () => {
      document.documentElement.style.setProperty("--voice-sidebar-open", "0")
    }
  }, [])
}

const dummyMessages = [
  {
    id: 1,
    type: "user" as const,
    content: "suggest me some courses",
    timestamp: "11:20 PM",
  },
  {
    id: 2,
    type: "assistant" as const,
    sender: "Mikel AI",
    timestamp: "11:21 PM",
    content: `To give you the best course suggestions, I need a little more information!  Tell me about:

**1. Your Interests:**

*   **What are you passionate about?** (e.g., technology, art, writing, history, business, cooking, fitness, music, gaming, social justice, environmentalism, etc.)
*   **What do you enjoy doing in your free time?**
*   **What subjects did you enjoy in school (if applicable)?**

**2. Your Goals:**`,
  },
]

export function VoiceColumn({ onClose, isMobile = false, messages, onCanvasClick }: VoiceColumnProps) {
  useVoiceSidebarCSSVariable()
  const [inputValue, setInputValue] = useState("")
  const [localMessages, setLocalMessages] = useState<VoiceMessage[]>(dummyMessages)
  
  const displayMessages = messages || localMessages

  const handleSubmit = (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return
    
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    
    const newMessage: VoiceMessage = {
      id: Date.now(),
      type: "user",
      content: content.trim(),
      timestamp,
      attachments: files && files.length > 0 
        ? files.map(file => ({ name: file.name, type: file.type }))
        : undefined,
    }
    
    setLocalMessages(prev => [...prev, newMessage])
  }

  const handleVoiceActiveChange = (isActive: boolean) => {
    console.log("Voice active:", isActive)
  }

  const handleVoiceTranscript = (transcript: string) => {
    console.log("Voice transcript:", transcript)
  }

  return (
    <aside
      className="border-l border-gray-200 bg-[#FAFBFC] flex flex-col h-full transition-all duration-300 ease-in-out w-full md:w-[380px]"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">Mikel AI</h2>
        <TooltipFlowbite content="Close" position="bottom">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </TooltipFlowbite>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {onCanvasClick && (
          <button
            onClick={onCanvasClick}
            className="w-full mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-medium hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Generated Course
          </button>
        )}
        <div className="flex flex-col gap-4">
          {displayMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "assistant" && (
                <div className="flex flex-col max-w-[320px]">
                  {/* Avatar and sender info */}
                  <div className="flex items-center gap-2 mb-1">
                    <PortableVoiceAvatar size={32} />
                    <span className="text-sm font-medium text-gray-700">{message.sender}</span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  {/* Message bubble */}
                  <div className="bg-gray-100 rounded-tl-sm px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap rounded-xl">
                    {message.content.split(/(\*\*.*?\*\*)/).map((part, index) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={index}>{part.slice(2, -2)}</strong>
                      }
                      return <span key={index}>{part}</span>
                    })}
                  </div>
                  <TooltipProvider>
                    <div className="flex items-center gap-3 mt-2 ml-1">
                      <TooltipFlowbite content="Copy" position="top">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </TooltipFlowbite>
                      <TooltipFlowbite content="Read aloud" position="top">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </TooltipFlowbite>
                      <TooltipFlowbite content="Undo" position="top">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Undo2 className="w-4 h-4" />
                        </button>
                      </TooltipFlowbite>
                      <TooltipFlowbite content="Regenerate" position="top">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </TooltipFlowbite>
                    </div>
                  </TooltipProvider>
                </div>
              )}
              {message.type === "user" && (
                <div className="max-w-[260px]">
                  <div className="bg-[#E8F0F8] rounded-tr-sm px-4 py-3 text-sm text-gray-800 rounded-lg">
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {message.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs"
                          >
                            <FileUp className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-gray-700 max-w-[100px] truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {message.content && message.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Box at bottom */}
      <div className="px-4 pb-4">
        <PortableVoicePromptBox
          onSubmit={handleSubmit}
          placeholder="Ask anything..."
          onVoiceActiveChange={handleVoiceActiveChange}
          onVoiceTranscript={handleVoiceTranscript}
        />
      </div>
    </aside>
  )
}
