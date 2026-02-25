"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Building2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const ACADEMY_DETAILS_KEY = "academyDetails"

export function CreateAcademyDialog({
  open,
  onOpenChange,
  onSuccess,
  isEdit = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  isEdit?: boolean
}) {
  const [createAcademyForm, setCreateAcademyForm] = useState<{
    imageFile: File | null
    imagePreview: string | null
    title: string
    subtitle: string
    membershipPricing: string
  }>({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && isEdit && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(ACADEMY_DETAILS_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as {
            title?: string
            subtitle?: string
            membershipPricing?: string
            imageDataUrl?: string
          }
          setCreateAcademyForm((prev) => ({
            ...prev,
            title: parsed.title ?? "",
            subtitle: parsed.subtitle ?? "",
            membershipPricing: parsed.membershipPricing ?? "",
            imagePreview: parsed.imageDataUrl ?? null,
          }))
        }
      } catch (_) {}
    }
  }, [open, isEdit])

  const handleOpenChange = (next: boolean) => {
    if (!next && createAcademyForm.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(createAcademyForm.imagePreview)
    }
    if (!next) {
      setCreateAcademyForm({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
    }
    onOpenChange(next)
  }

  const handleRemoveAcademyImage = () => {
    if (createAcademyForm.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(createAcademyForm.imagePreview)
    setCreateAcademyForm((prev) => ({ ...prev, imageFile: null, imagePreview: null }))
  }

  const handleSubmit = async () => {
    if (!createAcademyForm.title.trim()) {
      toast.error("Please enter a title for the academy.")
      return
    }
    let imageDataUrl: string | undefined
    if (createAcademyForm.imageFile) {
      try {
        imageDataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(createAcademyForm.imageFile!)
        })
      } catch (_) {}
    } else if (isEdit && createAcademyForm.imagePreview?.startsWith("data:")) {
      imageDataUrl = createAcademyForm.imagePreview
    }
    try {
      localStorage.setItem("hasAcademy", "1")
      localStorage.setItem(
        "academyDetails",
        JSON.stringify({
          title: createAcademyForm.title,
          subtitle: createAcademyForm.subtitle,
          membershipPricing: createAcademyForm.membershipPricing,
          ...(imageDataUrl && { imageDataUrl }),
        })
      )
    } catch (_) {}
    handleOpenChange(false)
    setCreateAcademyForm({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
    toast.success(isEdit ? "Academy updated successfully" : "Academy created successfully", {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        padding: "14px 18px",
        fontSize: "15px",
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(0, 163, 236, 0.3)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      },
      className: "toast-success",
    })
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] flex flex-col p-0 gap-0 overflow-hidden bg-white" maxWidth="420px">
        <DialogHeader className="flex-shrink-0 px-4 py-4 text-center sm:px-0 sm:py-0 sm:text-center">
          <DialogTitle className="text-lg font-semibold text-[var(--sidebar-foreground)] pt-0 pb-0 sm:text-xl">
            {isEdit ? "Edit Academy" : "Create Academy"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable middle: profile + form */}
        <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Instagram-style profile section */}
        <div className="flex flex-col items-center px-4 pt-[10px] py-3 pb-0 box-content sm:px-0 sm:pt-[10px] sm:pb-0">
          <div className="flex items-center justify-center">
            {/* Academy logo (photo) */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
              {createAcademyForm.imagePreview ? (
                createAcademyForm.imagePreview.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={createAcademyForm.imagePreview}
                    alt="Academy logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={createAcademyForm.imagePreview}
                    alt="Academy logo"
                    fill
                    className="object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Building2 className="w-10 h-10" strokeWidth={1.25} />
                </div>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            id="academy-image"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const preview = URL.createObjectURL(file)
                setCreateAcademyForm((prev) => ({
                  ...prev,
                  imageFile: file,
                  imagePreview: preview,
                }))
              }
              e.target.value = ""
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-sm font-medium text-[#0095F6] hover:text-[#00376B] underline underline-offset-1"
          >
            Edit Logo
          </button>
          {createAcademyForm.imagePreview && (
            <button
              type="button"
              onClick={handleRemoveAcademyImage}
              className="mt-1 text-xs text-gray-500 hover:text-red-600"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Instagram-style form fields */}
        <div className="space-y-4 p-0 px-4 pt-4 py-3 pb-[10px] sm:space-y-5 sm:px-0 sm:pt-0 sm:py-0 sm:pb-[10px]">
          <div className="space-y-1.5">
            <Label htmlFor="academy-title" className="text-[11px] font-normal text-gray-500 sm:text-xs">
              Name
            </Label>
            <Input
              id="academy-title"
              placeholder="e.g. Academy name"
              value={createAcademyForm.title}
              onChange={(e) =>
                setCreateAcademyForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full h-11 rounded-lg border-gray-200 bg-white text-base font-normal text-[var(--sidebar-foreground)] placeholder:font-normal placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base focus-visible:ring-1 focus-visible:ring-gray-300"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="academy-subtitle" className="text-[11px] font-normal text-gray-500 sm:text-xs">
              Short description
            </Label>
            <div className="relative">
              <Textarea
                id="academy-subtitle"
                placeholder="e.g. Learn from industry experts"
                value={createAcademyForm.subtitle}
                rows={2}
                onChange={(e) => {
                  const text = e.target.value
                  const words = text.trim().split(/\s+/).filter(Boolean)
                  if (words.length <= 20) {
                    setCreateAcademyForm((prev) => ({ ...prev, subtitle: text }))
                  } else {
                    const truncated = words.slice(0, 20).join(" ")
                    setCreateAcademyForm((prev) => ({ ...prev, subtitle: truncated }))
                  }
                }}
                className="w-full min-h-[60px] max-h-[60px] rounded-lg border-gray-200 bg-white text-base font-normal text-[var(--sidebar-foreground)] placeholder:font-normal placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base focus-visible:ring-1 focus-visible:ring-gray-300 pr-16 resize-none overflow-y-auto"
              />
              <span className="absolute bottom-2 right-3 text-[11px] font-normal text-gray-400 sm:text-xs">
                {createAcademyForm.subtitle.trim().split(/\s+/).filter(Boolean).length} / 20 words
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="academy-pricing" className="text-[11px] font-normal text-gray-500 sm:text-xs">
              Membership price
            </Label>
            <Input
              id="academy-pricing"
              type="text"
              inputMode="decimal"
              placeholder="e.g. $9.99"
              value={createAcademyForm.membershipPricing}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, "")
                const parts = v.split(".")
                const filtered = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v
                setCreateAcademyForm((prev) => ({ ...prev, membershipPricing: filtered }))
              }}
              className="w-full h-11 rounded-lg border-gray-200 bg-white text-base font-normal text-[var(--sidebar-foreground)] placeholder:font-normal placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base focus-visible:ring-1 focus-visible:ring-gray-300"
            />
          </div>
        </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex justify-end gap-2 px-4 pt-4 pb-4 pr-6 border-t border-gray-100 sm:px-6 sm:pt-0 sm:pb-0 sm:pr-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 rounded-lg"
          >
            {isEdit ? "Save" : "Create Academy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
