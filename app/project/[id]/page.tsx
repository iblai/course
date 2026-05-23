"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { ProjectView } from "@/components/project-view"
import { AddSourcesDialog, type SelectedSource } from "@/components/chat-input/add-sources-dialog"
import { ChatInputForm } from "@/components/chat-input-form"
import { LoadingMessage } from "@/components/loading-message"
import { TooltipProvider, TooltipFlowbite } from "@/components/ui/tooltip-flowbite"
import { Copy, Volume2, Reply, Check, FileImage, X } from "lucide-react"
import { cn } from "@/lib/utils"

const PROJECT_STORAGE_KEY = "project-data"

interface StoredProject {
  name: string
  mentors: { id: number; title: string; description: string; avatar: string }[]
}

interface ChatMessageAttachment {
  id: string
  name: string
  type: string
  url?: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: ChatMessageAttachment[]
}

function formatAssistantMessage(content: string): string {
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-700">$1</strong>')
  formatted = formatted.replace(/_(.*?)_/g, '<span class="underline">$1</span>')
  formatted = formatted.replace(/^• (.*)$/gm, '<li class="ml-4 mb-1">$1</li>')
  formatted = formatted.replace(
    /^(\d+)\. (.*)$/gm,
    '<li class="ml-4 mb-1"><span class="inline-flex items-center justify-center w-5 h-5 rounded bg-[#00A3EC] text-white text-xs font-medium mr-1.5">$1</span> $2</li>',
  )
  formatted = formatted.replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc list-inside my-2 space-y-1">$&</ul>')
  formatted = formatted.replace(/\n/g, "<br/>")
  formatted = formatted.replace(/✅/g, '<span class="text-green-600 inline-flex">✓</span>')
  return formatted
}

const SAMPLE_AI_RESPONSE = `Thanks for your message. I'm your project assistant. In a full implementation, I would use the project context and mentors to help you. For now, here's a placeholder response.

Would you like to add files, set instructions, or chat about this project?`

