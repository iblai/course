export interface TicketReply {
  id: string
  ticketId: string
  message: string
  timestamp: Date
  isAdmin: boolean
  senderName: string
  senderAvatar?: string
}

export interface Notification {
  id: string
  title: string
  preview: string
  body: string
  timestamp: Date
  read: boolean
  type: "welcome" | "update" | "support" | "custom"
  status?: "sent" | "scheduled" | "opened" | "failed"
  scheduledFor?: Date
  recipients?: string[]
  supportTicketId?: string
  userId?: string
  userName?: string
  userAvatar?: string
  userEmail?: string
  priority?: "high" | "medium" | "low"
  replies?: TicketReply[]
}

export interface NotificationTemplate {
  id: string
  name: string
  preview: string
  body: string
  active: boolean
  type: "welcome" | "task_complete" | "resource_added" | "progress_report" | "deadline_reminder"
}
