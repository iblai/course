"use client"

import { useState } from "react"
import { ChevronRight, GraduationCap, Users, Mail, Bell, Settings, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SettingsModal } from "@/components/settings-modal"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"

const menuItems = [
  {
    label: "Courses",
    icon: GraduationCap,
    href: "/courses",
    hasSubmenu: true,
  },
  {
    label: "Instructors",
    icon: Users,
    href: "/login",
    hasSubmenu: false,
  },
]

const bottomMenuItems = [
  { label: "Invite Users", icon: Mail, href: "#" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Settings", icon: Settings, href: "#" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const handleCoursesClick = (item: (typeof menuItems)[0]) => {
    if (item.hasSubmenu) {
      toggleExpand(item.label)
    }
    if (item.href) {
      router.push(item.href)
    }
  }

  return (
    <>
      <TooltipProvider>
        <aside
          className={cn(
            "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
            isCollapsed ? "w-16" : "w-56",
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">ibl</span>
            </div>
            {!isCollapsed && <span className="font-semibold text-brand-primary text-lg">ibl.ai Wink</span>}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-4 -right-3 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
            style={{ left: isCollapsed ? "52px" : "212px" }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            )}
          </button>

          {/* Main Menu */}
          <nav className="flex-1 py-4 px-2 space-y-1">
            {menuItems.map((item) => {
              const menuButton = (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      if (item.href && !item.hasSubmenu) {
                        router.push(item.href)
                      } else if (item.href && item.hasSubmenu) {
                        handleCoursesClick(item)
                      } else if (item.hasSubmenu) {
                        toggleExpand(item.label)
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-accent-blue hover:text-text-primary transition-colors",
                      (pathname === item.href || expandedItems.includes(item.label)) && "bg-accent-blue text-text-primary",
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {item.hasSubmenu && (
                          <ChevronRight
                            className={cn("w-4 h-4 transition-transform", expandedItems.includes(item.label) && "rotate-90")}
                          />
                        )}
                      </>
                    )}
                  </button>
                </div>
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

          {/* Bottom Menu - Added Link wrapper for navigation */}
          <div className="border-t border-sidebar-border py-4 px-2 space-y-1">
            {bottomMenuItems.map((item) => {
              if (item.label === "Settings") {
                const settingsButton = (
                  <button
                    key={item.label}
                    onClick={() => setIsSettingsModalOpen(true)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-accent-blue hover:text-text-primary transition-colors",
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                )
                return isCollapsed ? (
                  <TooltipFlowbite key={item.label} content={item.label} position="right">
                    {settingsButton}
                  </TooltipFlowbite>
                ) : (
                  settingsButton
                )
              }
              const bottomButton = (
                <Link key={item.label} href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-accent-blue hover:text-text-primary transition-colors",
                      pathname === item.href && "bg-accent-blue text-text-primary",
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">Peter</p>
                  <p className="text-xs text-text-muted">Free</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-brand-primary border border-brand-primary rounded-full hover:bg-accent-blue transition-colors">
                  Upgrade
                </button>
              </div>
            )}
          </div>
        </aside>
      </TooltipProvider>

      {/* Settings Modal */}
      <SettingsModal open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />
    </>
  )
}
