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
import { cn } from "@/lib/utils"

export default function CourseSchedulePage() {
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

        <div className="flex flex-1">
          <main className="flex-1 transition-all duration-300 pb-[200px] md:pb-[200px] min-w-0">
            <div className="flex min-w-0">
              <div className="flex-1 min-w-0 w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 md:pr-20 py-4 sm:py-8 max-w-4xl mx-auto overflow-x-hidden">
                {/* Page header */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-1 text-[var(--sidebar-foreground)]">
                    {courseTitle}
                  </h1>
                  <p className="text-sm mb-4" style={{ color: "rgb(113,121,133)" }}>
                    Schedule & details
                  </p>
                  <Link href={`/course/${id}`}>
                    <Button
                      className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white border-0"
                    >
                      View About Page
                    </Button>
                  </Link>
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

              <div className="fixed top-20 right-0 z-40 flex">
                <ChatButton />
              </div>
            </div>

            <PlatformFooter />
          </main>
        </div>
      </div>
    </div>
  )
}
