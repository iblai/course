"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
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

type ContentBlock = {
  id: string
  title: string
  type: "html" | "video" | "quiz"
  html?: string
  videoId?: string
  quiz?: { question: string; choices: string[]; correctIndex: number }
}

type UnitItem = {
  id: string
  name: string
  blocks: ContentBlock[]
}

type SubsectionItem = {
  id: string
  name: string
  units?: UnitItem[]
}

type SectionItem = {
  id: string
  name: string
  displayName: string
  startDate: string
  dueDate: string
  subsections: SubsectionItem[]
}

export default function CourseEditPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const courseTitle = searchParams.get("name") || getCourseMetadata(id).title

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
      name: "AI-Driven Market Analysis",
      displayName: "1 AI-Driven Market Analysis",
      startDate: "2030-01-01T00:30",
      dueDate: "",
      subsections: [
        {
          id: "sub-1-1",
          name: "1.1 Understanding AI Technologies",
          units: [
            {
              id: "unit-1-1-1",
              name: "1.1.1 Basics of Artificial Intelligence",
              blocks: [
                {
                  id: "block-1",
                  title: "Defining Artificial Intelligence",
                  type: "html",
                  html: "<strong>What is Artificial Intelligence?</strong><p>Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. These systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.</p><p>AI relies on algorithms and machine learning models that improve through experience and data. From recommendation systems to autonomous vehicles, AI is transforming how we live and work.</p>",
                },
                {
                  id: "block-2",
                  title: "Introduction to AI Concepts",
                  type: "video",
                  videoId: "dQw4w9WgXcQ",
                },
              ],
            },
            {
              id: "unit-1-1-2",
              name: "1.1.2 Key AI Technologies",
              blocks: [
                {
                  id: "block-3",
                  title: "Overview of AI Technologies",
                  type: "html",
                  html: "<strong>Major AI Technologies</strong><p>AI technologies fall into several key categories: machine learning (including deep learning), natural language processing (NLP), computer vision, and robotics. Each of these areas enables machines to perform specific intelligent tasks.</p><p>The field is evolving rapidly, with new techniques and applications emerging regularly. Understanding these core technologies is essential for leveraging AI in business.</p>",
                },
                {
                  id: "block-4",
                  title: "AI Technologies Quiz",
                  type: "quiz",
                  quiz: {
                    question: "Which of the following is a key component of AI technologies?",
                    choices: ["Cryptography", "Data Mining", "Machine Learning", "Web Development"],
                    correctIndex: 2,
                  },
                },
              ],
            },
          ],
        },
        {
          id: "sub-1-2",
          name: "1.2 AI in Strategic Business Growth",
          units: [
            {
              id: "unit-1-2-1",
              name: "1.2.1 AI-Driven Business Models",
              blocks: [
                {
                  id: "block-5",
                  title: "Business Models Enhanced by AI",
                  type: "html",
                  html: "<strong>How AI transforms business</strong><p>AI enables new business models and enhances existing ones through automation, personalization, and data-driven decision-making.</p>",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sec-2",
      name: "Advanced AI Applications in Business",
      displayName: "2 Advanced AI Applications in Business",
      startDate: "",
      dueDate: "",
      subsections: [],
    },
  ])
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>("sec-1")
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
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false)
  const [hasPublished, setHasPublished] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false)
  const [isUpdatingDescriptions, setIsUpdatingDescriptions] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingToCourse, setIsUploadingToCourse] = useState(false)
  const [isSettingPrice, setIsSettingPrice] = useState(false)
  const [isUpdatingCertificate, setIsUpdatingCertificate] = useState(false)
  const [generatingSectionId, setGeneratingSectionId] = useState<string | null>(null)
  const [generatingSubsectionId, setGeneratingSubsectionId] = useState<string | null>(null)
  const [generatingUnitId, setGeneratingUnitId] = useState<string | null>(null)
  const [isEditSubsectionOpen, setIsEditSubsectionOpen] = useState(false)
  const [editingSubsectionId, setEditingSubsectionId] = useState<string | null>(null)
  const [editingSubsectionParentId, setEditingSubsectionParentId] = useState<string | null>(null)
  const [editSubsectionDisplayName, setEditSubsectionDisplayName] = useState("")
  const [editSubsectionGraded, setEditSubsectionGraded] = useState<"Yes" | "No">("No")
  const [editSubsectionHasScore, setEditSubsectionHasScore] = useState<"Yes" | "No">("No")
  const [editSubsectionFormat, setEditSubsectionFormat] = useState("")
  const [editSubsectionShowCorrectness, setEditSubsectionShowCorrectness] = useState<"Always" | "Never" | "Past due">("Always")
  const [editingBlock, setEditingBlock] = useState<{
    sectionId: string
    subsectionId: string
    unitId: string
    block: ContentBlock
  } | null>(null)
  const [editBlockDisplayName, setEditBlockDisplayName] = useState("")
  const [editBlockHtml, setEditBlockHtml] = useState("")

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
      setHasPublished(true)
      setIsPublishSuccessOpen(true)
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
    toast.success("Section updated.", successToastStyle)
  }

  const handleAddSection = () => {
    const name = sectionName.trim()
    if (!name || isAddingSection) return
    setIsAddingSection(true)
    const newId = `sec-${Date.now()}`
    setTimeout(() => {
      setSections((prev) => [
        ...prev,
        {
          id: newId,
          name,
          displayName: `${prev.length + 1} ${name}`,
          startDate: "",
          dueDate: "",
          subsections: [],
        },
      ])
      setSelectedSectionId(newId)
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

  const handleGenerateUnitContent = (unitId: string) => {
    setGeneratingUnitId(unitId)
    // TODO: wire to API to auto-generate unit content
    setTimeout(() => {
      setGeneratingUnitId(null)
      toast.success("Unit content generation started.", successToastStyle)
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

  const openEditBlock = (sectionId: string, subsectionId: string, unitId: string, block: ContentBlock) => {
    setEditingBlock({ sectionId, subsectionId, unitId, block: { ...block } })
    setEditBlockDisplayName(block.title)
    setEditBlockHtml(block.type === "html" && block.html ? block.html : "")
  }

  const handleCloseEditBlock = () => {
    setEditingBlock(null)
    setEditBlockDisplayName("")
    setEditBlockHtml("")
  }

  const handleSaveEditBlock = () => {
    if (!editingBlock) return
    const { sectionId, subsectionId, unitId, block } = editingBlock
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          subsections: (s.subsections || []).map((sub) => {
            if (sub.id !== subsectionId) return sub
            return {
              ...sub,
              units: (sub.units || []).map((u) => {
                if (u.id !== unitId) return u
                return {
                  ...u,
                  blocks: u.blocks.map((b) =>
                    b.id !== block.id
                      ? b
                      : {
                          ...b,
                          title: editBlockDisplayName.trim() || b.title,
                          html: b.type === "html" ? (editBlockHtml || b.html) : b.html,
                        }
                  ),
                }
              }),
            }
          }),
        }
      })
    )
    toast.success("Block updated.", successToastStyle)
    handleCloseEditBlock()
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
    <div className="h-screen-dvh overflow-y-auto bg-background">
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
          "flex flex-col min-h-screen-dvh transition-all duration-300",
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
              <div className="flex-1 min-h-0 min-w-0 w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 md:pr-20 py-4 sm:py-8 overflow-x-hidden">
                {/* Page header: title, subtitle, Add Section */}
                <div className="pt-4 pb-4 mb-4 sm:mb-6 border-b border-gray-100">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-1 text-[var(--sidebar-foreground)] break-words">
                    {courseTitle}
                  </h1>
                  <p className="text-sm mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Edit course content
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      onClick={() => setIsAddSectionOpen(true)}
                      className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white text-sm font-medium px-4 py-2"
                    >
                      Add Section
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsOutlineOpen(true)}
                      className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-sm font-medium px-4 py-2"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Course Outline
                    </Button>
                    {hasPublished && (
                      <Button
                        variant="outline"
                        asChild
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2"
                      >
                        <Link href={`/course/${id}`}>View course</Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Section tabs */}
                {sections.length > 0 && (
                  <div className="flex border-b border-gray-200 mb-6 gap-0">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setSelectedSectionId(section.id)}
                        className={cn(
                          "py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-colors",
                          selectedSectionId === section.id
                            ? "border-[#2563EB] text-[#2563EB] bg-gray-100 rounded-t-[8px]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {index + 1} {section.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Hierarchical outline with content blocks (screenshot style) */}
                <section className="min-w-0">
                  {!selectedSectionId || sections.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 bg-white rounded-lg border border-gray-200">
                      No sections yet. Click &quot;Add Section&quot; to create one.
                    </div>
                  ) : (
                    (() => {
                      const section = sections.find((s) => s.id === selectedSectionId)
                      if (!section) return null
                      return (
                        <div className="space-y-5">
                          {/* Section heading with refresh + edit */}
                          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-[var(--sidebar-foreground)]">
                              {section.displayName || section.name}
                            </h2>
                            <TooltipProvider>
                              <TooltipFlowbite content="Generate content" position="top">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50"
                                  onClick={() => handleGenerateSectionContent(section.id)}
                                  disabled={generatingSectionId === section.id}
                                  aria-label="Refresh content"
                                >
                                  <RotateCw className={cn("w-4 h-4", generatingSectionId === section.id && "animate-spin")} />
                                </Button>
                              </TooltipFlowbite>
                              <TooltipFlowbite content="Edit section" position="top">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50"
                                  onClick={() => openEditSection(section)}
                                  aria-label="Edit section"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </TooltipFlowbite>
                            </TooltipProvider>
                          </div>

                          {/* Subsections → Units → Content blocks */}
                          {(section.subsections || []).map((sub) => (
                            <div key={sub.id} className="pt-[5px] first:pt-2 border-b border-gray-100 last:border-b-0 pb-5 last:pb-0">
                              <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-base font-semibold text-[var(--sidebar-foreground)]">
                                  {sub.name}
                                </h3>
                                <TooltipProvider>
                                  <TooltipFlowbite content="Generate content" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50"
                                      onClick={() => handleGenerateSubsectionContent(sub.id)}
                                      disabled={generatingSubsectionId === sub.id}
                                      aria-label="Generate content"
                                    >
                                      <RotateCw className={cn("w-4 h-4", generatingSubsectionId === sub.id && "animate-spin")} />
                                    </Button>
                                  </TooltipFlowbite>
                                  <TooltipFlowbite content="Edit subsection" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50"
                                      onClick={() => openEditSubsection(section.id, sub)}
                                      aria-label="Edit subsection"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  </TooltipFlowbite>
                                </TooltipProvider>
                              </div>
                              {(sub.units || []).map((unit) => (
                                <div key={unit.id} className="pl-3 sm:pl-5 ml-0 border-l-2 border-gray-200 mb-6 last:mb-0">
                                  <div className="flex items-center gap-2 mb-3 mt-4 first:mt-0">
                                    <h4 className="text-sm font-semibold text-gray-700">{unit.name}</h4>
                                    <TooltipProvider>
                                      <TooltipFlowbite content="Generate content" position="top">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50"
                                          onClick={() => handleGenerateUnitContent(unit.id)}
                                          disabled={generatingUnitId === unit.id}
                                          aria-label="Generate content"
                                        >
                                          <RotateCw className={cn("w-3.5 h-3.5", generatingUnitId === unit.id && "animate-spin")} />
                                        </Button>
                                      </TooltipFlowbite>
                                    </TooltipProvider>
                                  </div>
                                  {(unit.blocks || []).map((block) => (
                                    <div key={block.id} className="mb-6 last:mb-0">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className="font-medium text-gray-800">{block.title}</span>
                                        <TooltipProvider>
                                          <TooltipFlowbite content="Edit block" position="top">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50"
                                              aria-label="Edit block"
                                              onClick={() => openEditBlock(section.id, sub.id, unit.id, block)}
                                            >
                                              <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                          </TooltipFlowbite>
                                        </TooltipProvider>
                                      </div>
                                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm text-gray-800 leading-relaxed mt-1">
                                        {block.type === "html" && block.html && (
                                          <div
                                            className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 prose-headings:font-semibold prose-headings:text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: block.html }}
                                          />
                                        )}
                                        {block.type === "video" && block.videoId && (
                                          <p className="font-medium text-gray-600">YouTube ID: {block.videoId}</p>
                                        )}
                                        {block.type === "quiz" && block.quiz && (
                                          <div>
                                            <p className="font-semibold text-gray-800 mb-1">Question:</p>
                                            <p className="mb-2">{block.quiz.question}</p>
                                            <p className="font-semibold text-gray-800 mb-1">Choices:</p>
                                            <ul className="list-disc list-inside space-y-0.5">
                                              {block.quiz.choices.map((choice, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                  {choice}
                                                  {i === block.quiz!.correctIndex && (
                                                    <span className="text-[#00A3EC]" aria-label="Correct">✓</span>
                                                  )}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                              {(!sub.units || sub.units.length === 0) && (
                                <div className="flex items-center gap-2 pl-2">
                                  <TooltipFlowbite content="Add subsection" position="top">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-gray-500 hover:text-[#2563EB]"
                                      onClick={() => {
                                        setSubsectionParentId(section.id)
                                        setIsAddSubsectionOpen(true)
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </TooltipFlowbite>
                                  <span className="text-sm text-gray-500">No units yet. Add subsection to create content.</span>
                                </div>
                              )}
                            </div>
                          ))}
                          {section.subsections.length === 0 && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                                onClick={() => {
                                  setSubsectionParentId(section.id)
                                  setIsAddSubsectionOpen(true)
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add subsection
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })()
                  )}
                </section>

                {/* Publish button at bottom of page */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handlePublishChanges}
                    disabled={isPublishing}
                    className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white disabled:opacity-70 disabled:cursor-not-allowed text-sm font-medium px-4 py-2"
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

      {/* Publish success dialog */}
      <Dialog open={isPublishSuccessOpen} onOpenChange={setIsPublishSuccessOpen}>
        <DialogContent className="sm:max-w-[440px] gap-3" maxWidth="440px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Published
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Your course has published. Click View Course to review the course page.
            </p>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              asChild
              className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white text-sm font-medium px-4 py-2"
            >
              <Link href={`/course/${id}`}>View course</Link>
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
                className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-600 hover:bg-gray-50"
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
                className="px-4 py-2 text-sm font-medium border-gray-200 text-gray-600 hover:bg-gray-50"
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

      {/* Edit Block Dialog */}
      <Dialog open={editingBlock !== null} onOpenChange={(open) => !open && handleCloseEditBlock()}>
        <DialogContent className="sm:max-w-[640px] gap-3 max-h-[90vh] overflow-y-auto" maxWidth="640px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">
              Edit Block
            </DialogTitle>
          </DialogHeader>
          <div className="pb-2 space-y-4 border-t border-gray-100 pt-4 min-w-0">
            {/* Display Name */}
            <div className="space-y-1.5 min-w-0">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Display Name
              </Label>
              <div className="flex flex-wrap gap-2">
                <Input
                  value={editBlockDisplayName}
                  onChange={(e) => setEditBlockDisplayName(e.target.value)}
                  placeholder="Enter display name for the block"
                  className="border-gray-200 flex-1 min-w-0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setEditBlockDisplayName(editBlockDisplayName ? `${editBlockDisplayName} (revised)` : "Untitled block")
                    toast.success("Display name regenerated.", successToastStyle)
                  }}
                  aria-label="Regenerate"
                >
                  <RotateCw className="w-4 h-4 mr-1.5" />
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-gray-500">Enter the display name for the block</p>
            </div>
            {/* HTML Content - show for html type */}
            {editingBlock?.block.type === "html" && (
              <div className="space-y-1.5 min-w-0">
                <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                  HTML Content
                </Label>
                <div className="flex gap-1 p-1.5 border border-gray-200 rounded-lg bg-gray-50/50 min-w-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-200 shrink-0"
                    onClick={() => {
                      const ta = document.getElementById("edit-block-html") as HTMLTextAreaElement
                      if (ta) {
                        const start = ta.selectionStart
                        const end = ta.selectionEnd
                        const text = editBlockHtml
                        const selected = text.slice(start, end)
                        setEditBlockHtml(text.slice(0, start) + (selected ? `<strong>${selected}</strong>` : "<strong></strong>") + text.slice(end))
                      }
                    }}
                    aria-label="Bold"
                  >
                    <span className="text-sm font-bold">B</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-200 italic shrink-0"
                    onClick={() => {
                      const ta = document.getElementById("edit-block-html") as HTMLTextAreaElement
                      if (ta) {
                        const start = ta.selectionStart
                        const end = ta.selectionEnd
                        const text = editBlockHtml
                        const selected = text.slice(start, end)
                        setEditBlockHtml(text.slice(0, start) + (selected ? `<em>${selected}</em>` : "<em></em>") + text.slice(end))
                      }
                    }}
                    aria-label="Italic"
                  >
                    <span className="text-sm font-bold">I</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-200 shrink-0"
                    onClick={() => setEditBlockHtml(editBlockHtml + "\n<ul>\n  <li></li>\n</ul>")}
                    aria-label="Bullet list"
                  >
                    <span className="text-sm">•</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-200 shrink-0"
                    onClick={() => setEditBlockHtml(editBlockHtml + "\n<ol>\n  <li></li>\n</ol>")}
                    aria-label="Numbered list"
                  >
                    <span className="text-sm font-medium">1.</span>
                  </Button>
                </div>
                <Textarea
                  id="edit-block-html"
                  value={editBlockHtml}
                  onChange={(e) => setEditBlockHtml(e.target.value)}
                  placeholder="Enter HTML content..."
                  className="min-h-[200px] w-full min-w-0 border-gray-200 text-sm font-mono resize-y"
                  rows={10}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => toast.success("Content regeneration started.", successToastStyle)}
                  aria-label="Regenerate"
                >
                  <RotateCw className="w-4 h-4 mr-1.5" />
                  Regenerate
                </Button>
                <p className="text-xs text-gray-500">Enter the HTML content for the block</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleCloseEditBlock}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditBlock}
              className="w-full sm:w-auto bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
            >
              Save Changes
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
