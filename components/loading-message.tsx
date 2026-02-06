"use client"

import { Avatar } from "@/components/ui/avatar"

interface LoadingMessageProps {
  mentorName?: string
}

export function LoadingMessage({ mentorName = "mentorAI" }: LoadingMessageProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center ml-0">
        <div className="flex-shrink-0 mr-2 sm:mr-3 relative">
          <div className="absolute inset-0 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-transparent p-[1px] rounded-full flex items-center justify-center">
            <img src="/images/mentorAI-logo.png" alt={mentorName} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover" />
          </Avatar>
        </div>
        <span className="text-gray-700 text-sm">Just a sec...</span>
      </div>
    </div>
  )
}
