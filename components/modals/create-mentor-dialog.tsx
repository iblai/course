"use client"

import { useEffect } from "react"
import { toast } from "sonner"

/**
 * Stub for hq's CreateMentorDialog. Same role as
 * `edit-mentor-dialog.tsx` -- keeps the
 * `admin-workspace-panels-context` import resolvable while we leave
 * the actual agent-creation surface in courseai unwired.
 */
interface CreateMentorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMentorDialog({ open, onOpenChange }: CreateMentorDialogProps) {
  useEffect(() => {
    if (!open) return
    toast.info("Create-agent dialog is not wired in courseai yet.")
    onOpenChange(false)
  }, [open, onOpenChange])
  return null
}
