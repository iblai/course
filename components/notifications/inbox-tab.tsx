"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageItem } from "./message-item"
import { MessageDetail } from "./message-detail"
import { ReplyBox } from "./reply-box"
import type { Notification, TicketReply } from "@/types/notification"

interface InboxTabProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onUpdateNotification: (notification: Notification) => void
}

export function InboxTab({ notifications, onMarkAsRead, onUpdateNotification }: InboxTabProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(notifications[0] || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false)

  const handleSendReply = () => {
    if (!selectedNotification || !replyMessage.trim()) return

    const newReply: TicketReply = {
      id: `reply-${Date.now()}`,
      ticketId: selectedNotification.supportTicketId || selectedNotification.id,
      message: replyMessage,
      timestamp: new Date(),
      isAdmin: true,
      senderName: "Admin",
    }

    const updatedNotification = {
      ...selectedNotification,
      replies: [...(selectedNotification.replies || []), newReply],
    }

    onUpdateNotification(updatedNotification)
    setSelectedNotification(updatedNotification)
    setReplyMessage("")
  }

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.userName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleMessageSelect = (notification: Notification) => {
    setSelectedNotification(notification)
    onMarkAsRead(notification.id)
    setShowDetailOnMobile(true)
  }

  const handleBackToList = () => {
    setShowDetailOnMobile(false)
  }

  return (
    <>
      <div
        className={`w-full md:w-96 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 h-full overflow-hidden ${showDetailOnMobile ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {filteredNotifications.map((notification) => (
            <MessageItem
              key={notification.id}
              notification={notification}
              isSelected={selectedNotification?.id === notification.id}
              onClick={() => handleMessageSelect(notification)}
            />
          ))}
        </div>
      </div>

      <div className={`flex-1 min-h-0 bg-white overflow-hidden ${showDetailOnMobile ? "flex" : "hidden md:flex"}`}>
        {selectedNotification ? (
          <div className="h-full w-full flex flex-col overflow-hidden">
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

            {/* Section 1: User Info Panel (Fixed) */}
            {/* Section 2: Scrollable Messages Area (Flex-1) */}
            <MessageDetail notification={selectedNotification} />

            {/* Section 3: Reply Section (Fixed) */}
            <ReplyBox
              value={replyMessage}
              onChange={setReplyMessage}
              onSend={handleSendReply}
              recipientName={selectedNotification.userName}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Select a message to view details</div>
        )}
      </div>
    </>
  )
}