export default function ProjectPage() {
  const params = useParams()
  const id = params.id as string
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectMentors, setProjectMentors] = useState<StoredProject["mentors"]>([])
  const [ready, setReady] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const [isAddSourcesDialogOpen, setIsAddSourcesDialogOpen] = useState(false)
  const [selectedAttachments, setSelectedAttachments] = useState<SelectedSource[]>([])
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string } | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null)
  const [inputBarBottom, setInputBarBottom] = useState(56)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
  const accumulatedTranscriptRef = useRef<string>("")
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const hasMessages = messages.length > 0

  const messagesRef = useRef(messages)
  messagesRef.current = messages
  useEffect(() => {
    return () => {
      messagesRef.current.forEach((msg) => {
        msg.attachments?.forEach((att) => {
          if (att.url) URL.revokeObjectURL(att.url)
        })
      })
    }
  }, [])

  // On mobile: position input bar above keyboard when keyboard is visible (same as chat page)
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return
    const vv = window.visualViewport
    const update = () => {
      const bottom =
        vv.height > 0 && vv.height < window.innerHeight - 80
          ? window.innerHeight - vv.height
          : 56
      setInputBarBottom(bottom)
    }
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
    }
  }, [])

  // One sidebar item per chat (current conversation), not per message
  useEffect(() => {
    if (typeof window === "undefined" || !id) return
    try {
      const raw = sessionStorage.getItem(`${PROJECT_STORAGE_KEY}-${id}`)
      if (raw) {
        const data: StoredProject = JSON.parse(raw)
        setProjectName(data.name || "New Project")
        setProjectMentors(data.mentors || [])
      } else {
        setProjectName("New Project")
        setProjectMentors([])
      }
    } catch {
      setProjectName("New Project")
      setProjectMentors([])
    }
    setReady(true)
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isAssistantTyping])

  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }
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

  const projectSlug = id || "new-project"

  const handleSubmit = (content: string) => {
    const text = content.trim()
    const hasAttachments = selectedAttachments.length > 0
    if (!text && !hasAttachments) return

    const attachments: ChatMessageAttachment[] = selectedAttachments.map((src) => {
      const isImage = src.file && src.file.type.startsWith("image/")
      return {
        id: src.id,
        name: src.name,
        type: src.type,
        ...(isImage && src.file ? { url: URL.createObjectURL(src.file) } : {}),
      }
    })

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text || "",
      ...(attachments.length > 0 ? { attachments } : {}),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setSelectedAttachments([])
    setReplyingTo(null)
    setIsAssistantTyping(true)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: SAMPLE_AI_RESPONSE,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsAssistantTyping(false)
    }, 800)
  }

  const stopDictation = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
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
      typeof window !== "undefined" && (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
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
    recognition.onresult = (event: any) => {
      let interim = ""
      let hadFinal = false
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          accumulatedTranscriptRef.current += t
          hadFinal = true
        } else {
          interim += t
        }
      }
      setInputValue(accumulatedTranscriptRef.current + interim)
      if (hadFinal) {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = setTimeout(() => stopDictation(), 2000)
      }
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

  const handlePhoneCallClick = () => {
    console.log("[ProjectView] phone call clicked")
  }

  if (!ready) {
    return (
      <div className="h-screen-dvh overflow-y-auto bg-background">
        <SidebarLearner
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          showAdminButtons={true}
          isLoggedIn={true}
        />
        <div
          className={cn(
            "flex flex-col min-h-screen-dvh transition-all duration-300",
            sidebarCollapsed ? "md:ml-16" : "md:ml-64",
          )}
        >
          <Header
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
            isLoggedIn={true}
            showLogo={true}
            showBackButton={true}
            showModelSelector={true}
            sidebarCollapsed={sidebarCollapsed}
          />
          <div className="flex flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-[#00A3EC] border-t-transparent rounded-full animate-spin" />
          </div>
          <PlatformFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen-dvh overflow-y-auto bg-background">
      {/* Fullscreen image overlay */}
      {fullscreenImageUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image fullscreen view"
        >
          <button
            type="button"
            onClick={() => setFullscreenImageUrl(null)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={fullscreenImageUrl}
            alt="Full size"
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute inset-0 -z-10"
            onClick={() => setFullscreenImageUrl(null)}
            aria-label="Close"
          />
        </div>
      )}
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={true}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen-dvh transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={true}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex flex-1">
          <main
            className={cn(
              "flex-1 transition-all duration-300 pb-[200px] md:pb-[200px]",
              hasMessages && "pb-[56px]",
            )}
          >
            <div className="flex">
              <div className="flex-1 pt-0 pb-6 px-4 md:px-8 w-full max-w-4xl mx-auto">
            {!hasMessages ? (
                  <ProjectView
                    projectName={projectName}
                    projectSlug={projectSlug}
                    projectMentors={projectMentors}
                    onSubmit={handleSubmit}
                    onPhoneCallClick={handlePhoneCallClick}
                    value={inputValue}
                    onChange={setInputValue}
                    placeholder="Ask anything"
                    onAddSourcesClick={() => setIsAddSourcesDialogOpen(true)}
                    selectedAttachments={selectedAttachments}
                    onRemoveAttachment={(id) => setSelectedAttachments((prev) => prev.filter((s) => s.id !== id))}
                    fileInputRef={fileInputRef}
                    isListening={isListening}
                    onVoiceClick={handleDictationClick}
                  />
            ) : (
                    <div className="w-full max-w-3xl mx-auto py-6 pb-6 px-4 md:px-6">
                    {messages.map((msg) =>
                      msg.role === "user" ? (
                        <div key={msg.id} className="flex flex-col items-end gap-2 mb-4">
                          {msg.attachments && msg.attachments.length > 0 ? (
                            <div className="flex justify-end">
                              <div className="rounded-xl px-4 py-2.5 max-w-[85%] sm:max-w-[75%] border border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                  {msg.attachments.map((att) =>
                                    att.url ? (
                                      <button
                                        key={att.id}
                                        type="button"
                                        onClick={() => setFullscreenImageUrl(att.url ?? null)}
                                        className="block rounded-lg overflow-hidden border border-gray-200 max-w-[200px] max-h-[200px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00A3EC] focus:ring-offset-1"
                                      >
                                        <img src={att.url} alt={att.name} className="w-full h-auto object-cover pointer-events-none" />
                                      </button>
                                    ) : (
                                      <div
                                        key={att.id}
                                        className="flex items-center gap-2 rounded-md bg-gray-200/80 py-1.5 pl-2 pr-3 text-slate-700"
                                      >
                                        <FileImage className="h-4 w-4 shrink-0 text-[#2563EB]" />
                                        <span className="text-xs truncate max-w-[140px]" title={att.name}>
                                          {att.name}
                                        </span>
                                        <span className="text-xs text-slate-500">{att.type}</span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : null}
                          {msg.content ? (
                            <div className="flex justify-end">
                              <div className="rounded-xl px-4 py-2.5 max-w-[85%] sm:max-w-[75%] bg-gray-100">
                                <p className="text-xs text-slate-800">{msg.content}</p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div key={msg.id} className="mb-6">
                          <div
                            className="text-xs leading-relaxed prose prose-sm max-w-none pb-[15px]"
                            style={{ color: "rgb(113,121,133)" }}
                            dangerouslySetInnerHTML={{ __html: formatAssistantMessage(msg.content) }}
                          />
                          <div className="flex items-center gap-0.5 mt-3 pt-2 text-gray-400">
                            <TooltipFlowbite content={copiedMessageId === msg.id ? "Copied" : "Copy"} position="top">
                              <button
                                type="button"
                                className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors"
                                aria-label={copiedMessageId === msg.id ? "Copied" : "Copy"}
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(msg.content)
                                    setCopiedMessageId(msg.id)
                                    setTimeout(() => setCopiedMessageId(null), 2000)
                                  } catch (_) {}
                                }}
                              >
                                {copiedMessageId === msg.id ? (
                                  <Check className="h-4 w-4 text-[#00A3EC]" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </TooltipFlowbite>
                            <TooltipFlowbite content="Read aloud" position="top">
                              <button type="button" className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors" aria-label="Read aloud">
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </TooltipFlowbite>
                            <TooltipFlowbite content="Reply to message" position="top">
                              <button
                                type="button"
                                className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors"
                                aria-label="Reply to message"
                                onClick={() => setReplyingTo({ id: msg.id, content: msg.content })}
                              >
                                <Reply className="h-4 w-4" />
                              </button>
                            </TooltipFlowbite>
                          </div>
                        </div>
                      ),
                    )}
                    {isAssistantTyping && <LoadingMessage mentorName="agentAI" />}
                    <div ref={messagesEndRef} />
                    </div>
            )}

              </div>
            </div>
          </main>
        </div>

        {hasMessages && (
          <TooltipProvider>
            <div
              className={cn(
                "fixed right-0 left-0 z-20 bg-white/95 backdrop-blur px-3 sm:px-4 pb-2 pt-2 transition-[left] duration-300",
                sidebarCollapsed ? "md:left-16" : "md:left-64",
              )}
              style={{ borderColor: "#F1F2F3", bottom: inputBarBottom }}
            >
              <div className="w-full max-w-3xl mx-auto min-w-0">
                <ChatInputForm
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={() => handleSubmit(inputValue)}
                  placeholder="Ask anything"
                  onAddSourcesClick={() => setIsAddSourcesDialogOpen(true)}
                  onVoiceClick={handleDictationClick}
                  isListening={isListening}
                  selectedAttachments={selectedAttachments}
                  onRemoveAttachment={(id) => setSelectedAttachments((prev) => prev.filter((s) => s.id !== id))}
                  replyingTo={replyingTo}
                  onClearReply={() => setReplyingTo(null)}
                  compact
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
          </TooltipProvider>
        )}

        <PlatformFooter />
      </div>

      <AddSourcesDialog
        open={isAddSourcesDialogOpen}
        onOpenChange={setIsAddSourcesDialogOpen}
        onFileInputTrigger={() => fileInputRef.current?.click()}
        sourceCount={selectedAttachments.length}
        onSourcesSelected={setSelectedAttachments}
      />
    </div>
  )
}
