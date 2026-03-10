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
import { Calendar, Pencil, FileText, Eye, Trash2, Info, Plus } from "lucide-react"
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
import "@/styles/colors.css"

/* Consistent course list action buttons – modern hover */
const COURSE_ACTION_BTN =
  "inline-flex items-center justify-center rounded-lg w-8 h-8 border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 ease-out hover:bg-blue-50/80 hover:border-blue-200 hover:text-[#2563EB] hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-1"
const COURSE_ACTION_BTN_MOBILE =
  "inline-flex items-center justify-center rounded-lg w-7 h-7 border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 ease-out hover:bg-blue-50/80 hover:border-blue-200 hover:text-[#2563EB] hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-1"
const COURSE_ACTION_BTN_DANGER =
  "inline-flex items-center justify-center rounded-lg w-8 h-8 border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 ease-out hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1"
const COURSE_ACTION_BTN_DANGER_MOBILE =
  "inline-flex items-center justify-center rounded-lg w-7 h-7 border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 ease-out hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-1"

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
  const [courseToDelete, setCourseToDelete] = useState<{ id: number; title: string } | null>(null)
  const [isCreateAcademyDialogOpen, setIsCreateAcademyDialogOpen] = useState(false)
  const [viewAcademyDialogOpen, setViewAcademyDialogOpen] = useState(false)
  const [isEditAcademyMode, setIsEditAcademyMode] = useState(false)
  const [hasAcademy, setHasAcademy] = useState(false)

  useEffect(() => {
    // Set logged in state - can be determined by other means (auth context, localStorage, etc.)
      setIsLoggedIn(true)
  }, [])

  useEffect(() => {
    try {
      setHasAcademy(typeof window !== "undefined" && localStorage.getItem("hasAcademy") === "1")
    } catch (_) {}
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

  const courses = [
    {
      id: 1,
      title: "Greenland's Historical Ties: An insightful Perspective on Origins and U.S. Involvement",
      thumbnail: "/images/course-1.png",
      organization: "lorena",
      startDate: "2029-12-31",
      price: "Free",
      earnings: "$1.00",
    },
    {
      id: 2,
      title: "Evaluating the Impact of Trump Administration Policies: An Economic Perspective",
      thumbnail: "/images/course-2.png",
      organization: "ACI",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 3,
      title: "Introduction to Debian for Beginners",
      thumbnail: "/images/course-3.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 4,
      title: "Debian for Beginners: An Introductory Guide 9",
      thumbnail: "/images/data-driven-decision.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 5,
      title: "Advanced Introduction to Debian for Beginners II",
      thumbnail: "/images/team-performance.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 6,
      title: "Integrating MySQL with Django: A Comprehensive Guide",
      thumbnail: "/images/leadership-is-language.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 7,
      title: "Essential Ubuntu Linux Administration for Beginners",
      thumbnail: "/images/leadership-development.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 8,
      title: "Introduction to Debian Linux Administration",
      thumbnail: "/images/strategic-leadership.png",
      organization: "test_admin",
      startDate: "2030-01-02",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 9,
      title: "Mastering AI Prompt Engineering: A Comprehensive Guide",
      thumbnail: "/images/teamwork-growth.png",
      organization: "ACI",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 10,
      title: "AI in Academia: Driving Innovation and Efficiency",
      thumbnail: "/images/coaching-culture.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 11,
      title: "AI to Empower Students with Hyper-Personalized Learning",
      thumbnail: "/images/course-1.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 12,
      title: "AI in Autonomous Vehicles: Driving the Future",
      thumbnail: "/images/course-2.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
    {
      id: 13,
      title: "Managing Cybersecurity Incident Response",
      thumbnail: "/images/course-3.png",
      organization: "test_admin",
      startDate: "2030-01-01",
      price: "Free",
      earnings: "$0.00",
    },
  ]

  const handleActionClick = (action: string, courseId: number) => {
    if (action === "viewAbout") {
      router.push(`/course/${courseId}`)
      return
    }
    if (action === "schedule") {
      router.push(`/course/${courseId}/schedule`)
      return
    }
    if (action === "edit") {
      router.push(`/course/${courseId}/edit`)
      return
    }
    if (action === "view") {
      router.push(`/course/${courseId}/creation-prompt`)
      return
    }
    if (action === "delete") {
      const course = courses.find((c) => c.id === courseId)
      if (course) {
        setCourseToDelete({ id: course.id, title: course.title })
        setIsDeleteCourseDialogOpen(true)
      }
      return
    }
    // Handle different actions
    console.log(`${action} clicked for course ${courseId}`)
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
                    All Courses
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
                ) : (
                  <Button
                    onClick={() => {
                    setIsEditAcademyMode(false)
                    setIsCreateAcademyDialogOpen(true)
                  }}
                    className="shrink-0 gap-2 text-white border-0 shadow-sm hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)" }}
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Create Academy
                  </Button>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden mb-8 w-full min-w-0">
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
              <div className="md:hidden space-y-3 mb-[200px]">
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
              <code className="inline-block mt-0.5 px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-200 rounded text-gray-800">
                {`course-v1:lorena+ibl_${courseToDelete?.id ?? ""}+2026_01`}
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
              onClick={() => {
                // TODO: call delete API
                setIsDeleteCourseDialogOpen(false)
                setCourseToDelete(null)
                toast.success("Deleted successfully", {
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
              }}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Delete Course
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
    </div>
  )
}

export default function CoursesPage() {
  return <CoursesPageContent />
}
