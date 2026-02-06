"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, User, Clock } from "lucide-react"

interface EmailPreviewDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  email?: {
    subject: string
    to: string
    from: string
    date: string
    body: string
  }
  onSend?: () => void
}

export function EmailPreviewDialog({ isOpen, onOpenChange, email, onSend }: EmailPreviewDialogProps) {
  const defaultEmail = {
    subject: "No Subject",
    to: "recipient@example.com",
    from: "sender@example.com",
    date: new Date().toLocaleDateString(),
    body: "No content available.",
  }

  const displayEmail = email || defaultEmail

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Preview
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500 w-16">Subject:</span>
              <span className="font-semibold text-gray-900">{displayEmail.subject}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500 w-16">To:</span>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-gray-400" />
                <span>{displayEmail.to}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500 w-16">From:</span>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-gray-400" />
                <span>{displayEmail.from}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500 w-16">Date:</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{displayEmail.date}</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 min-h-[200px] bg-white">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{displayEmail.body}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onSend && (
            <Button onClick={onSend}>
              Send Email
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
