"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}
interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void
  onerror: () => void
  onend: () => void
}
import Image from "next/image"
import { ChatTab } from "./chat-tabs/chat-tab"
import { AssessmentsTab } from "./chat-tabs/assessments-tab"
import { ContentTab } from "./chat-tabs/content-tab"
import { CommunicationTab } from "./chat-tabs/communication-tab"
import { SummarizeTab } from "./chat-tabs/summarize-tab"
import { PracticeTab } from "./chat-tabs/practice-tab"
import { CreateTab } from "./chat-tabs/create-tab"
import { ChatInputForm } from "@/components/chat-input-form"
import { createContext, useContext } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useIsMobile } from "@/hooks/use-mobile"

// Create a context to share the chat state with other components
export const ChatContext = createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export const useChatState = () => useContext(ChatContext)

interface ChatButtonProps {
  isMobile?: boolean
  isSmallScreen?: boolean
}

export function ChatButton({ isMobile = false, isSmallScreen = false }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [activeTab, setActiveTab] = useState<
    "chat" | "assessments" | "content" | "communication" | "summarize" | "practice" | "create"
  >("chat")
  const [userRole, setUserRole] = useState<"instructor" | "learner">("instructor")
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false)
  const [isDocumentSidebarOpen, setIsDocumentSidebarOpen] = useState(false)
  const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false)
  const [isVoiceSidebarOpen, setIsVoiceSidebarOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [visualViewportHeight, setVisualViewportHeight] = useState(0)
  const [visualViewportOffsetTop, setVisualViewportOffsetTop] = useState(0)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const accumulatedTranscriptRef = useRef<string>("")
  const pathname = usePathname()
  const isMobileView = useIsMobile()
  const isCanvasView = pathname?.includes("/canvas") || pathname?.includes("/artifact")
  const isChatInterface = pathname?.includes("/chat")
  const { isToolbarOpen: isAccessibilityOpen } = useAccessibility()

  // Listen for open-chat event (e.g. from header mobile button)
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true)
    document.addEventListener("open-chat", handleOpenChat)
    return () => document.removeEventListener("open-chat", handleOpenChat)
  }, [])

  // Track visual viewport so mobile chat panel (and prompt box) stays above the keyboard
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return
    const vv = window.visualViewport
    const update = () => {
      setVisualViewportHeight(vv.height)
      setVisualViewportOffsetTop(vv.offsetTop)
    }
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
    }
  }, [])

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log("Submitting:", inputValue)
      setInputValue("")
    }
  }

  const stopDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (_) {}
      recognitionRef.current = null
    }
    setInputValue(accumulatedTranscriptRef.current)
    setIsListening(false)
  }

  const handleDictationClick = () => {
    if (isListening) {
      stopDictation()
      return
    }
    const SpeechRecognition =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)
    if (!SpeechRecognition) {
      if (typeof window !== "undefined") {
        alert("Your browser does not support speech recognition. Please try Chrome or Edge.")
      }
      return
    }
    accumulatedTranscriptRef.current = inputValue ? `${inputValue.trim()} ` : ""
    setIsListening(true)
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.onresult = (event: {
      resultIndex: number
      results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } }
    }) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          accumulatedTranscriptRef.current += t
        } else {
          interim += t
        }
      }
      setInputValue(accumulatedTranscriptRef.current + interim)
    }
    recognition.onerror = () => {
      stopDictation()
    }
    recognition.onend = () => {
      setInputValue(accumulatedTranscriptRef.current)
      setIsListening(false)
      recognitionRef.current = null
    }
    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (_) {
      setIsListening(false)
    }
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (_) {}
        recognitionRef.current = null
      }
      setIsListening(false)
    }
  }, [])

  // Stop listening when user clicks anywhere else on the page (not inside prompt area)
  useEffect(() => {
    if (!isListening) return
    const stopOnClick = (e: MouseEvent | TouchEvent) => {
      const node = e.target as Node | null
      const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : (node?.parentElement ?? null)
      if (el?.closest?.("[data-prompt-area]")) return
      stopDictation()
    }
    document.addEventListener("mousedown", stopOnClick)
    document.addEventListener("touchstart", stopOnClick)
    return () => {
      document.removeEventListener("mousedown", stopOnClick)
      document.removeEventListener("touchstart", stopOnClick)
    }
  }, [isListening])

  // Set a CSS variable when the chat state changes
  useEffect(() => {
    document.documentElement.style.setProperty("--chat-open", isOpen ? "1" : "0")
    return () => {
      document.documentElement.style.setProperty("--chat-open", "0")
    }
  }, [isOpen])

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMoreDropdownOpen) {
        const dropdownElement = document.querySelector(".more-dropdown")
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setIsMoreDropdownOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMoreDropdownOpen])

  // Add this effect to handle role changes
  useEffect(() => {
    if (userRole === "instructor") {
      setActiveTab("chat")
    } else {
      setActiveTab("chat")
    }
  }, [userRole])

  useEffect(() => {
    const checkSidebars = () => {
      const docValue = getComputedStyle(document.documentElement).getPropertyValue("--document-sidebar-open").trim()
      const agentValue = getComputedStyle(document.documentElement).getPropertyValue("--agent-sidebar-open").trim()
      const voiceValue = getComputedStyle(document.documentElement).getPropertyValue("--voice-sidebar-open").trim()
      setIsDocumentSidebarOpen(docValue === "1")
      setIsAgentSidebarOpen(agentValue === "1")
      setIsVoiceSidebarOpen(voiceValue === "1")
    }

    checkSidebars()

    const observer = new MutationObserver(checkSidebars)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] })

    return () => observer.disconnect()
  }, [])

  const renderTabContent = () => {
    if (userRole === "learner") {
      switch (activeTab) {
        case "chat":
          return <ChatTab onPromptClick={handlePromptClick} />
        case "summarize":
          return <SummarizeTab onPromptClick={handlePromptClick} />
        case "practice":
          return <PracticeTab onPromptClick={handlePromptClick} />
        case "create":
          return <CreateTab onPromptClick={handlePromptClick} />
        default:
          return <ChatTab onPromptClick={handlePromptClick} />
      }
    } else {
      switch (activeTab) {
        case "chat":
          return <ChatTab onPromptClick={handlePromptClick} />
        case "assessments":
          return <AssessmentsTab onPromptClick={handlePromptClick} />
        case "content":
          return <ContentTab onPromptClick={handlePromptClick} />
        case "communication":
          return <CommunicationTab onPromptClick={handlePromptClick} />
        default:
          return <ChatTab onPromptClick={handlePromptClick} />
      }
    }
  }

  if (isCanvasView || isChatInterface) {
    return null
  }

  // Mobile: full-screen chat panel when open (triggered by header button or open-chat event)
  if (isSmallScreen || isMobile || isMobileView) {
    if (!isOpen) return null
    return (
      <div
        className="fixed left-0 right-0 z-40 bg-[#FAFBFC] overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)] md:hidden w-full h-full"
        style={
          visualViewportHeight > 0
            ? { top: visualViewportOffsetTop, height: visualViewportHeight }
            : undefined
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/images/toolsAI-logo.png" alt="Chat assistant" width={32} height={32} className="h-8 w-8" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-200 rounded-[4px] p-0.5 py-1.5 px-1.5">
              <button
                className={`py-1 px-2 rounded-[4px] transition-all text-xs font-medium ${userRole === "instructor" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setUserRole("instructor")}
              >
                Instructor
              </button>
              <button
                className={`py-1 px-2 rounded-[4px] text-xs transition-all ${userRole === "learner" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setUserRole("learner")}
              >
                Learner
              </button>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 rounded p-1" aria-label="Close chat">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 flex-shrink-0 bg-white">
          {userRole === "instructor" ? (
            <div className="flex w-full">
              {["chat", "assessments", "content", "communication"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className="flex-1 min-w-0 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-3"
                  style={{
                    borderBottomColor: activeTab === tab ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === tab ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex w-full">
              {(["chat", "summarize", "practice", "create"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 min-w-0 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-3"
                  style={{
                    borderBottomColor: activeTab === tab ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === tab ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">{renderTabContent()}</div>

        {/* Prompt Box */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 pb-2">
          <ChatInputForm
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder="Ask a question or prompt"
            onVoiceClick={handleDictationClick}
            isListening={isListening}
            compact
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`hidden md:flex w-14 items-center justify-center rounded-lg bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] z-40 h-28 mt-6 ${isDocumentSidebarOpen || isAgentSidebarOpen || isVoiceSidebarOpen || isAccessibilityOpen ? "!hidden" : ""}`}
          aria-label="Open chat assistant"
        >
          <Image src="/images/toolsAI-logo.png" alt="Chat assistant" width={32} height={32} className="h-8 w-8" />
        </button>
      )}

      {isOpen && (
        <div className="fixed top-[65px] right-0 bottom-16 w-[380px] border-l border-gray-200 bg-[#FAFBFC] z-40 overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)] hidden md:flex">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <Image src="/images/toolsAI-logo.png" alt="Chat assistant" width={32} height={32} className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-200 rounded-[4px] p-0.5 py-1.5 px-1.5">
                <button
                  className={`py-1 px-2 rounded-[4px] transition-all text-xs font-medium ${userRole === "instructor" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setUserRole("instructor")}
                >
                  Instructor
                </button>
                <button
                  className={`py-1 px-2 rounded-[4px] text-xs transition-all ${userRole === "learner" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setUserRole("learner")}
                >
                  Learner
                </button>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 rounded p-1" aria-label="Close chat">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 flex-shrink-0 bg-white">
            {userRole === "instructor" ? (
              <div className="flex w-full">
                <button
                  onClick={() => setActiveTab("chat")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "chat" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "chat" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("assessments")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "assessments" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "assessments" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Assessments
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "content" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "content" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab("communication")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2 pr-4"
                  style={{
                    borderBottomColor: activeTab === "communication" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "communication" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Communication
                </button>
              </div>
            ) : (
              <div className="flex w-full">
                <button
                  onClick={() => setActiveTab("chat")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "chat" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "chat" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("summarize")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "summarize" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "summarize" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Summarize
                </button>
                <button
                  onClick={() => setActiveTab("practice")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "practice" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "practice" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Practice
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className="flex-1 py-3 font-medium text-xs border-b-2 text-center whitespace-nowrap px-2"
                  style={{
                    borderBottomColor: activeTab === "create" ? "var(--chat-tab-active)" : "transparent",
                    color: activeTab === "create" ? "var(--chat-tab-active)" : "var(--chat-tab-inactive)",
                  }}
                >
                  Create
                </button>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">{renderTabContent()}</div>

          {/* Prompt Box */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 pb-2">
            <ChatInputForm
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              placeholder="Ask a question or prompt"
              onVoiceClick={handleDictationClick}
              isListening={isListening}
              compact
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatButton
