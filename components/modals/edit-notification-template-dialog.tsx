"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { NotificationTemplate } from "@/types/notification"

interface EditNotificationTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: NotificationTemplate | null
  onSave: (template: NotificationTemplate) => void
}

export function EditNotificationTemplateDialog({
  open,
  onOpenChange,
  template,
  onSave,
}: EditNotificationTemplateDialogProps) {
  const [name, setName] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (template) {
      setName(template.name)
      setBody(template.body)
    }
  }, [template])

  const handleSave = () => {
    if (template) {
      onSave({
        ...template,
        name,
        body,
        preview: body.replace(/<[^>]*>/g, "").substring(0, 60) + "...",
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-3">
        <DialogHeader>
          <DialogTitle className="text-[var(--sidebar-foreground)]">Edit Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-0 pb-3">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-body">Template Content</Label>
            <Textarea
              id="template-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Template content..."
              rows={8}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || !body.trim()}
            className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
