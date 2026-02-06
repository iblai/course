"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StandaloneChatInput } from "@/components/standalone-chat-input"
import { Copy, ThumbsUp, ThumbsDown, Share, RefreshCw, MoreHorizontal, ExternalLink } from "lucide-react"
import { SkillsSelectionDialog, type SkillsSelections } from "@/components/skills-selection-dialog"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AiAssistantProps {
  isLoggedIn?: boolean
  onChatStarted?: (hasMessages: boolean) => void
  onOpenCustomCourse?: (messages: Message[]) => void
  selectedMentor?: { name: string; image: string } | null
}

function ChatMessage({
  message,
  isLast,
  showCustomCourseBlock,
  isLoggedIn,
  allMessages,
  onOpenCustomCourse,
}: {
  message: Message
  isLast: boolean
  showCustomCourseBlock?: boolean
  isLoggedIn?: boolean
  allMessages?: Message[]
  onOpenCustomCourse?: (messages: Message[]) => void
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-gray-100 rounded-md px-5 py-2.5 max-w-[80%]">
          <p className="text-sm text-gray-700">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="prose prose-sm max-w-none">
        <div
          className="text-slate-600 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatAssistantMessage(message.content) }}
        />
      </div>

      {showCustomCourseBlock && <CustomCourseBlock isLoggedIn={isLoggedIn} messages={allMessages} onOpenCustomCourse={onOpenCustomCourse} />}

      {isLast && (
        <div className="flex items-center gap-1 mt-4 pt-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <Copy className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <ThumbsUp className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <ThumbsDown className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <Share className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  )
}

function formatAssistantMessage(content: string): string {
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-700">$1</strong>')
  formatted = formatted.replace(/_(.*?)_/g, '<span class="underline">$1</span>')
  formatted = formatted.replace(/^• (.*)$/gm, '<li class="ml-4 mb-1">$1</li>')
  formatted = formatted.replace(
    /^(\d+)\. (.*)$/gm,
    '<li class="ml-4 mb-1"><span class="font-medium">$1.</span> $2</li>',
  )
  formatted = formatted.replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc list-inside my-2 space-y-1">$&</ul>')
  formatted = formatted.replace(/\n/g, "<br/>")
  formatted = formatted.replace(/📘/g, '<span class="mr-1">📘</span>')
  formatted = formatted.replace(/👉/g, '<span class="mr-1">👉</span>')
  formatted = formatted.replace(/✅/g, '<span class="text-green-500">✅</span>')
  return formatted
}

const sampleAIResponse = `Here's a **simple beginner-friendly path to learn AI from scratch:**

📘 **Start with AI basics (No coding needed)**

I've shared a Coursera video from _"AI For Everyone"_ by Andrew Ng (DeepLearning.AI) above.

This course helps you understand:

• What AI really is (and what it isn't)
• Machine Learning vs Deep Learning
• How AI is used in real life
• AI ethics and future impact

👉 Perfect if you're _new to AI._

---

**Suggested Beginner Order**

1. AI For Everyone ✅
2. Python Basics
3. Machine Learning Fundamentals
4. Small AI Projects

Would you like me to create a 30-day AI learning plan or suggest free AI courses based on your goal (job, startup, or curiosity)?`

const customCourseResponse = `Great choice! I've created a **personalized 30-day AI learning plan** just for you.

**Your Custom Learning Path:**

**Week 1: AI Foundations**
• Day 1-3: Introduction to Artificial Intelligence
• Day 4-5: Understanding Machine Learning concepts
• Day 6-7: Overview of Deep Learning

**Week 2: Python for AI**
• Day 8-10: Python basics and data structures
• Day 11-12: NumPy and Pandas essentials
• Day 13-14: Data visualization with Matplotlib

**Week 3: Machine Learning Basics**
• Day 15-17: Supervised Learning algorithms
• Day 18-19: Unsupervised Learning techniques
• Day 20-21: Model evaluation and optimization

**Week 4: Practical Projects**
• Day 22-24: Build your first ML model
• Day 25-27: Natural Language Processing basics
• Day 28-30: Complete a mini AI project

This plan includes **video lessons**, **hands-on exercises**, and **quizzes** to track your progress.`

function CustomCourseBlock({ 
  isLoggedIn, 
  messages,
  onOpenCustomCourse 
}: { 
  isLoggedIn?: boolean
  messages?: Message[]
  onOpenCustomCourse?: (messages: Message[]) => void
}) {
  const router = useRouter()

  const handleOpenCourse = () => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      if (messages && messages.length > 0) {
        sessionStorage.setItem("customCourseMessages", JSON.stringify(messages))
      }
      // On mobile, use callback to show as modal; on desktop, navigate
      if (onOpenCustomCourse && messages) {
        onOpenCustomCourse(messages)
      } else {
        router.push("/custom-course")
      }
    }
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-600">Your Custom AI Learning Course</h4>
          <p className="text-sm text-gray-600 mt-1">30-day personalized learning path</p>
        </div>
        <Button
          onClick={handleOpenCourse}
          className="text-white gap-2 hover:opacity-90 w-full sm:w-auto"
          style={{ background: "var(--gradient-bg)" }}
        >
          Open Custom Course
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const hintMessage = `Help us customizing a learning plan for you. If you prefer a voice conversation tap the blue button below. Ready?`

const AiAssistant = ({ isLoggedIn = false, onChatStarted, onOpenCustomCourse, selectedMentor }: AiAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false)
  
  // Current mentor being displayed (either selected or default)
  const currentMentor = selectedMentor || { name: "Mikel AI", image: "/images/mikel-ai.png" }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    onChatStarted?.(messages.length > 0)
  }, [messages.length, onChatStarted])

  const handleSubmit = (message: string, files?: File[]) => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    const isFirstMessage = messages.length === 0
    const isYesResponse = message.trim().toLowerCase() === "yes"

    if (isFirstMessage && isYesResponse) {
      const hintAssistantMessage: Message = {
        id: (Date.now() - 2).toString(),
        role: "assistant",
        content: hintMessage,
      }
      setMessages([hintAssistantMessage, userMessage])
    } else {
      setMessages((prev) => [...prev, userMessage])
    }

    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isYesResponse ? customCourseResponse : sampleAIResponse,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const shouldShowCustomCourseBlock = (messageIndex: number) => {
    if (messageIndex > 0) {
      const prevMessage = messages[messageIndex - 1]
      if (prevMessage.role === "user" && prevMessage.content.trim().toLowerCase() === "yes") {
        return true
      }
    }
    return false
  }

  const handleSkillsComplete = (selections: SkillsSelections) => {
    console.log("Skills selected:", selections)
    // You can handle the selections here, e.g., send to API or use for recommendations
  }

  if (messages.length > 0 && isLoggedIn) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div
          className="flex-1 overflow-y-auto py-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="max-w-3xl mx-auto px-0">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1 && message.role === "assistant" && !isLoading}
                showCustomCourseBlock={message.role === "assistant" && shouldShowCustomCourseBlock(index)}
                isLoggedIn={isLoggedIn}
                allMessages={messages}
                onOpenCustomCourse={onOpenCustomCourse}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-300 animate-spin" />
                  <div className="absolute inset-1 rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <img src={currentMentor.image} alt="Loading" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-gray-600 text-base">Just a sec...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-gray-100 bg-white py-0 border-t-0">
          <div className="max-w-3xl mx-auto px-0">
            <StandaloneChatInput
              onSubmit={handleSubmit}
              placeholder="Help us customizing a learning plan for you. If you prefer a voice conversation tap the blue button below. Ready?"
              allowFileUpload={false}
              isLoggedIn={isLoggedIn}
              isInChatListView={true}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-center text-lg font-semibold text-text-primary mb-4">Talk to our Academic Advisor</h2>
      <div className="w-full bg-gradient-to-r from-white from-50% to-accent to-100% rounded-xl border border-border p-4 sm:p-6 shadow-sm flex flex-col items-center">
      <div className="flex items-center gap-3 mb-4 w-full max-w-[550px] flex-wrap justify-start">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary/20">
          <img src={currentMentor.image} alt={currentMentor.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-[#38A1E5] to-[#7284FF] bg-clip-text text-transparent">
          {currentMentor.name}
        </h2>
      </div>

      <div className="w-full max-w-2xl px-0 sm:px-0">
        <StandaloneChatInput
          onSubmit={handleSubmit}
          placeholder="Help us customizing a learning plan for you. If you prefer a voice conversation tap the blue button below. Ready?"
          allowFileUpload={false}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <div className="max-w-[550px] w-full mx-auto">
        <div className="flex flex-row items-center justify-center gap-3 my-4 sm:my-6">
          <Button
            variant="outline"
            className="text-white border-transparent hover:opacity-90 hover:text-white px-4 sm:px-6 text-sm sm:text-base whitespace-normal text-center bg-transparent"
            style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/login")
              } else {
                setSkillsDialogOpen(true)
              }
            }}
          >
            Manually select your areas of interest
          </Button>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary text-sm"
            onClick={() => {
              router.push(isLoggedIn ? "/browse?loggedIn=true" : "/login")
            }}
          >
            Skip for now
          </Button>
        </div>
      </div>

      <SkillsSelectionDialog
        open={skillsDialogOpen}
        onOpenChange={setSkillsDialogOpen}
        onComplete={handleSkillsComplete}
      />
      </div>
    </div>
  )
}

export { AiAssistant }
export default AiAssistant
