"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { ProjectView } from "@/components/project-view"
import { AddSourcesDialog, type SelectedSource } from "@/components/chat-input/add-sources-dialog"
import { ChatInputForm } from "@/components/chat-input-form"
import { TooltipProvider, TooltipFlowbite } from "@/components/ui/tooltip-flowbite"
import ChatButton from "@/components/chat-button"
import { Copy, Volume2, Reply } from "lucide-react"
import { cn } from "@/lib/utils"

const PROJECT_STORAGE_KEY = "project-data"

interface StoredProject {
  name: string
  mentors: { id: number; title: string; description: string; avatar: string }[]
}

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0

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

  const projectSlug = id || "new-project"

  const handleSubmit = (content: string) => {
    const text = content.trim()
    if (!text) return
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
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

  const handleDictationClick = () => {
    setIsListening((prev) => !prev)
  }

  const handlePhoneCallClick = () => {
    console.log("[ProjectView] phone call clicked")
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00A3EC] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
          "flex flex-col min-h-screen transition-all duration-300",
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

        <div
          className={cn(
            "flex flex-1 min-h-0 flex-col overflow-hidden",
            hasMessages && "pb-[56px]",
          )}
        >
          <main className="flex-1 min-h-0 flex flex-col transition-all duration-300 overflow-hidden">
            {!hasMessages ? (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="py-6 px-4 md:px-8">
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
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="w-full max-w-3xl mx-auto py-6 pb-6 px-4 md:px-6">
                    {messages.map((msg) =>
                      msg.role === "user" ? (
                        <div key={msg.id} className="flex justify-end mb-4">
                          <div className="rounded-xl px-4 py-2.5 max-w-[85%] sm:max-w-[75%] bg-gray-100">
                            <p className="text-sm text-slate-800">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={msg.id} className="mb-6">
                          <div
                            className="text-sm leading-relaxed prose prose-sm max-w-none pb-[15px]"
                            style={{ color: "rgb(113,121,133)" }}
                            dangerouslySetInnerHTML={{ __html: formatAssistantMessage(msg.content) }}
                          />
                          <div className="flex items-center gap-0.5 mt-3 pt-2 text-gray-400">
                            <TooltipFlowbite content="Copy" position="top">
                              <button type="button" className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors" aria-label="Copy">
                                <Copy className="h-4 w-4" />
                              </button>
                            </TooltipFlowbite>
                            <TooltipFlowbite content="Read aloud" position="top">
                              <button type="button" className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors" aria-label="Read aloud">
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </TooltipFlowbite>
                            <TooltipFlowbite content="Reply to message" position="top">
                              <button type="button" className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors" aria-label="Reply to message">
                                <Reply className="h-4 w-4" />
                              </button>
                            </TooltipFlowbite>
                          </div>
                        </div>
                      ),
                    )}
                    {isAssistantTyping && (
                      <div className="flex gap-1 mb-4">
                        <span className="sr-only">Assistant is typing</span>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </>
            )}

            {/* Chat Button - sticky right side (same as other pages) */}
            <div className="fixed top-20 right-0 z-40 flex">
              <ChatButton />
            </div>
          </main>
        </div>

        {hasMessages && (
          <TooltipProvider>
            <div
              className={cn(
                "fixed right-0 z-20 bg-white/95 backdrop-blur px-4 pb-2 transition-[left] duration-300",
                sidebarCollapsed ? "left-0 md:left-16" : "left-0 md:left-64",
              )}
              style={{ borderColor: "#F1F2F3", bottom: 56 }}
            >
              <div className="w-full max-w-3xl mx-auto">
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
