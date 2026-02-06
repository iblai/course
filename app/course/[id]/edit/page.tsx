"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
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
import { RotateCw, Calendar, Pencil, Trash2, Plus, ChevronDown, ChevronRight, FileText, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const searchParams = useSearchParams()
  const id = params.id as string
  const courseTitle = searchParams.get("title") || "Course"

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
  const [isAddSubsectionOpen, setIsAddSubsectionOpen] = useState(false)
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
    if (!name) return
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
  }

  const handleAddSubsection = () => {
    const name = subsectionName.trim()
    if (!name || !subsectionParentId) return
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
  }

  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    if (editingSectionId === sectionId) {
      setIsEditSectionOpen(false)
      setEditingSectionId(null)
    }
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
    <div className="min-h-screen bg-background">
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
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col transition-all duration-300 overflow-y-auto">
            <div className="flex">
              <div className="flex-1 px-5 sm:px-2 py-4 sm:py-8 pb-[200px] md:pb-[200px] w-full sm:pl-8 sm:pr-8 md:pr-20 max-w-4xl mx-auto">
                {/* Page header - sticky */}
                <div className="sticky top-0 z-10 pt-4 pb-4 mb-6 sm:mb-8 bg-background border-b border-gray-100">
                  <h1
                    className="text-xl sm:text-2xl font-semibold mb-1 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent"
                    style={{ color: "rgb(33,41,52)" }}
                  >
                    {courseTitle}
                  </h1>
                  <p className="text-sm mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Edit course details, descriptions, image, price, and certificates
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/course/${id}`}>
                      <Button
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                      >
                        View About Page
                      </Button>
                    </Link>
                    <Link href={`/course/${id}/schedule${courseTitle ? `?title=${encodeURIComponent(courseTitle)}` : ""}`}>
                      <Button
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                      >
                        Schedule & details
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {}}
                      className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Publish changes
                    </Button>
                  </div>
                </div>

                {/* Course Details */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-base font-semibold mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Course Details
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                        Course ID
                      </Label>
                      <Input
                        value={courseId}
                        readOnly
                        className="bg-gray-50 border-gray-200 text-sm"
                      />
                      <p className="text-xs text-gray-500">Course identifier (cannot be changed)</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                        Display Name
                      </Label>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="border-gray-200"
                      />
                      <p className="text-xs text-gray-500">Display name for the course</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                          Start Date
                        </Label>
                        <Input
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="border-gray-200"
                        />
                        <p className="text-xs text-gray-500">Course start date and time (optional)</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                          End Date
                        </Label>
                        <Input
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="border-gray-200"
                        />
                        <p className="text-xs text-gray-500">Course end date and time (optional)</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                          Enrollment Start Date
                        </Label>
                        <Input
                          type="datetime-local"
                          value={enrollmentStart}
                          onChange={(e) => setEnrollmentStart(e.target.value)}
                          className="border-gray-200"
                          placeholder="yyyy-mm-dd, --:--"
                        />
                        <p className="text-xs text-gray-500">Enrollment start (optional)</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                          Enrollment End Date
                        </Label>
                        <Input
                          type="datetime-local"
                          value={enrollmentEnd}
                          onChange={(e) => setEnrollmentEnd(e.target.value)}
                          className="border-gray-200"
                          placeholder="yyyy-mm-dd, --:--"
                        />
                        <p className="text-xs text-gray-500">Enrollment end (optional)</p>
                      </div>
                    </div>
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                    >
                      Update Course
                    </Button>
                  </div>
                </section>

                {/* Course structure */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-base font-semibold" style={{ color: "rgb(113,121,133)" }}>
                        Course structure
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">Manage sections and subsections</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOutlineOpen(true)}
                        className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        See course outline
                      </Button>
                      <Button
                        onClick={() => setIsAddSectionOpen(true)}
                        className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Section
                      </Button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {sections.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No sections yet. Click &quot;Add Section&quot; to create one.
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {sections.map((section, index) => (
                          <li key={section.id} className="bg-white">
                            <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50/50">
                              <button
                                type="button"
                                onClick={() => toggleSectionExpanded(section.id)}
                                className="p-0.5 rounded hover:bg-gray-200 text-gray-500"
                                aria-label={expandedSectionIds.has(section.id) ? "Collapse" : "Expand"}
                              >
                                {expandedSectionIds.has(section.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <span className="flex-1 text-sm font-medium min-w-0 truncate" style={{ color: "rgb(113,121,133)" }}>
                                {index + 1}. {section.displayName || section.name}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-600 hover:text-[#2563EB] hover:bg-blue-50"
                                  onClick={() => openEditSection(section)}
                                  aria-label="Edit section"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteSection(section.id)}
                                  aria-label="Delete section"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {expandedSectionIds.has(section.id) && (
                              <div className="border-t border-gray-100 bg-gray-50/30">
                                {section.subsections.length > 0 ? (
                                  <ul>
                                    {section.subsections.map((sub) => (
                                      <li
                                        key={sub.id}
                                        className="flex items-center gap-2 pl-10 pr-4 py-2 text-sm border-b border-gray-100 last:border-b-0"
                                      >
                                        <span className="flex-1 text-gray-600">{sub.name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="pl-10 pr-4 py-3 text-sm text-gray-500">No subsections. Click + to add one.</p>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>

                {/* Course Descriptions */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-base font-semibold mb-1" style={{ color: "rgb(113,121,133)" }}>
                    Course Descriptions
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">Update course descriptions using the dedicated endpoint</p>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                        Description
                      </Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[180px] border-gray-200 text-sm"
                      />
                      <p className="text-xs text-gray-500">Complete description of the course (optional)</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                        Short Description
                      </Label>
                      <Textarea
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="min-h-[80px] border-gray-200 text-sm"
                      />
                      <p className="text-xs text-gray-500">Short description (optional)</p>
                    </div>
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                    >
                      Update Course Descriptions
                    </Button>
                  </div>
                </section>

                {/* Course Image */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-base font-semibold mb-1" style={{ color: "rgb(113,121,133)" }}>
                    Course Image
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">Upload or generate a course image</p>
                  <div className="space-y-4">
                    <div className="aspect-video max-w-md rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src="/images/course-1.png"
                        alt={courseTitle}
                        width={560}
                        height={315}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                      >
                        Upload Image
                      </Button>
                      <Button variant="outline" className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50">
                        Generate with AI
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                        Select Image File
                      </Label>
                      <Input type="file" accept=".jpg,.jpeg,.png,.gif" className="border-gray-200" />
                      <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                        Image Alt Text (optional)
                      </Label>
                      <Input placeholder="Description of the image" className="border-gray-200" />
                      <p className="text-xs text-gray-500">Alternative text for accessibility</p>
                    </div>
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                    >
                      Upload Image
                    </Button>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium mb-2" style={{ color: "rgb(113,121,133)" }}>
                        Upload the current image to the course in edX Studio
                      </p>
                      <Button className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white">
                        Upload Image to Course
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Course Price */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-base font-semibold mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Course Price
                  </h2>
                  <div className="flex items-center gap-2 max-w-[140px]">
                    <span className="text-gray-600 font-medium">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                  <Button
                    className="mt-4 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                  >
                    Set price (In U.S. Dollars)
                  </Button>
                </section>

                {/* Certificates */}
                <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
                  <h2 className="text-base font-semibold mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Certificates
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3" style={{ color: "rgb(113,121,133)" }}>
                        Details
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                            Title
                          </Label>
                          <Input value={courseTitle} readOnly className="bg-gray-50 border-gray-200" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                            Number
                          </Label>
                          <Input value={certNumber} readOnly className="bg-gray-50 border-gray-200" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                            Title override
                          </Label>
                          <Input
                            value={certTitleOverride}
                            onChange={(e) => setCertTitleOverride(e.target.value)}
                            placeholder="Optional"
                            className="border-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3" style={{ color: "rgb(113,121,133)" }}>
                        Signatories
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        It is recommended to include four or fewer signatories. Preview the certificate in Print View to
                        ensure it prints on one page.
                      </p>
                      <div className="space-y-3">
                        <p className="text-xs font-medium text-gray-600">Signatory 1</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                              Name
                            </Label>
                            <Input
                              value={signatoryName}
                              onChange={(e) => setSignatoryName(e.target.value)}
                              className="border-gray-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                              Title
                            </Label>
                            <Input
                              value={signatoryTitle}
                              onChange={(e) => setSignatoryTitle(e.target.value)}
                              className="border-gray-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                              Organization
                            </Label>
                            <Input
                              value={signatoryOrg}
                              onChange={(e) => setSignatoryOrg(e.target.value)}
                              className="border-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white"
                    >
                      Update Certificate Details
                    </Button>
                  </div>
                </section>
              </div>

              <div className="hidden md:flex fixed top-20 right-0 z-[100]">
                <ChatButton />
              </div>
            </div>

            <PlatformFooter />
          </main>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={isAddSectionOpen} onOpenChange={(open) => { setIsAddSectionOpen(open); if (!open) setSectionName("") }}>
        <DialogContent className="sm:max-w-[440px] gap-y-2" maxWidth="440px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold" style={{ color: "rgb(33,41,52)" }}>
              Add Section
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Add a new section to the course</p>
          </DialogHeader>
          <div className="pb-4 space-y-1.5">
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
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddSectionOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={!sectionName.trim()}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Add Section
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
          }
        }}
      >
        <DialogContent className="sm:max-w-[440px] gap-y-2" maxWidth="440px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold" style={{ color: "rgb(33,41,52)" }}>
              Add Subsection
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Add a new subsection to the section</p>
          </DialogHeader>
          <div className="pb-4 space-y-1.5">
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
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddSubsectionOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubsection}
              disabled={!subsectionName.trim()}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Add Subsection
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
        <DialogContent className="sm:max-w-[500px] gap-y-2" maxWidth="500px">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold" style={{ color: "rgb(33,41,52)" }}>
              Edit Section
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Edit section details</p>
          </DialogHeader>
          <div className="pb-4 space-y-4 border-t border-gray-100 pt-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Display Name
              </Label>
              <div className="flex gap-2">
                <Input
                  value={editSectionDisplayName}
                  onChange={(e) => setEditSectionDisplayName(e.target.value)}
                  className="border-gray-200 flex-1"
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
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Start Date
              </Label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  value={editSectionStartDate}
                  onChange={(e) => setEditSectionStartDate(e.target.value)}
                  className="border-gray-200 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                Due Date
              </Label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  value={editSectionDueDate}
                  onChange={(e) => setEditSectionDueDate(e.target.value)}
                  className="border-gray-200 pr-10"
                  placeholder="yyyy-mm-dd, --:-- --"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-100">
            <div className="flex gap-2 sm:mr-auto order-2 sm:order-1">
              <Button
                variant="outline"
                onClick={() => editingSectionId && handleDeleteSection(editingSectionId)}
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

      {/* Course outline dialog */}
      <Dialog open={isOutlineOpen} onOpenChange={setIsOutlineOpen}>
        <DialogContent className="sm:max-w-[560px] gap-y-2" maxWidth="560px">
          <DialogHeader>
            <h2 className="text-lg font-bold text-gray-900 pr-8">{courseTitle}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Course structure outline</p>
          </DialogHeader>
          <div className="pb-4 max-h-[60vh] overflow-y-auto">
            {sections.length === 0 ? (
              <p className="text-sm text-gray-500">No sections in the outline yet.</p>
            ) : (
              <div className="space-y-0">
                {sections.map((section, sIdx) => (
                  <div key={section.id} className="relative">
                    <div
                      className="flex items-start gap-2 py-2 pl-4 border-l-4 border-[#3B82F6]"
                      style={{ borderColor: "rgb(59, 130, 246)" }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0 w-16">Section</span>
                      <span className="text-sm font-medium text-gray-900">
                        {sIdx + 1} {section.displayName || section.name}
                      </span>
                    </div>
                    {section.subsections.map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 ml-6 pl-4 py-1.5 border-l-4"
                        style={{ borderColor: "#14b8a6" }}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0 w-20">Subsection</span>
                        <span className="text-sm text-gray-700">
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
    </div>
  )
}
