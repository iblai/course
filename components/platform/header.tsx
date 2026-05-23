"use client"

import { HqHeader, HqHeaderProviders } from "@/components/hq-header"

interface HeaderProps {
  onMenuClick?: () => void
  onMobileMenuToggle?: () => void
  /** Accepted for compatibility with v0 callers — hq header derives auth from SDK state. */
  isLoggedIn?: boolean
  onLogin?: () => void
  onLogout?: () => void
  userName?: string
  showLogo?: boolean
  showBackButton?: boolean
  showModelSelector?: boolean
  /** When true, sidebar is collapsed (narrow). Used for fixed header left offset on desktop. */
  sidebarCollapsed?: boolean
  /** Compatibility no-op — hq header does not render a chat button. */
  showChatButton?: boolean
}

/**
 * Project-wide nav header. Ported from hq verbatim (`components/hq-header.tsx`).
 * The v0 prop surface (`onMenuClick`, `sidebarCollapsed`, etc.) is kept so
 * every existing call-site keeps compiling; only the mobile menu callback
 * is actually wired through. Visuals + behaviour now match hq.
 *
 * `fixed top-0` + left-offset for the collapsed/expanded sidebar are
 * preserved here -- removing them would shift every page's content up
 * under the nav bar. The companion `<div className="h-14">` spacer keeps
 * page bodies clear of the fixed bar.
 */
export function Header({
  onMenuClick,
  onMobileMenuToggle,
  sidebarCollapsed,
}: HeaderProps) {
  const leftClass = sidebarCollapsed === undefined ? "" : sidebarCollapsed ? "md:left-16" : "md:left-64"

  return (
    <HqHeaderProviders>
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-[#fafafa] pt-[env(safe-area-inset-top)] ${leftClass}`}
      >
        <HqHeader onMobileMenuOpen={onMenuClick || onMobileMenuToggle} />
      </div>
      {/* Spacer so content below doesn't sit under the fixed header. */}
      <div className="h-14 flex-shrink-0" aria-hidden />
    </HqHeaderProviders>
  )
}
