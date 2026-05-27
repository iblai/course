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
    // `h-dvh` (not `min-h-dvh`): the SDK `<AnalyticsLayout>` manages
    // its OWN internal scroll (its root is `h-full overflow-hidden`)
    // and needs a concrete fixed height to inherit. With `min-h-dvh`
    // here, the SDK's `h-full` collapsed circularly and the billing
    // page wouldn't scroll on touch or scroll wheel. The body
    // background concern that drove the original `min-h-dvh` switch
    // doesn't apply when the SDK keeps every panel inside the
    // viewport — nothing ever scrolls *past* the box.
    <div className="h-dvh w-full bg-[#f5f7fb]">
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isLoggedIn
      />
      <div
        className={cn(
          "flex h-dvh flex-col transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />
        {/*
          The SDK's `<AnalyticsLayout>` root carries `h-full
          overflow-hidden flex-1 min-h-0` and manages its OWN internal
          scroll — it expects a parent with a concrete height. We give
          it one with `flex-1 min-h-0` inside an `h-dvh` (header
          shrinks; this fills the rest). No `overflow-auto` here and
          no card wrapper around the SDK — the previous
          `<div className="overflow-hidden">` had no height and
          collapsed the SDK's `h-full` to 0, which made the billing
          page un-scrollable on both touch and scroll wheel.
        */}
        <div className="mx-auto flex min-h-0 w-full flex-1 flex-col px-4 py-8 md:w-[75vw] md:px-0">
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
  )
}
