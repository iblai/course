"use client"

import { useState, useEffect } from "react"
import { flushSync } from "react-dom"
import { useRouter, usePathname } from "next/navigation"
const SIDEBAR_ICONS = "/icons/sidebar"
const PROJECT_STORAGE_KEY = "project-data"
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
  /** Recent user message previews from current chat (e.g. when on /chat with messages) */
  recentChatPreviews?: string[]
  /** Called when user renames a chat preview by index */
  onRenameChat?: (index: number, newName: string) => void
  /** Called when user deletes a chat by index */
  onDeleteChat?: (index: number) => void
  /** Called when user pins a chat by index */
  onPinChat?: (index: number) => void
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
  recentChatPreviews,
  onRenameChat,
  onDeleteChat,
  onPinChat,
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
    if (pathname === "/chat" && !expandedItems.includes("chats")) {
      setExpandedItems((prev) => [...prev, "chats"])
    }
    if (pathname?.startsWith("/project/") && !expandedItems.includes("projects")) {
      setExpandedItems((prev) => [...prev, "projects"])
    }
  }, [pathname])

  // Load created projects from sessionStorage so they persist across refresh
  useEffect(() => {
    try {
      const loaded: { id: string; label: string }[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key?.startsWith(`${PROJECT_STORAGE_KEY}-`) && key !== PROJECT_STORAGE_KEY) {
          const id = key.replace(`${PROJECT_STORAGE_KEY}-`, "")
          const raw = sessionStorage.getItem(key)
          if (raw) {
            const data = JSON.parse(raw) as { name?: string }
            loaded.push({ id, label: data?.name || "Untitled Project" })
          }
        }
      }
      if (loaded.length > 0) setProjectsData(loaded)
    } catch (_) {}
  }, [])

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


  const [projectsData, setProjectsData] = useState<{ id: string; label: string }[]>([])

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
      icon: `${SIDEBAR_ICONS}/courses.svg`,
      href: "/courses",
    },
    {
      id: "course-catalog",
      label: "Course Catalog",
      icon: `${SIDEBAR_ICONS}/course-catalog.svg`,
      href: "/course-catalog",
    },
    {
      id: "configure",
      label: "Configure",
      icon: `${SIDEBAR_ICONS}/configure.svg`,
      href: "/customize",
    },
    {
      id: "users",
      label: "Users",
      icon: `${SIDEBAR_ICONS}/users.svg`,
      href: "/users",
    },
    {
      id: "invite-user",
      label: "Invite User",
      icon: `${SIDEBAR_ICONS}/mail.svg`,
      href: "#",
    },
  ]

  const projectsItem = {
    id: "projects",
    label: "New Project",
    icon: `${SIDEBAR_ICONS}/folder-plus.svg`,
    children: projectsData.map((project) => ({
      id: `project-${project.id}`,
      label: project.label,
    })),
  }

  const pinnedItem = {
    id: "pinned",
    label: "Pinned",
    icon: `${SIDEBAR_ICONS}/pin.svg`,
    children: pinnedData.map((pinned) => ({
      id: `pinned-${pinned.id}`,
      label: pinned.label,
    })),
  }

  const recentItem = {
    id: "recent",
    label: "Recent",
    icon: `${SIDEBAR_ICONS}/clock.svg`,
    children: recentData.map((recent) => ({
      id: `recent-${recent.id}`,
      label: recent.label,
    })),
  }

  const getDataId = (childId: string, section: RenameDialogSection) =>
    childId.replace(`${section}-`, "")

  const handleRenameConfirm = (newName: string) => {
    if (renameDialog.section === "chat") {
      onRenameChat?.(parseInt(renameDialog.itemId, 10), newName)
      return
    }
    const dataId = getDataId(renameDialog.itemId, renameDialog.section)
    if (renameDialog.section === "pinned") {
      setPinnedData((prev) => prev.map((p) => (p.id === dataId ? { ...p, label: newName } : p)))
    } else if (renameDialog.section === "project") {
      setProjectsData((prev) => prev.map((p) => (p.id === dataId ? { ...p, label: newName } : p)))
      try {
        const key = `${PROJECT_STORAGE_KEY}-${dataId}`
        const raw = sessionStorage.getItem(key)
        const data = raw ? { ...JSON.parse(raw), name: newName } : { name: newName, mentors: [] }
        sessionStorage.setItem(key, JSON.stringify(data))
      } catch (_) {}
    } else {
      setRecentData((prev) => prev.map((r) => (r.id === dataId ? { ...r, label: newName } : r)))
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.section === "chat") {
      onDeleteChat?.(parseInt(deleteDialog.itemId, 10))
      return
    }
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
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/images/skillsAI-logo.webp"
            alt="ibl.ai Wink"
            width={32}
            height={32}
            className="object-contain flex-shrink-0"
          />
          {(!isCollapsed || isMobile) && (
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
                      pathname === "/home"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    )}
                    onClick={() => {
                      router.push("/home")
                    }}
                  >
                    <img
                      src={`${SIDEBAR_ICONS}/square-pen.svg`}
                      alt=""
                      className="w-[18px] h-[18px] flex-shrink-0"
                      style={pathname === "/home" ? { filter: "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)" } : {}}
                      aria-hidden
                    />
                  </Button>
                </div>
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-2 pl-[11px] border-gray-300 rounded-lg py-2.5",
                pathname === "/home"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
              onClick={() => {
                if (pathname === "/home") {
                  window.location.href = "/home"
                } else {
                  router.push("/home")
                }
              }}
            >
              <img
                src={`${SIDEBAR_ICONS}/square-pen.svg`}
                alt=""
                className="w-[18px] h-[18px] flex-shrink-0"
                style={pathname === "/home" ? { filter: "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)" } : {}}
                aria-hidden
              />
              <span>New Course</span>
            </Button>
          )}
        </div>
      )}

      <div className={cn("flex-1 overflow-y-auto space-y-1", isCollapsed ? "flex flex-col items-center px-0 py-2" : "text-left px-3 py-4")}>
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
                    onMobileClose?.()
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
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={cn(
                          item.id === "invite-user"
                            ? "w-4 h-4 p-0 transition-colors"
                            : "w-5 h-[19px] p-0 transition-colors",
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
                    </span>
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

        {/* Separator before Chats / Projects */}
        {(!isCollapsed || isMobile) && (
          <div className="my-2 border-t" style={{ borderColor: "#D0E0FF" }} />
        )}

        {/* Chats Section */}
        {(!isCollapsed || isMobile) && (
          <div key="chats" className="mb-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 pl-[11px] rounded-lg border",
                expandedItems.includes("chats") || pathname === "/chat"
                  ? "bg-[#e0f2fe] text-blue-600 border-blue-200/60"
                  : "hover:bg-blue-50 hover:text-[#020817] text-[rgb(113,121,133)] border-transparent"
              )}
              onClick={() => {
                router.push("/chat?new=1")
                if (!expandedItems.includes("chats")) setExpandedItems((prev) => [...prev, "chats"])
              }}
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <img
                  src={`${SIDEBAR_ICONS}/chat.svg`}
                  alt=""
                  className="w-4 h-4"
                  style={
                  expandedItems.includes("chats") || pathname === "/chat"
                    ? { filter: "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)" }
                    : {}
                  }
                  aria-hidden
                />
              </span>
              <span className="flex-1 text-left">Chats</span>
              <img
                src={expandedItems.includes("chats") || pathname === "/chat" ? `${SIDEBAR_ICONS}/chevron-down.svg` : `${SIDEBAR_ICONS}/chevron-right.svg`}
                alt=""
                className="w-4 h-4 flex-shrink-0"
                aria-hidden
              />
            </Button>
            {(expandedItems.includes("chats") || pathname === "/chat") && (
              <div className="ml-6 mt-1 relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                {recentChatPreviews && recentChatPreviews.length > 0 ? (
                  <ul className="pl-4 py-1 space-y-0.5 text-left list-none">
                    {recentChatPreviews.map((preview, i) => (
                      <li key={i} className="group flex items-center gap-1 min-w-0 rounded-md hover:bg-gray-50/80">
                        <span className="flex-1 text-sm text-[rgb(113,121,133)] truncate min-w-0 py-1" title={preview}>
                          {preview}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7 shrink-0 rounded-md text-[rgb(113,121,133)] hover:bg-gray-200 hover:text-[#020817]",
                                "opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                                "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img src={`${SIDEBAR_ICONS}/more-vertical.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                onMobileClose?.()
                                setRenameDialog({
                                  open: true,
                                  section: "chat",
                                  itemId: String(i),
                                  label: preview,
                                })
                              }}
                            >
                              <img src={`${SIDEBAR_ICONS}/pencil.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                              Rename chat
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPinChat?.(i)}>
                              <img src={`${SIDEBAR_ICONS}/pin.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                              Pin chat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                onMobileClose?.()
                                setDeleteDialog({
                                  open: true,
                                  section: "chat",
                                  itemId: String(i),
                                  label: preview,
                                })
                              }}
                            >
                              <img src={`${SIDEBAR_ICONS}/trash-2.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                              Delete chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pl-4 py-1 text-sm text-gray-500 italic text-left">No chat history</p>
                )}
              </div>
            )}
          </div>
        )}

        {isCollapsed && (
          <TooltipProvider>
            <TooltipFlowbite content="Chats" position="right">
              <div className="flex justify-center items-center">
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto",
                    expandedItems.includes("chats") || pathname === "/chat" ? "bg-[#e0f2fe] text-blue-600" : "text-[rgb(113,121,133)] hover:bg-blue-50 hover:text-[#020817]"
                  )}
                  onClick={() => router.push("/chat?new=1")}
                >
                  <img src={`${SIDEBAR_ICONS}/chat.svg`} alt="Chats" className="w-4 h-4 flex-shrink-0" aria-hidden />
                </Button>
              </div>
            </TooltipFlowbite>
          </TooltipProvider>
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
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={cn(
                          item.id === "projects" ? "w-4 h-4 p-0 transition-colors" : "w-5 h-[19px] p-0 transition-colors",
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
                    </span>
                  )}
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children &&
                      item.children.length > 0 &&
                      (item.id === "projects" || expandedItems.includes(item.id) ? (
                        <img src={`${SIDEBAR_ICONS}/chevron-down.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
                      ) : (
                        <img src={`${SIDEBAR_ICONS}/chevron-right.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
                  {item.children.map((child) => {
                    const projectId = child.id.replace(/^project-/, "")
                    const isActiveProject = pathname === `/project/${projectId}`
                    return (
                    <div
                      key={child.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        try {
                          const key = `${PROJECT_STORAGE_KEY}-${projectId}`
                          const existing = sessionStorage.getItem(key)
                          if (!existing) {
                            sessionStorage.setItem(
                              key,
                              JSON.stringify({ name: child.label, mentors: [] }),
                            )
                          }
                        } catch (_) {}
                        router.push(`/project/${projectId}`)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          try {
                            const key = `${PROJECT_STORAGE_KEY}-${projectId}`
                            const existing = sessionStorage.getItem(key)
                            if (!existing) {
                              sessionStorage.setItem(
                                key,
                                JSON.stringify({ name: child.label, mentors: [] }),
                              )
                            }
                          } catch (_) {}
                          router.push(`/project/${projectId}`)
                        }
                      }}
                      className={cn(
                        "group flex items-center gap-2 rounded-md pl-4 pr-1 py-0.5 hover:bg-gray-100 min-h-8 cursor-pointer",
                        isActiveProject && "bg-blue-50 text-blue-600"
                      )}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
                        <img src={`${SIDEBAR_ICONS}/folder.svg`} alt="" className="h-3 w-3 flex-shrink-0 opacity-70" aria-hidden />
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
                              "opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                              "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img src={`${SIDEBAR_ICONS}/more-vertical.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onPointerDown={(e) => {
                              e.preventDefault()
                              const payload = {
                                open: true,
                                section: "project" as const,
                                itemId: child.id,
                                label: child.label,
                              }
                              flushSync(() => setRenameDialog(payload))
                              setTimeout(() => onMobileClose?.(), 100)
                            }}
                            onSelect={() => {
                              const payload = {
                                open: true,
                                section: "project" as const,
                                itemId: child.id,
                                label: child.label,
                              }
                              setRenameDialog(payload)
                              setTimeout(() => onMobileClose?.(), 100)
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/pencil.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Rename Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onPointerDown={(e) => {
                              e.preventDefault()
                              const payload = {
                                open: true,
                                section: "project" as const,
                                itemId: child.id,
                                label: child.label,
                              }
                              flushSync(() => setDeleteDialog(payload))
                              setTimeout(() => onMobileClose?.(), 100)
                            }}
                            onSelect={() => {
                              const payload = {
                                open: true,
                                section: "project" as const,
                                itemId: child.id,
                                label: child.label,
                              }
                              setDeleteDialog(payload)
                              setTimeout(() => onMobileClose?.(), 100)
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/trash-2.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                  })}
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
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={cn(
                          "w-4 h-4 p-0 transition-colors",
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
                    </span>
                  )}
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children &&
                      item.children.length > 0 &&
                      (expandedItems.includes(item.id) ? (
                        <img src={`${SIDEBAR_ICONS}/chevron-down.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
                      ) : (
                        <img src={`${SIDEBAR_ICONS}/chevron-right.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
                        <img src={`${SIDEBAR_ICONS}/user.svg`} alt="" className="h-3 w-3 flex-shrink-0 opacity-70" aria-hidden />
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
                              "opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                              "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img src={`${SIDEBAR_ICONS}/more-vertical.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              onMobileClose?.()
                              setRenameDialog({
                                open: true,
                                section: "pinned",
                                itemId: child.id,
                                label: child.label,
                              })
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/pencil.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Rename Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <img src={`${SIDEBAR_ICONS}/pin-off.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Unpin
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <img src={`${SIDEBAR_ICONS}/download.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              onMobileClose?.()
                              setDeleteDialog({
                                open: true,
                                section: "pinned",
                                itemId: child.id,
                                label: child.label,
                              })
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/trash-2.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
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
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={cn(
                        "w-5 h-[19px] flex-shrink-0 p-0 transition-colors",
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
                  )}
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children &&
                      item.children.length > 0 &&
                      (expandedItems.includes(item.id) ? (
                        <img src={`${SIDEBAR_ICONS}/chevron-down.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
                      ) : (
                        <img src={`${SIDEBAR_ICONS}/chevron-right.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
                        <img src={`${SIDEBAR_ICONS}/user.svg`} alt="" className="h-3 w-3 flex-shrink-0 opacity-70" aria-hidden />
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
                              "opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                              "transition-opacity data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img src={`${SIDEBAR_ICONS}/more-vertical.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              onMobileClose?.()
                              setRenameDialog({
                                open: true,
                                section: "recent",
                                itemId: child.id,
                                label: child.label,
                              })
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/pencil.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Rename Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setPinnedData((prev) => [...prev, { id: String(Date.now()), label: child.label }])
                              setRecentData((prev) => prev.filter((r) => `recent-${r.id}` !== child.id))
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/pin.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Pin
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <img src={`${SIDEBAR_ICONS}/download.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              onMobileClose?.()
                              setDeleteDialog({
                                open: true,
                                section: "recent",
                                itemId: child.id,
                                label: child.label,
                              })
                            }}
                          >
                            <img src={`${SIDEBAR_ICONS}/trash-2.svg`} alt="" className="h-4 w-4 flex-shrink-0" aria-hidden />
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
        <div className={cn("border-t space-y-1", isCollapsed ? "flex flex-col items-center px-0 py-3" : "p-3", isMobile && "pb-6")} style={{ borderColor: "#D0E0FF" }}>
          {isCollapsed ? (
            <TooltipFlowbite content="Pricing" position="right">
              <div className="flex justify-center items-center">
                <Link href="/pricing" onClick={onMobileClose}>
                  <Button
                    variant="ghost"
                    className="justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto text-[rgb(113,121,133)] hover:bg-blue-50 hover:text-[#020817]"
                  >
                    <img src={`${SIDEBAR_ICONS}/tag.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
                <img src={`${SIDEBAR_ICONS}/tag.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
                    <img src={`${SIDEBAR_ICONS}/help-circle.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
                <img src={`${SIDEBAR_ICONS}/help-circle.svg`} alt="" className="w-4 h-4 flex-shrink-0" aria-hidden />
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
        <div className="fixed inset-0 z-[50] md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose}></div>
          <TooltipProvider>
            <div id="mobile-sidebar" className="fixed left-0 top-0 h-[100dvh] w-64 z-[50] bg-white shadow-lg overflow-hidden">
              <SidebarContent isMobile={true} />
            </div>
          </TooltipProvider>
        </div>
      )}

      <aside
        data-sidebar="true"
        className={cn(
          "hidden md:flex flex-col border-r bg-white transition-all duration-300 fixed top-0 left-0 h-screen-dvh z-50 overflow-visible",
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
            <img src={`${SIDEBAR_ICONS}/chevron-right.svg`} alt="" className="w-4 h-4 flex-shrink-0 text-gray-600" aria-hidden />
          ) : (
            <img src={`${SIDEBAR_ICONS}/chevron-left.svg`} alt="" className="w-4 h-4 flex-shrink-0 text-gray-600" aria-hidden />
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
          const newId = String(Date.now())
          setProjectsData((prev) => [...prev, { id: newId, label: projectName }])
          setCreateProjectModalOpen(false)
          try {
            sessionStorage.setItem(
              `project-data-${newId}`,
              JSON.stringify({
                name: projectName,
                mentors: selectedMentors.map((m) => ({
                  id: m.id,
                  title: m.title,
                  description: m.description,
                  avatar: m.avatar,
                })),
              }),
            )
          } catch (_) {}
          router.push(`/project/${newId}`)
        }}
      />
    </>
  )
}
