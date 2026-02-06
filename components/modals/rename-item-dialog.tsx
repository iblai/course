"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type RenameDialogSection = "pinned" | "project" | "recent"

interface RenameItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  section: RenameDialogSection
  initialValue: string
  onConfirm: (newName: string) => void
}

const defaultTitles: Record<RenameDialogSection, string> = {
  pinned: "Rename Chat",
  project: "Rename Project",
  recent: "Rename Chat",
}

export function RenameItemDialog({
  open,
  onOpenChange,
  title,
  section,
  initialValue,
  onConfirm,
}: RenameItemDialogProps) {
  const [value, setValue] = React.useState(initialValue)
  const displayTitle = title ?? defaultTitles[section]

  React.useEffect(() => {
    if (open) setValue(initialValue)
  }, [open, initialValue])

  const handleConfirm = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onConfirm(trimmed)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full" maxWidth="400px">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-left">{displayTitle}</DialogTitle>
        </DialogHeader>
        <div className="pt-1 pb-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter name..."
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>
        <DialogFooter className="flex justify-end gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!value.trim()}
            className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white hover:opacity-90"
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
