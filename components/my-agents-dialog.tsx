"use client"

import { useEffect } from "react"
import { toast } from "sonner"

/**
 * Stub for hq's MyMentorDialog. Hq mounts the SDK `<AgentSearch>` in a
 * modal; courseai already has a `/agents` route for the same purpose,
 * so the modal-mode entry from the navbar dropdown is left unwired and
 * the user is nudged toward the dedicated page instead.
 */
interface MyMentorDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function MyMentorDialog({ isOpen, onClose }: MyMentorDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    toast.info("Use the Agents page to browse your agents.")
    onClose()
  }, [isOpen, onClose])
  return null
}
