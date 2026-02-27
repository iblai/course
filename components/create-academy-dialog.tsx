"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Building2 } from "lucide-react"
import Cropper, { type Area } from "react-easy-crop"
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
import { getCroppedImg } from "@/lib/crop-image"

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
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cropOpen, setCropOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadProgressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const croppedAreaPixelsRef = useRef<Area | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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
      setIsImageUploading(false)
      setImageUploadProgress(0)
      setIsSaving(false)
      if (uploadProgressRef.current) {
        clearInterval(uploadProgressRef.current)
        uploadProgressRef.current = null
      }
    }
    onOpenChange(next)
  }

  const handleRemoveAcademyImage = () => {
    if (createAcademyForm.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(createAcademyForm.imagePreview)
    setCreateAcademyForm((prev) => ({ ...prev, imageFile: null, imagePreview: null }))
  }

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    croppedAreaPixelsRef.current = croppedAreaPixels
  }, [])

  const handleLogoFileChange = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (isMobile) {
        if (createAcademyForm.imagePreview?.startsWith("blob:")) {
          URL.revokeObjectURL(createAcademyForm.imagePreview)
        }
        setCreateAcademyForm((prev) => ({ ...prev, imageFile: file, imagePreview: dataUrl }))
      } else {
        setCropImageSrc(dataUrl)
        setCropOpen(true)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        croppedAreaPixelsRef.current = null
      }
    }
    reader.onerror = () => toast.error("Failed to load image.")
    reader.readAsDataURL(file)
  }

  const handleCropDone = async () => {
    if (!cropImageSrc || !croppedAreaPixelsRef.current) return
    setIsImageUploading(true)
    try {
      const blob = await getCroppedImg(cropImageSrc, croppedAreaPixelsRef.current, "image/jpeg")
      const file = new File([blob], "academy-logo.jpg", { type: "image/jpeg" })
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result as string)
        r.onerror = reject
        r.readAsDataURL(blob)
      })
      if (createAcademyForm.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(createAcademyForm.imagePreview)
      }
      setCreateAcademyForm((prev) => ({ ...prev, imageFile: file, imagePreview: dataUrl }))
      setCropOpen(false)
      setCropImageSrc(null)
    } catch (e) {
      toast.error("Failed to crop image.")
    } finally {
      setIsImageUploading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (uploadProgressRef.current) clearInterval(uploadProgressRef.current)
    }
  }, [])

  const handleSubmit = async () => {
    if (!createAcademyForm.title.trim()) {
      toast.error("Please enter a title for the academy.")
      return
    }
    setIsSaving(true)
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
    await new Promise((r) => setTimeout(r, 3000))
    handleOpenChange(false)
    setCreateAcademyForm({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
    setIsSaving(false)
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
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px] sm:max-w-[560px] flex flex-col p-0 gap-0 overflow-hidden bg-white min-h-0 max-h-[calc(100dvh-2rem)] sm:min-h-[min(560px,85vh)]" maxHeight="calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 2rem)">
        <DialogHeader className="flex-shrink-0 px-4 py-4 text-center sm:pl-0 sm:pt-0 sm:pr-6 sm:pb-4 sm:text-left border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-[var(--sidebar-foreground)] pt-0 pb-0 sm:text-xl">
            {isEdit ? "Edit Academy" : "Create Academy"}
          </DialogTitle>
        </DialogHeader>

        {/* Desktop: same layout as course creation flow (gray block + form) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-0">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-start sm:gap-6 pt-4 py-3 pb-4 sm:rounded-xl sm:bg-[#F0F2F5] sm:p-4">
          <input
            ref={fileInputRef}
            id="academy-image"
            type="file"
            accept={isMobile ? "image/*" : "image/png,image/jpeg,image/jpg,image/webp"}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              handleLogoFileChange(file)
              e.target.value = ""
            }}
          />
          {/* Academy logo (photo) - with Instagram-style upload progress */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
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
            {isImageUploading && (
              <>
                <div className="absolute inset-0 bg-black/40 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 46}
                      strokeDashoffset={2 * Math.PI * 46 * (1 - imageUploadProgress / 100)}
                      className="transition-[stroke-dashoffset] duration-75"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>
          <div className="mt-3 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={isImageUploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-60 disabled:pointer-events-none"
            >
              {createAcademyForm.imagePreview ? "Change Logo" : "Choose logo"}
            </button>
            {createAcademyForm.imagePreview && (
              <button
                type="button"
                disabled={isImageUploading}
                onClick={handleRemoveAcademyImage}
                className="gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg disabled:opacity-60 disabled:pointer-events-none"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 py-3 pb-[10px] sm:space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="academy-title" className="text-sm font-normal text-gray-500">
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
            <Label htmlFor="academy-subtitle" className="text-sm font-normal text-gray-500">
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
            <Label htmlFor="academy-pricing" className="text-sm font-normal text-gray-500">
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

        <DialogFooter className="flex-shrink-0 flex justify-end gap-2 px-4 pt-4 pb-4 pr-6 border-t border-gray-100 sm:pl-6 sm:pr-0 sm:pt-4 sm:pb-4">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 rounded-lg disabled:opacity-70"
          >
            {isSaving ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save changes" : "Create Academy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Crop modal */}
    <Dialog open={cropOpen} onOpenChange={(open) => !open && setCropOpen(false)}>
      <DialogContent className="max-w-[min(100vw,420px)] p-0 gap-0 overflow-hidden bg-white" maxHeight="85vh">
        <DialogHeader className="flex-shrink-0 px-4 pt-4 pb-2">
          <DialogTitle className="text-lg font-semibold text-[var(--sidebar-foreground)]">Crop logo</DialogTitle>
        </DialogHeader>
        <div className="relative w-full min-h-[50vh] max-h-[60vh] bg-black" style={{ touchAction: "none" }}>
          <Cropper
            image={cropImageSrc ?? ""}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            zoomWithScroll={true}
            minZoom={1}
            maxZoom={3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs font-medium text-gray-500 mb-2">Zoom (pinch or use slider)</p>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-[#00A3EC]"
            aria-label="Zoom in or out"
          />
        </div>
        <DialogFooter className="flex-shrink-0 flex justify-end gap-2 px-4 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => setCropOpen(false)}
            className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCropDone}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 rounded-lg"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
