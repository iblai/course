"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { DocumentSidebar } from "@/components/document-sidebar"

import { VoiceColumn } from "@/components/voice-column"
import ChatButton from "@/components/chat-button"
import { cn } from "@/lib/utils"
import "@/styles/colors.css"

function CourseCatalogContent() {
  const [searchValue, setSearchValue] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDocumentSidebarOpen, setIsDocumentSidebarOpen] = useState(false)
  const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false)
  const [isVoiceSidebarOpen, setIsVoiceSidebarOpen] = useState(false)

  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(true)

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
      title: "AI in Academia: Driving Innovation and Efficiency",
      image: "/images/course-1.png",
      level: "Beginner",
    },
    {
      id: 2,
      title: "AI to Empower Students with Hyper-Personalized Learning",
      image: "/images/course-2.png",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "AI in Autonomous Vehicles: Driving the Future",
      image: "/images/course-3.png",
      level: "Advanced",
    },
    {
      id: 4,
      title: "Managing Cybersecurity Incident Response",
      image: "/images/data-driven-decision.png",
      level: "Intermediate",
    },
    {
      id: 5,
      title: "Going Cloud Native with Linux",
      image: "/images/team-performance.png",
      level: "Advanced",
    },
    {
      id: 6,
      title: "Data-Driven Leadership",
      image: "/images/leadership-is-language.png",
      level: "Beginner",
    },
    {
      id: 7,
      title: "Advanced Leadership Techniques",
      image: "/images/leadership-development.png",
      level: "Advanced",
    },
    {
      id: 8,
      title: "Mastering Project Management",
      image: "/images/strategic-leadership.png",
      level: "Intermediate",
    },
    {
      id: 9,
      title: "Building High Performance Teams",
      image: "/images/teamwork-growth.png",
      level: "Beginner",
    },
    {
      id: 10,
      title: "Employee Coaching Techniques",
      image: "/images/coaching-culture.png",
      level: "Intermediate",
    },
    {
      id: 11,
      title: "Strategic Decision Making",
      image: "/images/strategic-leadership.png",
      level: "Advanced",
    },
    {
      id: 12,
      title: "Introduction to Machine Learning",
      image: "/images/course-1.png",
      level: "Beginner",
    },
  ]

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchValue.toLowerCase()))

  const handleCourseClick = (course: (typeof courses)[0]) => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push(`/course/${course.id}`)
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
                {/* Search Bar */}
                <div className="mb-6 sm:mb-8 max-w-md">
                  <div className="relative">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-[200px]">
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
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No courses found matching your search.</p>
                  </div>
                )}
              </div>

              {/* Chat Button - sticky right side */}
              <div className="fixed top-20 right-0 z-40 flex">
                <ChatButton />
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
    </div>
  )
}

export default function CourseCatalogPage() {
  return <CourseCatalogContent />
}
