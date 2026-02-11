"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Upload, X, ArrowLeft, Globe } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

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

  const addFilesToSources = useCallback(
    (files: FileList | null, closeAfterAdd = false) => {
      if (!files?.length) return
      const newSources: SelectedSource[] = Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: getExtension(file.name) || "FILE",
        file,
      }))
      setSelectedSources((prev) => {
        const combined = [...prev, ...newSources]
        if (closeAfterAdd) {
          onSourcesSelected?.(combined)
          onOpenChange(false)
        }
        return combined
      })
    },
    [onSourcesSelected, onOpenChange],
  )

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
        addFilesToSources(e.dataTransfer.files, true)
      }
    },
    [addFilesToSources],
  )

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFilesToSources(e.target.files, true)
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

  const iconCls = "h-5 w-5 shrink-0 object-contain"
  const itemIconCls = "h-4 w-4 shrink-0 object-contain"
  const iconDir = "/icons/add-source-dialog"

  const sourceOptions = [
    {
      title: "Google Workspace",
      icon: <Image src={`${iconDir}/google-workspace.svg`} alt="" width={20} height={20} className={iconCls} />,
      items: [
        {
          name: "Google Drive",
          icon: <Image src={`${iconDir}/google-drive.svg`} alt="" width={16} height={16} className={itemIconCls} />,
          action: () => console.log("Google Drive clicked"),
        },
      ],
    },
    {
      title: "Microsoft OneDrive",
      icon: <Image src={`${iconDir}/onedrive.svg`} alt="" width={20} height={20} className={iconCls} />,
      items: [
        {
          name: "OneDrive",
          icon: <Image src={`${iconDir}/onedrive-item.svg`} alt="" width={16} height={16} className={itemIconCls} />,
          action: () => console.log("OneDrive clicked"),
        },
      ],
    },
    {
      title: "Upload from phone",
      icon: <Image src={`${iconDir}/smartphone.svg`} alt="" width={20} height={20} className={iconCls} />,
      items: [
        {
          name: "Scan QR Code",
          icon: <Image src={`${iconDir}/qr-code.svg`} alt="" width={16} height={16} className={itemIconCls} />,
          action: () => console.log("Scan QR Code clicked"),
        },
      ],
    },
    {
      title: "Link",
      icon: <Image src={`${iconDir}/link.svg`} alt="" width={20} height={20} className={iconCls} />,
      items: [
        {
          name: "Website",
          icon: <Image src={`${iconDir}/globe.svg`} alt="" width={16} height={16} className={itemIconCls} />,
          action: () => setCurrentView("website-urls"),
        },
        {
          name: "YouTube",
          icon: <Image src={`${iconDir}/youtube.svg`} alt="" width={16} height={16} className={itemIconCls} />,
          action: () => setCurrentView("youtube-url"),
        },
      ],
    },
    {
      title: "Paste text",
      icon: <Image src={`${iconDir}/clipboard.svg`} alt="" width={20} height={20} className={iconCls} />,
      items: [
        {
          name: "Copied text",
          icon: <Image src={`${iconDir}/clipboard.svg`} alt="" width={16} height={16} className={itemIconCls} />,
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
            type="button"
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
          </div>
          <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-2 mb-3 min-h-[1.5rem]">
                  <span className="flex shrink-0 items-center justify-center text-[#38A1E5] [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-[#38A1E5] [&>img]:h-5 [&>img]:w-5 [&>img]:object-contain [&>img]:[filter:brightness(0)_saturate(100%)_invert(67%)_sepia(52%)_saturate(1023%)_hue-rotate(182deg)_brightness(95%)_contrast(91%)]">
                    {option.icon}
                  </span>
                  <span className="font-medium text-slate-600">{option.title}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-[#38A1E5]/10 text-[#38A1E5] hover:bg-[#38A1E5]/20 transition-colors"
                    >
                      <span className="flex shrink-0 items-center justify-center text-[#38A1E5] [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#38A1E5] [&>img]:h-4 [&>img]:w-4 [&>img]:object-contain [&>img]:[filter:brightness(0)_saturate(100%)_invert(67%)_sepia(52%)_saturate(1023%)_hue-rotate(182deg)_brightness(95%)_contrast(91%)]">
                        {item.icon}
                      </span>
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
