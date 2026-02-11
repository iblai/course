"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { ChatButton } from "@/components/chat-button"
import { VoiceColumn } from "@/components/voice-column"
import { Clock, Calendar, Award, Globe, Play, Plus, Minus, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCourseMetadata } from "@/lib/course-metadata"

export default function CourseDetailsContent() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const isLoggedIn = true
  const { title: courseTitle, image: courseImage } = getCourseMetadata(id)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [documentSidebarOpen, setDocumentSidebarOpen] = useState(false)
  const [agentSidebarOpen, setAgentSidebarOpen] = useState(false)
  const [voiceSidebarOpen, setVoiceSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [navigating, setNavigating] = useState(false)

  const handleDocumentSidebarToggle = () => {
    setDocumentSidebarOpen(!documentSidebarOpen)
    if (!documentSidebarOpen) {
      setAgentSidebarOpen(false)
      setVoiceSidebarOpen(false)
    }
  }

  const handleAgentSidebarToggle = () => {
    setAgentSidebarOpen(!agentSidebarOpen)
    if (!agentSidebarOpen) {
      setDocumentSidebarOpen(false)
      setVoiceSidebarOpen(false)
    }
  }

  const handleVoiceSidebarToggle = () => {
    setVoiceSidebarOpen(!voiceSidebarOpen)
    if (!voiceSidebarOpen) {
      setDocumentSidebarOpen(false)
      setAgentSidebarOpen(false)
    }
  }

  const isAnySidebarOpen = documentSidebarOpen || agentSidebarOpen || voiceSidebarOpen

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 925)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    const fetchCourse = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const courseData = {
        id: id,
        title: courseTitle,
        image: courseImage,
        duration: "8:45",
        date: "May 15, 2025",
        language: "English",
        certificate: true,
        free: true,
        description:
          "Develop the essential skills needed to lead strategically in today's complex business environment. This comprehensive course explores the fundamental principles of strategic leadership, equipping you with the tools to inspire teams, drive innovation, and navigate organizational change. You'll learn how to align vision with execution, make data-driven decisions, and foster a culture of collaboration and continuous improvement. Through case studies, interactive exercises, and real-world scenarios, you'll develop a strategic mindset that balances short-term goals with long-term organizational success.",
        objectives: [
          "Develop a strategic vision and effectively communicate it to stakeholders",
          "Build high-performing teams through motivation and empowerment",
          "Implement strategic decision-making frameworks for complex challenges",
          "Lead organizational change initiatives with confidence and clarity",
          "Foster innovation and adaptability in rapidly evolving environments",
          "Balance analytical thinking with emotional intelligence in leadership",
        ],
        syllabus: [
          {
            title: "Foundations of Strategic Leadership",
            expanded: true,
            lessons: [
              { title: "Introduction to Strategic Leadership", type: "video", duration: "10:15" },
              { title: "The Strategic Leader's Mindset", type: "video", duration: "8:30" },
              { title: "Distinguishing Management from Leadership", type: "video", duration: "7:45" },
            ],
          },
          {
            title: "Vision and Strategic Planning",
            expanded: true,
            lessons: [
              { title: "Crafting a Compelling Vision", type: "video", duration: "9:20" },
              { title: "Strategic Planning Frameworks", type: "video", duration: "12:15" },
              { title: "Aligning Vision with Organizational Goals", type: "video", duration: "8:40" },
            ],
          },
          {
            title: "Building High-Performance Teams",
            expanded: true,
            lessons: [
              { title: "Team Dynamics and Development", type: "video", duration: "11:30" },
              { title: "Motivational Leadership Techniques", type: "video", duration: "9:45" },
              { title: "Delegation and Empowerment", type: "video", duration: "8:20" },
              { title: "Conflict Resolution Strategies", type: "video", duration: "10:15" },
            ],
          },
          {
            title: "Strategic Decision Making",
            expanded: true,
            lessons: [
              { title: "Decision-Making Models", type: "video", duration: "9:30" },
              { title: "Data-Driven Leadership", type: "video", duration: "11:15" },
              { title: "Risk Assessment and Management", type: "video", duration: "10:45" },
            ],
          },
          {
            title: "Leading Change and Innovation",
            expanded: true,
            lessons: [
              { title: "Change Management Frameworks", type: "video", duration: "12:10" },
              { title: "Overcoming Resistance to Change", type: "video", duration: "9:25" },
              { title: "Fostering Innovation Culture", type: "video", duration: "10:40" },
              { title: "Adaptive Leadership in Practice", type: "video", duration: "8:55" },
            ],
          },
          {
            title: "Strategic Communication",
            expanded: true,
            lessons: [
              { title: "Effective Communication Strategies", type: "video", duration: "9:15" },
              { title: "Storytelling for Leaders", type: "video", duration: "7:50" },
              { title: "Influencing and Persuasion Skills", type: "video", duration: "8:35" },
            ],
          },
          {
            title: "Emotional Intelligence in Leadership",
            expanded: true,
            lessons: [
              { title: "Self-Awareness and Self-Management", type: "video", duration: "10:20" },
              { title: "Social Awareness and Relationship Management", type: "video", duration: "9:45" },
              { title: "Building Resilience and Adaptability", type: "video", duration: "8:30" },
            ],
          },
          {
            title: "Ethical Leadership and Governance",
            expanded: true,
            lessons: [
              { title: "Ethical Decision-Making Frameworks", type: "video", duration: "11:10" },
              { title: "Corporate Social Responsibility", type: "video", duration: "9:25" },
              { title: "Building Trust and Integrity", type: "video", duration: "8:40" },
            ],
          },
          {
            title: "Leadership in Practice",
            expanded: true,
            lessons: [
              { title: "Case Study Analysis", type: "workshop", duration: "15:00" },
              { title: "Leadership Action Planning", type: "workshop", duration: "12:30" },
              { title: "Personal Leadership Development Plan", type: "assessment", duration: "20:00" },
            ],
          },
        ],
      }

      setCourse(courseData)
      const initialExpandedState: Record<string, boolean> = {}
      courseData.syllabus.forEach((_, index) => {
        initialExpandedState[index] = true
      })
      setExpandedSections(initialExpandedState)
      setLoading(false)
    }

    fetchCourse()
  }, [id, courseImage, courseTitle])

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleAccessCourse = async () => {
    try {
      setNavigating(true)
      await router.push(`/course-content/${id}/course${isLoggedIn ? "?loggedIn=true" : ""}`)
    } catch (error) {
      console.error("Navigation error:", error)
      setNavigating(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen overflow-y-auto bg-background">
        <SidebarLearner
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          showAdminButtons={true}
          isLoggedIn={isLoggedIn}
        />
        <div
          className={cn(
            "flex flex-col min-h-screen transition-all duration-300",
            sidebarCollapsed ? "md:ml-16" : "md:ml-64",
          )}
        >
          <Header
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
            isLoggedIn={isLoggedIn}
            showLogo={true}
            showBackButton={true}
            showModelSelector={true}
            sidebarCollapsed={sidebarCollapsed}
          />
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <PlatformFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-background">
      {/* Sidebar */}
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={isLoggedIn}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex flex-1">
          <main
            className={cn(
              "flex-1 transition-all duration-300 pb-[200px] md:pb-[200px] min-w-0",
              isAnySidebarOpen ? "md:mr-[380px]" : "",
            )}
          >
            <div className="flex min-w-0">
              <div className="flex-1 min-w-0 w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 md:pr-20 py-4 sm:py-8 max-w-6xl mx-auto overflow-x-hidden">
                {/* Page header - sticky (same pattern as edit course page) */}
                <div className="sticky top-0 z-10 pt-4 pb-2 mb-1 bg-background border-b border-border">
                  <h1 className="text-base md:text-lg font-semibold text-text-secondary">{course.title}</h1>
                </div>

                {/* Sub tabs */}
                <div className="border-b border-border mb-4 sm:mb-6">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab("about")}
                      className={`py-3 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "about"
                          ? "border-brand-primary text-brand-primary"
                          : "border-transparent text-text-secondary hover:border-gray-300"
                      }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setActiveTab("syllabus")}
                      className={`py-3 px-1 text-sm font-medium border-b-2 ${
                        activeTab === "syllabus"
                          ? "border-brand-primary text-brand-primary"
                          : "border-transparent text-text-secondary hover:border-gray-300"
                      }`}
                    >
                      Syllabus
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 w-full bg-accent-blue rounded-lg min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
                  <div className="md:col-span-2">
                    {activeTab === "about" ? (
                      <div className="bg-white rounded-lg border border-border p-6">
                        <h2 className="text-lg font-medium mb-4 text-text-secondary">Course Description</h2>
                        <p className="text-text-secondary">{course.description}</p>

                        <div className="mt-6">
                          <h2 className="text-lg font-medium mb-3 text-text-secondary">Course objectives:</h2>
                          <ul className="space-y-2">
                            {course.objectives.map((objective: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2 text-brand-primary">{index + 1})</span>
                                <span className="text-text-secondary">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg border border-border p-6">
                        <h2 className="text-lg font-medium mb-4 text-text-secondary">Syllabus</h2>
                        <div className="space-y-3">
                          {course.syllabus.map((section: any, index: number) => (
                            <div key={index} className="border border-border rounded-md overflow-hidden">
                              <div
                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleSection(index)}
                              >
                                <h3 className="font-medium text-text-primary">{section.title}</h3>
                                <div>
                                  {expandedSections[index] ? (
                                    <Minus className="h-5 w-5 text-text-muted" />
                                  ) : (
                                    <Plus className="h-5 w-5 text-text-muted" />
                                  )}
                                </div>
                              </div>

                              {expandedSections[index] && (
                                <div className="border-t border-border">
                                  {section.lessons.map((lesson: any, lessonIndex: number) => (
                                    <div
                                      key={lessonIndex}
                                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-border last:border-b-0"
                                    >
                                      <div className="mr-3 text-brand-primary">
                                        <Play className="h-5 w-5" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm text-text-secondary">{lesson.title}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-1">
                    <div className="sticky top-6 space-y-6 mb-6">
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-white flex items-center justify-center border border-border">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <button
                        onClick={handleAccessCourse}
                        disabled={navigating}
                        className="w-full py-3 text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-brand-gradient"
                      >
                        {navigating ? "Loading..." : "Access Course"}
                      </button>

                      <div className="space-y-4 bg-white border border-border rounded-lg p-4">
                        <div className="flex items-center text-text-secondary">
                          <DollarSign className="h-5 w-5 mr-3 text-brand-primary" />
                          <span>Free</span>
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <Globe className="h-5 w-5 mr-3 text-brand-primary" />
                          <span>English</span>
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <Award className="h-5 w-5 mr-3 text-brand-primary" />
                          <span>Certificate</span>
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <Clock className="h-5 w-5 mr-3 text-brand-primary" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <Calendar className="h-5 w-5 mr-3 text-brand-primary" />
                          <span>{course.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              <div className="fixed top-20 right-0 z-40 flex">
                <ChatButton />
              </div>
            </div>

            <PlatformFooter />
          </main>
        </div>

        {voiceSidebarOpen && (
          <div className="fixed top-0 md:top-[65px] right-0 w-full md:w-[380px] h-full md:h-[calc(100vh-65px)] z-50 md:z-40">
            <VoiceColumn onClose={() => setVoiceSidebarOpen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
