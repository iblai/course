"use client"

import { useState } from "react"
import { Square } from "lucide-react"
import { useConversation } from "@elevenlabs/react"
import Image from "next/image"

export function FloatingMicrophoneButton() {
  const [isListening, setIsListening] = useState(false)

  const conversation = useConversation({
    onConnect: () => {
      setIsListening(true)
    },
    onDisconnect: () => {
      setIsListening(false)
    },
    onMessage: () => {},
    onError: () => {
      setIsListening(false)
    },
  })

  const handleClick = async () => {
    try {
      if (isListening) {
        await conversation.endSession()
      } else {
        await conversation.startSession({
          agentId: "MzsE6bmfRQNtCtD0az0q",
        })
      }
    } catch {
      setIsListening(false)
    }
  }

  return (
    <div className="relative">
      {isListening && (
        <div
          className="absolute -inset-2 rounded-full border-4 border-[#38A1E5]"
          style={{
            animation: "border-pulse 2s ease-in-out infinite",
          }}
        />
      )}

      <button
        onClick={handleClick}
        className={`relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isListening ? "bg-[#38A1E5] hover:bg-[#2E8BC7]" : "bg-[#38A1E5] hover:bg-[#2E8BC7]"
        } focus:outline-none focus:ring-2 focus:ring-[#38A1E5] focus:ring-offset-2`}
        aria-label={isListening ? "Stop Voice Assistant" : "Start Voice Assistant"}
        disabled={conversation.status === "connecting"}
      >
        {isListening ? (
          <Square className="w-5 h-5 text-white fill-white" />
        ) : (
          <Image src="/icons/voice-icon.svg" alt="Voice" width={24} height={24} className="text-white" />
        )}
      </button>

      <style jsx>{`
        @keyframes border-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

export default FloatingMicrophoneButton
