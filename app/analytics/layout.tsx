"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  AnalyticsLayout,
  AnalyticsSettingsProvider,
} from "@iblai/iblai-js/web-containers"

import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { cn } from "@/lib/utils"

/**
 * `/iblai-analytics` shell — wraps each sub-route in `<AnalyticsLayout>` +
 * `<AnalyticsSettingsProvider>`. Sidebar + Header stay outside the SDK
 * shell so the rest of the app's nav remains visible.
 *
 * Background colour: the SDK layout uses `bg-[#f5f7fb]` internally and
 * we want the surrounding page to match — otherwise the blue-ish
 * content panel looks like an inset card on a white page. The outer
 * `<div>` is set to `bg-[#f5f7fb]` so the whole route reads as a
 * single surface, and the wrapper around `<AnalyticsLayout>` drops its
 * card chrome (no bg-white, no border, no rounded) so it blends in.
 */
export default function AnalyticsLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const basePath = "/analytics"

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    // `min-h-dvh` (not `h-dvh`): the analytics content can be taller than
    // the viewport. With `h-dvh`, the outer box was clipped to a single
    // viewport — once the user scrolled past it the body background
    // (theme `--background`, white) was what showed. `min-h-dvh` lets
    // the blue-ish surface grow with the document.
    <div className="min-h-dvh w-full bg-[#f5f7fb]">
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isLoggedIn
      />
      <div
        className={cn(
          "flex min-h-dvh flex-col transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />
        <div className="mx-auto w-full flex-1 overflow-auto px-4 py-8 md:w-[75vw] md:px-0">
          <div className="overflow-hidden">
            <AnalyticsSettingsProvider value={{}}>
              <AnalyticsLayout
                currentPath={pathname ?? `${basePath}/financial`}
                basePath={basePath}
                // Single-tab strip — courseai only surfaces the Financial
                // pane (sidebar's Billing button). Other tabs (Overview,
                // Courses, Programs, etc.) ship with the SDK but aren't
                // wired to courseai routes yet.
                tabs={[{ label: "Financial", value: "financial" }]}
                onTabChange={(tab) =>
                  router.push(tab ? `${basePath}/${tab}` : basePath)
                }
              >
                {children}
              </AnalyticsLayout>
            </AnalyticsSettingsProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
