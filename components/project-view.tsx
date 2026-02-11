"use client"
import { useState, useEffect } from "react"
import { ChatInputForm } from "@/components/chat-input-form"
import { ProjectFilesModal } from "@/components/modals/project-files-modal"
import { ProjectInstructionsModal } from "@/components/modals/project-instructions-modal"
import { AddMentorToProjectModal } from "@/components/modals/add-mentor-to-project-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MoreVertical,
  MoreHorizontal,
  Share,
  Edit3,
  Folder,
  RotateCcw,
  Trash2,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
} from "lucide-react"
import { OpenFolderIcon } from "@/components/icons/svg-icons"

export interface ProjectViewAttachment {
  id: string
  name: string
  type: string
}

interface ProjectViewProps {
  projectName: string
  projectSlug: string
  projectMentors?: any[]
  onSubmit: (content: string, files?: File[], toolType?: string, toolData?: any) => void
  onPhoneCallClick: () => void
  onToolSelection?: (toolType: string) => void
  selectedToolType?: string
  onChatSelect?: (chatId: string, chatTitle: string) => void
  /** Prompt box: same as chat page when provided */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onAddSourcesClick?: () => void
  selectedAttachments?: ProjectViewAttachment[]
  onRemoveAttachment?: (id: string) => void
  fileInputRef?: React.RefObject<HTMLInputElement | null>
  isListening?: boolean
  onVoiceClick?: () => void
}

interface ChatItem {
  id: string
  title: string
  subtitle?: string
  timestamp: string
  slug: string
}

interface ProjectFile {
  id: string
  name: string
  type: string
  size?: string
  icon: "pdf" | "image" | "document" | "video" | "audio" | "other"
  file?: File
}

interface ProjectMentor {
  id: string | number
  title: string // Changed from 'name' to 'title' to match mentor data
  avatar: string
  description: string
}

