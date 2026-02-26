"use client"

import { useEffect, useState } from "react"
import { Building2, Pencil, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const ACADEMY_DETAILS_KEY = "academyDetails"

export type AcademyDetails = {
  title?: string
  subtitle?: string
  membershipPricing?: string
  imageDataUrl?: string
}

export function ViewAcademyDialog({
  open,
  onOpenChange,
  onEdit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
}) {
  const [details, setDetails] = useState<AcademyDetails | null>(null)

  useEffect(() => {
    if (!open || typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(ACADEMY_DETAILS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AcademyDetails
        setDetails(parsed)
      } else {
        setDetails(null)
      }
    } catch {
      setDetails(null)
    }
  }, [open])

  const title = details?.title?.trim() || "Your Academy"
  const subtitle = details?.subtitle?.trim()
  const price = details?.membershipPricing?.trim()
  const imageDataUrl = details?.imageDataUrl

  const handleShare = async () => {
    const shareText = subtitle ? `${title} — ${subtitle}` : title
    const shareData: ShareData = { title, text: shareText }
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData)
        toast.success("Shared successfully")
      } else {
        await navigator.clipboard?.writeText(shareText)
        toast.success("Link copied to clipboard")
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        await navigator.clipboard?.writeText(shareText).catch(() => {})
        toast.success("Copied to clipboard")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] sm:max-w-[560px] flex flex-col p-0 gap-0 overflow-hidden bg-white min-h-0 max-h-[calc(100dvh-2rem)] sm:min-h-[min(560px,85vh)]" maxHeight="calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 2rem)">
        <DialogHeader className="flex-shrink-0 px-4 py-4 text-center sm:pl-0 sm:pt-0 sm:pr-6 sm:pb-4 sm:text-left border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-[var(--sidebar-foreground)] pt-0 pb-0 sm:text-xl">
            Academy details
          </DialogTitle>
        </DialogHeader>

        {/* Desktop: same layout as course creation flow (gray block + read-only details) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-0">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-start sm:gap-6 pt-4 py-3 pb-4 sm:rounded-xl sm:bg-[#F0F2F5] sm:p-4">
          {/* Academy logo (photo) */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
            {imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageDataUrl}
                alt="Academy logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Building2 className="w-10 h-10" strokeWidth={1.25} />
              </div>
            )}
          </div>
          <div className="mt-3 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onEdit()
                }}
                className="gap-1.5 px-3 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Academy
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 px-3 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-4 py-3 pb-[10px] sm:space-y-5">
          <div className="space-y-1.5">
            <p className="text-sm font-normal text-gray-500">Name</p>
            <div className="w-full min-h-11 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-[var(--sidebar-foreground)]">
              {title}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-normal text-gray-500 sm:text-xs">Short description</p>
            <div className="w-full min-h-[60px] max-h-[60px] rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-[var(--sidebar-foreground)] overflow-y-auto">
              {subtitle || "—"}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-normal text-gray-500">Membership price</p>
            <div className="w-full min-h-11 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-[var(--sidebar-foreground)]">
              {price ? `$${price}/month` : "—"}
            </div>
          </div>
        </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex justify-end gap-2 px-4 pt-4 pb-4 pr-6 border-t border-gray-100 sm:pl-6 sm:pr-0 sm:pt-4 sm:pb-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
