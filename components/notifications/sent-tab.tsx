"use client"

import { useState } from "react"
import { Clock, CheckCircle2, XCircle, Eye, Calendar, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { MessageDetail } from "./message-detail"
import type { Notification } from "@/types/notification"

interface SentTabProps {
  notifications: Notification[]
}

export function SentTab({ notifications }: SentTabProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false)

  const handleMessageSelect = (notification: Notification) => {
    setSelectedNotification(notification)
    setShowDetailOnMobile(true)
  }

  const handleBackToList = () => {
    setShowDetailOnMobile(false)
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInHours < 48) return "Yesterday"
    return format(date, "MMM d, yyyy")
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Calendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        )
      case "opened":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Eye className="h-3 w-3 mr-1" />
            Opened
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className={`w-full md:w-96 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 h-full overflow-hidden ${showDetailOnMobile ? "hidden md:flex" : "flex"}`}>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleMessageSelect(notification)}
              className={cn(
                "p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedNotification?.id === notification.id && "bg-blue-50 hover:bg-blue-50",
              )}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-500 line-clamp-1">{notification.title}</h3>
                    <div className="flex-shrink-0 hidden sm:block">{getStatusBadge(notification.status)}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1.5 sm:mb-2">{notification.preview}</p>
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(notification.timestamp)}</span>
                    </div>
                    {notification.recipients && (
                      <span>
                        {notification.recipients.length} recipient{notification.recipients.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex-1 min-h-0 bg-white overflow-hidden ${showDetailOnMobile ? "flex" : "hidden md:flex"}`}>
        {selectedNotification ? (
          <div className="h-full w-full flex flex-col overflow-hidden">
            {/* Mobile back button */}
            <div className="md:hidden p-3 border-b border-gray-200 flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium text-gray-900">Back to messages</span>
            </div>

            {/* Message Detail */}
            <MessageDetail notification={selectedNotification} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-500">
            Select a notification to view details
          </div>
        )}
      </div>
    </>
  )
}
