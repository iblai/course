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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import "@/styles/colors.css"

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
  const [hasAcademy, setHasAcademy] = useState(false)
  const [createAcademyForm, setCreateAcademyForm] = useState<{
    imageFile: File | null
    imagePreview: string | null
    title: string
    subtitle: string
    membershipPricing: string
  }>({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })

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

  const handleRemoveAcademyImage = () => {
    if (createAcademyForm.imagePreview) URL.revokeObjectURL(createAcademyForm.imagePreview)
    setCreateAcademyForm((prev) => ({ ...prev, imageFile: null, imagePreview: null }))
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
              <div className="flex-1 px-5 sm:px-2 py-4 sm:py-8 w-full min-w-0 sm:pl-8 sm:pr-8 md:pr-20">
              {/* Page Title */}
              <div className="mb-4 sm:mb-6 mt-[15px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                    asChild
                    className="shrink-0 gap-2 text-white border-0 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)" }}
                  >
                    <Link href="/courses">View academy</Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsCreateAcademyDialogOpen(true)}
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
                                    onClick={() => handleActionClick("schedule", course.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                                    style={{ backgroundColor: "#F0F4F8" }}
                                  >
                                    <Calendar className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                                  </button>
                                </TooltipFlowbite>
                              </TooltipProvider>
                              <TooltipProvider>
                                <TooltipFlowbite content="Edit Content" position="top">
                                  <button
                                    onClick={() => handleActionClick("edit", course.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                                    style={{ backgroundColor: "#F0F4F8" }}
                                  >
                                    <Pencil className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                                  </button>
                                </TooltipFlowbite>
                              </TooltipProvider>
                              <TooltipProvider>
                                <TooltipFlowbite content="View Creation User Prompt" position="top">
                                  <button
                                    onClick={() => handleActionClick("view", course.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                                    style={{ backgroundColor: "#F0F4F8" }}
                                  >
                                    <FileText className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                                  </button>
                                </TooltipFlowbite>
                              </TooltipProvider>
                              <TooltipProvider>
                                <TooltipFlowbite content="View Course in Studio" position="top">
                                  <button
                                    onClick={() => handleActionClick("preview", course.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                                    style={{ backgroundColor: "#F0F4F8" }}
                                  >
                                    <Eye className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                                  </button>
                                </TooltipFlowbite>
                              </TooltipProvider>
                              <TooltipProvider>
                                <TooltipFlowbite content="Delete Course" position="top">
                                  <button
                                    onClick={() => handleActionClick("delete", course.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-gray-200 cursor-pointer"
                                    style={{ backgroundColor: "#F5F5F5" }}
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
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
                              onClick={() => handleActionClick("viewAbout", course.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                              style={{ backgroundColor: "#F0F4F8" }}
                            >
                              <Info className="w-3.5 h-3.5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                        <TooltipProvider>
                          <TooltipFlowbite content="Schedule and Detail" position="top">
                            <button
                              onClick={() => handleActionClick("schedule", course.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                              style={{ backgroundColor: "#F0F4F8" }}
                            >
                              <Calendar className="w-3.5 h-3.5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                        <TooltipProvider>
                          <TooltipFlowbite content="Edit Content" position="top">
                            <button
                              onClick={() => handleActionClick("edit", course.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                              style={{ backgroundColor: "#F0F4F8" }}
                            >
                              <Pencil className="w-3.5 h-3.5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                        <TooltipProvider>
                          <TooltipFlowbite content="View Creation User Prompt" position="top">
                            <button
                              onClick={() => handleActionClick("view", course.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                              style={{ backgroundColor: "#F0F4F8" }}
                            >
                              <FileText className="w-3.5 h-3.5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                        <TooltipProvider>
                          <TooltipFlowbite content="View Course in Studio" position="top">
                            <button
                              onClick={() => handleActionClick("preview", course.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                              style={{ backgroundColor: "#F0F4F8" }}
                            >
                              <Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                        <TooltipProvider>
                          <TooltipFlowbite content="Delete Course" position="top">
                            <button
                              onClick={() => handleActionClick("delete", course.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-gray-200 cursor-pointer"
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
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

      {/* Create Academy Dialog */}
      <Dialog
        open={isCreateAcademyDialogOpen}
        onOpenChange={(open) => {
          setIsCreateAcademyDialogOpen(open)
          if (!open) {
            if (createAcademyForm.imagePreview) URL.revokeObjectURL(createAcademyForm.imagePreview)
            setCreateAcademyForm({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px] p-3 sm:p-4 gap-4" maxWidth="480px">
          <DialogHeader className="mb-0">
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Create Academy
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Add a new academy with image, title, and membership pricing.</p>
          </DialogHeader>
          <div className="space-y-4 pt-0 pb-2 sm:pb-3">
            {/* Academy Image */}
            <div className="space-y-2">
              <Label htmlFor="academy-image" className="text-sm font-medium text-gray-700">
                Academy Image
              </Label>
              <div className="flex items-center gap-3">
                {createAcademyForm.imagePreview ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                      src={createAcademyForm.imagePreview}
                      alt="Academy preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAcademyImage}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-800/80 text-white flex items-center justify-center text-xs hover:bg-gray-800"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <Input
                    id="academy-image"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer file:cursor-pointer"
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
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="academy-title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="academy-title"
                placeholder="e.g. Data Science Academy"
                value={createAcademyForm.title}
                onChange={(e) =>
                  setCreateAcademyForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full"
              />
            </div>
            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="academy-subtitle" className="text-sm font-medium text-gray-700">
                Subtitle
              </Label>
              <Input
                id="academy-subtitle"
                placeholder="e.g. Learn data science from industry experts"
                value={createAcademyForm.subtitle}
                onChange={(e) =>
                  setCreateAcademyForm((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                className="w-full"
              />
            </div>
            {/* Membership Pricing */}
            <div className="space-y-2">
              <Label htmlFor="academy-pricing" className="text-sm font-medium text-gray-700">
                Membership Pricing
              </Label>
              <Input
                id="academy-pricing"
                placeholder="e.g. $9.99/month or Free"
                value={createAcademyForm.membershipPricing}
                onChange={(e) =>
                  setCreateAcademyForm((prev) => ({ ...prev, membershipPricing: e.target.value }))
                }
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateAcademyDialogOpen(false)
                setCreateAcademyForm({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
              }}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!createAcademyForm.title.trim()) {
                  toast.error("Please enter a title for the academy.")
                  return
                }
                try {
                  localStorage.setItem("hasAcademy", "1")
                } catch (_) {}
                setHasAcademy(true)
                setIsCreateAcademyDialogOpen(false)
                setCreateAcademyForm({ imageFile: null, imagePreview: null, title: "", subtitle: "", membershipPricing: "" })
                toast.success("Academy created successfully", {
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
              Create Academy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CoursesPage() {
  return <CoursesPageContent />
}
