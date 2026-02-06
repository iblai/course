"use client"

import { Clock, MessageSquare, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Notification } from "@/types/notification"

interface MessageItemProps {
  notification: Notification
  isSelected: boolean
  onClick: () => void
}

export function MessageItem({ notification, isSelected, onClick }: MessageItemProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInHours < 48) return "Yesterday"
    return format(date, "MMM d, yyyy")
  }

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border-blue-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-blue-50 hover:bg-blue-50",
        !notification.read && "bg-blue-50/30",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={notification.userAvatar || "/placeholder.svg"} alt={notification.userName} />
          <AvatarFallback>{notification.userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
            !notification.read ? "bg-blue-500" : "bg-transparent",
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={cn("text-sm font-medium text-slate-500", !notification.read && "font-semibold")}>
              {notification.title}
            </h3>
            {notification.type === "support" && (
              <div className="flex flex-col items-end gap-1">
                {getPriorityBadge(notification.priority)}
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Support
                </Badge>
              </div>
            )}
          </div>
          {notification.userEmail && <p className="text-xs text-gray-500 mb-1">{notification.userEmail}</p>}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.preview}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatTimestamp(notification.timestamp)}</span>
            </div>
            {notification.replies && notification.replies.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MessageSquare className="h-3 w-3" />
                <span>{notification.replies.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
