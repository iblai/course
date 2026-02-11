"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddNewPromptDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (prompt: { name: string; content: string }) => void
}

export function AddNewPromptDialog({ isOpen, onOpenChange, onSave }: AddNewPromptDialogProps) {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")

  const handleSave = () => {
    if (name.trim() && content.trim()) {
      onSave({ name: name.trim(), content: content.trim() })
      setName("")
      setContent("")
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    setName("")
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-3">
        <DialogHeader>
          <DialogTitle className="text-[var(--sidebar-foreground)]">Add New Prompt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-0 pb-3">
          <div className="space-y-2">
            <Label htmlFor="prompt-name">Prompt Name</Label>
            <Input
              id="prompt-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter prompt name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-content">Prompt Content</Label>
            <Textarea
              id="prompt-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the prompt content..."
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !content.trim()}>
            Add Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
