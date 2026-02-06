import { Clock, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Notification } from "@/types/notification"

interface MessageDetailProps {
  notification: Notification
}

export function MessageDetail({ notification }: MessageDetailProps) {
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
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Section 1: User Info Panel - Fixed at top */}
      <div className="flex-shrink-0 p-2 sm:p-3 lg:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-2 lg:gap-3 flex-1 min-w-0">
            {notification.userAvatar && (
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 flex-shrink-0">
                <AvatarImage src={notification.userAvatar || "/placeholder.svg"} alt={notification.userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] sm:text-xs lg:text-sm">
                  {notification.userName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0 overflow-hidden">
              {/* Mobile/Tablet: Compact layout */}
              <div className="lg:hidden">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-2">{notification.title}</h2>
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-600">
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">{notification.userEmail}</span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">{format(notification.timestamp, "MMM d, h:mm a")}</span>
                </div>
              </div>

              {/* Desktop: Full layout */}
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold mb-1 break-words text-slate-500">{notification.title}</h2>
                {notification.userName && notification.userEmail && (
                  <div className="flex flex-col gap-0.5 text-sm text-gray-600">
                    <span className="font-medium break-words">{notification.userName}</span>
                    <span className="break-all text-xs">{notification.userEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{format(notification.timestamp, "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
            </div>
          </div>
          {notification.type === "support" && (
            <div className="flex-shrink-0 hidden sm:block">{getPriorityBadge(notification.priority)}</div>
          )}
        </div>
      </div>

      {/* Section 2: Scrollable Messages Area - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 lg:p-4 bg-gray-50">
        {notification.replies && notification.replies.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {/* Original message */}
            <div className="flex">
              <div className="max-w-[90%] sm:max-w-[85%] bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  {notification.userAvatar && (
                    <Avatar className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0">
                      <AvatarImage src={notification.userAvatar || "/placeholder.svg"} alt={notification.userName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] sm:text-xs">
                        {notification.userName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{notification.userName}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {format(notification.timestamp, "MMM d 'at' h:mm a")}
                      </span>
                    </div>
                    <div
                      className="text-xs sm:text-sm text-gray-700 prose prose-sm max-w-none break-words"
                      dangerouslySetInnerHTML={{ __html: notification.body }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Replies */}
            {notification.replies?.map((reply) => (
              <div key={reply.id} className={cn("flex", reply.isAdmin ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[90%] sm:max-w-[85%] rounded-lg p-2 sm:p-3",
                    reply.isAdmin
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gray-50 text-gray-900",
                  )}
                >
                  <div className="flex items-start gap-1.5 sm:gap-2">
                    <Avatar className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-[10px] sm:text-xs",
                          reply.isAdmin
                            ? "bg-white text-blue-600"
                            : "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
                        )}
                      >
                        {reply.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                        <span className={cn("text-xs sm:text-sm font-semibold", reply.isAdmin ? "text-white" : "text-gray-900")}>
                          {reply.senderName}
                        </span>
                        {reply.isAdmin && (
                          <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-[10px] sm:text-xs px-1 py-0 sm:px-1.5">
                            Admin
                          </Badge>
                        )}
                        <span className={cn("text-[10px] sm:text-xs", reply.isAdmin ? "text-blue-100" : "text-gray-500")}>
                          {format(reply.timestamp, "MMM d 'at' h:mm a")}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs sm:text-sm whitespace-pre-wrap break-words",
                          reply.isAdmin ? "text-white" : "text-gray-700",
                        )}
                      >
                        {reply.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-700 break-words bg-white rounded-lg p-2 sm:p-4 shadow-sm">
            <div className="sm:text-sm text-sm" dangerouslySetInnerHTML={{ __html: notification.body }} />
          </div>
        )}
      </div>
    </div>
  )
}
