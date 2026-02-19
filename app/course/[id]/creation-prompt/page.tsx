"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { ViewCreationUserPrompt } from "@/components/view-creation-user-prompt"
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
          <main className="flex-1 flex flex-col min-h-0 transition-all duration-300 pb-[200px] md:pb-[200px] min-w-0 bg-[#F8FAFC]">
            <div className="flex flex-1 min-h-0 min-w-0 bg-[#F8FAFC]">
              <div className="flex-1 min-h-0 min-w-0 w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-8 sm:pr-8 md:pr-20 py-4 sm:py-8 overflow-x-hidden bg-[#F8FAFC]">
                <ViewCreationUserPrompt courseTitle={courseTitle} />
              </div>
            </div>
          </main>
        </div>

        <PlatformFooter />
      </div>
    </div>
  )
}
