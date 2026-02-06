"use client"

import { useState } from "react"
import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentSidebar } from "@/components/document-sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function RetrievedDocumentsButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(true)}
      >
        <FileText className="h-4 w-4 text-blue-600" />
        <span>Retrieved Documents</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-2xl w-[95vw] p-0 gap-0 overflow-hidden fixed [&::-webkit-scrollbar]:hidden"
          style={{
            height: "80vh",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Header */}
          <DialogHeader className="pl-6 pr-4 py-4 border-b border-gray-200 bg-white flex-shrink-0 sticky top-0 z-10 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Retrieved Documents
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Scrollable Content */}
          <div
            className="flex-1 p-4 [&::-webkit-scrollbar]:hidden"
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <DocumentSidebar isModal={true} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
