"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronRight, Play, FileText, Clock, CheckCircle, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"

import { VoiceColumn } from "@/components/voice-column"
import ChatButton from "@/components/chat-button"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { cn } from "@/lib/utils"

export default function CourseContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ id: string }>()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [expandedModule, setExpandedModule] = useState("module4")
  const [currentLesson, setCurrentLesson] = useState("lesson14")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false)
  const [documentSidebarOpen, setDocumentSidebarOpen] = useState(false)
  const [agentSidebarOpen, setAgentSidebarOpen] = useState(false)
  const [voiceSidebarOpen, setVoiceSidebarOpen] = useState(false)

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 925)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("courseSidebarExpanded")
      if (saved !== null) {
        setSidebarExpanded(JSON.parse(saved))
      }
    }
  }, [])

  const onToggleCourseSidebar = () => {
    const newState = !sidebarExpanded
    setSidebarExpanded(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("courseSidebarExpanded", JSON.stringify(newState))
    }
  }

  const pathname = usePathname()
  const activeTab = pathname.split("/").pop() || "course"

  const course = {
    id: params.id,
    title: "Strategic Leadership Development",
    progress: 35,
    grade: 0,
    modules: [
      {
        id: "module1",
        title: "Foundations of Strategic Leadership",
        expanded: true,
        lessons: [
          { id: "lesson1", title: "Leadership Fundamentals", completed: true, type: "video" },
          { id: "lesson2", title: "Strategic Thinking", completed: false, type: "document" },
        ],
      },
      {
        id: "module2",
        title: "Vision and Strategic Planning",
        expanded: false,
        lessons: [
          { id: "lesson3", title: "Creating Vision", completed: false, type: "video" },
          { id: "lesson4", title: "Strategic Planning Process", completed: false, type: "quiz" },
        ],
      },
      {
        id: "module3",
        title: "Building High-Performance Teams",
        expanded: false,
        lessons: [
          { id: "lesson5", title: "Team Dynamics", completed: false, type: "video" },
          { id: "lesson6", title: "Performance Management", completed: false, type: "document" },
        ],
      },
      {
        id: "module4",
        title: "Strategic Decision Making",
        expanded: true,
        lessons: [
          { id: "lesson7", title: "Decision Frameworks", completed: false, type: "video" },
          { id: "lesson8", title: "Risk Assessment", completed: false, type: "document" },
          { id: "lesson9", title: "Data-Driven Decisions", completed: false, type: "video" },
          { id: "lesson10", title: "Implementation Strategies", completed: false, type: "quiz" },
          { id: "lesson11", title: "Change Management", completed: false, type: "video" },
          { id: "lesson12", title: "Stakeholder Engagement", completed: false, type: "document" },
          { id: "lesson13", title: "Communication Strategies", completed: false, type: "video" },
          { id: "lesson14", title: "Leadership in Crisis", completed: false, type: "video", active: true },
          { id: "lesson15", title: "Continuous Improvement", completed: false, type: "document" },
          { id: "lesson16", title: "Future Leadership", completed: false, type: "quiz" },
        ],
      },
    ],
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? "" : moduleId)
  }

  const selectLesson = (lessonId: string) => {
    setCurrentLesson(lessonId)
  }

  return (
    <div className="h-screen-dvh overflow-y-auto bg-background">
      {!isMobile && (
        <SidebarLearner
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isLoggedIn={true}
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      )}

      {isMobile && (
        <SidebarLearner
          isCollapsed={false}
          onToggleCollapse={() => {}}
          isLoggedIn={true}
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "flex flex-col min-h-screen-dvh transition-all duration-300",
          !isMobile && (isCollapsed ? "md:ml-16" : "md:ml-64"),
        )}
      >
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={true}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={isCollapsed}
        />

        <div className="flex flex-1 min-h-0 relative overflow-hidden">
          {/* Course sidebar - Desktop only */}
          <div
            className={cn(
              "hidden md:block md:transition-all md:duration-300 border-r flex-shrink-0 overflow-hidden bg-white",
              sidebarExpanded ? "md:w-80" : "md:w-0"
            )}
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{course.title}</h2>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ backgroundColor: "var(--sidebar-bg)" }}>
                {course.modules.map((module) => (
                  <div key={module.id} className="border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
                    <button
                      onClick={() => toggleModule(module.id)}
                      className={cn(
                        "w-full text-left p-4 flex items-center justify-between transition-colors",
                        expandedModule === module.id && "bg-[var(--accent-color)]"
                      )}
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span className="text-sm font-medium">{module.title}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedModule === module.id && "rotate-90"
                        )}
                        style={{ color: "var(--text-muted)" }}
                      />
                    </button>

                    {expandedModule === module.id && (
                      <div style={{ backgroundColor: "var(--sidebar-bg)" }}>
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson.id)}
                            className={cn(
                              "w-full text-left p-3 pl-8 text-sm flex items-center transition-colors",
                              currentLesson === lesson.id
                                ? "border-r-2"
                                : "hover:bg-[var(--hover-bg)]"
                            )}
                            style={{
                              backgroundColor: currentLesson === lesson.id ? "var(--accent-color)" : undefined,
                              color: currentLesson === lesson.id ? "var(--primary-color)" : "var(--text-secondary)",
                              borderColor: currentLesson === lesson.id ? "var(--primary-color)" : undefined,
                            }}
                          >
                            <div className="mr-3 flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4" style={{ color: "var(--success-color, #22c55e)" }} />
                              ) : lesson.type === "video" ? (
                                <Play className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                              ) : lesson.type === "document" ? (
                                <FileText className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                              ) : (
                                <Clock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                              )}
                            </div>
                            <span className={lesson.completed ? "line-through opacity-60" : ""}>
                              {lesson.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          

          {/* Course Content Drawer - Mobile only */}
          {courseDrawerOpen && isMobile && (
            <>
              <div 
                className="fixed inset-0 z-50" 
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onClick={() => setCourseDrawerOpen(false)} 
              />
              <div 
                className="fixed top-0 left-0 w-80 max-w-[85vw] z-50 shadow-xl flex flex-col"
                style={{ 
                  backgroundColor: "var(--card-bg)",
                  height: "100dvh",
                  maxHeight: "-webkit-fill-available",
                }}
              >
                {/* Drawer Header */}
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
                  <h2 className="font-semibold text-sm pr-2 line-clamp-1" style={{ color: "var(--text-primary)" }}>{course.title}</h2>
                  <button
                    onClick={() => setCourseDrawerOpen(false)}
                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)] transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain min-h-0" style={{ backgroundColor: "var(--sidebar-bg)", WebkitOverflowScrolling: "touch" }}>
                  {course.modules.map((module) => (
                    <div key={module.id} className="border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className={cn(
                          "w-full text-left p-4 flex items-center justify-between transition-colors",
                          expandedModule === module.id && "bg-[var(--accent-color)]"
                        )}
                        style={{ color: "var(--text-primary)" }}
                      >
                        <span className="text-sm font-medium">{module.title}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedModule === module.id && "rotate-90"
                          )}
                          style={{ color: "var(--text-muted)" }}
                        />
                      </button>

                      {expandedModule === module.id && (
                        <div style={{ backgroundColor: "var(--sidebar-bg)" }}>
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                selectLesson(lesson.id)
                                setCourseDrawerOpen(false)
                              }}
                              className={cn(
                                "w-full text-left p-3 pl-8 text-sm flex items-center transition-colors",
                                currentLesson === lesson.id
                                  ? "border-r-2"
                                  : "hover:bg-[var(--hover-bg)]"
                              )}
                              style={{
                                backgroundColor: currentLesson === lesson.id ? "var(--accent-color)" : undefined,
                                color: currentLesson === lesson.id ? "var(--primary-color)" : "var(--text-secondary)",
                                borderColor: currentLesson === lesson.id ? "var(--primary-color)" : undefined,
                              }}
                            >
                              <div className="mr-3 flex-shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle className="h-4 w-4" style={{ color: "var(--success-color, #22c55e)" }} />
                                ) : lesson.type === "video" ? (
                                  <Play className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                                ) : lesson.type === "document" ? (
                                  <FileText className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                                ) : (
                                  <Clock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                                )}
                              </div>
                              <span className={lesson.completed ? "line-through opacity-60" : ""}>
                                {lesson.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Main content area */}
          <div className="flex flex-1 min-w-0 min-h-0">
          <div className="flex-1 flex flex-col min-w-0 min-h-0 relative z-30">
            <div className="border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
              <div className="flex overflow-x-auto scrollbar-hide">
                <Link
                  href={`/course-content/${params.id}/course`}
                  className={cn(
                    "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "course"
                      ? "border-[var(--primary-color)]"
                      : "border-transparent hover:border-[var(--border-color)]"
                  )}
                  style={{ color: activeTab === "course" ? "var(--primary-color)" : "var(--text-secondary)" }}
                >
                  Course
                </Link>
                <Link
                  href={`/course-content/${params.id}/progress`}
                  className={cn(
                    "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "progress"
                      ? "border-[var(--primary-color)]"
                      : "border-transparent hover:border-[var(--border-color)]"
                  )}
                  style={{ color: activeTab === "progress" ? "var(--primary-color)" : "var(--text-secondary)" }}
                >
                  Progress
                </Link>
                <Link
                  href={`/course-content/${params.id}/dates`}
                  className={cn(
                    "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "dates"
                      ? "border-[var(--primary-color)]"
                      : "border-transparent hover:border-[var(--border-color)]"
                  )}
                  style={{ color: activeTab === "dates" ? "var(--primary-color)" : "var(--text-secondary)" }}
                >
                  Dates
                </Link>
                <Link
                  href={`/course-content/${params.id}/discussion`}
                  className={cn(
                    "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "discussion"
                      ? "border-[var(--primary-color)]"
                      : "border-transparent hover:border-[var(--border-color)]"
                  )}
                  style={{ color: activeTab === "discussion" ? "var(--primary-color)" : "var(--text-secondary)" }}
                >
                  Discussion
                </Link>
                <Link
                  href={`/course-content/${params.id}/bookmarks`}
                  className={cn(
                    "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "bookmarks"
                      ? "border-[var(--primary-color)]"
                      : "border-transparent hover:border-[var(--border-color)]"
                  )}
                  style={{ color: activeTab === "bookmarks" ? "var(--primary-color)" : "var(--text-secondary)" }}
                >
                  Bookmarks
                </Link>
              </div>
            </div>

            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--sidebar-bg)" }}>
              <div className="flex items-center justify-between min-w-max gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Course Content Drawer Button - Mobile only */}
                  <button
                    onClick={() => setCourseDrawerOpen(true)}
                    className="flex md:hidden items-center justify-center h-8 w-8 rounded-md border transition-colors hover:bg-[var(--hover-bg)]"
                    style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}
                  >
                    <Menu className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                  </button>
                  
                  <div className="flex items-center text-sm flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                    <Link href={`/course/${params.id}`} className="font-medium hidden sm:inline" style={{ color: "var(--primary-color)" }}>
                      {course.title}
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2 hidden sm:block" style={{ color: "var(--text-muted)" }} />
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>Strategic Decision Making</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-sm ml-2.5">
                    <span className="mr-2 hidden sm:inline" style={{ color: "var(--text-secondary)" }}>Progress:</span>
                    <div className="w-16 sm:w-24 h-2 rounded-full" style={{ backgroundColor: "var(--hover-bg)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%`, background: "var(--gradient-bg)" }}
                      />
                    </div>
                    <span className="ml-2 font-medium" style={{ color: "var(--primary-color)" }}>{course.progress}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto md:pr-20 pb-[200px] md:pb-[200px]" style={{ backgroundColor: "var(--card-bg)" }}>
              {children}
            </div>
          </div>

          {/* Chat Button - sticky right side */}
          <div className="fixed top-20 right-0 z-40 flex">
            <ChatButton />
          </div>
          </div>

          {/* Right Sidebars */}
        {voiceSidebarOpen && (
          <div className="fixed top-0 md:top-[65px] right-0 w-full md:w-[380px] h-full md:h-[calc(100dvh-65px)] z-50 md:z-40">
            <VoiceColumn onClose={() => setVoiceSidebarOpen(false)} />
          </div>
        )}
        </div>

        <PlatformFooter />
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
