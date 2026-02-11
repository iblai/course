"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ProjectInstructionsModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  initialInstructions?: string
  onSave?: (instructions: string) => void
}

export function ProjectInstructionsModal({
  isOpen,
  onClose,
  projectName,
  initialInstructions = "",
  onSave,
}: ProjectInstructionsModalProps) {
  const [instructions, setInstructions] = useState(initialInstructions)

  const handleSave = () => {
    onSave?.(instructions)
    onClose()
  }

  const handleCancel = () => {
    setInstructions(initialInstructions)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="gap-3 max-h-[85vh] flex flex-col"
        maxWidth="400px"
      >
        <DialogHeader>
          <DialogTitle className="text-left text-[var(--sidebar-foreground)]">Instructions</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground text-left pt-0 pb-1">
          You can ask Agent to focus on certain topics, or use a certain tone or format for responses.
        </p>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder='e.g. "Reference the latest JavaScript documentation. Keep answers short and focused."'
            className="min-h-[200px] resize-none border-2 border-gray-200 rounded-lg p-4 text-base placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 flex-1"
          />
        </div>
        <DialogFooter className="flex justify-end gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white hover:opacity-90"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
