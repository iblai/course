"use client"

import { useState } from "react"
import { Send, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Notification } from "@/types/notification"

interface SendNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNotificationSent: (notification: Notification) => void
}

export function SendNotificationDialog({ open, onOpenChange, onNotificationSent }: SendNotificationDialogProps) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")

  const handleSend = () => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      preview: body.substring(0, 100) + "...",
      body,
      timestamp: new Date(),
      read: false,
      type: "custom",
      status: isScheduled ? "scheduled" : "sent",
      scheduledFor: isScheduled ? new Date(scheduledDate) : undefined,
      recipients: ["1", "2", "3"],
    }

    onNotificationSent(notification)
    setTitle("")
    setBody("")
    setIsScheduled(false)
    setScheduledDate("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-base sm:text-lg">Send Notification</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="title" className="text-sm">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              className="text-base"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="body" className="text-sm">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your notification message..."
              rows={4}
              className="text-base min-h-[100px] sm:min-h-[120px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
              <Label className="text-sm">Schedule for later</Label>
            </div>
          </div>

          {isScheduled && (
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="schedule-date" className="text-sm">Schedule Date & Time</Label>
              <Input
                id="schedule-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="text-base"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!title.trim() || !body.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white text-sm"
          >
            {isScheduled ? (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
