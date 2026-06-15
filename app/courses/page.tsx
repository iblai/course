"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { DocumentSidebar } from "@/components/document-sidebar"

import { VoiceColumn } from "@/components/voice-column"
import { Calendar, Pencil, FileText, Eye, Trash2, Info, Plus, Loader2 } from "lucide-react"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ViewAcademyDialog } from "@/components/view-academy-dialog"
import { CreateAcademyDialog } from "@/components/create-academy-dialog"
import {
    studioOutlineUrl,
    lmsCoursePreviewUrl,
    lmsCourseAboutUrl,
    mfeCourseDatesUrl,
    deleteCourse,
    listCourseCreationCourses,
    getCourseCreationTask,
    recordToCourseLocator,
    type EdxCourseRecord,
    type CourseCreationTask,
} from "@/lib/iblai/course-actions"
import { useUrlContext } from "@/lib/iblai/use-url-context"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { UpdateSubscriptionModal } from "@/components/iblai/update-subscription-modal"
import { Spinner } from "@/components/iblai/page-loader"
import "@/styles/colors.css"

/**
 * v0 mock thumbnails -- rotated as fallback when the SDK row has no
 * `edx_data.course_image_asset_path`. Keeps the v0 grid visually
 * populated until tenants attach real images.
 */
const COURSE_THUMB_FALLBACKS = [
    "/images/course-1.png",
    "/images/course-2.png",
    "/images/course-3.png",
    "/images/data-driven-decision.png",
    "/images/team-performance.png",
    "/images/leadership-is-language.png",
    "/images/leadership-development.png",
    "/images/strategic-leadership.png",
    "/images/teamwork-growth.png",
]

/* Consistent course list action buttons – modern hover */
const COURSE_ACTION_BTN =
    "inline-flex items-center justify-center rounded-lg w-8 h-8 border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 ease-out hover:bg-blue-50/80 hover:border-blue-200 hover:text-[#2563EB] hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-1"
const COURSE_ACTION_BTN_MOBILE =
    "inline-flex items-center justify-center rounded-lg w-7 h-7 border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 ease-out hover:bg-blue-50/80 hover:border-blue-200 hover:text-[#2563EB] hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-1"
const COURSE_ACTION_BTN_DANGER =
    "inline-flex items-center justify-center rounded-lg w-8 h-8 border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 ease-out hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1"
const COURSE_ACTION_BTN_DANGER_MOBILE =
    "inline-flex items-center justify-center rounded-lg w-7 h-7 border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 ease-out hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1"

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

