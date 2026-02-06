"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  BookOpen,
  Users,
  Star,
  HelpCircle,
  Tag,
  SquarePen,
  User,
  Mail,
  FolderPlus,
  Pin,
  PinOff,
  Folder,
  MoreVertical,
  Pencil,
  Download,
  Trash2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InviteUserDialog } from "@/components/modals/invite-user-dialog"
import { RenameItemDialog, type RenameDialogSection } from "@/components/modals/rename-item-dialog"
import { DeleteItemDialog, type DeleteDialogSection } from "@/components/modals/delete-item-dialog"
import { CreateProjectModal } from "@/components/modals/create-project-modal"

interface SidebarLearnerProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
  showAdminButtons?: boolean
  isLoggedIn?: boolean
}

const courseData = [
  { id: "1", label: "AI in Academia", image: "/images/course-1.png" },
  { id: "2", label: "AI for Students", image: "/images/course-2.png" },
  { id: "3", label: "Autonomous Vehicles", image: "/images/course-3.png" },
  { id: "4", label: "Clinical Judgment", image: "/images/course-4.png" },
  { id: "5", label: "Strategic Management", image: "/images/course-1.png" },
  { id: "6", label: "Leadership Development", image: "/images/course-2.png" },
  { id: "7", label: "Data Analytics", image: "/images/course-3.png" },
  { id: "8", label: "Team Performance", image: "/images/course-4.png" },
]

