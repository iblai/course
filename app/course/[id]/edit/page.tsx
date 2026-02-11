"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import ChatButton from "@/components/chat-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import { RotateCw, Pencil, Trash2, Plus, ChevronDown, ChevronRight, FileText, Upload, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCourseMetadata } from "@/lib/course-metadata"
import { toast } from "sonner"

const DATE_INPUT_CLASS =
  "border-gray-200 w-full min-w-0 max-w-full box-border h-10 text-sm"
const DATE_FIELD_WRAPPER_CLASS = "space-y-1.5 min-w-0 w-full max-w-full overflow-hidden"
const DATE_INPUT_INNER_CLASS = "min-w-0 w-full max-w-full overflow-hidden"

type SectionItem = {
  id: string
  name: string
  displayName: string
  startDate: string
  dueDate: string
  subsections: { id: string; name: string }[]
}

export default function CourseEditPage() {
  const params = useParams()
  const id = params.id as string
  const courseTitle = getCourseMetadata(id).title

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [displayName, setDisplayName] = useState(courseTitle)
  const [startDate, setStartDate] = useState("2030-01-01T00:30")
  const [endDate, setEndDate] = useState("2027-07-09T20:25")
  const [enrollmentStart, setEnrollmentStart] = useState("")
  const [enrollmentEnd, setEnrollmentEnd] = useState("")
  const [description, setDescription] = useState(
    "Learning Objectives:\n• Understand Greenland's historical development.\n• Analyze U.S. involvement in the region.\n• Explore geopolitical dynamics.\n\nThe course covers key topics such as:\n• Norse settlements and heritage\n• Colonial influences\n• Cold War strategy\n\nThis course is designed for history enthusiasts and political science students. Through engaging lectures and case studies, participants will gain a nuanced perspective on Greenland's past and its connections with the United States."
  )
  const [shortDescription, setShortDescription] = useState(
    "A concise overview of Greenland's history and its ties to the United States. This course explores origins, colonial periods, and modern geopolitical context."
  )
  const [price, setPrice] = useState("1")
  const [certTitleOverride, setCertTitleOverride] = useState("")
  const [signatoryName, setSignatoryName] = useState("Academic Director")
  const [signatoryTitle, setSignatoryTitle] = useState("Director of Academic Programs")
  const [signatoryOrg, setSignatoryOrg] = useState("IBL.ai")

  const courseId = `course-v1:lorena+ibl_1+2026_01`
  const certNumber = "ibL_1"

  const [sections, setSections] = useState<SectionItem[]>([
    {
      id: "sec-1",
      name: "Greenland's Early History",
      displayName: "1 Greenland's Early History",
      startDate: "2030-01-01T00:30",
      dueDate: "",
      subsections: [
        { id: "sub-1-1", name: "Norse Settlements" },
        { id: "sub-1-2", name: "Colonial Period" },
      ],
    },
    {
      id: "sec-2",
      name: "U.S. Involvement",
      displayName: "2 U.S. Involvement",
      startDate: "",
      dueDate: "",
      subsections: [],
    },
  ])
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [isAddSubsectionOpen, setIsAddSubsectionOpen] = useState(false)
  const [isAddingSubsection, setIsAddingSubsection] = useState(false)
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false)
  const [sectionName, setSectionName] = useState("")
  const [subsectionName, setSubsectionName] = useState("")
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [subsectionParentId, setSubsectionParentId] = useState<string | null>(null)
  const [editSectionDisplayName, setEditSectionDisplayName] = useState("")
  const [editSectionStartDate, setEditSectionStartDate] = useState("")
  const [editSectionDueDate, setEditSectionDueDate] = useState("")
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set(["sec-1"]))
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false)
  const [isUpdatingDescriptions, setIsUpdatingDescriptions] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingToCourse, setIsUploadingToCourse] = useState(false)
  const [isSettingPrice, setIsSettingPrice] = useState(false)
  const [isUpdatingCertificate, setIsUpdatingCertificate] = useState(false)
  const [generatingSectionId, setGeneratingSectionId] = useState<string | null>(null)
  const [generatingSubsectionId, setGeneratingSubsectionId] = useState<string | null>(null)
  const [isEditSubsectionOpen, setIsEditSubsectionOpen] = useState(false)
  const [editingSubsectionId, setEditingSubsectionId] = useState<string | null>(null)
  const [editingSubsectionParentId, setEditingSubsectionParentId] = useState<string | null>(null)
  const [editSubsectionDisplayName, setEditSubsectionDisplayName] = useState("")
  const [editSubsectionGraded, setEditSubsectionGraded] = useState<"Yes" | "No">("No")
  const [editSubsectionHasScore, setEditSubsectionHasScore] = useState<"Yes" | "No">("No")
  const [editSubsectionFormat, setEditSubsectionFormat] = useState("")
  const [editSubsectionShowCorrectness, setEditSubsectionShowCorrectness] = useState<"Always" | "Never" | "Past due">("Always")

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

  const [courseImageTab, setCourseImageTab] = useState<"upload" | "generate">("upload")
  const [imageDescriptionPrompt, setImageDescriptionPrompt] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const handleGenerateCourseImage = () => {
    if (!imageDescriptionPrompt.trim()) return
    setIsGeneratingImage(true)
    setTimeout(() => {
      const mockImageUrl = `https://picsum.photos/800/600?random=${Date.now()}`
      setGeneratedImageUrl(mockImageUrl)
      setIsGeneratingImage(false)
    }, 3000)
  }

  const handleCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setUploadedImageUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handlePublishChanges = () => {
    if (isPublishing) return
    setIsPublishing(true)
    // Simulate publish request
    setTimeout(() => {
      setIsPublishing(false)
      toast.success("Changes published successfully", successToastStyle)
    }, 2000)
  }

  const openEditSection = (section: SectionItem) => {
    setEditingSectionId(section.id)
    setEditSectionDisplayName(section.displayName)
    setEditSectionStartDate(section.startDate || "2030-01-01T00:30")
    setEditSectionDueDate(section.dueDate || "")
    setIsEditSectionOpen(true)
  }

  const handleSaveEditSection = () => {
    if (!editingSectionId) return
    setSections((prev) =>
      prev.map((s) =>
        s.id === editingSectionId
          ? {
              ...s,
              displayName: editSectionDisplayName,
              startDate: editSectionStartDate,
              dueDate: editSectionDueDate,
            }
          : s
      )
    )
    setIsEditSectionOpen(false)
    setEditingSectionId(null)
  }

  const handleAddSection = () => {
    const name = sectionName.trim()
    if (!name || isAddingSection) return
    setIsAddingSection(true)
    // Brief delay to show adding animation
    setTimeout(() => {
      setSections((prev) => [
        ...prev,
        {
          id: `sec-${Date.now()}`,
          name,
          displayName: `${prev.length + 1} ${name}`,
          startDate: "",
          dueDate: "",
          subsections: [],
        },
      ])
      setSectionName("")
      setIsAddSectionOpen(false)
      setIsAddingSection(false)
    }, 800)
  }

  const handleAddSubsection = () => {
    const name = subsectionName.trim()
    if (!name || !subsectionParentId || isAddingSubsection) return
    setIsAddingSubsection(true)
    setTimeout(() => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === subsectionParentId
            ? {
                ...s,
                subsections: [...s.subsections, { id: `sub-${Date.now()}`, name }],
              }
            : s
        )
      )
      setSubsectionName("")
      setSubsectionParentId(null)
      setIsAddSubsectionOpen(false)
      setIsAddingSubsection(false)
    }, 800)
  }

  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    if (editingSectionId === sectionId) {
      setIsEditSectionOpen(false)
      setEditingSectionId(null)
    }
    setSectionToDelete(null)
  }

  const openDeleteSectionDialog = (section: SectionItem) => {
    setSectionToDelete({ id: section.id, name: section.displayName || section.name })
  }

  const handleGenerateSectionContent = (sectionId: string) => {
    setGeneratingSectionId(sectionId)
    // TODO: wire to API to auto-generate section content
    setTimeout(() => {
      setGeneratingSectionId(null)
      toast.success("Section content generation started.", successToastStyle)
    }, 1500)
  }

  const handleGenerateSubsectionContent = (subsectionId: string) => {
    setGeneratingSubsectionId(subsectionId)
    // TODO: wire to API to auto-generate subsection content
    setTimeout(() => {
      setGeneratingSubsectionId(null)
      toast.success("Subsection content generation started.", successToastStyle)
    }, 1500)
  }

  const openEditSubsection = (sectionId: string, sub: { id: string; name: string }) => {
    setEditingSubsectionId(sub.id)
    setEditingSubsectionParentId(sectionId)
    setEditSubsectionDisplayName(sub.name)
    setEditSubsectionGraded("No")
    setEditSubsectionHasScore("No")
    setEditSubsectionFormat("")
    setEditSubsectionShowCorrectness("Always")
    setIsEditSubsectionOpen(true)
  }

  const handleSaveEditSubsection = () => {
    if (!editingSubsectionId || !editingSubsectionParentId) return
    setSections((prev) =>
      prev.map((s) =>
        s.id === editingSubsectionParentId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === editingSubsectionId ? { ...sub, name: editSubsectionDisplayName.trim() || sub.name } : sub
              ),
            }
          : s
      )
    )
    toast.success("Subsection updated.", successToastStyle)
    setIsEditSubsectionOpen(false)
    setEditingSubsectionId(null)
    setEditingSubsectionParentId(null)
  }

  const handleRegenerateSubsectionDisplayName = () => {
    // Placeholder: could call API to suggest a name
    setEditSubsectionDisplayName(editSubsectionDisplayName ? `${editSubsectionDisplayName} (revised)` : "1.1 New Subsection")
    toast.success("Display name regenerated.", successToastStyle)
  }

  const handleDeleteSubsection = () => {
    if (!editingSubsectionId || !editingSubsectionParentId) return
    setSections((prev) =>
      prev.map((s) =>
        s.id === editingSubsectionParentId
          ? { ...s, subsections: s.subsections.filter((sub) => sub.id !== editingSubsectionId) }
          : s
      )
    )
    toast.success("Subsection deleted.", successToastStyle)
    setIsEditSubsectionOpen(false)
    setEditingSubsectionId(null)
    setEditingSubsectionParentId(null)
  }

  const runWithToast = (
    setLoading: (v: boolean) => void,
    message: string,
    delay = 800
  ) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(message, successToastStyle)
    }, delay)
  }

  const handleUpdateCourse = () => {
    if (isUpdatingCourse) return
    runWithToast(setIsUpdatingCourse, "Course updated successfully")
  }
  const handleUpdateDescriptions = () => {
    if (isUpdatingDescriptions) return
    runWithToast(setIsUpdatingDescriptions, "Course descriptions updated successfully")
  }
  const handleUploadImage = () => {
    if (isUploadingImage) return
    runWithToast(setIsUploadingImage, "Image uploaded successfully")
  }
  const handleUploadToCourse = () => {
    if (isUploadingToCourse) return
    runWithToast(setIsUploadingToCourse, "Image uploaded to course successfully")
  }
  const handleSetPrice = () => {
    if (isSettingPrice) return
    runWithToast(setIsSettingPrice, "Price updated successfully")
  }
  const handleUpdateCertificate = () => {
    if (isUpdatingCertificate) return
    runWithToast(setIsUpdatingCertificate, "Certificate details updated successfully")
  }

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={true}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={true}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex flex-1 min-h-0 min-w-0">
          <main className="flex-1 flex flex-col min-h-0 min-w-0 transition-all duration-300 pb-[200px] md:pb-[200px] overflow-x-hidden">
            <div className="flex flex-1 min-h-0 min-w-0">
              <div className="flex-1 min-h-0 min-w-0 w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 md:pr-20 py-4 sm:py-8 max-w-4xl mx-auto overflow-x-hidden">
                {/* Page header - sticky */}
                <div className="sticky top-0 z-10 pt-4 pb-4 mb-4 sm:mb-8 bg-background border-b border-gray-100">
                  <h1 className="text-lg sm:text-2xl font-semibold mb-1 text-[var(--sidebar-foreground)] break-words">
                    {courseTitle}
                  </h1>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Manage sections and subsections
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/course/${id}`} className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-sm"
                      >
                        View About Page
                      </Button>
                    </Link>
                    <Link href={`/course/${id}/schedule`} className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-sm"
                      >
                        Schedule & details
                      </Button>
                    </Link>
                    <Button
                      onClick={handlePublishChanges}
                      disabled={isPublishing}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                      {isPublishing ? (
                        <>
                          <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Publish changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Course structure */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-6 mb-4 sm:mb-6 min-w-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-semibold" style={{ color: "rgb(113,121,133)" }}>
                        Course structure
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage sections and subsections</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOutlineOpen(true)}
                        className="flex-1 sm:flex-none min-w-0 text-xs sm:text-sm border-[#2563EB] text-[#2563EB] hover:bg-blue-50 px-[29px]"
                      >
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
                        See course outline
                      </Button>
                      <Button
                        onClick={() => setIsAddSectionOpen(true)}
                        className="flex-1 sm:flex-none min-w-0 text-xs sm:text-sm bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
                        Add Section
                      </Button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden min-w-0">
                    {sections.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No sections yet. Click &quot;Add Section&quot; to create one.
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200 min-w-0">
                        {sections.map((section, index) => (
                          <li key={section.id} className="bg-white min-w-0">
                            <div className="flex flex-wrap items-center justify-start gap-2 px-3 sm:px-4 py-3 hover:bg-gray-50/50">
                              <button
                                type="button"
                                onClick={() => toggleSectionExpanded(section.id)}
                                className="p-0.5 rounded hover:bg-gray-200 text-gray-500 shrink-0"
                                aria-label={expandedSectionIds.has(section.id) ? "Collapse" : "Expand"}
                              >
                                {expandedSectionIds.has(section.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <span className="flex-1 min-w-0 text-sm font-medium truncate" style={{ color: "rgb(113,121,133)" }}>
                                {index + 1}. {section.displayName || section.name}
                              </span>
                              <div className="flex items-center justify-start gap-1 shrink-0">
                                <TooltipProvider>
                                  <TooltipFlowbite content="Generate content" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50"
                                      onClick={() => handleGenerateSectionContent(section.id)}
                                      disabled={generatingSectionId === section.id}
                                      aria-label="Generate content"
                                    >
                                      <RotateCw className={cn("w-4 h-4", generatingSectionId === section.id && "animate-spin")} />
                                    </Button>
                                  </TooltipFlowbite>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <TooltipFlowbite content="Add subsection" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50"
                                      onClick={() => {
                                        setSubsectionParentId(section.id)
                                        setIsAddSubsectionOpen(true)
                                      }}
                                      aria-label="Add subsection"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </TooltipFlowbite>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <TooltipFlowbite content="Edit section" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50"
                                      onClick={() => openEditSection(section)}
                                      aria-label="Edit section"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  </TooltipFlowbite>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <TooltipFlowbite content="Delete section" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => openDeleteSectionDialog(section)}
                                      aria-label="Delete section"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipFlowbite>
                                </TooltipProvider>
                              </div>
                              {generatingSectionId === section.id && (
                                <span className="w-full sm:w-auto inline-flex items-center text-xs text-[#2563EB] animate-generating-dots ml-0 sm:ml-1 shrink-0" aria-live="polite">
                                  Generating content<span>.</span><span>.</span><span>.</span>
                                </span>
                              )}
                            </div>
                            {expandedSectionIds.has(section.id) && (
                              <div className="border-t border-gray-100 bg-gray-50/30 min-w-0">
                                {section.subsections.length > 0 ? (
                                  <ul className="min-w-0">
                                    {section.subsections.map((sub) => (
                                      <li
                                        key={sub.id}
                                        className="flex flex-wrap items-center justify-start gap-2 pl-4 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border-b border-gray-100 last:border-b-0 min-w-0"
                                      >
                                        <span className="flex-1 min-w-0 text-gray-600 truncate">{sub.name}</span>
                                        {generatingSubsectionId === sub.id && (
                                          <span className="inline-flex items-center text-xs text-[#2563EB] animate-generating-dots mr-1 shrink-0" aria-live="polite">
                                            Generating content<span>.</span><span>.</span><span>.</span>
                                          </span>
                                        )}
                                        <div className="flex items-center justify-start gap-1 shrink-0">
                                          <TooltipProvider>
                                            <TooltipFlowbite content="Generate content" position="top">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50"
                                                onClick={() => handleGenerateSubsectionContent(sub.id)}
                                                disabled={generatingSubsectionId === sub.id}
                                                aria-label="Generate content"
                                              >
                                                <RotateCw className={cn("w-4 h-4", generatingSubsectionId === sub.id && "animate-spin")} />
                                              </Button>
                                            </TooltipFlowbite>
                                          </TooltipProvider>
                                          <TooltipProvider>
                                            <TooltipFlowbite content="Edit subsection" position="top">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50"
                                                onClick={() => openEditSubsection(section.id, sub)}
                                                aria-label="Edit subsection"
                                              >
                                                <Pencil className="w-4 h-4" />
                                              </Button>
                                            </TooltipFlowbite>
                                          </TooltipProvider>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="pl-4 sm:pl-10 pr-3 sm:pr-4 py-3 text-sm text-gray-500">No subsections. Click + to add one.</p>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </div>

              <div className="fixed top-20 right-2 sm:right-4 md:right-0 z-40 flex">
                <ChatButton />
              </div>
            </div>

            {/* Footer - fixed to bottom (PlatformFooter uses fixed positioning) */}
            <PlatformFooter />
          </main>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={isAddSectionOpen} onOpenChange={(open) => { setIsAddSectionOpen(open); if (!open) { setSectionName(""); setIsAddingSection(false) } }}>
        <DialogContent className="sm:max-w-[440px] gap-3" maxWidth="440px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Add Section
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Add a new section to the course</p>
          </DialogHeader>
          <div className="pt-0 pb-2 space-y-1.5">
            <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
              Section Name
            </Label>
            <Input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Enter section name"
              className="border-gray-200"
            />
            <p className="text-xs text-gray-500">Enter the display name for the new section</p>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-0">
            <Button
              variant="outline"
              onClick={() => setIsAddSectionOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={!sectionName.trim() || isAddingSection}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAddingSection ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Section"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subsection Dialog */}
      <Dialog
        open={isAddSubsectionOpen}
        onOpenChange={(open) => {
          setIsAddSubsectionOpen(open)
          if (!open) {
            setSubsectionName("")
            setSubsectionParentId(null)
            setIsAddingSubsection(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[440px] gap-3" maxWidth="440px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Add Subsection
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Add a new subsection to the section</p>
          </DialogHeader>
          <div className="pt-0 pb-2 space-y-1.5">
            <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
              Subsection Name
            </Label>
            <Input
              value={subsectionName}
              onChange={(e) => setSubsectionName(e.target.value)}
              placeholder="Enter subsection name"
              className="border-gray-200"
            />
            <p className="text-xs text-gray-500">Enter the display name for the new subsection</p>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-0">
            <Button
              variant="outline"
              onClick={() => setIsAddSubsectionOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubsection}
              disabled={!subsectionName.trim() || isAddingSubsection}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAddingSubsection ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Subsection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog
        open={isEditSectionOpen}
        onOpenChange={(open) => {
          if (!open) setEditingSectionId(null)
          setIsEditSectionOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[500px] gap-3" maxWidth="500px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Edit Section
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Edit section details</p>
          </DialogHeader>
          <div className="pb-2 space-y-4 border-t border-gray-100 pt-2 min-w-0">
            <div className="space-y-1.5 min-w-0">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Display Name
              </Label>
              <div className="flex flex-wrap gap-2">
                <Input
                  value={editSectionDisplayName}
                  onChange={(e) => setEditSectionDisplayName(e.target.value)}
                  className="border-gray-200 flex-1 min-w-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-gray-300 text-gray-700 hover:bg-gray-50"
                  aria-label="Regenerate"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className={DATE_FIELD_WRAPPER_CLASS}>
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Start Date
              </Label>
              <div className={DATE_INPUT_INNER_CLASS}>
                <Input
                  type="datetime-local"
                  value={editSectionStartDate}
                  onChange={(e) => setEditSectionStartDate(e.target.value)}
                  className={DATE_INPUT_CLASS}
                  placeholder="yyyy-mm-dd, --:--"
                />
              </div>
            </div>
            <div className={DATE_FIELD_WRAPPER_CLASS}>
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Due Date
              </Label>
              <div className={DATE_INPUT_INNER_CLASS}>
                <Input
                  type="datetime-local"
                  value={editSectionDueDate}
                  onChange={(e) => setEditSectionDueDate(e.target.value)}
                  className={DATE_INPUT_CLASS}
                  placeholder="yyyy-mm-dd, --:--"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-gray-100">
            <div className="flex gap-2 sm:mr-auto order-2 sm:order-1">
              <Button
                variant="outline"
                onClick={() => {
                  if (editingSectionId) {
                    const sec = sections.find((s) => s.id === editingSectionId)
                    if (sec) {
                      setIsEditSectionOpen(false)
                      openDeleteSectionDialog(sec)
                    }
                  }
                }}
                className="px-4 py-2 text-sm font-medium border-red-200 text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  if (editingSectionId) setSubsectionParentId(editingSectionId)
                  setIsAddSubsectionOpen(true)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
              >
                Add Subsection
              </Button>
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={() => setIsEditSectionOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditSection}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subsection Dialog */}
      <Dialog
        open={isEditSubsectionOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSubsectionId(null)
            setEditingSubsectionParentId(null)
          }
          setIsEditSubsectionOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[500px] gap-3" maxWidth="500px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Edit Subsection
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Edit subsection details</p>
          </DialogHeader>
          <div className="pb-2 space-y-4 border-t border-gray-100 pt-4 min-w-0">
            <div className="space-y-1.5 min-w-0">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Display Name
              </Label>
              <div className="flex flex-wrap gap-2">
                <Input
                  value={editSubsectionDisplayName}
                  onChange={(e) => setEditSubsectionDisplayName(e.target.value)}
                  className="border-gray-200 flex-1 min-w-0 bg-white"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleRegenerateSubsectionDisplayName}
                  aria-label="Regenerate"
                >
                  <RotateCw className="w-4 h-4 mr-1.5" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Graded
              </Label>
              <Select value={editSubsectionGraded} onValueChange={(v) => setEditSubsectionGraded(v as "Yes" | "No")}>
                <SelectTrigger className="w-full border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Has Score
              </Label>
              <Select value={editSubsectionHasScore} onValueChange={(v) => setEditSubsectionHasScore(v as "Yes" | "No")}>
                <SelectTrigger className="w-full border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Format
              </Label>
              <Input
                value={editSubsectionFormat}
                onChange={(e) => setEditSubsectionFormat(e.target.value)}
                placeholder="e.g., Homework, Lab"
                className="border-gray-200 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Show Correctness
              </Label>
              <Select
                value={editSubsectionShowCorrectness}
                onValueChange={(v) => setEditSubsectionShowCorrectness(v as "Always" | "Never" | "Past due")}
              >
                <SelectTrigger className="w-full border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Always">Always</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Past due">Past due</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-gray-100">
            <div className="flex gap-2 sm:mr-auto order-2 sm:order-1">
              <Button
                variant="outline"
                onClick={handleDeleteSubsection}
                className="px-4 py-2 text-sm font-medium border-red-200 text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (editingSubsectionParentId) {
                    setSubsectionParentId(editingSubsectionParentId)
                    setIsEditSubsectionOpen(false)
                    setIsAddSubsectionOpen(true)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Unit
              </Button>
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={() => setIsEditSubsectionOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditSubsection}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course outline dialog */}
      <Dialog open={isOutlineOpen} onOpenChange={setIsOutlineOpen}>
        <DialogContent className="sm:max-w-[560px] gap-3" maxWidth="560px">
          <DialogHeader>
            <h2 className="text-lg font-bold pr-8 text-[var(--sidebar-foreground)]">{courseTitle}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Course structure outline</p>
          </DialogHeader>
          <div className="pt-0 pb-2 max-h-[60vh] overflow-y-auto">
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sections in the outline yet.</p>
            ) : (
              <div className="space-y-0 min-w-0">
                {sections.map((section, sIdx) => (
                  <div key={section.id} className="relative min-w-0">
                    <div
                      className="flex items-start gap-2 py-2 pl-3 sm:pl-4 border-l-4 border-[#3B82F6] min-w-0"
                      style={{ borderColor: "rgb(59, 130, 246)" }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 w-14 sm:w-16">Section</span>
                      <span className="text-sm font-medium text-[var(--sidebar-foreground)] min-w-0 truncate">
                        {sIdx + 1} {section.displayName || section.name}
                      </span>
                    </div>
                    {section.subsections.map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 ml-4 sm:ml-6 pl-3 sm:pl-4 py-1.5 border-l-4 border-gray-300 min-w-0"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 w-14 sm:w-20">Subsection</span>
                        <span className="text-sm text-[var(--sidebar-foreground)] min-w-0 truncate">
                          {sIdx + 1}.{subIdx + 1} {sub.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsOutlineOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section confirmation */}
      <Dialog
        open={sectionToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setSectionToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-[480px] p-3 sm:p-4 gap-3" maxWidth="480px">
          <DialogHeader className="mb-0">
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Delete Section
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone</p>
          </DialogHeader>
          <div className="pt-0 pb-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              Are you sure you want to delete the section{" "}
              <span className="font-semibold text-[var(--sidebar-foreground)]">{sectionToDelete?.name}</span>?
            </p>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-0">
            <Button
              variant="outline"
              onClick={() => setSectionToDelete(null)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => sectionToDelete && handleDeleteSection(sectionToDelete.id)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Delete Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
