"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { FileText, Trash2, Smartphone, Globe, File, FileImage, FileVideo, FileAudio } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OneDriveIcon } from "@/components/icons/svg-icons"
import Image from "next/image"

interface ProjectFile {
  id: string
  name: string
  type: string
  size?: string
  icon: "pdf" | "image" | "document" | "video" | "audio" | "other"
  file?: File
}

interface ProjectFilesModalProps {
  isOpen: boolean
  onClose: () => void
  projectName?: string
  onFilesChange?: (files: ProjectFile[]) => void
}

const getFileTypeFromExtension = (fileName: string): { icon: ProjectFile["icon"]; displayType: string } => {
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

const getFileIcon = (iconType: ProjectFile["icon"]) => {
  const boxClass = "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
  const iconClass = "w-5 h-5 text-blue-600"
  switch (iconType) {
    case "pdf":
      return (
        <div className={boxClass}>
          <FileText className={iconClass} />
        </div>
      )
    case "image":
      return (
        <div className={boxClass}>
          <FileImage className={iconClass} />
        </div>
      )
    case "document":
      return (
        <div className={boxClass}>
          <FileText className={iconClass} />
        </div>
      )
    case "video":
      return (
        <div className={boxClass}>
          <FileVideo className={iconClass} />
        </div>
      )
    case "audio":
      return (
        <div className={boxClass}>
          <FileAudio className={iconClass} />
        </div>
      )
    default:
      return (
        <div className={boxClass}>
          <File className={iconClass} />
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

export function ProjectFilesModal({
  isOpen,
  onClose,
  projectName = "Course - Generative AI For coding",
  onFilesChange,
}: ProjectFilesModalProps) {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = (fileList: File[]) => {
    const newFiles: ProjectFile[] = fileList.map((file, index) => {
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

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleSelectFiles = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || [])
      handleFiles(selectedFiles)
    }
    input.click()
  }

  const handleImportOption = (option: string) => {
    console.log("Import from:", option)
    // TODO: Handle different import options
  }

  const handleDeleteFile = (fileId: string) => {
    setFileToDelete(fileId)
  }

  const confirmDelete = () => {
    if (fileToDelete) {
      const updatedFiles = files.filter((file) => file.id !== fileToDelete)
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
      setFileToDelete(null)
    }
  }

  const cancelDelete = () => {
    setFileToDelete(null)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="gap-3 max-h-[85vh] flex flex-col overflow-hidden"
          maxWidth="400px"
        >
          <DialogHeader>
            <DialogTitle className="text-left text-[var(--sidebar-foreground)]">Project files</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-3 overflow-y-auto min-h-0 flex-1">
            {files.length === 0 ? (
              // Empty State
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragOver ? "border-[#CBD0DC] bg-[#F5F8FF]" : "border-[#CBD0DC] bg-[#F5F8FF]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p className="text-sm text-gray-600 mb-2">Drag and drop your files here</p>
                <p className="text-xs text-gray-500 mb-4">or</p>

                <div className="flex flex-col gap-3 mb-4">
                  <Button
                    onClick={handleSelectFiles}
                    className="bg-[#38A1E5] hover:bg-[#2E8BC7] text-white w-full"
                  >
                    Select Files
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-gray-700 border-gray-300 bg-transparent w-full"
                      >
                        Import Files
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                      <DropdownMenuItem onClick={() => handleImportOption("phone")}>
                        <Smartphone className="mr-2 h-4 w-4" />
                        Upload from phone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleImportOption("google-drive")}>
                        <Image
                          src="/icons/google-drive.svg"
                          alt="Google Drive"
                          width={20}
                          height={20}
                          className="mr-2 h-4 w-4"
                        />
                        Google Drive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleImportOption("onedrive")}>
                        <OneDriveIcon className="mr-2 h-4 w-4" />
                        Microsoft OneDrive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleImportOption("website")}>
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-xs text-gray-500">
                  Add documents, code files, images, and more. <span className="font-semibold">{projectName}</span> can
                  access their contents when you chat inside the project.
                </p>
              </div>
            ) : (
              // Files State
              <>
                <div
                  className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                    isDragOver ? "border-[#CBD0DC] bg-[#F5F8FF]" : "border-[#CBD0DC] bg-[#F5F8FF]"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <p className="text-sm text-gray-600 mb-1">Drag and drop or</p>
                  <Button
                    onClick={handleSelectFiles}
                    variant="outline"
                    size="sm"
                    className="mb-2 text-gray-700 border-gray-300"
                  >
                    Select Files
                  </Button>
                </div>

                {/* Files List */}
                <div className="space-y-0 max-h-64 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      className={`group flex items-center gap-3 p-2.5 border border-gray-200 hover:bg-gray-50 transition-colors ${
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
                        <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                        <p className="text-xs text-gray-500">{file.type}{file.size ? ` · ${file.size}` : ""}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFile(file.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <DialogContent className="w-full gap-3" maxWidth="400px">
          <DialogHeader>
            <DialogTitle className="text-left text-[var(--sidebar-foreground)]">Delete File</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-left pt-0 pb-2">
            Are you sure you want to delete this file? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white hover:opacity-90 hover:text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
