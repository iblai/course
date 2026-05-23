"use client"

import { Fragment, useState, useEffect, type ComponentType } from "react"
import { flushSync } from "react-dom"
import { useRouter, usePathname } from "next/navigation"
import { useUrlContext } from "@/lib/iblai/use-url-context"
import {
  useGetUserProjectsQuery,
  useCreateUserProjectMutation,
  useUpdateUserProjectMutation,
  useDeleteUserProjectMutation,
  useGetChatHistoryQuery,
} from "@iblai/iblai-js/data-layer"
import { chatActions, isLoggedIn as sdkIsLoggedIn } from "@iblai/iblai-js/web-utils"
import { useDispatch } from "react-redux"
import { useShowFreeTrialDialog } from "@/hooks/use-show-free-trial-dialog"
import { AuthPopover } from "@/components/iblai/auth-popover"
import { enableCourseCreationToolIfMissing } from "@/lib/iblai/agent-tools"
const SIDEBAR_ICONS = "/icons/sidebar"
const PROJECT_STORAGE_KEY = "project-data"
const MAX_RECENT_CHATS = 8

/**
 * Coerce `Conversations.messages` into an array of `{ human, ai }` turns.
 * The platform sometimes returns a JSON string, sometimes the already-
 * parsed array — accept both, return [] for anything else.
 * Mirrors hq's sidebar helper of the same name.
 */
function parseChatMessages(
  raw: unknown,
): Array<{ human?: string; ai?: string }> {
  if (Array.isArray(raw)) return raw as Array<{ human?: string; ai?: string }>
  if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {
      /* ignore */
    }
  }
  return []
}

/** Trim to a single-line preview. Same trim semantics as hq's sidebar. */
function truncateChatLabel(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max)
  const lastSpace = cut.lastIndexOf(" ")
  return `${lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut}…`
}
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { CreditCard, Coins, KeyRound, Settings, UserPlus, Mail } from "lucide-react"
import { toast } from "sonner"