function CoursesPageContent() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isDocumentSidebarOpen, setIsDocumentSidebarOpen] = useState(false)
    const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false)
    const [isVoiceSidebarOpen, setIsVoiceSidebarOpen] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string; platformKey: string; recordId: string } | null>(null)
    const [isCreateAcademyDialogOpen, setIsCreateAcademyDialogOpen] = useState(false)
    const [viewAcademyDialogOpen, setViewAcademyDialogOpen] = useState(false)
    const [isEditAcademyMode, setIsEditAcademyMode] = useState(false)
    const [hasAcademy, setHasAcademy] = useState(false)
    const [creationPromptCourse, setCreationPromptCourse] = useState<{ id: string; title: string; taskId: string } | null>(null)
    const [creationPromptTask, setCreationPromptTask] = useState<CourseCreationTask | null>(null)
    const [creationPromptLoading, setCreationPromptLoading] = useState(false)
    const [creationPromptError, setCreationPromptError] = useState<string | null>(null)
    const [isDeletingCourse, setIsDeletingCourse] = useState(false)

    // Tenant + username for course-creation API calls (delete).
    const { tenantKey, username } = useUrlContext()
    // Platform admins already own the platform — hide the "Create School"
    // CTA for them. They still see "View Academy" when one exists.
    // Non-admins seeing "Create School" get the upgrade prompt instead
    // of the academy creation dialog (matches the rest of the
    // admin-gated surfaces).
    const isPlatformAdmin = useIsAdmin()
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

    useEffect(() => {
        // Set logged in state - can be determined by other means (auth context, localStorage, etc.)
        setIsLoggedIn(true)
    }, [])

    useEffect(() => {
        try {
            setHasAcademy(typeof window !== "undefined" && localStorage.getItem("hasAcademy") === "1")
        } catch (_) { }
    }, [])

    useEffect(() => {
        if (searchParams.get("openCreateAcademy") === "1") {
            setIsEditAcademyMode(false)
            setIsCreateAcademyDialogOpen(true)
            router.replace("/courses", { scroll: false })
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

    // "All Courses" = the AI-mentor `EdxCourse` records owned by the
    // current user under the current tenant. Pulled directly from
    //   GET /api/ai-mentor/orgs/{tenant}/users/{username}/course-creation/course/?page=1&page_size=100
    // (see `listCourseCreationCourses`). Each record carries the integer
    // id required by the delete endpoint, so no separate lookup is
    // needed on row actions.
    const [records, setRecords] = useState<EdxCourseRecord[]>([])
    const [recordsLoading, setRecordsLoading] = useState(true)
    const [recordsError, setRecordsError] = useState<string | null>(null)
    useEffect(() => {
        let cancelled = false
        if (!tenantKey || !username) {
            // Wait for url-context to resolve before firing.
            return
        }
        setRecordsLoading(true)
        setRecordsError(null)
        listCourseCreationCourses({ tenant: tenantKey, username })
            .then((data) => {
                if (cancelled) return
                setRecords(data.results)
            })
            .catch((e) => {
                if (cancelled) return
                setRecordsError((e as Error).message || "Failed to load courses")
            })
            .finally(() => {
                if (!cancelled) setRecordsLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [tenantKey, username])

    // Load the AI brief (CourseCreationTask) when the "View Creation
    // Prompt" dialog opens. We fetch lazily so the list endpoint stays
    // fast -- the task body can be large and isn't needed until the user
    // actually looks at it.
    useEffect(() => {
        if (!creationPromptCourse) {
            setCreationPromptTask(null)
            setCreationPromptError(null)
            setCreationPromptLoading(false)
            return
        }
        if (!creationPromptCourse.taskId) {
            // Course exists as an EdxCourse but has no linked task (manual
            // creation). Nothing to fetch -- the dialog will show the
            // fallback message.
            setCreationPromptTask(null)
            setCreationPromptError(null)
            setCreationPromptLoading(false)
            return
        }
        if (!tenantKey || !username) return
        let cancelled = false
        setCreationPromptLoading(true)
        setCreationPromptError(null)
        setCreationPromptTask(null)
        getCourseCreationTask(creationPromptCourse.taskId, {
            tenant: tenantKey,
            username,
        })
            .then((task) => {
                if (!cancelled) setCreationPromptTask(task)
            })
            .catch((e) => {
                if (!cancelled) setCreationPromptError((e as Error).message || "Failed to load")
            })
            .finally(() => {
                if (!cancelled) setCreationPromptLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [creationPromptCourse, tenantKey, username])

    const isLoadingCourses = recordsLoading
    const courses = records.map((r, i) => {
        const courseLocator = recordToCourseLocator(r)
        if (!courseLocator && typeof window !== "undefined") {
            // Surface in devtools so the missing field name is obvious.
            // Without a locator, every action button (About / Schedule / Edit
            // / Preview / Delete) builds a broken URL silently.
            console.warn(
                "[courses] no course locator on record — actions disabled",
                r,
            )
        }
        return {
            // edX locator for routing (About/Schedule/Edit/Preview buttons).
            id: courseLocator,
            // Course owner tenant; the course-creation list endpoint is
            // already scoped by `{org}` so this equals `tenantKey`.
            platformKey: tenantKey,
            // Integer EdxCourse record id -- used directly by the delete
            // endpoint (no lookup needed).
            recordId: String(r.id),
            // Integer CourseCreationTask id -- used by the "View Creation
            // Prompt" dialog to fetch the AI brief. Null when the course
            // wasn't generated via the AI pipeline (rare given this list is
            // already filtered to course-creation records).
            taskId: r.task != null ? String(r.task) : "",
            title: r.name ?? "Untitled course",
            thumbnail: COURSE_THUMB_FALLBACKS[i % COURSE_THUMB_FALLBACKS.length],
            organization: tenantKey,
            startDate: r.created_at ? r.created_at.slice(0, 10) : "",
            price: "Free",
            earnings: "$0.00",
        }
    })

    // Maps each row icon to the right ibl.ai skill surface.
    //  - viewAbout / schedule: in-app reader (`/iblai-course-access` →
    //    `/course-content/[id]/<tab>`).
    //  - edit: Studio outline (course authoring UI, lives outside this
    //    SPA on `studio.<domain>`).
    //  - preview: LMS course view (read-only learner preview).
    //  - view: shows the course-creation brief (name + id) the AI used
    //    when generating this course (see `/iblai-course-create`).
    //  - delete: opens confirm dialog; the dialog's confirm button hits
    //    the Course Creation API.
    const handleActionClick = (action: string, courseId: string) => {
        // Hard-bail on empty courseId so we don't open a broken LMS /
        // Studio URL silently. The record mapping above logs to devtools
        // when the locator is missing, so the user can see the offending
        // record shape.
        if (!courseId) {
            toast.error("This course is missing its edX locator — actions disabled")
            return
        }
        if (action === "viewAbout") {
            // Real LMS about page (description, schedule, enroll). In-app
            // `/course-content/[id]/course` still ships v0 mock content.
            window.open(lmsCourseAboutUrl(courseId), "_blank", "noopener,noreferrer")
            return
        }
        if (action === "schedule") {
            // Open the real learner MFE dates tab in a new tab. The in-app
            // `/course-content/[id]/dates` route still ships v0 mock content
            // (not yet wired to `CourseContentLayout` + `CourseContentTabPage`
            // from `/iblai-course-access`).
            window.open(mfeCourseDatesUrl(courseId), "_blank", "noopener,noreferrer")
            return
        }
        if (action === "edit") {
            window.open(studioOutlineUrl(courseId), "_blank", "noopener,noreferrer")
            return
        }
        if (action === "preview") {
            window.open(lmsCoursePreviewUrl(courseId), "_blank", "noopener,noreferrer")
            return
        }
        if (action === "view") {
            const course = courses.find((c) => c.id === courseId)
            if (course) {
                setCreationPromptCourse({
                    id: course.id,
                    title: course.title,
                    taskId: course.taskId,
                })
            }
            return
        }
        if (action === "delete") {
            const course = courses.find((c) => c.id === courseId)
            if (course) {
                setCourseToDelete({
                    id: course.id,
                    title: course.title,
                    platformKey: course.platformKey,
                    recordId: course.recordId,
                })
                setIsDeleteCourseDialogOpen(true)
            }
            return
        }
    }

    const handleConfirmDelete = async () => {
        if (!courseToDelete) return
        // Prefer the course's own platform_key (from the discover row).
        // Fall back to the viewer's active tenant when the row omits it.
        const tenant = courseToDelete.platformKey || tenantKey
        if (!tenant || !username) {
            toast.error("Missing tenant or user — please re-login")
            return
        }
        if (!courseToDelete.recordId) {
            toast.error("Missing EdxCourse record id; cannot delete")
            return
        }
        setIsDeletingCourse(true)
        try {
            await deleteCourse(courseToDelete.recordId, { tenant, username })
            toast.success("Course deleted", successToastStyle)
            setIsDeleteCourseDialogOpen(false)
            setCourseToDelete(null)
            // Optimistically drop the row from local state.
            setRecords((prev) => prev.filter((r) => String(r.id) !== courseToDelete.recordId))
        } catch (e) {
            toast.error((e as Error).message || "Failed to delete course")
        } finally {
            setIsDeletingCourse(false)
        }
    }

    return (
        <div className="h-screen-dvh overflow-y-auto overflow-x-hidden bg-background">
            {/* Sidebar */}
            <SidebarLearner
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            {/* Main Content */}
            <div
                className={cn("flex flex-col min-h-screen-dvh min-w-0 transition-all duration-300", isCollapsed ? "md:ml-16" : "md:ml-64")}
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

                <div className="flex flex-1 min-w-0 overflow-hidden">
                    <main
                        className={cn(
                            "flex-1 min-w-0 transition-all duration-300 pb-[200px] md:pb-[200px]",
                            (isDocumentSidebarOpen || isAgentSidebarOpen || isVoiceSidebarOpen) && "md:mr-[380px]",
                        )}
                    >
                        <div className="flex min-w-0">
                            <div className="flex-1 px-5 sm:px-2 pt-3 pb-4 sm:pt-6 sm:pb-8 w-full min-w-0 sm:pl-8 sm:pr-8 md:pr-20">
                                {/* Page Title */}
                                <div className="mb-4 sm:mb-6 mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h1 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: "rgb(113,121,133)" }}>
                                            My Courses
                                        </h1>
                                        <p className="text-xs sm:text-sm" style={{ color: "rgb(113,121,133)" }}>
                                            Total courses: {courses.length}
                                        </p>
                                    </div>
                                    {hasAcademy ? (
                                        <Button
                                            onClick={() => setViewAcademyDialogOpen(true)}
                                            className="shrink-0 gap-2 text-white border-0 hover:opacity-90"
                                            style={{ background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)" }}
                                        >
                                            View Academy
                                        </Button>
                                    ) : isPlatformAdmin ? null : (
                                        <Button
                                            onClick={() => setUpgradeModalOpen(true)}
                                            className="shrink-0 gap-2 text-white border-0 shadow-sm hover:opacity-90"
                                            style={{ background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)" }}
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={2} />
                                            Create School
                                        </Button>
                                    )}
                                </div>

                                {isLoadingCourses && (
                                    <div className="flex items-center justify-center py-16">
                                        <Spinner />
                                    </div>
                                )}

                                {/* Desktop Table View */}
                                <div className={cn(
                                    "hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden mb-8 w-full min-w-0",
                                    isLoadingCourses && "md:hidden",
                                )}>
                                    <div className="overflow-x-auto max-w-full">
                                        <table className="w-full min-w-[700px]">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        THUMBNAIL
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        TITLE
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        ACTIONS
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        ORGANIZATION
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        START
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        PRICE
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        EARNINGS
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {courses.map((course) => (
                                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={course.thumbnail || "/placeholder.svg"}
                                                                    alt={course.title}
                                                                    width={96}
                                                                    height={64}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="text-sm font-medium max-w-md" style={{ color: "rgb(113,121,133)" }}>
                                                                {course.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <TooltipProvider>
                                                                    <TooltipFlowbite content="About Course" position="top">
                                                                        <button
                                                                            onClick={() => handleActionClick("viewAbout", course.id)}
                                                                            className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                                                                            style={{ backgroundColor: "#F0F4F8" }}
                                                                        >
                                                                            <Info className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                                                                        </button>
                                                                    </TooltipFlowbite>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <TooltipFlowbite content="Schedule and Detail" position="top">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleActionClick("schedule", course.id)}
                                                                            className={COURSE_ACTION_BTN}
                                                                        >
                                                                            <Calendar className="w-4 h-4" strokeWidth={1.5} />
                                                                        </button>
                                                                    </TooltipFlowbite>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <TooltipFlowbite content="Edit Content" position="top">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleActionClick("edit", course.id)}
                                                                            className={COURSE_ACTION_BTN}
                                                                        >
                                                                            <Pencil className="w-4 h-4" strokeWidth={1.5} />
                                                                        </button>
                                                                    </TooltipFlowbite>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <TooltipFlowbite content="View Creation User Prompt" position="top">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleActionClick("view", course.id)}
                                                                            className={COURSE_ACTION_BTN}
                                                                        >
                                                                            <FileText className="w-4 h-4" strokeWidth={1.5} />
                                                                        </button>
                                                                    </TooltipFlowbite>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <TooltipFlowbite content="View Course in Studio" position="top">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleActionClick("preview", course.id)}
                                                                            className={COURSE_ACTION_BTN}
                                                                        >
                                                                            <Eye className="w-4 h-4" strokeWidth={1.5} />
                                                                        </button>
                                                                    </TooltipFlowbite>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <TooltipFlowbite content="Delete Course" position="top">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleActionClick("delete", course.id)}
                                                                            className={COURSE_ACTION_BTN_DANGER}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                                                        </button>
                                                                    </TooltipFlowbite>
                                                                </TooltipProvider>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>{course.organization}</div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>{course.startDate}</div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>{course.price}</div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>{course.earnings}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile Card View */}
                                <div className={cn(
                                    "md:hidden space-y-3 mb-[200px]",
                                    isLoadingCourses && "hidden",
                                )}>
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex gap-3 mb-3">
                                                <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={course.thumbnail || "/placeholder.svg"}
                                                        alt={course.title}
                                                        width={80}
                                                        height={56}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3
                                                        className="text-sm font-medium mb-1 line-clamp-2"
                                                        style={{ color: "rgb(113,121,133)" }}
                                                    >
                                                        {course.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 text-xs" style={{ color: "rgb(113,121,133)" }}>
                                                        <span>{course.organization}</span>
                                                        <span>•</span>
                                                        <span>{course.startDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                                                <div className="flex gap-4 text-xs" style={{ color: "rgb(113,121,133)" }}>
                                                    <div>
                                                        <span className="font-medium">Price:</span> {course.price}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Earnings:</span> {course.earnings}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3.5 sm:gap-1.5 flex-wrap">
                                                    <TooltipProvider>
                                                        <TooltipFlowbite content="About Course" position="top">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActionClick("viewAbout", course.id)}
                                                                className={COURSE_ACTION_BTN_MOBILE}
                                                            >
                                                                <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </TooltipFlowbite>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <TooltipFlowbite content="Schedule and Detail" position="top">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActionClick("schedule", course.id)}
                                                                className={COURSE_ACTION_BTN_MOBILE}
                                                            >
                                                                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </TooltipFlowbite>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <TooltipFlowbite content="Edit Content" position="top">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActionClick("edit", course.id)}
                                                                className={COURSE_ACTION_BTN_MOBILE}
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </TooltipFlowbite>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <TooltipFlowbite content="View Creation User Prompt" position="top">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActionClick("view", course.id)}
                                                                className={COURSE_ACTION_BTN_MOBILE}
                                                            >
                                                                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </TooltipFlowbite>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <TooltipFlowbite content="View Course in Studio" position="top">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActionClick("preview", course.id)}
                                                                className={COURSE_ACTION_BTN_MOBILE}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </TooltipFlowbite>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <TooltipFlowbite content="Delete Course" position="top">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActionClick("delete", course.id)}
                                                                className={COURSE_ACTION_BTN_DANGER_MOBILE}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                            </button>
                                                        </TooltipFlowbite>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <PlatformFooter />
                    </main>
                </div>
            </div>

            {/* Delete Course Dialog */}
            <Dialog
                open={isDeleteCourseDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteCourseDialogOpen(open)
                    if (!open) setCourseToDelete(null)
                }}
            >
                <DialogContent className="sm:max-w-[480px] p-3 sm:p-4 gap-3" maxWidth="480px">
                    <DialogHeader className="mb-0">
                        <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
                            Delete Course
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone</p>
                    </DialogHeader>
                    <div className="pt-0 pb-2 sm:pb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Are you sure you want to delete the course{" "}
                            <span className="font-semibold text-gray-900">{courseToDelete?.title}</span>?
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Course ID:{" "}
                            <code className="inline-block mt-0.5 px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-200 rounded text-gray-800 break-all">
                                {courseToDelete?.id ?? ""}
                            </code>
                        </p>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteCourseDialogOpen(false)}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={isDeletingCourse}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 disabled:opacity-60"
                        >
                            {isDeletingCourse ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden />
                                    Deleting…
                                </>
                            ) : (
                                "Delete Course"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Creation Prompt dialog -- shows the AI brief that produced this
          course (see `/iblai-course-create`). Pulls the linked
          `CourseCreationTask` from
          `course-creation/tasks/{task_id}/` lazily when opened. */}
            <Dialog
                open={!!creationPromptCourse}
                onOpenChange={(open) => {
                    if (!open) setCreationPromptCourse(null)
                }}
            >
                {/* Spacing follows /iblai-design (4pt scale, hierarchy via varied
            gaps + dividers, no nested cards). Font sizes/weights kept as
            already used elsewhere on the page. */}
                <DialogContent className="sm:max-w-[640px] p-6 sm:p-7 gap-6 max-h-[85vh] overflow-y-auto" maxWidth="640px">
                    <DialogHeader className="mb-0 space-y-1">
                        <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)] leading-tight">
                            Creation Prompt
                        </DialogTitle>
                        <p className="text-sm text-gray-500 leading-snug">
                            The AI brief that generated this course
                        </p>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Course identity -- name + locator. Tight cluster, then
                a thin divider before the brief body. */}
                        <div className="space-y-2 pb-5 border-b border-gray-100">
                            <p className="text-sm text-gray-700 leading-snug">
                                <span className="font-medium">Course:</span>{" "}
                                {creationPromptTask?.name ?? creationPromptCourse?.title}
                            </p>
                            <p className="text-xs text-gray-500 break-all leading-snug">
                                <span className="font-medium">Course ID:</span>{" "}
                                <code className="ml-0.5 px-1.5 py-0.5 font-mono bg-gray-100 border border-gray-200 rounded text-gray-700">
                                    {creationPromptCourse?.id ?? ""}
                                </code>
                            </p>
                        </div>

                        {creationPromptLoading && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 py-6">
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                                Loading brief…
                            </div>
                        )}

                        {creationPromptError && !creationPromptLoading && (
                            <p className="text-sm text-red-600">{creationPromptError}</p>
                        )}

                        {!creationPromptLoading && !creationPromptError && !creationPromptCourse?.taskId && (
                            <p className="text-sm text-gray-500 leading-relaxed">
                                This course has no linked AI-creation task (may have been
                                created manually in Studio).
                            </p>
                        )}

                        {creationPromptTask && !creationPromptLoading && !creationPromptError && (
                            <div className="space-y-6">
                                <section className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Description
                                    </p>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {creationPromptTask.description || <span className="text-gray-400">—</span>}
                                    </p>
                                </section>

                                <section className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Target audience
                                    </p>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {creationPromptTask.target_audience || <span className="text-gray-400">—</span>}
                                    </p>
                                </section>

                                {/* Metadata grid -- generous gaps so cells breathe;
                    bordered top to separate from prose above. Row gap
                    bumped (`gap-y-8`) so each value has visible space
                    below before the next label. */}
                                <section className="grid grid-cols-2 gap-x-8 gap-y-8 pt-5 pb-2 border-t border-gray-100 text-sm text-gray-700">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 block">Provider</span>
                                        <span className="leading-snug">{creationPromptTask.provider || <span className="text-gray-400">—</span>}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 block">Model</span>
                                        <span className="leading-snug">{creationPromptTask.model || <span className="text-gray-400">—</span>}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 block">Sections</span>
                                        <span className="leading-snug">{creationPromptTask.desired_number_of_sections ?? <span className="text-gray-400">—</span>}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 block">Status</span>
                                        <span className="leading-snug">{creationPromptTask.status || <span className="text-gray-400">—</span>}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 block">Published</span>
                                        <span className="leading-snug">{creationPromptTask.publish_course ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 block">Created</span>
                                        <span className="leading-snug">{creationPromptTask.date_created ? creationPromptTask.date_created.slice(0, 10) : <span className="text-gray-400">—</span>}</span>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setCreationPromptCourse(null)}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
    )
}

export default function CoursesPage() {
    return <CoursesPageContent />
}