export function ProjectView({
  projectName,
  projectSlug,
  projectMentors: initialProjectMentors = [],
  onSubmit,
  onPhoneCallClick,
  onToolSelection,
  selectedToolType = "",
  onChatSelect,
  value: inputValue,
  onChange: setInputValue,
  placeholder = "Ask anything",
  onAddSourcesClick,
  selectedAttachments = [],
  onRemoveAttachment,
  fileInputRef,
  isListening = false,
  onVoiceClick,
}: ProjectViewProps) {
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false)
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [projectInstructions, setProjectInstructions] = useState("")
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false)

  const [projectMentors, setProjectMentors] = useState<ProjectMentor[]>(initialProjectMentors)

  useEffect(() => {
    console.log("[v0] ProjectView received mentors:", initialProjectMentors)
    setProjectMentors(initialProjectMentors)
  }, [initialProjectMentors])

  // Mock projects data (same as sidebar) - get chats for current project
  const projects = [
    {
      id: "1",
      title: "Web Development Bootcamp",
      slug: "web-development-bootcamp",
      chats: [
        { id: "chat-1", title: "HTML Basics", slug: "html-basics", timestamp: "2 hours ago" },
        { id: "chat-2", title: "CSS Fundamentals", slug: "css-fundamentals", timestamp: "1 day ago" },
        { id: "chat-3", title: "JavaScript Introduction", slug: "javascript-introduction", timestamp: "2 days ago" },
      ],
    },
    {
      id: "2",
      title: "Data Science Fundamentals",
      slug: "data-science-fundamentals",
      chats: [
        { id: "chat-4", title: "Python for Data Science", slug: "python-for-data-science", timestamp: "3 hours ago" },
        { id: "chat-5", title: "Data Visualization", slug: "data-visualization", timestamp: "1 day ago" },
      ],
    },
    {
      id: "3",
      title: "AI for Business Leaders",
      slug: "ai-for-business-leaders",
      chats: [
        { id: "chat-6", title: "AI Strategy", slug: "ai-strategy", timestamp: "4 hours ago" },
        { id: "chat-7", title: "Implementation Planning", slug: "implementation-planning", timestamp: "2 days ago" },
      ],
    },
    {
      id: "4",
      title: "Course - Generative AI For coding",
      slug: "course-generative-ai-for-coding",
      chats: [
        {
          id: "1",
          title: "Lesson on AI Tools",
          slug: "lesson-on-ai-tools",
          timestamp: "2 hours ago",
        },
        {
          id: "2",
          title: "LLMs for Code Lesson",
          slug: "llms-for-code-lesson",
          subtitle: "no the pdf is missing a lot content as we have in canvas",
          timestamp: "1 day ago",
        },
        {
          id: "3",
          title: "Generative AI for Coding",
          slug: "generative-ai-for-coding",
          subtitle: "I need the separate pdf for each of the lessons",
          timestamp: "2 days ago",
        },
      ],
    },
  ]

  // Find current project and its chats
  const currentProject = projects.find((p) => p.slug === projectSlug)
  const chats = currentProject?.chats || []

  // Mock projects for move functionality
  const otherProjects = [
    { id: "1", name: "Web Development Bootcamp" },
    { id: "2", name: "Data Science Fundamentals" },
    { id: "3", name: "AI for Business Leaders" },
  ]

  const handleAddFiles = () => {
    setIsFilesModalOpen(true)
  }

  const handleAddInstructions = () => {
    setIsInstructionsModalOpen(true)
  }

  const handleSaveInstructions = (instructions: string) => {
    setProjectInstructions(instructions)
    console.log("Instructions saved:", instructions)
    // TODO: Save instructions to backend
  }

  const handleFilesChange = (files: ProjectFile[]) => {
    setProjectFiles(files)
  }

  const handleChatClick = (chatId: string) => {
    if (editingChatId === chatId) return // Don't navigate if editing

    const selectedChat = chats.find((chat) => chat.id === chatId)
    if (selectedChat && onChatSelect) {
      onChatSelect(chatId, selectedChat.title)
    }
  }

  const handleRenameChat = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = (chatId: string) => {
    // Update chat title in the list
    const updatedChats = chats.map((chat) => (chat.id === chatId ? { ...chat, title: editingTitle } : chat))
    // In a real app, you would update the state or make an API call here
    setEditingChatId(null)
    setEditingTitle("")
  }

  const handleCancelRename = () => {
    setEditingChatId(null)
    setEditingTitle("")
  }

  const handleMoveToProject = (chatId: string, projectId: string) => {
    console.log(`Moving chat ${chatId} to project ${projectId}`)
    // TODO: Implement move functionality
  }

  const handleRemoveFromProject = (chatId: string) => {
    console.log(`Removing chat ${chatId} from project`)
    // TODO: Implement remove from project functionality
  }

  const handleDeleteChat = (chatId: string) => {
    // Remove chat from the list
    // In a real app, you would update the state or make an API call here
    setShowDeleteConfirm(null)
  }

  const handleShareChat = (chatId: string) => {
    console.log(`Sharing chat ${chatId}`)
    // TODO: Implement share functionality
  }

  const handleAddMentor = () => {
    setIsAddMentorModalOpen(true)
  }

  const handleMentorSelect = (mentor: ProjectMentor) => {
    if (!projectMentors.find((m) => m.id === mentor.id)) {
      setProjectMentors([...projectMentors, mentor])
    }
    // Keep dialog open so user can add multiple agents; close only via Done or Cancel
  }

  const handleRemoveMentor = (mentorId: string) => {
    setProjectMentors(projectMentors.filter((m) => m.id !== mentorId))
  }

  const handleMentorDeselect = (mentor: ProjectMentor) => {
    setProjectMentors(projectMentors.filter((m) => m.id !== mentor.id))
  }

  const truncateText = (text: string, maxLines = 2) => {
    const words = text.split(" ")
    const maxWordsPerLine = 10 // Approximate words per line
    const maxWords = maxLines * maxWordsPerLine

    if (words.length <= maxWords) {
      return text
    }

    return words.slice(0, maxWords).join(" ") + "..."
  }

  const getFileIcon = (iconType: ProjectFile["icon"], size = "w-5 h-5") => {
    const iconClass = `${size} text-blue-600`

    switch (iconType) {
      case "pdf":
        return <FileText className={iconClass} />
      case "image":
        return <FileImage className={iconClass} />
      case "document":
        return <FileText className={iconClass} />
      case "video":
        return <FileVideo className={iconClass} />
      case "audio":
        return <FileAudio className={iconClass} />
      default:
        return <File className={iconClass} />
    }
  }

  const renderFileIcons = () => {
    if (projectFiles.length === 0) return null

    const maxIcons = 3
    const filesToShow = projectFiles.slice(0, maxIcons)

    return (
      <div className="flex -space-x-1">
        {filesToShow.map((file, index) => (
          <div
            key={file.id}
            className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center border border-white shadow-sm"
            style={{ zIndex: maxIcons - index }}
          >
            {getFileIcon(file.icon, "w-4 h-4")}
          </div>
        ))}
        {projectFiles.length > maxIcons && (
          <div
            className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center border border-white shadow-sm text-xs font-medium text-[var(--sidebar-foreground)]"
            style={{ zIndex: 0 }}
          >
            +{projectFiles.length - maxIcons}
          </div>
        )}
      </div>
    )
  }

  const renderMentorIcons = () => {
    if (projectMentors.length === 0) return null

    const maxIcons = 3
    const mentorsToShow = projectMentors.slice(0, maxIcons)

    return (
      <div className="flex -space-x-1">
        {mentorsToShow.map((mentor, index) => (
          <div
            key={mentor.id}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden"
            style={{ zIndex: maxIcons - index }}
          >
            <Avatar className="w-full h-full">
              <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.title || "Mentor"} />
              <AvatarFallback className="text-xs">{mentor.title?.substring(0, 2) || "M"}</AvatarFallback>
            </Avatar>
          </div>
        ))}
        {projectMentors.length > maxIcons && (
          <div
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-xs font-medium text-[var(--sidebar-foreground)]"
            style={{ zIndex: 0 }}
          >
            +{projectMentors.length - maxIcons}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="flex items-center justify-center gap-3 px-6 py-6 border-b border-gray-200">
        <OpenFolderIcon className="h-7 w-7" />
        <h1 className="text-lg font-semibold text-[var(--sidebar-foreground)] md:text-2xl">{projectName}</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-0 py-6 space-y-8 md:px-6">
        {/* Chat Input Form - same width as new course page (max-w-2xl) */}
        <div className="w-full max-w-2xl mx-auto">
          <ChatInputForm
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => {
              const text = inputValue.trim()
              if (text) {
                onSubmit(text)
                setInputValue("")
              }
            }}
            placeholder={placeholder}
            onAddSourcesClick={onAddSourcesClick}
            onVoiceClick={onVoiceClick ?? onPhoneCallClick}
            isListening={isListening}
            selectedAttachments={selectedAttachments}
            onRemoveAttachment={onRemoveAttachment}
            fileInputRef={fileInputRef}
          />
        </div>

        {/* Background Section for Action Buttons and Recents */}
        <div className="bg-[#FBFBFB] rounded-lg p-6 space-y-8">
          {/* Action Buttons - Combined Card with transparent background */}
          <div className="border border-gray-200 rounded-lg transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Add Files Section */}
              <div
                className="p-6 h-full flex flex-col justify-between cursor-pointer hover:bg-[#F0F1F0] transition-colors"
                onClick={handleAddFiles}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--sidebar-foreground)] mb-1 md:text-base">
                      {projectFiles.length > 0 ? "Project files" : "Add files"}
                    </h3>
                    <p className="text-sm text-[var(--sidebar-foreground)]">
                      {projectFiles.length === 0
                        ? "Chats in this project can access file content"
                        : `${projectFiles.length} file${projectFiles.length === 1 ? "" : "s"} added`}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">{renderFileIcons()}</div>
                </div>
              </div>

              {/* Add Instructions Section */}
              <div
                className="p-6 h-full flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200 cursor-pointer hover:bg-[#F0F1F0] transition-colors"
                onClick={handleAddInstructions}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--sidebar-foreground)] mb-1 md:text-base">
                      {projectInstructions ? "Instructions" : "Add instructions"}
                    </h3>
                    <p className="text-sm text-[var(--sidebar-foreground)]">
                      {projectInstructions
                        ? truncateText(projectInstructions, 2)
                        : "Tailor the way mentorAI responds in this project"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Agents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--sidebar-foreground)] md:text-lg">Project Agents</h2>
              <Button
                onClick={handleAddMentor}
                variant="outline"
                size="sm"
                className="text-sm bg-[#38A1E5] text-white border-[#38A1E5] hover:bg-[#2E8BC7] hover:border-[#2E8BC7] hover:text-white"
              >
                Add Agent
              </Button>
            </div>
            {projectMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group h-full"
                  >
                    <div className="flex items-start gap-3 h-full">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.title || "Mentor"} />
                        <AvatarFallback>{mentor.title?.substring(0, 2) || "M"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 flex flex-col h-full">
                        <h3 className="font-medium text-[var(--sidebar-foreground)] text-sm mb-2">{mentor.title || "Unknown Mentor"}</h3>
                        <p className="text-xs text-[var(--sidebar-foreground)] line-clamp-3 flex-1">
                          {mentor.description || "No description available"}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemoveMentor(mentor.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove from project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state when no agents are assigned
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p className="text-sm">No agents assigned to this project yet.</p>
                <p className="text-xs mt-1">Click "Add Agent" to assign agents to this project.</p>
              </div>
            )}
          </div>

          {/* Recents Section */}
          {chats.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--sidebar-foreground)]">Recents</h2>
              <div className="space-y-0">
                {chats.map((chat, index) => (
                  <div key={chat.id}>
                    <div
                      className={`cursor-pointer hover:bg-[#F0F1F0] transition-colors group px-4 py-4 ${
                        chats.length === 1
                          ? "hover:rounded-lg"
                          : index === 0
                            ? "hover:rounded-t-lg"
                            : index === chats.length - 1
                              ? "hover:rounded-b-lg"
                              : ""
                      }`}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          {editingChatId === chat.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSaveRename(chat.id)
                                  } else if (e.key === "Escape") {
                                    handleCancelRename()
                                  }
                                }}
                                onBlur={() => handleSaveRename(chat.id)}
                                className="flex-1"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-medium text-[var(--sidebar-foreground)] mb-1">{chat.title}</h3>
                              {chat.subtitle && (
                                <p className="text-sm text-[var(--sidebar-foreground)] mb-2 line-clamp-2">{chat.subtitle}</p>
                              )}
                              <p className="text-xs text-[var(--muted-foreground)]">{chat.timestamp}</p>
                            </>
                          )}
                        </div>
                        <div
                          className={`transition-opacity ${
                            openDropdownId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <DropdownMenu onOpenChange={(open) => setOpenDropdownId(open ? chat.id : null)}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleShareChat(chat.id)
                                }}
                              >
                                <Share className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRenameChat(chat.id, chat.title)
                                }}
                              >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <Folder className="mr-2 h-4 w-4" />
                                  Move to project
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {otherProjects.map((project) => (
                                    <DropdownMenuItem
                                      key={project.id}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleMoveToProject(chat.id, project.id)
                                      }}
                                    >
                                      {project.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFromProject(chat.id)
                                }}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Remove from {projectName}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowDeleteConfirm(chat.id)
                                }}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    {index < chats.length - 1 && <div className="border-b border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Files Modal */}
      <ProjectFilesModal
        isOpen={isFilesModalOpen}
        onClose={() => setIsFilesModalOpen(false)}
        projectName={projectName}
        onFilesChange={handleFilesChange}
      />

      {/* Project Instructions Modal */}
      <ProjectInstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        projectName={projectName}
        initialInstructions={projectInstructions}
        onSave={handleSaveInstructions}
      />

      <AddMentorToProjectModal
        isOpen={isAddMentorModalOpen}
        onClose={() => setIsAddMentorModalOpen(false)}
        onMentorSelect={handleMentorSelect}
        onMentorDeselect={handleMentorDeselect}
        projectName={projectName}
        existingMentors={projectMentors}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[var(--sidebar-foreground)] mb-2">Delete chat?</h3>
            <p className="text-[var(--sidebar-foreground)] mb-4">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteChat(showDeleteConfirm)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