import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InviteUserDialog } from "@iblai/iblai-js/web-containers"
import { RenameItemDialog, type RenameDialogSection } from "@/components/modals/rename-item-dialog"
import { DeleteItemDialog, type DeleteDialogSection } from "@/components/modals/delete-item-dialog"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { OrgAccountDialog, type OrgAccountTab } from "@/components/org-account-dialog"

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
  // Resolve current mentor + tenant so the prominent "New Chat" button
  // can fire `?new=<ts>` on the active mentor URL (matches mentorai's
  // `startNewChat` behaviour). Falls back to `/` when no mentor is
  // resolved so `useMentorRedirect` picks one for us.
  const { tenantKey: ctxTenantKey, mentorId: ctxMentorId, username } = useUrlContext()
  const startNewChat = () => {
    if (ctxTenantKey && ctxMentorId) {
      if (username) {
        // Fire-and-forget — never blocks navigation. The settings GET
        // returns immediately when the tool is already present; the
        // PUT only runs the first time per agent.
        void enableCourseCreationToolIfMissing(
          ctxTenantKey,
          username,
          ctxMentorId,
        )
      }
      router.push(`/platform/${ctxTenantKey}/${ctxMentorId}?new=${Date.now()}`)
    } else {
      // No mentor in URL context — `/` mounts `useMentorRedirect` which
      // resolves the default mentor and enables course-creation there
      // before redirecting.
      router.push("/")
    }
  }
  // Org account dialog (SDK <Account>) — every admin-footer pane
  // (Users / API / Billing / Monetization / Settings) opens this with a
  // different `targetTab`. Mirrors hq's `handleFooterActionClick`.
  const [orgAccountTab, setOrgAccountTab] = useState<OrgAccountTab | null>(
    null,
  )
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

  // Projects feed -- pulled live from the SDK (mirrors mentorai's
  // `ProjectsSidebarDropdown`). See `/iblai-project` skill.
  //
  // `useGetUserProjectsQuery` returns `{ results: Project[] }` where each
  // project carries `id`, `name`, and `mentors[]` (the assigned agents).
  // We project this into the existing `{ id, label }` shape the sidebar
  // section renders, and keep a per-project map of the first mentor's
  // `unique_id` so the click handler can route to
  // `/platform/<tenant>/<mentor>/projects/<projectId>`.
  const { data: projectsQueryData } = useGetUserProjectsQuery(
    {
      tenantKey: ctxTenantKey,
      username: username ?? "",
      params: { limit: 50 },
    } as never,
    {
      skip: !username || !ctxTenantKey,
    },
  )
  type SdkProjectMentor = {
    id?: number | string | null
    unique_id?: string | null
    name?: string | null
    profile_image?: string | null
  }
  type SdkProject = {
    id: number | string
    name?: string | null
    mentors?: SdkProjectMentor[] | null
  }
  const sdkProjects: SdkProject[] =
    (projectsQueryData as { results?: SdkProject[] } | undefined)?.results ??
    []
  const projectsData = sdkProjects.map((p) => ({
    id: String(p.id),
    label: p.name ?? "Untitled Project",
  }))
  // Per-project mentor list (mirrors mentorai's expansion under a
  // selected project) -- click a mentor row to land on
  // `/platform/<tenant>/<mentor>/projects/<projectId>`.
  const projectMentors: Record<string, SdkProjectMentor[]> = {}
  const projectDefaultMentor: Record<string, string> = {}
  for (const p of sdkProjects) {
    const ms = (p.mentors ?? []).filter(
      (m) => typeof m.unique_id === "string" && m.unique_id,
    )
    projectMentors[String(p.id)] = ms
    if (ms[0]?.unique_id) projectDefaultMentor[String(p.id)] = ms[0].unique_id
  }

  // Recent chat sessions -- same source hq's sidebar uses
  // (`useGetChatHistoryQuery` -> `/ai-analytics/orgs/<org>/users/<user>/
  // chat-history/`). Each row is a previous conversation with an
  // AI-generated `title`, the agent's `mentor` (unique_id), and an
  // `inserted_at` timestamp. `filterUserId` scopes the dropdown to the
  // signed-in user even when they're org admin -- otherwise the
  // endpoint returns the whole org's history.
  const { data: chatHistoryData } = useGetChatHistoryQuery(
    {
      org: ctxTenantKey,
      filterUserId: username ?? "",
      pageSize: MAX_RECENT_CHATS,
      page: 1,
    } as never,
    { skip: !ctxTenantKey || !username },
  )
  type ChatHistoryRow = {
    id?: string | null
    mentor?: string | null
    title?: string | null
    inserted_at?: string | null
    messages?: unknown
  }
  const chatHistoryRows: ChatHistoryRow[] =
    ((chatHistoryData as { results?: unknown[] } | undefined)?.results as
      | ChatHistoryRow[]
      | undefined) ?? []

  /** Best-effort label: AI title -> latest human msg -> fallback. */
  const labelForChat = (c: ChatHistoryRow): string => {
    const aiTitle = (c.title ?? "").trim()
    if (aiTitle) return truncateChatLabel(aiTitle, 60)
    const msgs = parseChatMessages(c.messages)
    for (let i = msgs.length - 1; i >= 0; i--) {
      const t = (msgs[i].human ?? "").trim()
      if (t) return truncateChatLabel(t, 60)
    }
    for (let i = msgs.length - 1; i >= 0; i--) {
      const t = (msgs[i].ai ?? "").trim()
      if (t) return truncateChatLabel(t, 60)
    }
    return "Untitled chat"
  }

  const recentChatItems = chatHistoryRows
    .slice(0, MAX_RECENT_CHATS)
    .map((c) => ({
      id: String(c.id ?? ""),
      label: labelForChat(c),
      mentor: c.mentor ?? "",
      href:
        c.mentor && ctxTenantKey && c.id
          ? `/platform/${ctxTenantKey}/${c.mentor}?session=${encodeURIComponent(String(c.id))}`
          : "",
    }))
    .filter((c) => c.href)

  // Mutations -- mirror mentorai's `ProjectsSidebarDropdown` /
  // `CreateProjectModal` / `RenameProjectModal` / `DeleteProjectModal`.
  // RTK Query invalidation refreshes the list automatically; we only
  // surface success/error toasts.
  const dispatch = useDispatch()
  const { executeWithTrialCheck } = useShowFreeTrialDialog()
  const userLoggedIn = sdkIsLoggedIn()
  const [createUserProject] = useCreateUserProjectMutation()
  const [updateUserProject] = useUpdateUserProjectMutation()
  const [deleteUserProject] = useDeleteUserProjectMutation()

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


  // Pinned + Recent are not yet wired to SDK feeds -- start empty so
  // the sidebar never shows placeholder "Design a course on..." rows.
  // When `/iblai-agent-history` is integrated, replace these with the
  // chat-history query results.
  const [pinnedData, setPinnedData] = useState<{ id: string; label: string }[]>([])
  const [recentData, setRecentData] = useState<{ id: string; label: string }[]>([])

  // Top nav -- matches hq's order: workspace/agent surface first, then
  // catalog. Users + Invite User moved to the admin footer below (hq
  // groups Users/Invite in its own footer rail). Configure stays in
  // the top nav as the workspace-config entry point.
  const sidebarItems = [
    {
      id: "my-courses",
      label: "My Courses",
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
      // Always lands on customize. `/customize/page.tsx` resolves the
      // current mentor via `useMentorRedirect({ pathSuffix: "/customize" })`
      // and redirects to `/platform/<tenant>/<mentor>/customize` -- so
      // this works from anywhere, not only when a mentor is in URL
      // context.
      href: "/customize",
    },
  ]

  // Admin footer -- mirrors hq's `SIDEBAR_FOOTER_ACTIONS` order:
  // Invites, Users, API, Billing, Monetization, Settings. Mix of
  // file-based SVGs (existing wink icons) and Lucide components (for
  // the new buttons that don't have a matching svg in
  // `public/icons/sidebar/`).
  type FooterIcon = string | ComponentType<{ className?: string }>
  const adminFooterItems: { id: string; label: string; icon: FooterIcon }[] = [
    { id: "invite-user", label: "Invites", icon: Mail },
    { id: "users", label: "Users", icon: UserPlus },
    { id: "api", label: "API", icon: KeyRound },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "monetization", label: "Monetization", icon: Coins },
    { id: "settings", label: "Settings", icon: Settings },
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

  const handleRenameConfirm = async (newName: string) => {
    const dataId = getDataId(renameDialog.itemId, renameDialog.section)
    if (renameDialog.section === "pinned") {
      setPinnedData((prev) => prev.map((p) => (p.id === dataId ? { ...p, label: newName } : p)))
    } else if (renameDialog.section === "project") {
      // Persist via the SDK; the `useGetUserProjectsQuery` cache is
      // invalidated by the mutation, so the sidebar list re-renders
      // with the new name on its own.
      if (!ctxTenantKey) {
        toast.error("No tenant resolved; cannot rename project.")
        return
      }
      try {
        await updateUserProject({
          tenantKey: ctxTenantKey,
          username: username ?? "",
          id: parseInt(dataId, 10),
          data: { name: newName },
        } as never).unwrap()
        toast.success("Project renamed")
      } catch (err) {
        console.error("[sidebar] project rename failed", err)
        toast.error("Failed to rename project")
      }
    } else {
      setRecentData((prev) => prev.map((r) => (r.id === dataId ? { ...r, label: newName } : r)))
    }
  }

  const handleDeleteConfirm = async () => {
    const dataId = getDataId(deleteDialog.itemId, deleteDialog.section)
    if (deleteDialog.section === "pinned") {
      setPinnedData((prev) => prev.filter((p) => p.id !== dataId))
    } else if (deleteDialog.section === "project") {
      if (!ctxTenantKey) {
        toast.error("No tenant resolved; cannot delete project.")
        return
      }
      try {
        await deleteUserProject({
          tenantKey: ctxTenantKey,
          username: username ?? "",
          id: parseInt(dataId, 10),
        } as never).unwrap()
        toast.success("Project deleted")
      } catch (err) {
        console.error("[sidebar] project delete failed", err)
        toast.error("Failed to delete project")
      }
    } else {
      setRecentData((prev) => prev.filter((r) => r.id !== dataId))
    }
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", isMobile && "pb-[env(safe-area-inset-bottom)]")}>
      <div className="px-4 py-4 border-b" style={{ borderColor: "#D0E0FF" }}>
        {/* ibl.ai brand mark. Asset is 257x110 (wordmark-style), so use
            an aspect-preserving height-based size like hq does. Hide the
            mark entirely on the collapsed rail (rail is only 64px wide,
            no room for the wordmark) -- the toggle chevron beside the
            rail handles brand presence. */}
        {(!isCollapsed || isMobile) && (
          <Link
            href="/home"
            className="flex items-center justify-center transition-opacity hover:opacity-90"
            aria-label="ibl.ai home"
          >
            <Image
              src="/images/iblai-logo.png"
              alt="ibl.ai"
              width={257}
              height={110}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
        )}
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
                      "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                    )}
                    onClick={startNewChat}
                  >
                    <img
                      src={`${SIDEBAR_ICONS}/square-pen.svg`}
                      alt=""
                      className="w-[18px] h-[18px] flex-shrink-0"
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
                "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
              )}
              onClick={startNewChat}
            >
              <img
                src={`${SIDEBAR_ICONS}/square-pen.svg`}
                alt=""
                className="w-[18px] h-[18px] flex-shrink-0"
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
              onClick={() => toggleExpanded("chats")}
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
                {recentChatItems.length > 0 ? (
                  <ul className="pl-4 py-1 space-y-0.5 text-left list-none">
                    {recentChatItems.map((chat) => {
                      const isActive =
                        !!ctxMentorId && chat.mentor === ctxMentorId
                      return (
                        <li key={chat.id} className="group flex items-center min-w-0 rounded-md">
                          <button
                            type="button"
                            onClick={() => {
                              onMobileClose?.()
                              router.push(chat.href)
                            }}
                            title={chat.label}
                            className={cn(
                              "w-full truncate rounded-md px-2 py-1 text-left text-sm transition-colors",
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-[rgb(113,121,133)] hover:bg-gray-50/80 hover:text-[#020817]",
                            )}
                          >
                            {chat.label}
                          </button>
                        </li>
                      )
                    })}
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
                  onClick={() => toggleExpanded("chats")}
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
                    executeWithTrialCheck(() =>
                      setCreateProjectModalOpen(true),
                    )
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

          const projectsTrigger = userLoggedIn ? (
            sidebarButton
          ) : (
            <AuthPopover tenantKey={ctxTenantKey}>{sidebarButton}</AuthPopover>
          )
          return isCollapsed ? (
            <TooltipProvider key={item.id}>
              <TooltipFlowbite content={item.label} position="right">
                {projectsTrigger}
              </TooltipFlowbite>
            </TooltipProvider>
          ) : (
            <div key={item.id}>
              {projectsTrigger}
              {(item.id === "projects" || expandedItems.includes(item.id)) && item.children && item.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  {item.children.map((child) => {
                    const projectId = child.id.replace(/^project-/, "")
                    // Route format mirrors `/iblai-project`:
                    //   /platform/<tenant>/<mentor>/projects/<projectId>
                    // Mentor = first agent attached to the project (from
                    // the SDK list). Fall back to the URL's mentor if a
                    // project has no agents yet so the click still works.
                    const defaultMentor =
                      projectDefaultMentor[projectId] || ctxMentorId || ""
                    const projectHref =
                      ctxTenantKey && defaultMentor
                        ? `/platform/${ctxTenantKey}/${defaultMentor}/projects/${projectId}`
                        : ""
                    const isActiveProject =
                      !!projectHref && pathname === projectHref
                    const openProject = () =>
                      executeWithTrialCheck(() => {
                        if (projectHref) router.push(projectHref)
                        else toast("Add an agent to this project first.")
                      })
                    const projectIsExpanded =
                      isActiveProject ||
                      (!!ctxTenantKey &&
                        pathname?.startsWith(`/platform/${ctxTenantKey}/`) &&
                        pathname?.includes(`/projects/${projectId}`))
                    return (
                    <Fragment key={child.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={openProject}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") openProject()
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
                    {projectIsExpanded && projectMentors[projectId]?.length ? (
                      <div className="ml-6 mt-1 space-y-0.5 border-l border-gray-200">
                        {projectMentors[projectId].map((m) => {
                          const mentorUniqueId = m.unique_id as string
                          const mentorHref =
                            ctxTenantKey
                              ? `/platform/${ctxTenantKey}/${mentorUniqueId}/projects/${projectId}`
                              : ""
                          const mentorActive =
                            !!mentorHref && pathname === mentorHref
                          return (
                            <button
                              key={mentorUniqueId}
                              type="button"
                              onClick={() =>
                                executeWithTrialCheck(() => {
                                  if (mentorHref) router.push(mentorHref)
                                })
                              }
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1 pl-4 text-left text-sm hover:bg-gray-100",
                                mentorActive && "bg-blue-50 text-blue-600",
                              )}
                            >
                              {m.profile_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={m.profile_image}
                                  alt=""
                                  className="h-4 w-4 rounded-full object-cover"
                                />
                              ) : (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-[8px] font-semibold text-white">
                                  {(m.name ?? "").slice(0, 2).toUpperCase()}
                                </span>
                              )}
                              <span className="flex-1 truncate text-[rgb(113,121,133)]">
                                {m.name ?? "Untitled agent"}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                    </Fragment>
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

      {/* Admin footer (logged-in) -- matches hq's `SIDEBAR_FOOTER_ACTIONS`:
          Invites, Users, API, Billing, Monetization, Settings. Every
          pane (except Invites + Users) opens the SDK `<Account>` via
          `OrgAccountDialog` with the matching `targetTab`. */}
      {isLoggedIn && (
        <div
          className={cn(
            "border-t space-y-1",
            isCollapsed ? "flex flex-col items-center px-0 py-3" : "p-3",
            isMobile && "pb-6",
          )}
          style={{ borderColor: "#D0E0FF" }}
        >
          {adminFooterItems.map((item) => {
            const handleClick = () => {
              // Footer routing matches hq's `handleFooterActionClick`
              // pattern (`components/sidebar.tsx`): every admin-pane
              // button opens the SDK `<Account>` at the matching tab via
              // `OrgAccountDialog`. courseai keeps `users` as a
              // standalone route since it predates the SDK Account
              // surface; everything else consolidates on the dialog.
              if (item.id === "invite-user") {
                onMobileClose?.()
                setInviteDialogOpen(true)
                return
              }
              if (item.id === "users") {
                onMobileClose?.()
                setOrgAccountTab("management")
                return
              }
              if (item.id === "api") {
                onMobileClose?.()
                setOrgAccountTab("integrations")
                return
              }
              if (item.id === "settings") {
                onMobileClose?.()
                setOrgAccountTab("advanced")
                return
              }
              if (item.id === "billing") {
                // Matches hq's `handleFooterActionClick`: route to the
                // analytics Financial tab (`AnalyticsFinancialStats`
                // from `/iblai-analytics`).
                onMobileClose?.()
                router.push("/analytics/financial")
                return
              }
              if (item.id === "monetization") {
                onMobileClose?.()
                setOrgAccountTab("monetization")
                return
              }
            }
            const isActive =
              item.id === "billing" ? isActiveRoute("/analytics/financial") : false
            const isLucide = typeof item.icon !== "string"
            const button = (
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 hover:bg-blue-50 hover:text-[#020817] text-[rgb(113,121,133)]",
                  isCollapsed
                    ? "justify-center items-center w-10 h-10 p-0 rounded-lg mx-auto"
                    : "w-full justify-start pl-[11px]",
                  isActive && !isCollapsed && "bg-blue-50 text-blue-600",
                  isActive && isCollapsed && "bg-gray-100",
                )}
                onClick={handleClick}
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  {isLucide ? (
                    (() => {
                      const Icon = item.icon as ComponentType<{ className?: string }>
                      return (
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive && "text-blue-600",
                          )}
                        />
                      )
                    })()
                  ) : (
                    <img
                      src={item.icon as string}
                      alt={item.label}
                      className="w-5 h-[19px] p-0 transition-colors"
                      style={
                        isActive
                          ? {
                              filter:
                                "brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(202deg) brightness(98%) contrast(96%)",
                            }
                          : {}
                      }
                    />
                  )}
                </span>
                {(!isCollapsed || isMobile) && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
              </Button>
            )
            return isCollapsed ? (
              <TooltipProvider key={item.id}>
                <TooltipFlowbite content={item.label} position="right">
                  <div className="flex justify-center items-center">{button}</div>
                </TooltipFlowbite>
              </TooltipProvider>
            ) : (
              <div key={item.id}>{button}</div>
            )
          })}
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
          "hidden md:flex flex-col border-r bg-white transition-all duration-300 fixed top-0 left-0 h-dvh z-50 overflow-visible",
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

      <InviteUserDialog
        isOpen={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        tenant={ctxTenantKey}
      />

      <OrgAccountDialog
        open={orgAccountTab !== null}
        onOpenChange={(open) => {
          if (!open) setOrgAccountTab(null)
        }}
        tab={orgAccountTab ?? "monetization"}
        onInviteClick={() => setInviteDialogOpen(true)}
      />

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
        onCreateProject={async (projectName, selectedMentors) => {
          if (!ctxTenantKey || !username) {
            toast.error("No tenant or user resolved; cannot create project.")
            return
          }
          try {
            const created = await createUserProject({
              tenantKey: ctxTenantKey,
              username,
              // SDK payload matches mentorai's CreateProjectModal:
              // `{ name, description, shared, mentors_to_add: <unique_id[]> }`.
              data: {
                name: projectName,
                description: "",
                shared: false,
                mentors_to_add: selectedMentors
                  .map((m) =>
                    typeof (m as { unique_id?: string }).unique_id === "string"
                      ? (m as { unique_id?: string }).unique_id
                      : String((m as { id?: string | number }).id ?? ""),
                  )
                  .filter((v): v is string => !!v),
              },
            } as never).unwrap()
            setCreateProjectModalOpen(false)
            const newId = (created as { id?: number | string } | undefined)?.id
            const firstMentor =
              selectedMentors[0] &&
              ((selectedMentors[0] as { unique_id?: string }).unique_id ??
                String((selectedMentors[0] as { id?: string | number }).id ?? ""))
            if (newId && firstMentor) {
              // Mentorai pattern: signal a fresh chat session so the
              // SDK Chat (mounted on the project route) starts a new
              // conversation instead of restoring the cached one for
              // this mentor.
              dispatch(chatActions.setShouldStartNewChat(true))
              router.push(`/platform/${ctxTenantKey}/${firstMentor}/projects/${newId}`)
            }
            toast.success("Project created")
          } catch (err) {
            console.error("[sidebar] project create failed", err)
            toast.error("Failed to create project")
          }
        }}
      />
    </>
  )
}
