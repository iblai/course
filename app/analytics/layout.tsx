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
 * shell so the rest of the app's nav remains visible. The SDK layout
 * uses `bg-[#f5f7fb]` internally; we wrap it in a white card so it pops
 * against the page background (per skill).
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
    <div className="h-dvh w-full bg-white">
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
          <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-white">
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
