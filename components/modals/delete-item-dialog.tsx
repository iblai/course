"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type DeleteDialogSection = "pinned" | "project" | "recent"

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
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  title,
  section,
  itemName,
  onConfirm,
}: DeleteItemDialogProps) {
  const displayTitle = title ?? defaultTitles[section]

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full" maxWidth="400px">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-left">{displayTitle}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground text-left pt-1 pb-2">
          Are you sure you want to delete &quot;{itemName}&quot;? This action cannot be undone.
        </p>
        <DialogFooter className="flex justify-end gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white hover:opacity-90 hover:text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