export function SidebarLearner({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
  showAdminButtons = true,
  isLoggedIn = false,
}: SidebarLearnerProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["projects"])
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean
    section: RenameDialogSection
    itemId: string
    label: string
  }>({ open: false, section: "pinned", itemId: "", label: "" })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    section: DeleteDialogSection
    itemId: string
    label: string
  }>({ open: false, section: "pinned", itemId: "", label: "" })
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    router.push("/")
  }

  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById("mobile-sidebar")
        const target = event.target as Node
        if (sidebar && !sidebar.contains(target)) {
          onMobileClose()
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileOpen, onMobileClose])

  useEffect(() => {
    if (pathname === "/courses" && !expandedItems.includes("courses")) {
      setExpandedItems((prev) => [...prev, "courses"])
    }
  }, [pathname])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isActiveRoute = (href: string) => pathname === href

  type SidebarItemLike = { id: string; label: string; icon: unknown; href?: string; children?: { id: string; label: string; href?: string }[] }

  const isParentSectionActive = (item: SidebarItemLike) => {
    if (item.href && isActiveRoute(item.href)) return true
    if (item.children) {
      return item.children.some((child: { href?: string }) => child.href && isActiveRoute(child.href))
    }
    return false
  }

  const isItemHighlighted = (item: SidebarItemLike) => {
    if (item.children && !item.href) {
      return false
    }
    return expandedItems.includes(item.id) || isParentSectionActive(item)
  }


  const [projectsData, setProjectsData] = useState([
    { id: "1", label: "Web Development Bo..." },
    { id: "2", label: "Data Science Fundam.." },
    { id: "3", label: "AI for Business Leaders" },
    { id: "4", label: "Course - Generative AI" },
  ])

  const [pinnedData, setPinnedData] = useState([
    { id: "1", label: "Design a course on..." },
    { id: "2", label: "Design a course on..." },
  ])

  const [recentData, setRecentData] = useState([
    { id: "1", label: "Design a course on..." },
    { id: "2", label: "Recent chat item..." },
  ])

  const sidebarItems = [
    {
      id: "all-courses",
      label: "All Courses",
      icon: "/images/courses.svg",
      href: "/courses",
    },
    {
      id: "course-catalog",
      label: "Course Catalog",
      icon: "/images/course-catalog.svg",
      href: "/course-catalog",
    },
    {
      id: "configure",
      label: "Configure",
      icon: "/images/configure.svg",
      href: "/customize",
    },
    {
      id: "users",
      label: "Users",
      icon: "/images/users.svg",
      href: "/users",
    },
    {
      id: "invite-user",
      label: "Invite User",
      icon: Mail,
      href: "#",
    },
  ]

  const projectsItem = {
    id: "projects",
    label: "New Project",
    icon: FolderPlus,
    children: projectsData.map((project) => ({
      id: `project-${project.id}`,
      label: project.label,
    })),
  }

  const pinnedItem = {
    id: "pinned",
    label: "Pinned",
    icon: Pin,
    children: pinnedData.map((pinned) => ({
      id: `pinned-${pinned.id}`,
      label: pinned.label,
    })),
  }

  const recentItem = {
    id: "recent",
    label: "Recent",
    icon: Clock,
    children: recentData.map((recent) => ({
      id: `recent-${recent.id}`,
      label: recent.label,
    })),
  }

  const getDataId = (childId: string, section: RenameDialogSection) =>
    childId.replace(`${section}-`, "")

  const handleRenameConfirm = (newName: string) => {
    const dataId = getDataId(renameDialog.itemId, renameDialog.section)
    if (renameDialog.section === "pinned") {
      setPinnedData((prev) => prev.map((p) => (p.id === dataId ? { ...p, label: newName } : p)))
    } else if (renameDialog.section === "project") {
      setProjectsData((prev) => prev.map((p) => (p.id === dataId ? { ...p, label: newName } : p)))
    } else {
      setRecentData((prev) => prev.map((r) => (r.id === dataId ? { ...r, label: newName } : r)))
    }
  }

  const handleDeleteConfirm = () => {
    const dataId = getDataId(deleteDialog.itemId, deleteDialog.section)
    if (deleteDialog.section === "pinned") {
      setPinnedData((prev) => prev.filter((p) => p.id !== dataId))
    } else if (deleteDialog.section === "project") {
      setProjectsData((prev) => prev.filter((p) => p.id !== dataId))
    } else {
      setRecentData((prev) => prev.filter((r) => r.id !== dataId))
    }
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", isMobile && "pb-[env(safe-area-inset-bottom)]")}>
      <div className="px-4 py-3.5 border-b" style={{ borderColor: "#D0E0FF" }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/skillsAI-logo.webp"
            alt="ibl.ai Wink"
            width={32}
            height={32}
            className="object-contain flex-shrink-0"
          />
          {!isCollapsed && (
              <span className="text-lg font-semibold bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent">
                ibl.ai Wink
              </span>
          )}
        </Link>
      </div>

      {isLoggedIn && (
        <div className={cn("pt-4 text-center", isCollapsed ? "px-0" : "px-3")}>
          {isCollapsed ? (
            <TooltipProvider>
              <TooltipFlowbite content="New Course" position="right">
                <div className="flex justify-center items-center">
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-center items-center w-10 h-10 p-0 border-gray-300 rounded-lg mx-auto",
                      pathname === "/"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    )}
                    onClick={() => {
                      router.push("/")
                    }}
                  >
                    <SquarePen className="w-4 h-4" />
                  </Button>
                </div>
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-3 border-gray-300 rounded-lg py-2.5",
                pathname === "/"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
              onClick={() => {
                router.push("/")
              }}
            >
              <SquarePen className="w-4 h-4" />
              <span>New Course</span>
            </Button>
          )}
        </div>
      )}

      <div className={cn("flex-1 overflow-y-auto text-center", isCollapsed ? "px-0 py-2" : "px-3 py-4", "space-y-1")}>
        {sidebarItems.map((item) => {
          const sidebarButton = (
            <div key={item.id} className={isCollapsed ? "flex justify-center items-center" : ""}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 hover:bg-blue-50 hover:text-[#020817] text-[rgb(113,121,133)]",
                  isCollapsed 
                    ? "justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto" 
                    : "w-full justify-start pl-[11px]",
                  isItemHighlighted(item) && isCollapsed && "bg-gray-100",
                  isItemHighlighted(item) && !isCollapsed && "bg-blue-50 text-blue-600",
                )}
                onClick={() => {
                  if (item.id === "invite-user") {
                    setInviteDialogOpen(true)
                  } else if (item.href) {
                    if (!isLoggedIn && item.id === "instructors") {
                      router.push("/login")
                    } else {
                      router.push(item.href)
                    }
                  }
                }}
              >
                {item.icon && (
                  typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={cn(
                        "w-5 h-5 flex-shrink-0 p-0 transition-colors",
                        isItemHighlighted(item) && "opacity-100"
                      )}
                      style={
                        isItemHighlighted(item)
                          ? {
                              filter:
                                "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)",
                            }
                          : {}
                      }
                    />
                  ) : (
                    <item.icon className="w-5 h-5 flex-shrink-0 p-0" />
                  )
                )}
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
              </Button>
            </div>
          )

          return isCollapsed ? (
            <TooltipProvider key={item.id}>
              <TooltipFlowbite content={item.label} position="right">
                {sidebarButton}
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            sidebarButton
          )
        })}

        {/* Separator before Projects */}
        {!isCollapsed && (
          <div className="my-2 border-t" style={{ borderColor: "#D0E0FF" }} />
        )}

        {/* Projects Section */}
        {(() => {
          const item = projectsItem
          const sidebarButton = (
            <div key={item.id} className={isCollapsed ? "flex justify-center items-center" : ""}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 hover:bg-blue-50 hover:text-[#020817] text-[rgb(113,121,133)]",
                  isCollapsed 
                    ? "justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto" 
                    : "w-full justify-start pl-[11px]",
                  isItemHighlighted(item) && isCollapsed && "bg-gray-100",
                  isItemHighlighted(item) && !isCollapsed && "bg-blue-50 text-blue-600",
                )}
                onClick={() => {
                  if (item.id === "projects") {
                    setCreateProjectModalOpen(true)
                  } else if (item.children && item.children.length > 0) {
                    toggleExpanded(item.id)
                  }
                }}
              >
                {item.icon && (
                  typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={cn(
                        "w-5 h-5 flex-shrink-0 p-0 transition-colors",
                        isItemHighlighted(item) && "opacity-100"
                      )}
                      style={
                        isItemHighlighted(item)
                          ? {
                              filter:
                                "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)",
                            }
                          : {}
                      }
                    />
                  ) : (
                    <item.icon className="w-5 h-5 flex-shrink-0 p-0" />
                  )
                )}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children &&
                      item.children.length > 0 &&
                      (item.id === "projects" || expandedItems.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      ))}
                  </>
                )}
              </Button>
            </div>
          )

          return isCollapsed ? (
            <TooltipProvider key={item.id}>
              <TooltipFlowbite content={item.label} position="right">
                {sidebarButton}
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            <div key={item.id}>
              {sidebarButton}
              {(item.id === "projects" || expandedItems.includes(item.id)) && item.children && item.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="group flex items-center gap-2 rounded-md pl-4 pr-1 py-0.5 hover:bg-gray-100 min-h-8"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
                        <Folder className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="flex-1 truncate text-sm text-[rgb(113,121,133)] group-hover:text-[#020817]">
                        {child.label}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7 shrink-0 rounded-md text-[rgb(113,121,133)] hover:bg-gray-200 hover:text-[#020817]",
                              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                              "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              setRenameDialog({
                                open: true,
                                section: "project",
                                itemId: child.id,
                                label: child.label,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            Rename Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                section: "project",
                                itemId: child.id,
                                label: child.label,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Pinned Section */}
        {(() => {
          const item = pinnedItem
          const sidebarButton = (
            <div key={item.id} className={isCollapsed ? "flex justify-center items-center" : ""}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 hover:bg-blue-50 hover:text-[#020817] text-[rgb(113,121,133)]",
                  isCollapsed 
                    ? "justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto" 
                    : "w-full justify-start pl-[11px]",
                  isItemHighlighted(item) && isCollapsed && "bg-gray-100",
                  isItemHighlighted(item) && !isCollapsed && "bg-blue-50 text-blue-600",
                )}
                onClick={() => {
                  if (item.children && item.children.length > 0) {
                    toggleExpanded(item.id)
                  }
                }}
              >
                {item.icon && (
                  typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={cn(
                        "w-5 h-5 flex-shrink-0 p-0 transition-colors",
                        isItemHighlighted(item) && "opacity-100"
                      )}
                      style={
                        isItemHighlighted(item)
                          ? {
                              filter:
                                "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)",
                            }
                          : {}
                      }
                    />
                  ) : (
                    <item.icon className="w-5 h-5 flex-shrink-0 p-0" />
                  )
                )}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children &&
                      item.children.length > 0 &&
                      (expandedItems.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      ))}
                  </>
                )}
              </Button>
            </div>
          )

          return isCollapsed ? (
            <TooltipProvider key={item.id}>
              <TooltipFlowbite content={item.label} position="right">
                {sidebarButton}
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            <div key={item.id}>
              {sidebarButton}
              {expandedItems.includes(item.id) && item.children && item.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="group flex items-center gap-2 rounded-md pl-4 pr-1 py-0.5 hover:bg-gray-100 min-h-8"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="flex-1 truncate text-sm text-[rgb(113,121,133)] group-hover:text-[#020817]">
                        {child.label}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7 shrink-0 rounded-md text-[rgb(113,121,133)] hover:bg-gray-200 hover:text-[#020817]",
                              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                              "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              setRenameDialog({
                                open: true,
                                section: "pinned",
                                itemId: child.id,
                                label: child.label,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            Rename Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PinOff className="h-4 w-4" />
                            Unpin
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                section: "pinned",
                                itemId: child.id,
                                label: child.label,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Recent Section - hidden for now */}
        {(() => {
          const showRecentSection = false
          if (!showRecentSection) return null
          const item = recentItem
          const sidebarButton = (
            <div key={item.id} className={isCollapsed ? "flex justify-center items-center" : ""}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 hover:bg-blue-50 hover:text-[#020817] text-[rgb(113,121,133)]",
                  isCollapsed 
                    ? "justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto" 
                    : "w-full justify-start pl-[11px]",
                  isItemHighlighted(item) && isCollapsed && "bg-gray-100",
                  isItemHighlighted(item) && !isCollapsed && "bg-blue-50 text-blue-600",
                )}
                onClick={() => {
                  if (item.children && item.children.length > 0) {
                    toggleExpanded(item.id)
                  }
                }}
              >
                {item.icon && (
                  typeof item.icon === "string" ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={cn(
                        "w-5 h-5 flex-shrink-0 p-0 transition-colors",
                        isItemHighlighted(item) && "opacity-100"
                      )}
                      style={
                        isItemHighlighted(item)
                          ? {
                              filter:
                                "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)",
                            }
                          : {}
                      }
                    />
                  ) : (
                    <item.icon className="w-5 h-5 flex-shrink-0 p-0" />
                  )
                )}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children &&
                      item.children.length > 0 &&
                      (expandedItems.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      ))}
                  </>
                )}
              </Button>
            </div>
          )

          return isCollapsed ? (
            <TooltipProvider key={item.id}>
              <TooltipFlowbite content={item.label} position="right">
                {sidebarButton}
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            <div key={item.id}>
              {sidebarButton}
              {expandedItems.includes(item.id) && item.children && item.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="group flex items-center gap-2 rounded-md pl-4 pr-1 py-0.5 hover:bg-gray-100 min-h-8"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="flex-1 truncate text-sm text-[rgb(113,121,133)] group-hover:text-[#020817]">
                        {child.label}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7 shrink-0 rounded-md text-[rgb(113,121,133)] hover:bg-gray-200 hover:text-[#020817]",
                              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                              "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              setRenameDialog({
                                open: true,
                                section: "recent",
                                itemId: child.id,
                                label: child.label,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            Rename Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setPinnedData((prev) => [...prev, { id: String(Date.now()), label: child.label }])
                              setRecentData((prev) => prev.filter((r) => `recent-${r.id}` !== child.id))
                            }}
                          >
                            <Pin className="h-4 w-4" />
                            Pin
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                section: "recent",
                                itemId: child.id,
                                label: child.label,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

      </div>

      {showAdminButtons && !isLoggedIn && (
        <div className={cn("border-t space-y-1", isCollapsed ? "px-0 py-3" : "p-3", isMobile && "pb-6")} style={{ borderColor: "#D0E0FF" }}>
          {isCollapsed ? (
            <TooltipFlowbite content="Pricing" position="right">
              <div className="flex justify-center items-center">
                <Link href="/pricing" onClick={onMobileClose}>
                  <Button
                    variant="ghost"
                    className="justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto text-[rgb(113,121,133)] hover:bg-blue-50 hover:text-[#020817]"
                  >
                    <Tag className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </TooltipFlowbite>
          ) : (
            <Link href="/pricing" onClick={onMobileClose}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-[rgb(113,121,133)] hover:bg-blue-50 hover:text-[#020817]"
              >
                <Tag className="w-4 h-4" />
                Pricing
              </Button>
            </Link>
          )}
          {isCollapsed ? (
            <TooltipFlowbite content="FAQ" position="right">
              <div className="flex justify-center items-center">
                <Link href="/faq" onClick={onMobileClose}>
                  <Button
                    variant="ghost"
                    className="justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto text-[rgb(113,121,133)] hover:bg-blue-50 hover:text-[#020817]"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </TooltipFlowbite>
          ) : (
            <Link href="/faq" onClick={onMobileClose}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-[rgb(113,121,133)] hover:bg-blue-50 hover:text-[#020817]"
              >
                <HelpCircle className="w-4 h-4" />
                FAQ
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose}></div>
          <TooltipProvider>
            <div id="mobile-sidebar" className="fixed left-0 top-0 h-[100dvh] w-64 bg-white shadow-lg overflow-hidden">
              <SidebarContent isMobile={true} />
            </div>
          </TooltipProvider>
        </div>
      )}

      <aside
        data-sidebar="true"
        className={cn(
          "hidden md:flex flex-col border-r bg-white transition-all duration-300 fixed top-0 left-0 h-screen z-40 overflow-visible",
          isCollapsed ? "w-16" : "w-64",
        )}
        style={{ borderColor: "#D0E0FF" }}
      >
        <button
          onClick={onToggleCollapse}
          className="absolute -right-4 top-3.5 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm z-[100]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <TooltipProvider>
          <SidebarContent isMobile={false} />
        </TooltipProvider>
      </aside>

      <InviteUserDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />

      <RenameItemDialog
        open={renameDialog.open}
        onOpenChange={(open) => setRenameDialog((prev) => ({ ...prev, open }))}
        section={renameDialog.section}
        initialValue={renameDialog.label}
        onConfirm={handleRenameConfirm}
      />

      <DeleteItemDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        section={deleteDialog.section}
        itemName={deleteDialog.label}
        onConfirm={handleDeleteConfirm}
      />

      <CreateProjectModal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
        onCreateProject={(projectName, selectedMentors) => {
          setProjectsData((prev) => [...prev, { id: String(Date.now()), label: projectName }])
          setCreateProjectModalOpen(false)
        }}
      />
    </>
  )
}
