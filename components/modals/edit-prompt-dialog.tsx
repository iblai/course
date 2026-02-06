"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditPromptDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  prompt?: {
    id: string
    name: string
    content: string
  }
  onSave?: (prompt: { id: string; name: string; content: string }) => void
}

export function EditPromptDialog({ isOpen, onOpenChange, prompt, onSave }: EditPromptDialogProps) {
  const [name, setName] = useState(prompt?.name || "")
  const [content, setContent] = useState(prompt?.content || "")

  const handleSave = () => {
    if (onSave && prompt) {
      onSave({
        id: prompt.id,
        name,
        content,
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{prompt ? "Edit Prompt" : "Create Prompt"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
              placeholder="Enter prompt content..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
