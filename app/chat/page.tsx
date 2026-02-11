"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { JumpstartTemplates } from "@/components/jumpstart-templates"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { AddSourcesDialog, type SelectedSource } from "@/components/chat-input/add-sources-dialog"
import { ChatInputForm } from "@/components/chat-input-form"
import { LoadingMessage } from "@/components/loading-message"
import { TooltipProvider, TooltipFlowbite } from "@/components/ui/tooltip-flowbite"
import { Copy, Volume2, Reply, FileStack, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
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

const SAMPLE_AI_RESPONSE = `Here's a **simple beginner-friendly path to learn AI from scratch:**

**1 Start with AI basics (No coding needed)**

I've shared a Coursera video from "AI For Everyone" by Andrew Ng (DeepLearning.AI) above.

This course helps you understand:

• What AI really is (and what it isn't)
• Machine Learning vs Deep Learning
• How AI is used in real life
• AI ethics and future impact

Perfect if you're **new to AI**.

**Suggested Beginner Order**

1. AI For Everyone ✅
2. Python Basics
3. Machine Learning Fundamentals
4. Small AI Projects

Would you like me to create a 30-day AI learning plan or suggest free AI courses based on your goal (job, startup, or curiosity)?`

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAddSourcesDialogOpen, setIsAddSourcesDialogOpen] = useState(false)
  const [selectedAttachments, setSelectedAttachments] = useState<SelectedSource[]>([])
  const [chatTitleByIndex, setChatTitleByIndex] = useState<Record<number, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputBarBottom, setInputBarBottom] = useState(56)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string } | null>(null)

  const isLoggedIn = true
  const hasMessages = messages.length > 0

  // On mobile: position input bar above keyboard when keyboard is visible (footer stays fixed at viewport bottom)
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

  // When navigating to /chat?new=1 (e.g. clicking Chats in sidebar), show default welcome view
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setMessages([])
      setInputValue("")
      setIsAssistantTyping(false)
      router.replace("/chat")
    }
  }, [searchParams, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleTemplateClick = (question: string) => {
    setInputValue(question)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isAssistantTyping])

  const handleFileInputTrigger = () => {
    fileInputRef.current?.click()
  }

  const handleDictationClick = () => {
    setIsListening((prev) => !prev)
    // TODO: wire to speech recognition when implemented
  }

  const handleSubmit = () => {
    const text = inputValue.trim()
    if (!text) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setReplyingTo(null)
    setIsAssistantTyping(true)

    // Simulate AI response (replace with real API call later)
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

  const mainContent = (
    <>
      {!hasMessages ? (
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 min-h-0 items-center justify-center px-4 sm:px-6 py-6 sm:py-12 w-full max-w-full overflow-x-hidden sm:pl-8 sm:pr-8 md:pr-20">
            <div className="w-full max-w-6xl min-w-0">
              <div className="w-full max-w-2xl mx-auto min-w-0 mt-[55px]">
                <h2 className="text-center text-base sm:text-lg md:text-xl font-medium mb-6 sm:mb-8 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent px-1">
                  How may I help you today?
                </h2>
                <div className="mb-4">
                  <ChatInputForm
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleSubmit}
                    placeholder="Ask anything"
                    onAddSourcesClick={() => setIsAddSourcesDialogOpen(true)}
                    onVoiceClick={handleDictationClick}
                    isListening={isListening}
                    selectedAttachments={selectedAttachments}
                    onRemoveAttachment={(id) => setSelectedAttachments((prev) => prev.filter((s) => s.id !== id))}
                    fileInputRef={fileInputRef}
                  />
                </div>
              </div>
              {/* Jumpstart prompt boxes - same layout as new course page (one row) */}
              <JumpstartTemplates onTemplateSelect={handleTemplateClick} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-w-0">
          <div className="w-full max-w-3xl mx-auto py-4 sm:py-6 pb-6 px-4 sm:px-6 min-w-0">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end mb-4">
                  <div className="rounded-xl px-4 py-2.5 max-w-[85%] sm:max-w-[75%] bg-gray-100">
                    <p className="text-xs text-slate-800">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="mb-6">
                  <div
                    className="text-xs leading-relaxed prose prose-sm max-w-none pb-2"
                    style={{ color: "rgb(113,121,133)" }}
                    dangerouslySetInnerHTML={{ __html: formatAssistantMessage(msg.content) }}
                  />
                  <div className="flex items-center gap-0.5 mt-1.5 pt-1 text-gray-400">
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
              )
            )}
            {isAssistantTyping && <LoadingMessage mentorName="agentAI" />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  )

  const fixedPromptBar = (
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
            onSubmit={handleSubmit}
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
  )

  // One sidebar item per chat (current conversation), not per message
  const firstUserMessage = messages.find((m) => m.role === "user")
  const currentChatPreview =
    chatTitleByIndex[0] ??
    (firstUserMessage
      ? firstUserMessage.content.length > 50
        ? firstUserMessage.content.slice(0, 50).trim() + "…"
        : firstUserMessage.content
      : "")
  const recentChatPreviews = hasMessages ? [currentChatPreview] : []

  const handleRenameChat = (index: number, newName: string) => {
    if (index !== 0) return
    setChatTitleByIndex((prev) => ({ ...prev, 0: newName }))
  }
  const handleDeleteChat = (index: number) => {
    if (index !== 0) return
    setMessages([])
    setChatTitleByIndex({})
  }
  const handlePinChat = (_index: number) => {
    // Optional: add to pinned list or show toast
  }

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={isLoggedIn}
        recentChatPreviews={recentChatPreviews}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onPinChat={handlePinChat}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={isLoggedIn}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex flex-1 min-h-0 min-w-0">
          <main className="flex-1 flex flex-col min-h-0 min-w-0 transition-all duration-300 pb-[200px] md:pb-[200px] overflow-x-hidden">
            {mainContent}
            <PlatformFooter />
          </main>
        </div>
        {hasMessages && fixedPromptBar}
      </div>

      <AddSourcesDialog
        open={isAddSourcesDialogOpen}
        onOpenChange={setIsAddSourcesDialogOpen}
        onFileInputTrigger={handleFileInputTrigger}
        sourceCount={selectedAttachments.length}
        onSourcesSelected={setSelectedAttachments}
      />
    </div>
  )
}
