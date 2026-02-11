"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Upload,
  Search,
  ArrowLeft,
  Smartphone,
  Globe,
  FileText,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Trash2,
  Check,
  Database,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import Image from "next/image"
import { UploadIcon, OneDriveIcon } from "@/components/icons/svg-icons"

interface ResourceType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  bgColor: string
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: string
  icon: "pdf" | "image" | "document" | "video" | "audio" | "other"
  file: File | null
}

interface KnowledgeBankFile {
  id: string
  name: string
  type: string
  size: string
  mentorName: string
  uploadDate: string
  icon: "pdf" | "image" | "document" | "video" | "audio" | "other"
  selected?: boolean
}

interface AddResourceModalProps {
  isOpen: boolean
  onClose: () => void
  keepParentOpen?: boolean
}

const mockKnowledgeBankFiles: KnowledgeBankFile[] = [
  {
    id: "kb-1",
    name: "Machine Learning Fundamentals.pdf",
    type: "PDF",
    size: "2.4 MB",
    mentorName: "Computer Science",
    uploadDate: "2024-01-15",
    icon: "pdf",
  },
  {
    id: "kb-2",
    name: "React Best Practices Guide.docx",
    type: "Document",
    size: "1.8 MB",
    mentorName: "Python Programming",
    uploadDate: "2024-01-12",
    icon: "document",
  },
  {
    id: "kb-3",
    name: "Data Visualization Examples.png",
    type: "Image",
    size: "856 KB",
    mentorName: "Principles of Data Science",
    uploadDate: "2024-01-10",
    icon: "image",
  },
  {
    id: "kb-4",
    name: "Python Tutorial Video.mp4",
    type: "Video",
    size: "45.2 MB",
    mentorName: "Python Programming",
    uploadDate: "2024-01-08",
    icon: "video",
  },
  {
    id: "kb-5",
    name: "Database Design Principles.pdf",
    type: "PDF",
    size: "3.1 MB",
    mentorName: "Information Systems",
    uploadDate: "2024-01-05",
    icon: "pdf",
  },
  {
    id: "kb-6",
    name: "API Documentation.txt",
    type: "Text",
    size: "124 KB",
    mentorName: "Foundations of Computer Science",
    uploadDate: "2024-01-03",
    icon: "document",
  },
  {
    id: "kb-7",
    name: "Business Strategy Guide.pdf",
    type: "PDF",
    size: "2.8 MB",
    mentorName: "Business Technologies",
    uploadDate: "2024-01-20",
    icon: "pdf",
  },
  {
    id: "kb-8",
    name: "Calculus Problem Sets.pdf",
    type: "PDF",
    size: "1.5 MB",
    mentorName: "Calculus",
    uploadDate: "2024-01-18",
    icon: "pdf",
  },
  {
    id: "kb-9",
    name: "Physics Lab Manual.docx",
    type: "Document",
    size: "3.2 MB",
    mentorName: "Physics",
    uploadDate: "2024-01-16",
    icon: "document",
  },
  {
    id: "kb-10",
    name: "World History Timeline.png",
    type: "Image",
    size: "1.2 MB",
    mentorName: "World History",
    uploadDate: "2024-01-14",
    icon: "image",
  },
]

const getFileTypeFromExtension = (fileName: string): { icon: UploadedFile["icon"]; displayType: string } => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return { icon: "pdf", displayType: "PDF" }
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return { icon: "image", displayType: "Image" }
    case "doc":
    case "docx":
      return { icon: "document", displayType: "Document" }
    case "txt":
    case "rtf":
      return { icon: "document", displayType: "Text" }
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return { icon: "video", displayType: "Video" }
    case "mp3":
    case "wav":
    case "flac":
      return { icon: "audio", displayType: "Audio" }
    case "zip":
    case "rar":
    case "7z":
      return { icon: "other", displayType: "Archive" }
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "py":
    case "java":
    case "cpp":
    case "c":
    case "html":
    case "css":
      return { icon: "other", displayType: "Code" }
    default:
      return { icon: "other", displayType: "File" }
  }
}

