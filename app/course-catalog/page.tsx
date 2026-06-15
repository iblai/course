"use client"

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react"
import {
    Search,
    Share2,
    Link2,
    Plus,
    SlidersHorizontal,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { VoiceColumn } from "@/components/voice-column"
import { Button } from "@/components/ui/button"
import { ViewAcademyDialog } from "@/components/view-academy-dialog"
import { CreateAcademyDialog } from "@/components/create-academy-dialog"
import {
    useDiscover,
    FacetFilterContext,
    DiscoverFilterDrawer,
} from "@iblai/iblai-js/web-containers"
import config from "@/lib/iblai/config"
import { cn } from "@/lib/utils"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { UpdateSubscriptionModal } from "@/components/iblai/update-subscription-modal"
import { Spinner } from "@/components/iblai/page-loader"
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

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

const PAGE_SIZE = 24

const GRADIENT = "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)"

const successToastStyle = {
    duration: 3000,
    style: {
        background: GRADIENT,
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

/**
 * Catalog thumbnail with a graceful fallback when the LMS asset URL
 * fails to load (500 / 404 / CORS). Some tenants ship `edx_data`
 * with paths that aren't actually published on the LMS host, so we
 * swap to a local v0 thumbnail on the first error and stop trying.
 */
function CatalogImage({
    src,
    fallback,
    alt,
}: {
    src: string
    fallback: string
    alt: string
}) {
    const [errored, setErrored] = useState(false)
    const finalSrc = !src || errored ? fallback : src
    return (
        <Image
            src={finalSrc}
            alt={alt}
            width={400}
            height={200}
            onError={() => setErrored(true)}
            className="h-[160px] w-full border object-cover sm:h-[150px]"
        />
    )
}

function CourseCatalogContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isVoiceSidebarOpen, setIsVoiceSidebarOpen] = useState(false)
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

    const [isLoggedIn] = useState(true)
    // Platform admins already own the platform — hide the "Create School"
    // CTA for them. They still see "View Academy" when one exists.
    const isPlatformAdmin = useIsAdmin()
    const [viewAcademyDialogOpen, setViewAcademyDialogOpen] = useState(false)
    const [isCreateAcademyDialogOpen, setIsCreateAcademyDialogOpen] = useState(false)
    const [isEditAcademyMode, setIsEditAcademyMode] = useState(false)
    const [hasAcademy, setHasAcademy] = useState(false)
    // Non-admins seeing the "Create School" CTA get the upgrade prompt
    // instead of the academy creation dialog — matches the rest of the
    // admin-gated surfaces (New Course / Configure / Users / etc.).
    // Edit-from-View-Academy still opens the real dialog (admins only).
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

    useEffect(() => {
        try {
            setHasAcademy(typeof window !== "undefined" && localStorage.getItem("hasAcademy") === "1")
        } catch (_) { }
    }, [])

    // `?openCreateAcademy=1` deep-link from sidebar / onboarding.
    useEffect(() => {
        if (searchParams.get("openCreateAcademy") === "1") {
            setIsEditAcademyMode(false)
            setIsCreateAcademyDialogOpen(true)
            const next = new URLSearchParams(searchParams.toString())
            next.delete("openCreateAcademy")
            const qs = next.toString()
            router.replace(qs ? `/course-catalog?${qs}` : "/course-catalog", { scroll: false })
        }
    }, [searchParams, router])

    // Course Catalog = public courses across ALL tenants. SDK does this
    // via `tenantOverride: "main"` (the cross-tenant marketplace scope).
    //
    // `lmsUrl` here is the IMAGE host — the SDK builds course thumbnails
    // as `${lmsUrl}${edx_data.course_image_asset_path}`. edX serves
    // `/asset-v1:...` only on the direct LMS host (`learn.<domain>`); the
    // API gateway proxy (`api.<domain>/lms`) does NOT proxy asset routes
    // and returns 500. Use `lmsBrowserUrl()` for the image host even when
    // the data path goes through the gateway.
    const lmsImageHost = config.lmsBrowserUrl()
    const discover = useDiscover({
        limit: PAGE_SIZE,
        lmsUrl: lmsImageHost,
        tenantOverride: "main",
    }) as any
    const baseLmsUrl = lmsImageHost.replace(/\/+$/, "")
    const contentsLoading: boolean = !!discover?.contentsLoading
    const rawContents: any[] = discover?.contents ?? []

    // ----- URL <-> discover state sync (q + page) -----
    // One-shot hydration from the URL on first mount. After that the
    // search input + pagination buttons own the state and write back
    // to the URL.
    const initialQ = searchParams.get("q") ?? ""
    const initialPage = Math.max(1, Number(searchParams.get("page") ?? "1") || 1)
    const [searchValue, setSearchValue] = useState(initialQ)
    const didSyncFromUrl = useRef(false)
    useEffect(() => {
        if (didSyncFromUrl.current) return
        didSyncFromUrl.current = true
        if (initialQ) {
            discover.setSelectedFacets((prev: any) => ({ ...(prev || {}), q: [initialQ] }))
        }
        if (initialPage > 1) {
            discover.setPage(initialPage)
        }
        // discover identity changes per render — only run once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const writeUrl = useCallback(
        (q: string, page: number) => {
            const params = new URLSearchParams()
            if (q) params.set("q", q)
            if (page > 1) params.set("page", String(page))
            const qs = params.toString()
            router.replace(qs ? `/course-catalog?${qs}` : "/course-catalog", { scroll: false })
        },
        [router],
    )

    // Server-side search. The SDK's inner fetch is already 500ms-debounced
    // (`handleFetchSearchContents`), so we feed every keystroke straight to
    // `setSelectedFacets` and let the SDK collapse them.
    const onSearchChange = (v: string) => {
        setSearchValue(v)
        discover.setSelectedFacets((prev: any) => {
            const next = { ...(prev || {}) }
            if (v) next.q = [v]
            else delete next.q
            return next
        })
        discover.setPage(1)
        writeUrl(v, 1)
    }

    // ----- Pagination -----
    const totalPages: number = discover?.pagination?.total_pages ?? 0
    const page: number = discover?.page ?? 1
    const goToPage = (next: number) => {
        if (next < 1 || (totalPages > 0 && next > totalPages) || next === page) return
        discover.setPage(next)
        writeUrl(searchValue, next)
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    // ----- Active filter chips (excludes `q` + the implicit `content`) -----
    const activeChips: { slug: string; term: string }[] = useMemo(() => {
        const sel = discover?.selectedFacets ?? {}
        const out: { slug: string; term: string }[] = []
        for (const slug of Object.keys(sel)) {
            if (slug === "q" || slug === "content") continue
            for (const t of sel[slug] || []) out.push({ slug, term: String(t) })
        }
        return out
    }, [discover?.selectedFacets])

    const removeChip = (slug: string, term: string) => {
        discover.handleSelectFacets(slug, term)
    }

    const clearAllFilters = () => {
        discover.setSelectedFacets({ content: ["courses"] })
        discover.setPage(1)
        writeUrl(searchValue, 1)
    }

    // Loader settles on any of:
    //  (a) we observed a true→false transition (normal fetch settle),
    //  (b) the server returned a pagination block (positive signal even
    //      when results are empty),
    //  (c) hard 8s timeout so the page never gets stuck.
    const [hasSettled, setHasSettled] = useState(false)
    const prevLoadingRef = useRef(false)
    useEffect(() => {
        if (prevLoadingRef.current && !contentsLoading) setHasSettled(true)
        prevLoadingRef.current = contentsLoading
    }, [contentsLoading])
    useEffect(() => {
        if (discover?.pagination) setHasSettled(true)
    }, [discover?.pagination])
    useEffect(() => {
        const t = setTimeout(() => setHasSettled(true), 8000)
        return () => clearTimeout(t)
    }, [])
    const isLoadingCatalog = !hasSettled || contentsLoading

    const formatContent: (row: any) => any =
        discover?.handleFormatContents ?? ((row: any) => row)

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
        // Prefer the row's real `level` when present; otherwise rotate for
        // visual variety in chips so the grid doesn't look monotone.
        const rawLevel = f?.level
        const apiLevel = Array.isArray(rawLevel)
            ? rawLevel[0]
            : typeof rawLevel === "string"
                ? rawLevel
                : ""
        const level = apiLevel
            ? String(apiLevel).charAt(0).toUpperCase() + String(apiLevel).slice(1)
            : LEVELS[i % LEVELS.length]
        return {
            id: String(f?.course_id ?? f?.id ?? i),
            title: f?.title ?? f?.name ?? "Untitled course",
            image,
            level,
        }
    })

    // ----- FacetFilterContext value for the SDK's filter drawer -----
    const facetCtx = useMemo(
        () => ({
            facetsLoading: !!discover?.facetsLoading,
            isError: !!discover?.isError,
            filteredFacets: discover?.filteredFacets ?? [],
            facets: discover?.facets ?? [],
            handleToggleFacet: discover?.handleToggleFacet ?? (() => { }),
            handleFilterFacets: discover?.handleFilterFacets ?? (() => { }),
            isFacetTermSelected: discover?.isFacetTermSelected ?? (() => false),
            handleSelectFacets: discover?.handleSelectFacets ?? (() => { }),
            filterDrawerOpen,
            setFilterDrawerOpen,
        }),
        [discover, filterDrawerOpen],
    )

    // Catalog clicks land on skillsAI's course "about" page
    // (`/courses/<id>`) — the description + enrollment + start-course
    // surface — instead of dropping users straight into the course
    // content. The course player itself lives one level deeper at
    // `/course-content/<id>/<tab>` and is reached from the about page
    // (or from a direct deep link, which the in-app
    // `/course-content/[id]/layout.tsx` still forwards to skillsAI).
    // Share / copy-link share this URL so recipients land in the same
    // place.
    const getCourseUrl = (courseId: string) =>
        `${config.skillsaiUrl().replace(/\/+$/, "")}/courses/${encodeURIComponent(courseId)}`

    const handleCopyLink = (e: React.MouseEvent, course: (typeof courses)[0]) => {
        e.stopPropagation()
        const url = getCourseUrl(course.id)
        navigator.clipboard.writeText(url).then(
            () => toast.success("Link copied to clipboard", successToastStyle),
            () => toast.error("Failed to copy link"),
        )
    }

    const handleShare = async (e: React.MouseEvent, course: (typeof courses)[0]) => {
        e.stopPropagation()
        const url = getCourseUrl(course.id)
        if (navigator.share) {
            try {
                await navigator.share({ title: course.title, url })
                toast.success("Shared successfully", successToastStyle)
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    navigator.clipboard.writeText(url).then(
                        () => toast.success("Link copied to clipboard", successToastStyle),
                        () => toast.error("Failed to copy link"),
                    )
                }
            }
        } else {
            navigator.clipboard.writeText(url).then(
                () => toast.success("Link copied to clipboard", successToastStyle),
                () => toast.error("Failed to copy link"),
            )
        }
    }

    const handleCourseClick = (course: (typeof courses)[0]) => {
        if (!isLoggedIn) {
            router.push("/login")
            return
        }
        // Full-page navigation (not `router.push`) — skillsAI is a separate
        // origin. Browser carries the user's SSO cookies for `*.iblai.app`,
        // so they land already authenticated.
        window.location.href = getCourseUrl(course.id)
    }

    return (
        <FacetFilterContext.Provider value={facetCtx as any}>
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
                    className={cn(
                        "flex flex-col min-h-screen-dvh transition-all duration-300",
                        isCollapsed ? "md:ml-16" : "md:ml-64",
                    )}
                >
                    <Header
                        onMobileMenuToggle={() => setIsMobileOpen(true)}
                        isLoggedIn={isLoggedIn}
                        showLogo={true}
                        showBackButton={true}
                        showModelSelector={true}
                        sidebarCollapsed={isCollapsed}
                    />

                    <div className="flex flex-1">
                        <main className="flex-1 pb-[200px] md:pb-[200px]">
                            <div className="flex">
                                <div className="flex-1 px-5 sm:px-2 py-4 sm:py-8 w-full sm:pl-8 sm:pr-8 md:pr-20">
                                    {/* Search + Filters + Academy CTA */}
                                    <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                        <div className="relative w-full min-w-0 sm:flex-1 sm:max-w-md">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Search className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search courses…"
                                                value={searchValue}
                                                onChange={(e) => onSearchChange(e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2 pl-10 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {searchValue && (
                                                <button
                                                    type="button"
                                                    aria-label="Clear search"
                                                    onClick={() => onSearchChange("")}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto shrink-0">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setFilterDrawerOpen(true)}
                                                className="gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                                            >
                                                <SlidersHorizontal className="h-4 w-4" />
                                                Filters
                                                {activeChips.length > 0 && (
                                                    <span
                                                        className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
                                                        style={{ background: GRADIENT }}
                                                    >
                                                        {activeChips.length}
                                                    </span>
                                                )}
                                            </Button>
                                            {hasAcademy ? (
                                                <Button
                                                    onClick={() => setViewAcademyDialogOpen(true)}
                                                    className="gap-2 border-0 text-white hover:opacity-90"
                                                    style={{ background: GRADIENT }}
                                                >
                                                    View Academy
                                                </Button>
                                            ) : isPlatformAdmin ? null : (
                                                <Button
                                                    onClick={() => setUpgradeModalOpen(true)}
                                                    className="gap-2 border-0 text-white shadow-sm hover:opacity-90"
                                                    style={{ background: GRADIENT }}
                                                >
                                                    <Plus className="h-4 w-4" strokeWidth={2} />
                                                    Create School
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active filter chips */}
                                    {activeChips.length > 0 && (
                                        <div className="mb-5 flex flex-wrap items-center gap-2">
                                            {activeChips.map((c) => (
                                                <button
                                                    key={`${c.slug}-${c.term}`}
                                                    type="button"
                                                    onClick={() => removeChip(c.slug, c.term)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50"
                                                >
                                                    <span className="capitalize text-gray-500">{c.slug}:</span>
                                                    <span className="capitalize">{c.term}</span>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={clearAllFilters}
                                                className="text-xs font-medium text-[#2563EB] hover:underline"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    )}

                                    {isLoadingCatalog && (
                                        <div className="flex items-center justify-center py-16">
                                            <Spinner />
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "grid grid-cols-1 gap-3 pb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4",
                                            isLoadingCatalog && "hidden",
                                        )}
                                    >
                                        {courses.map((course) => (
                                            <div
                                                key={course.id}
                                                data-testid="course-card"
                                                className="cursor-pointer overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                                                onClick={() => handleCourseClick(course)}
                                            >
                                                <div className="relative overflow-hidden rounded-lg">
                                                    <div
                                                        className="absolute bottom-2 left-2 z-10 rounded px-2 py-1 text-xs text-white"
                                                        style={{ background: GRADIENT }}
                                                    >
                                                        {course.level}
                                                    </div>
                                                    <CatalogImage
                                                        src={course.image}
                                                        fallback={
                                                            CATALOG_IMG_FALLBACKS[
                                                            Number(course.id.length) % CATALOG_IMG_FALLBACKS.length
                                                            ] || CATALOG_IMG_FALLBACKS[0]
                                                        }
                                                        alt={course.title}
                                                    />
                                                </div>
                                                <div className="pt-3">
                                                    <h3
                                                        className="line-clamp-2 text-sm font-medium sm:text-base"
                                                        style={{ color: "rgb(113,121,133)" }}
                                                    >
                                                        {course.title}
                                                    </h3>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleShare(e, course)}
                                                            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                                            title="Share"
                                                        >
                                                            <Share2 className="h-3.5 w-3.5" />
                                                            <span>Share</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleCopyLink(e, course)}
                                                            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                                            title="Copy link"
                                                        >
                                                            <Link2 className="h-3.5 w-3.5" />
                                                            <span>Copy link</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Empty state */}
                                    {!isLoadingCatalog && courses.length === 0 && (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-500">
                                                {searchValue || activeChips.length > 0
                                                    ? "No courses match your search or filters."
                                                    : "No courses are available in the catalog yet."}
                                            </p>
                                            {(searchValue || activeChips.length > 0) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchValue("")
                                                        clearAllFilters()
                                                    }}
                                                    className="mt-3 text-sm font-medium text-[#2563EB] hover:underline"
                                                >
                                                    Reset search and filters
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {!isLoadingCatalog && totalPages > 1 && (
                                        <nav
                                            aria-label="Catalog pagination"
                                            className="mt-2 flex items-center justify-center gap-2 pb-10"
                                        >
                                            <button
                                                type="button"
                                                disabled={page <= 1}
                                                onClick={() => goToPage(page - 1)}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </button>
                                            <span className="px-2 text-sm text-gray-600">
                                                Page <span className="font-medium">{page}</span> of{" "}
                                                <span className="font-medium">{totalPages}</span>
                                            </span>
                                            <button
                                                type="button"
                                                disabled={page >= totalPages}
                                                onClick={() => goToPage(page + 1)}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </nav>
                                    )}
                                </div>
                            </div>

                            <PlatformFooter />
                        </main>

                        {isVoiceSidebarOpen && (
                            <div className="fixed right-0 top-0 z-50 h-full w-full md:top-[65px] md:z-40 md:h-[calc(100dvh-65px)] md:w-[380px]">
                                <VoiceColumn onClose={() => setIsVoiceSidebarOpen(false)} />
                            </div>
                        )}
                    </div>
                </div>

                {/* SDK filter drawer — reads everything from `FacetFilterContext`. */}
                <DiscoverFilterDrawer />

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
                <UpdateSubscriptionModal
                    open={upgradeModalOpen}
                    onClose={() => setUpgradeModalOpen(false)}
                />
            </div>
        </FacetFilterContext.Provider>
    )
}

export default function CourseCatalogPage() {
    return (
        <Suspense fallback={null}>
            <CourseCatalogContent />
        </Suspense>
    )
}
