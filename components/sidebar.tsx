"use client"
import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  GraduationCap,
  Users,
  Compass,
  Star,
  Mail,
  Bell,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Courses", icon: GraduationCap, href: "/" },
  { label: "Instructors", icon: Users, href: "/instructors" },
  { label: "Discover", icon: Compass, href: "/discover" },
  { label: "Recommended", icon: Star, href: "/recommended" },
]

const bottomMenuItems = [
  { label: "Invite Users", icon: Mail, href: "#" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Settings", icon: Settings, href: "#" },
]

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />}

      <TooltipProvider>
        <aside
          className={cn(
            "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50",
            "fixed md:relative",
            isMobileOpen ? "left-0" : "-left-64 md:left-0",
            isCollapsed ? "w-16" : "w-64",
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
            <Image src="/images/toolsAI-logo.png" alt="ibl.ai" width={32} height={32} className="w-8 h-8" />
            {!isCollapsed && <span className="font-semibold text-[#7284FF] text-lg">ibl.ai Wink</span>}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="absolute top-4 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10 hidden md:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-gray-500" />
            )}
          </button>

          {/* Main Menu */}
          <nav className="flex-1 py-4 px-2 space-y-1">
            {menuItems.map((item) => {
              const menuButton = (
                <Link key={item.label} href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-blue-50 text-[#7284FF]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                </Link>
              )

              return isCollapsed ? (
                <TooltipFlowbite key={item.label} content={item.label} position="right">
                  {menuButton}
                </TooltipFlowbite>
              ) : (
                menuButton
              )
            })}
          </nav>

          {/* Bottom Menu */}
          <div className="border-t border-gray-200 py-4 px-2 space-y-1">
            {bottomMenuItems.map((item) => {
              const bottomButton = (
                <Link key={item.label} href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-blue-50 text-[#7284FF]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                </Link>
              )

              return isCollapsed ? (
                <TooltipFlowbite key={item.label} content={item.label} position="right">
                  {bottomButton}
                </TooltipFlowbite>
              ) : (
                bottomButton
              )
            })}

            {/* User Profile */}
            {!isCollapsed && (
              <div className="flex items-center gap-3 px-3 py-3 mt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="/images/new-user-avatar.webp"
                    alt="User"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Mikel</p>
                  <p className="text-xs text-gray-500">Free</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-[#7284FF] border border-[#7284FF] rounded-full hover:bg-blue-50 transition-colors">
                  Upgrade
                </button>
              </div>
            )}
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}
