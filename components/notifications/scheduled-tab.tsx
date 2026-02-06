"use client"

import { useState } from "react"
import { Calendar, CheckCircle2, XCircle, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Notification } from "@/types/notification"

interface ScheduledTabProps {
  notifications: Notification[]
}

export function ScheduledTab({ notifications }: ScheduledTabProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

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
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        )
      case "opened":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
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
      <div className="w-full md:w-96 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => setSelectedNotification(notification)}
            className={cn(
              "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
              selectedNotification?.id === notification.id && "bg-blue-50 hover:bg-blue-50",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-slate-500">{notification.title}</h3>
                  {getStatusBadge(notification.status)}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.preview}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {notification.scheduledFor
                        ? format(notification.scheduledFor, "MMM d, yyyy 'at' h:mm a")
                        : "Not scheduled"}
                    </span>
                  </div>
                </div>
                {notification.recipients && (
                  <div className="mt-2 text-xs text-gray-500">
                    {notification.recipients.length} recipient{notification.recipients.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-white p-6 hidden md:block">
        {selectedNotification ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900">{selectedNotification.title}</h2>
                {getStatusBadge(selectedNotification.status)}
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Scheduled for:{" "}
                    {selectedNotification.scheduledFor
                      ? format(selectedNotification.scheduledFor, "MMMM d, yyyy 'at' h:mm a")
                      : "Not scheduled"}
                  </span>
                </div>
                {selectedNotification.recipients && (
                  <div className="flex items-center gap-2">
                    <span>
                      Recipients: {selectedNotification.recipients.length} user
                      {selectedNotification.recipients.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedNotification.body }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a notification to view details
          </div>
        )}
      </div>
    </>
  )
}