const getFileIcon = (iconType: UploadedFile["icon"]) => {
  switch (iconType) {
    case "pdf":
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      )
    case "image":
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileImage className="w-6 h-6 text-blue-600" />
        </div>
      )
    case "document":
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      )
    case "video":
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileVideo className="w-6 h-6 text-blue-600" />
        </div>
      )
    case "audio":
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileAudio className="w-6 h-6 text-blue-600" />
        </div>
      )
    default:
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <File className="w-6 h-6 text-blue-600" />
        </div>
      )
  }
}

const getSmallFileIcon = (iconType: UploadedFile["icon"]) => {
  switch (iconType) {
    case "pdf":
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
      )
    case "image":
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileImage className="w-4 h-4 text-blue-600" />
        </div>
      )
    case "document":
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
      )
    case "video":
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileVideo className="w-4 h-4 text-blue-600" />
        </div>
      )
    case "audio":
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileAudio className="w-4 h-4 text-blue-600" />
        </div>
      )
    default:
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <File className="w-4 h-4 text-blue-600" />
        </div>
      )
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function AddResourceModal({ isOpen, onClose, keepParentOpen = false }: AddResourceModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "knowledge">("upload")
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [url, setUrl] = useState<string>("")
  const [githubUrl, setGithubUrl] = useState<string>("")
  const [branch, setBranch] = useState<string>("main")
  const [isDragOver, setIsDragOver] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const [knowledgeBankFiles, setKnowledgeBankFiles] = useState<KnowledgeBankFile[]>(mockKnowledgeBankFiles)
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState("")
  const [mentorFilter, setMentorFilter] = useState("")
  const [fileTypeFilter, setFileTypeFilter] = useState("")
  const [selectedKnowledgeFiles, setSelectedKnowledgeFiles] = useState<string[]>([])

  useEffect(() => {
    const event = new CustomEvent("addResourceModalState", {
      detail: { isOpen },
    })
    window.dispatchEvent(event)

    return () => {
      const closeEvent = new CustomEvent("addResourceModalState", {
        detail: { isOpen: false },
      })
      window.dispatchEvent(closeEvent)
    }
  }, [isOpen])

  const resourceTypes: ResourceType[] = [
    {
      id: "phone",
      name: "Upload from phone",
      description: "Upload files directly from your mobile device.",
      bgColor: "bg-blue-100",
      icon: <Smartphone className="h-6 w-6 text-gray-600" />,
    },
    {
      id: "file",
      name: "Upload File",
      description: "Upload files including PDF, DOC, DOCX, TXT, JPG, PNG, GIF, MP4, MP3, WAV, ZIP, and more.",
      bgColor: "bg-blue-100",
      icon: <UploadIcon className="h-6 w-6 text-gray-600" />,
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Import files and folders directly from your Google Drive account.",
      bgColor: "bg-blue-100",
      icon: <Image src="/icons/google-drive.svg" alt="Google Drive" width={24} height={24} />,
    },
    {
      id: "onedrive",
      name: "Microsoft OneDrive",
      description: "Connect your OneDrive account to access and import files directly.",
      bgColor: "bg-blue-100",
      icon: <OneDriveIcon className="h-6 w-6 text-gray-600" />,
    },
    {
      id: "website",
      name: "Website",
      description: "Extract content from any website by providing its URL.",
      bgColor: "bg-purple-100",
      icon: <Globe className="h-6 w-6 text-gray-600" />,
    },
    {
      id: "youtube",
      name: "YouTube",
      description: "Import YouTube videos for transcription and content analysis.",
      bgColor: "bg-red-100",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.57879 17.5546 1.82072 17.9894 2.16135 18.3406C2.50198 18.6918 2.92925 18.9468 3.4 19.08C5.12 19.54 12 19.54 12 19.54C12 19.54 18.88 19.54 20.6 19.08C21.0708 18.9468 21.498 18.6918 21.8387 18.3406C22.1793 17.9894 22.4212 17.5546 22.54 17.08C22.8524 15.3427 23.0063 13.5733 23 11.8C23.0113 10.013 22.8573 8.22866 22.54 6.47V6.42Z"
            fill="#FF0000"
          />
          <path d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z" fill="white" />
        </svg>
      ),
    },
    {
      id: "github",
      name: "GitHub Repository",
      description: "Import code repositories from GitHub for analysis and documentation.",
      bgColor: "bg-gray-100",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.278 9.521 21.017C9.521 20.783 9.512 20.036 9.508 19.205C6.726 19.758 6.139 17.782 6.139 17.782C5.685 16.643 5.028 16.341 5.028 16.341C4.132 15.729 5.097 15.741 5.097 15.741C6.094 15.812 6.628 16.761 6.628 16.761C7.521 18.257 8.97 17.829 9.539 17.577C9.631 16.969 9.889 16.542 10.175 16.299C7.955 16.054 5.62 15.233 5.62 11.477C5.62 10.387 6.01 9.492 6.649 8.787C6.546 8.54 6.203 7.559 6.747 6.174C6.747 6.174 7.587 5.909 9.497 7.211C10.3 6.992 11.15 6.883 12 6.879C12.85 6.883 13.7 6.992 14.503 7.211C16.413 5.909 17.253 6.174 17.253 6.174C17.797 7.559 18.38 10.387 18.38 11.477C18.38 15.243 16.042 16.051 13.813 16.291C14.172 16.592 14.492 17.188 14.492 18.095C14.492 19.382 14.48 20.692 14.48 21.017C14.48 21.281 14.659 21.587 15.167 21.487C19.138 20.161 22 16.416 22 12C22 6.477 17.523 2 12 2ZM6 4H11V12L8.5 10.5L6 12V4Z"
            fill="black"
          />
        </svg>
      ),
    },
    {
      id: "courses",
      name: "Course Materials",
      description: "Import educational content and course materials for learning enhancement.",
      bgColor: "bg-blue-100",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4Z"
            fill="#1565C0"
          />
        </svg>
      ),
    },
  ]

  const filteredKnowledgeBankFiles = knowledgeBankFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(knowledgeSearchQuery.toLowerCase())
    const matchesMentor = !mentorFilter || file.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
    const matchesFileType = !fileTypeFilter || file.type.toLowerCase().includes(fileTypeFilter.toLowerCase())
    return matchesSearch && matchesMentor && matchesFileType
  })

  const uniqueMentors = [...new Set(knowledgeBankFiles.map((file) => file.mentorName))]
  const uniqueFileTypes = [...new Set(knowledgeBankFiles.map((file) => file.type))]

  const filteredResources = resourceTypes.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleKnowledgeFileSelect = (fileId: string) => {
    setSelectedKnowledgeFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId],
    )
  }

  const handleAddSelectedKnowledgeFiles = () => {
    const selectedFiles = knowledgeBankFiles.filter((file) => selectedKnowledgeFiles.includes(file.id))

    // Convert knowledge bank files to uploaded files format
    const convertedFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: `kb-${file.id}-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      icon: file.icon,
      file: null, // Knowledge bank files don't need actual File objects
    }))

    // Add files to the current upload list
    setFiles((prevFiles) => [...prevFiles, ...convertedFiles])
    setSelectedKnowledgeFiles([])

    // Close the modal instead of switching tabs
    onClose()
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set isDragOver to false if we're leaving the drag area completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        if (!selectedResource) {
          setSelectedResource("file")
        }
        handleFiles(droppedFiles)
      }
    },
    [selectedResource],
  )

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file, index) => {
      const { icon, displayType } = getFileTypeFromExtension(file.name)
      return {
        id: `${Date.now()}-${index}`,
        name: file.name,
        type: displayType,
        size: formatFileSize(file.size),
        icon: icon,
        file: file,
      }
    })

    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFileToDelete(fileId)
  }

  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileToDelete))
      setFileToDelete(null)
    }
  }

  const cancelDelete = () => {
    setFileToDelete(null)
  }

  const handleSubmit = () => {
    if (selectedResource === "url" || selectedResource === "website") {
      console.log(`Submitting URL: ${url}`)
    } else if (selectedResource === "github") {
      console.log(`Submitting GitHub repo: ${githubUrl}, branch: ${branch}`)
    } else {
      console.log(
        `Submitting files:`,
        files.map((f) => f.name),
      )
    }
    setSelectedResource(null)
    setFiles([])
    setUrl("")
    setGithubUrl("")
    setBranch("main")

    onClose()
  }

  const handleBack = () => {
    setSelectedResource(null)
    setFiles([])
    setUrl("")
    setGithubUrl("")
    setBranch("main")
  }

  const handleClose = () => {
    setSelectedResource(null)
    setFiles([])
    setUrl("")
    setGithubUrl("")
    setBranch("main")
    setSearchQuery("")
    setActiveTab("upload")
    setKnowledgeSearchQuery("")
    setMentorFilter("")
    setFileTypeFilter("")
    setSelectedKnowledgeFiles([])
    onClose()
  }

  // Tab configuration
  const tabs = [
    { id: "upload", label: "Upload File", icon: Upload },
    { id: "knowledge", label: "Knowledge Bank", icon: Database },
  ]

  // Get current tab info for mobile display
  const currentTabInfo = tabs.find((tab) => tab.id === activeTab)

  const renderResourceForm = () => {
    switch (selectedResource) {
      case "website":
      case "youtube":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
                {selectedResource === "youtube" ? "YouTube URL" : "Website URL"}
              </label>
              <Input
                id="url-input"
                type="url"
                placeholder={selectedResource === "youtube" ? "https://youtube.com/watch?v=..." : "https://example.com"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-11"
              />
            </div>
            <p className="text-sm text-gray-500">
              {selectedResource === "youtube"
                ? "Enter a YouTube video URL to extract transcription and content."
                : "Enter a website URL to extract and analyze its content."}
            </p>
          </div>
        )

      case "github":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 mb-2">
                Repository URL
              </label>
              <Input
                id="github-url"
                type="url"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <Input
                id="branch"
                type="text"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="h-11"
              />
            </div>
            <p className="text-sm text-gray-500">
              Enter a GitHub repository URL and branch to import code for analysis.
            </p>
          </div>
        )

      case "phone":
      case "file":
      case "google-drive":
      case "onedrive":
      case "courses":
      default:
        return (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-[#38A1E5] bg-[#38A1E5]/5 scale-[1.02] shadow-lg"
                  : "border-[#CBD0DC] bg-[#F8FAFC] hover:border-[#38A1E5] hover:bg-[#38A1E5]/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`mb-4 p-3 rounded-full transition-all duration-200 ${
                    isDragOver ? "bg-[#38A1E5] scale-110" : "bg-blue-100"
                  }`}
                >
                  <Upload
                    className={`h-6 w-6 transition-colors duration-200 ${isDragOver ? "text-white" : "text-blue-600"}`}
                  />
                </div>

                <p
                  className={`font-medium mb-2 transition-colors duration-200 ${
                    isDragOver ? "text-[#38A1E5]" : "text-gray-700"
                  }`}
                >
                  {isDragOver ? "Drop files to upload" : "Drag and drop files here"}
                </p>
                <p className="text-gray-500 text-sm mb-4">or click to browse your files</p>

                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="bg-[#38A1E5] hover:bg-[#2E8BC7] text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium hover:shadow-md">
                    Select Files
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.avi,.mov,.wmv,.mp3,.wav,.flac,.zip,.rar,.7z,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css"
                  />
                </label>

                <p className="text-xs text-gray-500 mt-4">
                  Supports: PDF, DOC, Images, Videos, Audio, Code files and more
                </p>
                <p className="text-xs text-gray-400">Maximum file size: 60MB per file</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-0 max-h-64 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className={`group flex items-center gap-4 p-3 border border-gray-200 hover:bg-gray-50 transition-colors ${
                      files.length === 1
                        ? "rounded-lg"
                        : index === 0
                          ? "rounded-t-lg"
                          : index === files.length - 1
                            ? "rounded-b-lg"
                            : ""
                    }`}
                  >
                    {getFileIcon(file.icon)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      <p className="text-sm text-gray-500">{file.type}</p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
    }
  }

  const renderUploadTab = () => (
    <div className="h-full flex flex-col">
      {selectedResource ? (
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium text-gray-900">
              {resourceTypes.find((r) => r.id === selectedResource)?.name}
            </h3>
          </div>
          {renderResourceForm()}
        </div>
      ) : (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-200 mb-4 sm:mb-6 ${
              isDragOver
                ? "border-[#38A1E5] bg-[#38A1E5]/5 scale-[1.02] shadow-lg"
                : "border-[#CBD0DC] bg-[#F8FAFC] hover:border-[#38A1E5] hover:bg-[#38A1E5]/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className={`mb-3 p-2 sm:p-3 rounded-full transition-all duration-200 ${
                  isDragOver ? "bg-[#38A1E5] scale-110" : "bg-blue-100"
                }`}
              >
                <Upload
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${isDragOver ? "text-white" : "text-blue-600"}`}
                />
              </div>

              <p
                className={`font-medium mb-1 sm:mb-2 text-sm sm:text-base transition-colors duration-200 ${
                  isDragOver ? "text-[#38A1E5]" : "text-gray-700"
                }`}
              >
                {isDragOver ? "Drop files to upload" : "Quick Upload"}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                Drag and drop files here or click to browse
              </p>

              <label htmlFor="quick-file-upload" className="cursor-pointer">
                <div className="bg-[#38A1E5] hover:bg-[#2E8BC7] text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-md text-xs sm:text-sm">
                  Browse Files
                </div>
                <input
                  id="quick-file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.avi,.mov,.wmv,.mp3,.wav,.flac,.zip,.rar,.7z,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css"
                />
              </label>

              <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                PDF, DOC, Images, Videos, Audio, Code files - Max 60MB
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Uploaded Files ({files.length})
              </h3>
              <div className="space-y-0 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className={`group flex items-center gap-2 sm:gap-3 p-2 border border-gray-200 hover:bg-gray-50 transition-colors ${
                      files.length === 1
                        ? "rounded-lg"
                        : index === 0
                          ? "rounded-t-lg"
                          : index === files.length - 1
                            ? "rounded-b-lg"
                            : ""
                    }`}
                  >
                    {getSmallFileIcon(file.icon)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-xs sm:text-sm">{file.name}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {file.type} - {file.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-9 h-9 sm:h-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
            Add knowledge to help your agent provide more relevant insights.
          </p>

          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">No resources found</h3>
              <p className="text-slate-600 max-w-sm text-xs sm:text-sm">
                No resources match "{searchQuery}". Try a different search term.
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-200 group"
                  onClick={() => setSelectedResource(resource.id)}
                >
                  <CardHeader className="p-3 sm:pb-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 ${resource.bgColor}`}
                      >
                        {resource.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                          {resource.name}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1 line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {(selectedResource || files.length > 0) && (
        <div className="flex-shrink-0 pt-4 mt-auto flex items-center justify-end gap-2 sm:gap-3 border-t">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            className="px-4 sm:px-6 py-2 bg-transparent text-xs sm:text-sm"
          >
            {selectedResource ? "Back" : "Clear Files"}
          </Button>
          <Button
            type="button"
            onClick={selectedResource ? handleSubmit : () => setSelectedResource("file")}
            disabled={
              selectedResource &&
              ((selectedResource === "url" && !url.trim()) ||
                (selectedResource === "website" && !url.trim()) ||
                (selectedResource === "github" && !githubUrl.trim()) ||
                (selectedResource !== "url" &&
                  selectedResource !== "website" &&
                  selectedResource !== "github" &&
                  files.length === 0))
            }
            className="px-4 sm:px-6 py-2 bg-[#38A1E5] hover:bg-[#2E8BC7] text-white text-xs sm:text-sm"
          >
            {selectedResource ? "Submit" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  )

  const renderKnowledgeBank = () => (
    <div className="h-full flex flex-col">
      {/* Search and Filters */}
      <div className="flex-shrink-0 space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-9 h-10"
            value={knowledgeSearchQuery}
            onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#38A1E5] focus:border-[#38A1E5]"
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
          >
            <option value="">All Mentors</option>
            {uniqueMentors.map((mentor) => (
              <option key={mentor} value={mentor}>
                {mentor}
              </option>
            ))}
          </select>

          <select
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#38A1E5] focus:border-[#38A1E5]"
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueFileTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Files Count */}
      {selectedKnowledgeFiles.length > 0 && (
        <div className="flex-shrink-0 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">{selectedKnowledgeFiles.length} file(s) selected</span>
            <button
              onClick={() => setSelectedKnowledgeFiles([])}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredKnowledgeBankFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No files found</h3>
            <p className="text-slate-600 max-w-sm">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredKnowledgeBankFiles.map((file) => {
              const isSelected = selectedKnowledgeFiles.includes(file.id)
              return (
                <div
                  key={file.id}
                  onClick={() => handleKnowledgeFileSelect(file.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[#38A1E5] bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  {getSmallFileIcon(file.icon)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      {file.mentorName} - {file.size}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? "border-[#38A1E5] bg-[#38A1E5]" : "border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedKnowledgeFiles.length > 0 && (
        <div className="flex-shrink-0 pt-4 mt-auto flex items-center justify-end gap-3 border-t">
          <Button
            type="button"
            onClick={() => setSelectedKnowledgeFiles([])}
            variant="outline"
            className="px-6 py-2 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddSelectedKnowledgeFiles}
            className="px-6 py-2 bg-[#38A1E5] hover:bg-[#2E8BC7] text-white"
          >
            Add Selected ({selectedKnowledgeFiles.length})
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-4xl w-[calc(100%-32px)] sm:w-[98vw] md:w-[95vw] lg:w-[90vw] h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] p-0 gap-0 overflow-hidden rounded-lg"
          overlayClassName="p-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          hideCloseButton
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isDragOver && (
            <div className="absolute inset-0 bg-[#38A1E5]/10 border-2 border-dashed border-[#38A1E5] rounded-lg z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="mb-4 p-4 rounded-full bg-[#38A1E5] mx-auto w-fit">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <p className="text-[#38A1E5] font-medium text-lg">Drop files to upload</p>
                <p className="text-gray-500 text-sm mt-1">Files will be automatically processed</p>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "knowledge")} className="flex flex-col lg:flex-row h-full">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <DialogHeader className="px-3 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-semibold text-[var(--sidebar-foreground)]">
                    Add Resources
                  </DialogTitle>
                  <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </DialogHeader>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col w-56 min-w-[224px] flex-shrink-0">
              <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 h-[73px] flex justify-between items-center">
                <DialogTitle className="text-lg font-semibold text-[var(--sidebar-foreground)]">
                  Add Resources
                </DialogTitle>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </DialogHeader>
              <TabsList className="flex-col h-auto bg-transparent p-2 space-y-1 w-full">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="w-full justify-start px-4 py-3 text-left text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    <tab.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <div className="flex items-center bg-white border-b border-gray-200">
                <div className="flex-1">
                  <TabsList className="w-full justify-start px-0 py-0 bg-white rounded-none h-auto flex">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap justify-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 hover:text-gray-700 transition-colors flex-1"
                      >
                        <tab.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-200 h-[73px]">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentTabInfo?.label}
                </h2>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <TabsContent value="upload" className="m-0 h-full">
                  {renderUploadTab()}
                </TabsContent>
                <TabsContent value="knowledge" className="m-0 h-full">
                  {renderKnowledgeBank()}
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!fileToDelete} onOpenChange={cancelDelete}>
        <DialogContent className="max-w-sm mx-4 sm:mx-auto gap-3">
          <DialogHeader>
            <DialogTitle className="text-[var(--sidebar-foreground)]">Delete File</DialogTitle>
          </DialogHeader>
          <div className="pt-0 pb-2">
            <p className="text-gray-600">Are you sure you want to delete this file? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
