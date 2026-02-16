"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import { ArrowUp, Mic, Paperclip, Square, X } from "lucide-react"

// Type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface PortableVoicePromptBoxProps {
  onSubmit: (content: string, files?: File[]) => void
  placeholder?: string
  disabled?: boolean
  showFileUpload?: boolean
  className?: string
  onVoiceActiveChange?: (isActive: boolean) => void
  onVoiceTranscript?: (transcript: string) => void
}

export function PortableVoicePromptBox({
  onSubmit,
  placeholder = "Ask anything...",
  disabled = false,
  showFileUpload = true,
  className = "",
  onVoiceActiveChange,
  onVoiceTranscript,
}: PortableVoicePromptBoxProps) {
  const [inputValue, setInputValue] = useState("")
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isDictating, setIsDictating] = useState(false)
  const [audioLevels, setAudioLevels] = useState<number[]>([0.3, 0.5, 0.8, 0.5, 0.3])
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)
  const dictationRecognitionRef = useRef<any>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSpeechTimeRef = useRef<number>(Date.now())
  const accumulatedTranscriptRef = useRef<string>("")

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioAnalysis()
      stopSpeechRecognition()
      stopDictation()
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }
  }, [])

  // Handle voice active state changes
  useEffect(() => {
    if (isVoiceActive) {
      startAudioAnalysis()
      startSpeechRecognition()
    } else {
      stopAudioAnalysis()
      stopSpeechRecognition()
    }
  }, [isVoiceActive])

  // Speech recognition for voice button
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported")
      return
    }

    accumulatedTranscriptRef.current = ""
    lastSpeechTimeRef.current = Date.now()

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      const currentTranscript = final || interim
      if (currentTranscript) {
        setInputValue(currentTranscript)
        lastSpeechTimeRef.current = Date.now()
      }

      if (final) {
        accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? " " : "") + final.trim()

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current)
        }

        silenceTimeoutRef.current = setTimeout(() => {
          if (accumulatedTranscriptRef.current.trim() && isVoiceActive) {
            onSubmit(accumulatedTranscriptRef.current.trim())
            onVoiceTranscript?.(accumulatedTranscriptRef.current.trim())
            accumulatedTranscriptRef.current = ""
            setInputValue("")
          }
        }, 2000)
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
    }

    recognition.onend = () => {
      if (isVoiceActive && recognitionRef.current) {
        try {
          recognition.start()
        } catch (e) {
          console.error("Error restarting recognition:", e)
        }
      }
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (e) {
      console.error("Error starting speech recognition:", e)
    }
  }

  const stopSpeechRecognition = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      recognitionRef.current = null
    }
  }

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 32
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateLevels = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)

        const bands = [
          dataArray[1] / 255,
          dataArray[2] / 255,
          dataArray[3] / 255,
          dataArray[4] / 255,
          dataArray[5] / 255,
        ].map((v) => Math.max(0.2, Math.min(1, v * 1.5 + 0.2)))

        setAudioLevels(bands)
        animationFrameRef.current = requestAnimationFrame(updateLevels)
      }

      updateLevels()
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setAudioLevels([0.4, 0.6, 0.8, 0.6, 0.4])
    }
  }

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    analyserRef.current = null
    setAudioLevels([0.3, 0.5, 0.8, 0.5, 0.3])
  }

  const handleDictation = () => {
    if (isDictating) {
      stopDictation()
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please try Chrome or Edge.")
      return
    }

    setIsDictating(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let finalTranscript = ""
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript
      }
      setInputValue(finalTranscript)
    }

    recognition.onerror = (event: any) => {
      console.error("Dictation error:", event.error)
      stopDictation()
    }

    recognition.onend = () => {
      setIsDictating(false)
      textareaRef.current?.focus()
    }

    try {
      recognition.start()
      dictationRecognitionRef.current = recognition
    } catch (e) {
      console.error("Error starting dictation:", e)
      setIsDictating(false)
    }
  }

  const stopDictation = () => {
    if (dictationRecognitionRef.current) {
      try {
        dictationRecognitionRef.current.stop()
      } catch (e) {}
      dictationRecognitionRef.current = null
    }
    setIsDictating(false)
  }

  const handleVoiceClick = () => {
    if (isVoiceActive) {
      if (accumulatedTranscriptRef.current.trim() || inputValue.trim()) {
        const finalTranscript = accumulatedTranscriptRef.current.trim() || inputValue.trim()
        onSubmit(finalTranscript)
        onVoiceTranscript?.(finalTranscript)
        accumulatedTranscriptRef.current = ""
        setInputValue("")
      }
      setIsVoiceActive(false)
      onVoiceActiveChange?.(false)
    } else {
      setIsVoiceActive(true)
      onVoiceActiveChange?.(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() && attachedFiles.length === 0) return

    onSubmit(inputValue, attachedFiles.length > 0 ? attachedFiles : undefined)
    setInputValue("")
    setAttachedFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const VoiceIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.6039 37.2002V10.8002C17.6039 9.9188 18.3186 9.20417 19.2 9.2041C20.0814 9.2041 20.7961 9.91875 20.7961 10.8002V37.2002C20.7961 38.0817 20.0814 38.7962 19.2 38.7962C18.3186 38.7962 17.6039 38.0817 17.6039 37.2002ZM27.204 31.5144V17.2994C27.204 16.418 27.9185 15.7034 28.8 15.7033C29.6815 15.7033 30.396 16.418 30.396 17.2994V31.5144C30.396 32.3956 29.6815 33.1104 28.8 33.1104C27.9187 33.1104 27.204 32.3956 27.204 31.5144ZM8.00391 27.2486V21.1572C8.00391 20.2758 8.71855 19.5611 9.6 19.5611C10.4815 19.5611 11.1961 20.2758 11.1961 21.1572V27.2486C11.1961 28.1301 10.4815 28.8448 9.6 28.8448C8.71855 28.8448 8.00391 28.1301 8.00391 27.2486ZM36.804 27.2486V21.1572C36.804 20.2758 37.5185 19.5611 38.4 19.5611C39.2815 19.5611 39.996 20.2758 39.996 21.1572V27.2486C39.996 28.1301 39.2815 28.8448 38.4 28.8448C37.5185 28.8448 36.804 28.1301 36.804 27.2486Z"
        fill="white"
      />
    </svg>
  )

  const WaveBars = () => (
    <div className="flex items-center justify-center gap-[2px] h-5 w-5">
      {audioLevels.map((level, i) => (
        <div
          key={i}
          className="w-[3px] bg-white rounded-full transition-all duration-75"
          style={{ height: `${level * 16}px` }}
        />
      ))}
    </div>
  )

  const ListeningDots = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      <span className="ml-2 text-gray-400 text-sm">Listening...</span>
    </div>
  )

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className={`w-full max-w-4xl mx-auto ${className}`}>
        <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 border-b border-gray-100">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-sm">
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#FBFBFB] rounded-2xl flex flex-col relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isDictating ? "" : placeholder}
              disabled={disabled}
              className="w-full min-h-[60px] bg-transparent px-4 pt-4 pb-2 text-base focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl border-0 resize-none placeholder:text-gray-400 shadow-none"
            />

            {isDictating && !inputValue && (
              <div className="absolute top-6 left-4">
                <ListeningDots />
              </div>
            )}

            <div className="flex items-center justify-between px-3 py-2.5 border-gray-200 rounded-b-2xl">
              <div className="flex items-center gap-2">
                {showFileUpload && (
                  <>
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
                    <TooltipFlowbite content="Attach file" position="top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </TooltipFlowbite>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
<TooltipFlowbite content={isDictating ? "Stop listening" : "Dictate"} position="top">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full transition-all duration-200 ${
                    isDictating ? "bg-blue-100 text-blue-500" : "text-gray-400 hover:bg-gray-100"
                  }`}
                  onClick={handleDictation}
                  aria-label={isDictating ? "Stop listening" : "Dictate"}
                >
                  {isDictating ? (
                    <Square className="h-4 w-4 fill-current" strokeWidth={0} />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </TooltipFlowbite>

                {!isDictating && (
                  <>
{isVoiceActive ? (
                    <TooltipFlowbite content="End voice" position="top">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 px-4 rounded-full text-white transition-all duration-200 hover:opacity-90 hover:brightness-110"
                        style={{
                          background: "linear-gradient(135deg, #38A1E5, #7284FF)",
                        }}
                        onClick={handleVoiceClick}
                      >
                        <div className="flex items-center gap-2">
                          <WaveBars />
                          <span className="text-sm font-medium text-white">End</span>
                        </div>
                      </Button>
                    </TooltipFlowbite>
                  ) : inputValue.trim() ? (
                    <TooltipFlowbite content="Send message" position="top">
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-[#38A1E5] hover:bg-[#2891D5] text-white"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </TooltipFlowbite>
                  ) : (
                    <TooltipFlowbite content="Voice input" position="top">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 w-9 rounded-full text-white transition-all duration-200 hover:opacity-90 hover:brightness-110"
                        style={{
                          background: "linear-gradient(135deg, #38A1E5, #7284FF)",
                        }}
                        onClick={handleVoiceClick}
                      >
                        <VoiceIcon />
                      </Button>
                    </TooltipFlowbite>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </TooltipProvider>
  )
}

export default PortableVoicePromptBox
