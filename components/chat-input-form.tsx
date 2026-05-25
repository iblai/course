"use client"

import { useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import { cn } from "@/lib/utils"
import { X, Square } from "lucide-react"
import { asset } from "@/lib/iblai/asset-url"

const PROMPT_ICONS = asset("/icons/home-prompt")

export interface ChatInputFormAttachment {
  id: string
  name: string
  type: string
}

export interface ReplyingTo {
  id: string
  content: string
}

interface ChatInputFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  onAddSourcesClick?: () => void
  onVoiceClick?: () => void
  isListening?: boolean
  selectedAttachments?: ChatInputFormAttachment[]
  onRemoveAttachment?: (id: string) => void
  /** When set, show reply preview inside the prompt box (like attachments) */
  replyingTo?: ReplyingTo | null
  onClearReply?: () => void
  /** Compact mode for fixed prompt bar (smaller height/padding) */
  compact?: boolean
  /** Optional ref for hidden file input (parent may use for trigger) */
  fileInputRef?: React.RefObject<HTMLInputElement | null>
}

export function ChatInputForm({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask anything",
  onAddSourcesClick,
  onVoiceClick,
  isListening = false,
  selectedAttachments = [],
  onRemoveAttachment,
  replyingTo = null,
  onClearReply,
  compact = false,
  fileInputRef: externalFileInputRef,
}: ChatInputFormProps) {
  const localFileInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = externalFileInputRef ?? localFileInputRef
  const hasReplyOrAttachments = replyingTo || selectedAttachments.length > 0

  return (
    <div
      data-prompt-area
      className={cn(
        "bg-[#FBFBFB] rounded-2xl flex flex-col border-2 relative",
        compact ? "min-h-0" : "",
      )}
      style={{ borderColor: "#F1F2F3" }}
    >
      {replyingTo && (
        <div className="flex items-center gap-2 pl-2.5 pr-2.5 pt-3 pb-2.5 min-h-0 shrink-0">
          <div className="relative flex items-start gap-2 rounded-md bg-gray-100/90 border border-gray-200/80 py-2 pl-2 pr-8 min-w-0 max-w-full flex-1">
            <div className="flex flex-col min-w-0 text-left flex-1">
              <span className="text-xs font-medium bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent">
                agentAI
              </span>
              <p className="text-sm text-slate-700 line-clamp-2 break-words mt-0.5" title={replyingTo.content}>
                {replyingTo.content}
              </p>
            </div>
            {onClearReply && (
              <button
                type="button"
                onClick={onClearReply}
                className="absolute top-1 right-1 w-6 h-6 rounded-[5px] flex items-center justify-center text-slate-500 bg-white border border-gray-200/80 shadow-sm hover:bg-gray-100 hover:text-gray-700 transition-colors z-10"
                aria-label="Cancel reply"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
      {selectedAttachments.length > 0 && (
        <div className="flex items-center gap-2 pl-2.5 pr-2.5 pt-3 pb-2.5 overflow-x-auto flex-nowrap scrollbar-hide min-h-0 shrink-0">
          {selectedAttachments.map((source) => (
            <div
              key={source.id}
              className="relative flex items-center gap-2 rounded-md bg-gray-100/90 border border-gray-200/80 py-1.5 pl-2 pr-6 min-w-0 max-w-full shrink-0"
            >
              <img src={`${PROMPT_ICONS}/file-image.svg`} alt="" className="h-4 w-4 shrink-0" aria-hidden />
              <div className="flex flex-col min-w-0 text-left">
                <span
                  className={cn(
                    "text-sm text-slate-700 truncate",
                    compact ? "max-w-[140px]" : "max-w-[140px] sm:max-w-[200px]",
                  )}
                  title={source.name}
                >
                  {source.name}
                </span>
                <span className="text-xs text-slate-500">{source.type}</span>
              </div>
              {onRemoveAttachment && (
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(source.id)}
                  className="absolute top-[-6px] right-[-6px] w-6 h-6 rounded-[5px] flex items-center justify-center text-slate-500 bg-white border border-gray-200/80 shadow-sm hover:bg-gray-100 hover:text-slate-700 transition-colors z-10"
                  aria-label="Remove attachment"
                >
                  <img src={`${PROMPT_ICONS}/x.svg`} alt="" className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isListening ? "" : placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          className={cn(
            "w-full bg-transparent px-4 text-base focus:outline-none rounded-2xl border-0 resize-none placeholder:text-gray-400 placeholder:text-base shadow-none focus-visible:ring-0 focus-visible:border-0",
            compact
              ? "min-h-[52px] py-2.5"
              : "min-h-[80px] pb-3",
            compact ? (isListening ? "pt-9" : "pt-2.5") : isListening ? "pt-10" : "pt-4",
            hasReplyOrAttachments && "pt-1",
          )}
        />
        {isListening && !value.trim() && (
          <div
            className={cn(
              "absolute flex items-center gap-1 pointer-events-none left-4",
              compact ? "top-2.5" : "top-4",
            )}
          >
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
      </div>
      <div
        className={cn(
          "flex items-center justify-between px-4 border-gray-200 rounded-b-2xl",
          compact ? "py-2" : "py-3",
        )}
      >
        <TooltipProvider>
          <div className="flex items-center gap-1.5">
            {onAddSourcesClick && (
              <TooltipFlowbite content="Add Source" position="top">
                <button
                  type="button"
                  onClick={onAddSourcesClick}
                  className="p-1.5 transition-colors"
                  style={{ color: "rgb(113,121,133)" }}
                  aria-label="Add attachment"
                >
                  <img src={`${PROMPT_ICONS}/plus.svg`} alt="" className="w-5 h-5 shrink-0" aria-hidden />
                </button>
              </TooltipFlowbite>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md"
              multiple
            />
          </div>
          <div className="flex items-center gap-2">
            {onVoiceClick && (
              <TooltipFlowbite content={isListening ? "Stop listening" : "Dictate"} position="top">
                <button
                  type="button"
                  onClick={onVoiceClick}
                  className={cn("w-9 h-9 flex items-center justify-center transition-colors rounded-lg", isListening ? "text-white" : "")}
                  style={
                    isListening ? { backgroundColor: "#00A6F1", color: "white" } : { color: "rgb(113,121,133)" }
                  }
                  aria-label={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? (
                    <Square className="w-3.5 h-3.5 shrink-0 fill-current" strokeWidth={0} />
                  ) : (
                    <img
                      src={`${PROMPT_ICONS}/mic.svg`}
                      alt=""
                      className="w-5 h-5 shrink-0"
                      aria-hidden
                    />
                  )}
                </button>
              </TooltipFlowbite>
            )}
            {!isListening && (
              <TooltipFlowbite content="Send Message" position="top">
                <button
                  type="button"
                  onClick={onSubmit}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-white hover:opacity-90"
                  style={{ backgroundColor: "#00A6F1" }}
                  aria-label="Submit"
                >
                  <img src={`${PROMPT_ICONS}/arrow-up.svg`} alt="" className="w-5 h-5 shrink-0" aria-hidden />
                </button>
              </TooltipFlowbite>
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
