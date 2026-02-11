"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export type DeleteDialogSection = "pinned" | "project" | "recent" | "chat"

interface DeleteItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  section: DeleteDialogSection
  itemName: string
  onConfirm: () => void
}

const defaultTitles: Record<DeleteDialogSection, string> = {
  pinned: "Delete Chat",
  project: "Delete Project",
  recent: "Delete Chat",
  chat: "Delete Chat",
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  title,
  section,
  itemName,
  onConfirm,
}: DeleteItemDialogProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  React.useEffect(() => {
    if (open && typeof document !== "undefined") {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  const displayTitle = title ?? defaultTitles[section]

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  if (!open || !mounted) return null

  const wrapperStyle: React.CSSProperties = {
    paddingTop: "max(1rem, env(safe-area-inset-top))",
    paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
    paddingLeft: "max(1rem, env(safe-area-inset-left))",
    paddingRight: "max(1rem, env(safe-area-inset-right))",
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-[100dvh]"
      style={wrapperStyle}
      data-dialog="delete"
    >
      <div
        className="fixed inset-0 bg-black/50 z-[9998] min-h-[100dvh]"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-[400px] sm:max-w-[420px] flex flex-col z-[9999] border max-h-[calc(100dvh-2rem)]">
        {/* Header - same as Invite User / Add Sources */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-600">{displayTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body - same padding as other dialogs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{itemName}&quot;?
          </p>
        </div>

        {/* Footer - same as Add Sources (border-t, bg-muted/50, rounded-b-lg) */}
        <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white hover:opacity-90 hover:text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
