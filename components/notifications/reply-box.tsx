"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface ReplyBoxProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  recipientName?: string
}

export function ReplyBox({ value, onChange, onSend, recipientName }: ReplyBoxProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState("Listening...")
  const recognitionRef = useRef<any>(null)
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const accumulatedTranscriptRef = useRef("")

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignore errors when stopping
      }
      recognitionRef.current = null
    }

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }

    setIsRecording(false)
    setRecordingStatus("Listening...")
  }

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording()
      return
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition. Please try Chrome or Edge.")
      return
    }

    setIsRecording(true)
    setRecordingStatus("Listening...")
    accumulatedTranscriptRef.current = value

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsRecording(true)
      recordingTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          setRecordingStatus("No speech detected. Try again.")
          setTimeout(() => {
            stopRecording()
          }, 2000)
        }
      }, 15000)
    }

    recognition.onresult = (event) => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current)
        recordingTimeoutRef.current = setTimeout(() => {
          if (isRecording) {
            stopRecording()
          }
        }, 5000)
      }

      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          accumulatedTranscriptRef.current += t
        } else {
          interim += t
        }
      }
      onChange(accumulatedTranscriptRef.current + interim)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)

      if (event.error === "no-speech") {
        setRecordingStatus("No speech detected. Try again.")
        setTimeout(() => {
          stopRecording()
        }, 2000)
      } else if (event.error === "aborted") {
        stopRecording()
      } else {
        setRecordingStatus(`Error: ${event.error}. Try again.`)
        setTimeout(() => {
          stopRecording()
        }, 2000)
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    try {
      recognition.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      stopRecording()
    }
  }

  return (
    <div className="flex-shrink-0 px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-200 bg-white sticky bottom-0 z-10 mb-safe mb-[60px]">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-1.5 block">Reply to Message</label>
      <div className="relative rounded-lg border border-gray-200 bg-[#FBFBFB]">
        <Textarea
          placeholder={isRecording ? "" : "Type your reply..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[44px] sm:min-h-[50px] max-h-[70px] sm:max-h-[80px] bg-transparent px-2 sm:px-3 pt-2 sm:pt-2.5 pb-10 sm:pb-11 text-base sm:text-sm focus:outline-none rounded-lg border-0 resize-none placeholder:text-gray-400"
          style={{ fontSize: "16px" }}
        />
        {isRecording && !value && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-xs text-blue-600">{recordingStatus}</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 flex items-center gap-1 sm:gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceInput}
            className={cn(
              "h-6 w-6 sm:h-7 sm:w-7 rounded-full transition-all",
              isRecording
                ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:opacity-90"
                : "hover:bg-gray-100",
            )}
          >
            {isRecording ? <Square className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" /> : <Mic className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
          </Button>
          <Button
            onClick={onSend}
            disabled={!value.trim()}
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-1.5">Reply will be sent to {recipientName || "the user"}</p>
    </div>
  )
}
