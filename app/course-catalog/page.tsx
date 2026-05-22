"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Search, Share2, Link2, Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { DocumentSidebar } from "@/components/document-sidebar"
import { VoiceColumn } from "@/components/voice-column"
import { Button } from "@/components/ui/button"
import { ViewAcademyDialog } from "@/components/view-academy-dialog"
import { CreateAcademyDialog } from "@/components/create-academy-dialog"
import { useDiscover } from "@iblai/iblai-js/web-containers"
import config from "@/lib/iblai/config"
import { cn } from "@/lib/utils"
import "@/styles/colors.css"

/**
 * v0 mock thumbnails -- rotated as fallback when the SDK row has no
 * `edx_data.course_image_asset_path`. Keeps the v0 grid visually
 * populated until real images attach.
 */
const CATALOG_IMG_FALLBACKS = [
  "/images/course-1.png",
  "/images/course-2.png",
  "/images/course-3.png",
  "/images/data-driven-decision.png",
  "/images/team-performance.png",
  "/images/leadership-is-language.png",
  "/images/leadership-development.png",
  "/images/strategic-leadership.png",
  "/images/teamwork-growth.png",
  "/images/coaching-culture.png",
]

function CourseCatalogContent() {
  const [searchValue, setSearchValue] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDocumentSidebarOpen, setIsDocumentSidebarOpen] = useState(false)
  const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false)
  const [isVoiceSidebarOpen, setIsVoiceSidebarOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [viewAcademyDialogOpen, setViewAcademyDialogOpen] = useState(false)
  const [isCreateAcademyDialogOpen, setIsCreateAcademyDialogOpen] = useState(false)
  const [isEditAcademyMode, setIsEditAcademyMode] = useState(false)
  const [hasAcademy, setHasAcademy] = useState(false)

  useEffect(() => {
    try {
      setHasAcademy(typeof window !== "undefined" && localStorage.getItem("hasAcademy") === "1")
    } catch (_) {}
  }, [])

  useEffect(() => {
    if (searchParams.get("openCreateAcademy") === "1") {
      setIsEditAcademyMode(false)
      setIsCreateAcademyDialogOpen(true)
      router.replace("/course-catalog", { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 910)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleDocumentSidebarToggle = () => {
    setIsDocumentSidebarOpen(!isDocumentSidebarOpen)
    if (!isDocumentSidebarOpen) {
      setIsAgentSidebarOpen(false)
      setIsVoiceSidebarOpen(false)
    }
  }

  const handleAgentSidebarToggle = () => {
    setIsAgentSidebarOpen(!isAgentSidebarOpen)
    if (!isAgentSidebarOpen) {
      setIsDocumentSidebarOpen(false)
      setIsVoiceSidebarOpen(false)
    }
  }

  const handleVoiceSidebarToggle = () => {
    setIsVoiceSidebarOpen(!isVoiceSidebarOpen)
    if (!isVoiceSidebarOpen) {
      setIsDocumentSidebarOpen(false)
      setIsAgentSidebarOpen(false)
    }
  }

  // Course Catalog = public courses across ALL tenants. SDK does this
  // via `tenantOverride: "main"` (the cross-tenant marketplace scope).
  // Use the raw discover rows + the SDK's `handleFormatContents` so
  // titles/images/ids land in the right shape, then remap to the v0
  // catalog card shape `{ id, title, image, level }`.
  const discover = useDiscover({
    limit: 24,
    lmsUrl: config.lmsUrl(),
    tenantOverride: "main",
  }) as any
  const baseLmsUrl = config.lmsUrl().replace(/\/+$/, "")
  const contentsLoading: boolean = !!discover?.contentsLoading
  const rawContents: any[] = discover?.contents ?? []
  // SDK's `contentsLoading` starts `false` and flips true only AFTER its
  // debounced (500ms) fetch effect actually runs. The SDK also re-creates
  // its fetch callback whenever tenant metadata resolves, which resets
  // the debounce — so on a slow path `contentsLoading` may never have
  // visibly toggled by the time we read it. Settle the loader on any of:
  //  (a) we observed a true→false transition (normal fetch settle),
  //  (b) contents arrived (positive signal), or
  //  (c) hard timeout (8s) so the page never gets stuck.
  const [hasSettled, setHasSettled] = useState(false)
  const prevLoadingRef = useRef(false)
  useEffect(() => {
    if (prevLoadingRef.current && !contentsLoading) setHasSettled(true)
    prevLoadingRef.current = contentsLoading
  }, [contentsLoading])
  useEffect(() => {
    if (rawContents.length > 0) setHasSettled(true)
  }, [rawContents.length])
  useEffect(() => {
    const t = setTimeout(() => setHasSettled(true), 8000)
    return () => clearTimeout(t)
  }, [])
  const isLoadingCatalog = !hasSettled && (contentsLoading || rawContents.length === 0)
  const formatContent: (row: any) => any =
    discover?.handleFormatContents ?? ((row: any) => row)
  const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const
  const courses = rawContents.map((row, i) => {
    const f = formatContent(row)
    // SDK builds `${lmsUrl}${edx_data.course_image_asset_path||""}`. With
    // no asset path that string is just `lmsUrl` (not an image) so the
    // browser hangs loading it. Detect + rotate a local fallback.
    const img: string = f?.image ?? ""
    const trimmedImg = img.replace(/\/+$/, "")
    const image =
      !trimmedImg || trimmedImg === baseLmsUrl
        ? CATALOG_IMG_FALLBACKS[i % CATALOG_IMG_FALLBACKS.length]
        : f.image
    return {
      id: String(f?.course_id ?? f?.id ?? i),
      title: f?.title ?? f?.name ?? "Untitled course",
      image,
      // API doesn't expose a level → rotate for visual variety in chips.
      level: LEVELS[i % LEVELS.length] as string,
    }
  })

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchValue.toLowerCase()))

  const successToastStyle = {
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
  } as const

  const getCourseUrl = (courseId: string) => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/course-content/${encodeURIComponent(courseId)}/course`
  }

  const handleCopyLink = (e: React.MouseEvent, course: (typeof courses)[0]) => {
    e.stopPropagation()
    const url = getCourseUrl(course.id)
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard", successToastStyle),
      () => toast.error("Failed to copy link")
    )
  }

  const handleShare = async (e: React.MouseEvent, course: (typeof courses)[0]) => {
    e.stopPropagation()
    const url = getCourseUrl(course.id)
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          url,
        })
        toast.success("Shared successfully", successToastStyle)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          navigator.clipboard.writeText(url).then(
            () => toast.success("Link copied to clipboard", successToastStyle),
            () => toast.error("Failed to copy link")
          )
        }
      }
    } else {
      navigator.clipboard.writeText(url).then(
        () => toast.success("Link copied to clipboard", successToastStyle),
        () => toast.error("Failed to copy link")
      )
    }
  }

  const handleCourseClick = (course: (typeof courses)[0]) => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push(`/course-content/${encodeURIComponent(course.id)}/course`)
    }
  }

  const handleSearchClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }

  return (
    <div className="h-screen-dvh overflow-y-auto bg-background">
      {/* Sidebar */}
      <SidebarLearner
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        showAdminButtons={true}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content */}
      <div
        className={cn("flex flex-col min-h-screen-dvh transition-all duration-300", isCollapsed ? "md:ml-16" : "md:ml-64")}
      >
        {/* Header */}
        <Header
          onMobileMenuToggle={() => setIsMobileOpen(true)}
          isLoggedIn={isLoggedIn}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={isCollapsed}
        />

        <div className="flex flex-1">
          {/* Main Content - collapses when any sidebar is open */}
          <main
            className={cn(
              "flex-1 transition-all duration-300 pb-[200px] md:pb-[200px]",
              (isDocumentSidebarOpen || isAgentSidebarOpen || isVoiceSidebarOpen) && "mr-[380px]",
            )}
          >
            <div className="flex">
              {/* Left side - main content */}
              <div className="flex-1 px-5 sm:px-2 py-4 sm:py-8 w-full sm:pl-8 sm:pr-8 md:pr-20">
                {/* Search Bar and View Academy */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="relative w-full min-w-0 sm:flex-1 sm:max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="AI Search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onClick={handleSearchClick}
                      readOnly={!isLoggedIn}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="shrink-0 sm:ml-auto">
                    {hasAcademy ? (
                      <Button
                        onClick={() => setViewAcademyDialogOpen(true)}
                        className="gap-2 text-white border-0 hover:opacity-90 w-full sm:w-auto"
                        style={{ background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)" }}
                      >
                        View Academy
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsEditAcademyMode(false)
                          setIsCreateAcademyDialogOpen(true)
                        }}
                        className="gap-2 text-white border-0 shadow-sm hover:opacity-90 w-full sm:w-auto"
                        style={{ background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)" }}
                      >
                        <Plus className="w-4 h-4" strokeWidth={2} />
                        Create School
                      </Button>
                    )}
                  </div>
                </div>

                {isLoadingCatalog && (
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Loading courses…
                  </div>
                )}

                <div className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-[200px]",
                  isLoadingCatalog && "hidden",
                )}>
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white p-3"
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="relative rounded-lg overflow-hidden">
                        <div
                          className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded z-10"
                          style={{
                            background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)",
                          }}
                        >
                          {course.level}
                        </div>
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          width={400}
                          height={200}
                          className="w-full h-[160px] sm:h-[150px] object-cover border"
                        />
                      </div>
                      <div className="pt-3">
                        <h3 className="font-medium line-clamp-2 text-sm sm:text-base" style={{ color: "rgb(113,121,133)" }}>{course.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={(e) => handleShare(e, course)}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleCopyLink(e, course)}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors"
                            title="Copy link"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Copy link</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {!isLoadingCatalog && filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No courses found matching your search.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <PlatformFooter />
          </main>

          {/* Right Sidebars - outside main like dashboard */}
          {isVoiceSidebarOpen && (
            <div className="fixed top-0 md:top-[65px] right-0 w-full md:w-[380px] h-full md:h-[calc(100dvh-65px)] z-50 md:z-40">
              <VoiceColumn onClose={() => setIsVoiceSidebarOpen(false)} />
            </div>
          )}
        </div>
      </div>

      <ViewAcademyDialog
        open={viewAcademyDialogOpen}
        onOpenChange={setViewAcademyDialogOpen}
        onEdit={() => {
          setViewAcademyDialogOpen(false)
          setIsEditAcademyMode(true)
          setIsCreateAcademyDialogOpen(true)
        }}
      />
      <CreateAcademyDialog
        open={isCreateAcademyDialogOpen}
        onOpenChange={(open) => {
          setIsCreateAcademyDialogOpen(open)
          if (!open) setIsEditAcademyMode(false)
        }}
        onSuccess={() => setHasAcademy(true)}
        isEdit={isEditAcademyMode}
      />
    </div>
  )
}

export default function CourseCatalogPage() {
  return (
    <Suspense fallback={null}>
      <CourseCatalogContent />
    </Suspense>
  )
}
