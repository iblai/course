"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddApiKeyDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: { keyName: string; expirationDate: string }) => void
}

export function AddApiKeyDialog({ isOpen, onOpenChange, onSubmit = () => {} }: AddApiKeyDialogProps) {
  const [keyName, setKeyName] = React.useState("")
  const [expirationDate, setExpirationDate] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!keyName.trim() || !expirationDate) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        keyName: keyName.trim(),
        expirationDate,
      })

      // Reset form
      setKeyName("")
      setExpirationDate("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding API key:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setKeyName("")
      setExpirationDate("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85vw] max-w-5xl lg:max-w-md max-h-[80vh] p-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-[var(--sidebar-foreground)]">Add API Key</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="keyName" className="text-sm font-medium text-gray-700">
                  Key Name
                </Label>
                <Input
                  id="keyName"
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Enter a name for your API key..."
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500">Choose a descriptive name to identify this key.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate" className="text-sm font-medium text-gray-700">
                  Expiration Date
                </Label>
                <Select value={expirationDate} onValueChange={setExpirationDate} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select expiration period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="never">Never expires</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Choose when this API key should expire for security.</p>
              </div>
            </form>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end gap-3 w-full">
            <Button type="button" onClick={handleClose} variant="outline">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!keyName.trim() || !expirationDate || isSubmitting}
              className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] text-white hover:opacity-90"
            >
              {isSubmitting ? "Adding..." : "Add API Key"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
