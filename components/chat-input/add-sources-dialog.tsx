"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Upload, Globe, Link2, ClipboardPaste, Plus, X, ArrowLeft, Smartphone } from "lucide-react"
import Image from "next/image"
import { Progress } from "../ui/progress"

type DialogView = "main" | "website-urls" | "youtube-url" | "copied-text"

export interface SelectedSource {
  id: string
  name: string
  type: string
  file?: File
}

interface AddSourcesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileInputTrigger: () => void
  sourceCount?: number
  maxSources?: number
  onSourcesSelected?: (sources: SelectedSource[]) => void
}

export function AddSourcesDialog({
  open,
  onOpenChange,
  onFileInputTrigger,
  sourceCount = 0,
  maxSources = 300,
  onSourcesSelected,
}: AddSourcesDialogProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentView, setCurrentView] = useState<DialogView>("main")
  const [urlInput, setUrlInput] = useState("")
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("")
  const [copiedTextInput, setCopiedTextInput] = useState("")
  const [selectedSources, setSelectedSources] = useState<SelectedSource[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      setCurrentView("main")
      setUrlInput("")
      setYoutubeUrlInput("")
      setCopiedTextInput("")
      setSelectedSources([])
    }
  }, [open])

  const getExtension = (name: string) => {
    const parts = name.split(".")
    return parts.length > 1 ? parts.pop()?.toUpperCase() ?? "" : ""
  }

  const addFilesToSources = useCallback((files: FileList | null) => {
    if (!files?.length) return
    const newSources: SelectedSource[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: getExtension(file.name) || "FILE",
      file,
    }))
    setSelectedSources((prev) => [...prev, ...newSources])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFilesToSources(e.dataTransfer.files)
      }
    },
    [addFilesToSources],
  )

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFilesToSources(e.target.files)
    e.target.value = ""
  }

  const handleClose = () => {
    onSourcesSelected?.(selectedSources)
    onOpenChange(false)
  }

  const handleInsertUrls = () => {
    if (urlInput.trim()) {
      console.log("Inserting URLs:", urlInput)
      onOpenChange(false)
    }
  }

  const handleInsertYoutubeUrl = () => {
    if (youtubeUrlInput.trim()) {
      console.log("Inserting YouTube URL:", youtubeUrlInput)
      onOpenChange(false)
    }
  }

  const handleInsertCopiedText = () => {
    if (copiedTextInput.trim()) {
      console.log("Inserting copied text:", copiedTextInput)
      onOpenChange(false)
    }
  }

  const sourceOptions = [
    {
      title: "Google Workspace",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      items: [
        {
          name: "Google Drive",
          icon: <Image src="/icons/google-drive.svg" alt="Google Drive" width={16} height={16} />,
          action: () => console.log("Google Drive clicked"),
        },
      ],
    },
    {
      title: "Microsoft OneDrive",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#0078D4"
            d="M10.5 18.5h8.25a3.75 3.75 0 0 0 .75-7.43 5.25 5.25 0 0 0-9.97-1.57A4.5 4.5 0 0 0 4.5 14a4.5 4.5 0 0 0 4.5 4.5h1.5z"
          />
          <path
            fill="#0364B8"
            d="M10.5 18.5h8.25a3.75 3.75 0 0 0 .75-7.43 5.25 5.25 0 0 0-4.76-3.82 6 6 0 0 0-11.24 3 4.5 4.5 0 0 0 1.5 8.75h5.5z"
          />
          <path
            fill="#1490DF"
            d="M6.75 18.5h12a3.75 3.75 0 0 0 .75-7.43A5.25 5.25 0 0 0 9.75 9a6 6 0 0 0-5.54 3.66A4.5 4.5 0 0 0 6.75 18.5z"
          />
        </svg>
      ),
      items: [
        {
          name: "OneDrive",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M10.5 18.5h8.25a3.75 3.75 0 0 0 .75-7.43 5.25 5.25 0 0 0-9.97-1.57A4.5 4.5 0 0 0 4.5 14a4.5 4.5 0 0 0 4.5 4.5h1.5z"
              />
            </svg>
          ),
          action: () => console.log("OneDrive clicked"),
        },
      ],
    },
    {
      title: "Upload from phone",
      icon: <Smartphone className="h-5 w-5 text-muted-foreground" />,
      items: [
        {
          name: "Scan QR Code",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="14" width="3" height="3" />
              <rect x="14" y="18" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
          ),
          action: () => console.log("Scan QR Code clicked"),
        },
      ],
    },
    {
      title: "Link",
      icon: <Link2 className="h-5 w-5 text-muted-foreground" />,
      items: [
        {
          name: "Website",
          icon: <Globe className="h-4 w-4" />,
          action: () => setCurrentView("website-urls"),
        },
        {
          name: "YouTube",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          ),
          action: () => setCurrentView("youtube-url"),
        },
      ],
    },
    {
      title: "Paste text",
      icon: <ClipboardPaste className="h-5 w-5 text-muted-foreground" />,
      items: [
        {
          name: "Copied text",
          icon: <ClipboardPaste className="h-4 w-4" />,
          action: () => setCurrentView("copied-text"),
        },
      ],
    },
  ]

  if (!open) return null

  const youtubeUrlContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={handleClose} />
      <div 
        className="relative bg-background rounded-lg shadow-xl w-full max-w-5xl h-[calc(100dvh-2rem)] sm:h-auto sm:max-h-[90vh] flex flex-col z-[100] border"
        style={{
          maxHeight: 'calc(100dvh - max(2rem, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 2rem))',
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("main")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-600">YouTube URL</h2>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[400px] sm:min-h-[450px]">
          <p className="text-sm text-muted-foreground mb-4">Paste in a YouTube URL below to upload as a source.</p>
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-muted-foreground shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              <input
                type="text"
                value={youtubeUrlInput}
                onChange={(e) => setYoutubeUrlInput(e.target.value)}
                placeholder="Paste YouTube URL*"
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-600 mb-2">Notes</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Only the text transcript will be imported at this moment</li>
              <li>Only public YouTube videos are supported</li>
              <li>Recently uploaded videos may not be available to import</li>
              <li>
                If upload fails,{" "}
                <a href="#" className="underline hover:text-foreground">
                  learn more
                </a>{" "}
                for common reasons.
              </li>
            </ul>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg flex justify-end">
          <Button
            onClick={handleInsertYoutubeUrl}
            disabled={!youtubeUrlInput.trim()}
            className="bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  )

  const websiteUrlsContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={handleClose} />
      <div 
        className="relative bg-background rounded-lg shadow-xl w-full max-w-5xl h-[calc(100dvh-2rem)] sm:h-auto sm:max-h-[90vh] flex flex-col z-[100] border"
        style={{
          maxHeight: 'calc(100dvh - max(2rem, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 2rem))',
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("main")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-600">Website URLs</h2>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[400px] sm:min-h-[450px]">
          <p className="text-sm text-muted-foreground mb-4">Paste in Web URLs below to upload as sources.</p>
          <div className="border border-border rounded-lg p-4 min-h-[200px] sm:min-h-[280px]">
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste URLs*"
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm min-h-[180px] sm:min-h-[250px] placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-600 mb-2">Notes</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>To add multiple URLs, separate with a space or new line.</li>
              <li>Only the visible text on the website will be imported.</li>
              <li>Paid articles are not supported.</li>
            </ul>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg flex justify-end">
          <Button
            onClick={handleInsertUrls}
            disabled={!urlInput.trim()}
            className="bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  )

  const copiedTextContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={handleClose} />
      <div 
        className="relative bg-background rounded-lg shadow-xl w-full max-w-5xl h-[calc(100dvh-2rem)] sm:h-auto sm:max-h-[90vh] flex flex-col z-[100] border"
        style={{
          maxHeight: 'calc(100dvh - max(2rem, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 2rem))',
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("main")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-600">Paste copied text</h2>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[400px] sm:min-h-[450px]">
          <p className="text-sm text-muted-foreground mb-4">Paste your copied text below to upload as a source.</p>
          <div className="border border-border rounded-lg p-4 min-h-[300px] sm:min-h-[350px]">
            <textarea
              value={copiedTextInput}
              onChange={(e) => setCopiedTextInput(e.target.value)}
              placeholder="Paste text here*"
              className="w-full h-full bg-transparent border-none outline-none resize-none text-sm min-h-[280px] sm:min-h-[330px] placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg flex justify-end">
          <Button
            onClick={handleInsertCopiedText}
            disabled={!copiedTextInput.trim()}
            className="bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  )

  const mainContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={handleClose} />
      <div 
        className="relative bg-background rounded-lg shadow-xl w-full max-w-5xl h-[calc(100dvh-2rem)] sm:h-auto sm:max-h-[90vh] flex flex-col z-[100] border"
        style={{
          maxHeight: 'calc(100dvh - max(2rem, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 2rem))',
        }}
      >
        <div className="flex items-start justify-between p-4 sm:p-6 border-b">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-600">Add sources</h2>
            </div>
            <p className="text-sm text-muted-foreground">Get started by selecting sources</p>
            <Button
              variant="outline"
              size="sm"
              className="flex sm:hidden text-[#38A1E5] border-[#38A1E5]/30 hover:bg-[#38A1E5]/5 w-fit bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to knowledge bank
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-[#38A1E5] border-[#38A1E5]/30 hover:bg-[#38A1E5]/5 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to knowledge bank
            </Button>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 sm:p-12 transition-colors mb-4 ${
              isDragOver ? "border-[#38A1E5] bg-[#38A1E5]/5" : "border-border hover:border-muted-foreground/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleChooseFile}
          >
            <div className="flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#38A1E5] flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-medium mb-4 text-slate-600">Upload sources</h3>
              <p className="text-sm text-muted-foreground/70 max-w-md">
                Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3), .docx, .avif, .bmp, .gif, .ico, .jp2, .png,
                .webp, .tif, .tiff, .heic, .heif, .jpeg, .jpg, .jpe
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {sourceOptions.map((option) => (
              <div key={option.title} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {option.icon}
                  <span className="font-medium text-slate-600">{option.title}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-[#38A1E5]/10 text-[#38A1E5] hover:bg-[#38A1E5]/20 transition-colors"
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/50 rounded-b-lg">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.txt,.md,audio/*,.docx,.avif,.bmp,.gif,.ico,.jp2,.png,.webp,.tif,.tiff,.heic,.heif,.jpeg,.jpg,.jpe"
            onChange={handleFileInputChange}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              Source limit
            </div>
            <div className="flex-1">
              <Progress value={(sourceCount / maxSources) * 100} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground shrink-0">
              {sourceCount} / {maxSources}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const dialogContent =
    currentView === "youtube-url"
      ? youtubeUrlContent
      : currentView === "website-urls"
        ? websiteUrlsContent
        : currentView === "copied-text"
          ? copiedTextContent
          : mainContent

  return isMounted ? createPortal(dialogContent, document.body) : null
}
