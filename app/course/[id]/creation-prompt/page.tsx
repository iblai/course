"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCourseMetadata } from "@/lib/course-metadata"

export default function CourseCreationPromptPage() {
  const params = useParams()
  const id = params.id as string
  const { title: courseTitle } = getCourseMetadata(id)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="h-screen-dvh overflow-y-auto scrollbar-hide bg-background">
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

        <div className="flex flex-1">
          <main className="flex-1 transition-all duration-300 pb-[200px] md:pb-[200px] min-w-0">
            <div className="flex min-w-0">
              <div className="flex-1 min-w-0 w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 md:pr-20 py-4 sm:py-8 overflow-x-hidden bg-[#F8FAFC]">
                {/* Centered card on light blue-grey background */}
                <div className="min-h-0 flex items-start justify-center px-4 sm:px-6 pt-4">
                  <div
                    className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="p-6 sm:p-8">
                      <h1 className="text-xl sm:text-2xl font-bold text-[var(--sidebar-foreground)]">
                        Course Creation User Prompt
                      </h1>
                      <p className="text-sm text-gray-600 mt-2">{courseTitle}</p>
                      <div className="border-b border-gray-200 my-5" />

                      <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 px-4 sm:px-5 text-sm text-gray-800 leading-relaxed text-left">
                        <p className="font-medium text-gray-700 mb-2">User prompt</p>
                        <p>
                          Create a comprehensive course on &quot;{courseTitle}&quot; covering key concepts, learning objectives, and assessment strategies. Include modules suitable for adult learners, with clear outcomes and optional assignments. Use a mix of text, examples, and discussion prompts where appropriate.
                        </p>
                      </div>

                      <div className="mt-8">
                        <Link href="/courses">
                          <Button
                            className="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] hover:border-[#93C5FD] rounded-lg gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Course List
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <PlatformFooter />
      </div>
    </div>
  )
}
