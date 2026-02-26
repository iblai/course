"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Building2, Pencil, Settings, Share2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export type AcademyCreationPhase = "form" | "creating" | "preview"

export interface CourseCreationAcademyBlockProps {
  /** Called when user clicks Skip (parent should clear academy and navigate to course edit) */
  onSkip?: () => void
  /** Called when user clicks Continue editing the course (parent should navigate to course edit) */
  onContinueToCourse?: () => void
}

const ACADEMY_DETAILS_KEY = "academyDetails"

export function CourseCreationAcademyBlock({
  onSkip,
  onContinueToCourse,
}: CourseCreationAcademyBlockProps) {
  const [academyCreationPhase, setAcademyCreationPhase] = useState<AcademyCreationPhase>("form")
  const [isEditingAcademyFromPreview, setIsEditingAcademyFromPreview] = useState(false)
  const [isAcademySavingFromPreview, setIsAcademySavingFromPreview] = useState(false)
  const [createAcademyForm, setCreateAcademyForm] = useState<{
    imageFile: File | null
    imagePreview: string | null
    title: string
    subtitle: string
    membershipPricing: string
  }>({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
  const [isAcademyImageUploading, setIsAcademyImageUploading] = useState(false)
  const [academyImageUploadProgress, setAcademyImageUploadProgress] = useState(0)
  const academyUploadProgressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (academyUploadProgressRef.current) clearInterval(academyUploadProgressRef.current)
    }
  }, [])

  const handleRemoveAcademyImage = () => {
    if (createAcademyForm.imagePreview?.startsWith("blob:"))
      URL.revokeObjectURL(createAcademyForm.imagePreview)
    setCreateAcademyForm((prev) => ({ ...prev, imageFile: null, imagePreview: null }))
  }

  const handleAcademyShare = async () => {
    const title = createAcademyForm.title?.trim() || "Your Academy"
    const subtitle = createAcademyForm.subtitle?.trim()
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

  const handleAcademyLogoFileChange = (file: File | undefined) => {
    if (!file) return
    if (createAcademyForm.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(createAcademyForm.imagePreview)
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setIsAcademyImageUploading(true)
      setAcademyImageUploadProgress(0)
      const duration = 800
      const start = Date.now()
      if (academyUploadProgressRef.current) clearInterval(academyUploadProgressRef.current)
      academyUploadProgressRef.current = setInterval(() => {
        const elapsed = Date.now() - start
        const p = Math.min(95, (elapsed / duration) * 95)
        setAcademyImageUploadProgress(p)
      }, 50)
      setTimeout(() => {
        if (academyUploadProgressRef.current) {
          clearInterval(academyUploadProgressRef.current)
          academyUploadProgressRef.current = null
        }
        setAcademyImageUploadProgress(100)
        setTimeout(() => {
          setCreateAcademyForm((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: dataUrl,
          }))
          setIsAcademyImageUploading(false)
          setAcademyImageUploadProgress(0)
        }, 200)
      }, 0)
    }
    reader.onerror = () => {
      setIsAcademyImageUploading(false)
      setAcademyImageUploadProgress(0)
    }
    reader.readAsDataURL(file)
  }

  const handleCreateAcademy = async () => {
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
    }
    try {
      localStorage.setItem("hasAcademy", "1")
      localStorage.setItem(
        ACADEMY_DETAILS_KEY,
        JSON.stringify({
          title: createAcademyForm.title,
          subtitle: createAcademyForm.subtitle,
          membershipPricing: createAcademyForm.membershipPricing,
          ...(imageDataUrl && { imageDataUrl }),
        })
      )
    } catch (_) {}
    setAcademyCreationPhase("creating")
    setTimeout(() => {
      onContinueToCourse?.()
    }, 2000)
  }

  const handleSaveChanges = async () => {
    if (!createAcademyForm.title.trim()) {
      toast.error("Please enter a title for the academy.")
      return
    }
    setIsAcademySavingFromPreview(true)
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
    }
    try {
      localStorage.setItem("hasAcademy", "1")
      localStorage.setItem(
        ACADEMY_DETAILS_KEY,
        JSON.stringify({
          title: createAcademyForm.title,
          subtitle: createAcademyForm.subtitle,
          membershipPricing: createAcademyForm.membershipPricing,
          ...(imageDataUrl && { imageDataUrl }),
        })
      )
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 3000))
    setIsEditingAcademyFromPreview(false)
    setIsAcademySavingFromPreview(false)
    setAcademyCreationPhase("preview")
    toast.success("Academy updated successfully", { duration: 3000 })
  }

  const handleSkip = () => {
    onSkip?.()
  }

  const handleContinueToCourse = () => {
    onContinueToCourse?.()
  }

  return (
    <div className="mt-8 w-full min-w-0 px-1">
      <div className="w-full rounded-lg border border-gray-200 bg-white overflow-hidden flex flex-col shadow-sm">
        {academyCreationPhase === "form" ? (
          <>
            <div className="flex-shrink-0 p-4 sm:p-6 pb-4 border-b border-gray-100">
              {isEditingAcademyFromPreview ? (
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-[var(--sidebar-foreground)]">
                    Edit Academy
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your academy details below.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[var(--sidebar-foreground)] min-w-0 truncate">
                      Set up your Academy
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 sm:pl-[52px]">
                    Provide your academy details, or skip and customize them later.
                  </p>
                </div>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pt-4">
              <div className="py-3 pb-0 flex flex-col items-center sm:flex-row sm:items-center sm:justify-start sm:gap-6 sm:rounded-xl sm:bg-[#F0F2F5] sm:p-4">
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-4">
                  <input
                    id="academy-image-flow"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      handleAcademyLogoFileChange(e.target.files?.[0])
                      e.currentTarget.value = ""
                    }}
                  />
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
                    {isAcademyImageUploading && (
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
                              strokeDashoffset={2 * Math.PI * 46 * (1 - academyImageUploadProgress / 100)}
                              className="transition-[stroke-dashoffset] duration-75"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    disabled={isAcademyImageUploading}
                    onClick={() => document.getElementById("academy-image-flow")?.click()}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {createAcademyForm.imagePreview ? "Change Logo" : "Choose logo"}
                  </button>
                  {createAcademyForm.imagePreview && (
                    <button
                      type="button"
                      disabled={isAcademyImageUploading}
                      onClick={handleRemoveAcademyImage}
                      className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-60 disabled:pointer-events-none"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2.5 sm:mt-0 space-y-4 py-3 pb-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="academy-title-flow" className="text-xs font-normal text-gray-500 sm:text-sm">
                    Name
                  </Label>
                  <Input
                    id="academy-title-flow"
                    placeholder="e.g. Academy name"
                    value={createAcademyForm.title}
                    onChange={(e) =>
                      setCreateAcademyForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full h-11 rounded-lg border-gray-200 bg-white text-base font-normal text-[var(--sidebar-foreground)] placeholder:font-normal placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base focus-visible:ring-1 focus-visible:ring-gray-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="academy-subtitle-flow" className="text-xs font-normal text-gray-500 sm:text-sm">
                    Short description
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="academy-subtitle-flow"
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
                  <Label htmlFor="academy-pricing-flow" className="text-xs font-normal text-gray-500 sm:text-sm">
                    Membership price
                  </Label>
                  <Input
                    id="academy-pricing-flow"
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
            <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 sm:px-6 py-4 border-t border-gray-100">
              {isEditingAcademyFromPreview ? (
                <Button
                  onClick={handleSaveChanges}
                  disabled={isAcademySavingFromPreview}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 rounded-lg disabled:opacity-70"
                >
                  {isAcademySavingFromPreview ? "Saving…" : "Save changes"}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleCreateAcademy}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 rounded-lg"
                  >
                    Create Academy
                  </Button>
                </>
              )}
            </div>
          </>
        ) : academyCreationPhase === "creating" ? (
          <div className="py-10 px-6 flex flex-col items-center justify-center text-center">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00A3EC]/20 to-[#6988FF]/20 flex items-center justify-center mb-6 animate-academy-magic-glow overflow-hidden">
              <div className="absolute inset-0 rounded-2xl animate-academy-magic-shimmer" aria-hidden />
              <Building2 className="relative w-10 h-10 text-[#00A3EC]" strokeWidth={1.5} />
              <Sparkles className="absolute top-1.5 right-1.5 w-4 h-4 text-[#6988FF] animate-academy-sparkle" aria-hidden />
              <Sparkles className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 text-[#00A3EC] animate-academy-sparkle-delay-1" aria-hidden />
              <Sparkles className="absolute top-1.5 left-2 w-3 h-3 text-[#6988FF]/90 animate-academy-sparkle-delay-2" aria-hidden />
            </div>
            <h2 className="text-xl font-semibold text-[var(--sidebar-foreground)] mb-1">
              Creating your academy...
            </h2>
            <p className="text-sm text-gray-600">Setting up your academy. This will only take a moment.</p>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0 p-4 sm:p-6 pb-0 sm:pb-4 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--sidebar-foreground)]">
                Your academy is ready
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Here’s how your academy looks. You can edit it or share, then continue to your course. You can also modify these details later.
              </p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6">
              <div className="mt-4 pt-4 py-3 pb-4 flex flex-col items-center sm:flex-row sm:items-center sm:justify-start sm:gap-6 sm:rounded-xl sm:bg-[#F0F2F5] sm:p-4">
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
                </div>
                <div className="mt-3 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingAcademyFromPreview(true)
                      setAcademyCreationPhase("form")
                    }}
                    className="gap-1.5 px-3 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Academy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAcademyShare}
                    className="gap-1.5 px-3 py-2 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="space-y-4 py-3 pb-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <p className="text-xs font-normal text-gray-500 sm:text-sm">Name</p>
                  <div className="w-full min-h-11 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-[var(--sidebar-foreground)]">
                    {createAcademyForm.title?.trim() || "—"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-normal text-gray-500 sm:text-sm">Short description</p>
                  <div className="w-full min-h-[60px] max-h-[60px] rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-[var(--sidebar-foreground)] overflow-y-auto">
                    {createAcademyForm.subtitle?.trim() || "—"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-normal text-gray-500 sm:text-sm">Membership price</p>
                  <div className="w-full min-h-11 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-[var(--sidebar-foreground)]">
                    {createAcademyForm.membershipPricing?.trim()
                      ? `$${createAcademyForm.membershipPricing}/month`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 sm:px-6 py-4 border-t border-gray-100">
              <Button
                onClick={handleContinueToCourse}
                className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
              >
                Continue editing the course
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
