"use client"

import * as React from "react"
import { CLOSE_LEARNER_TOOL_SIDEBARS_EVENT } from "@/lib/sidebar-events"

const STORAGE_KEY = "ibl.voice-sidebar-open"

function readStoredOpen(): boolean {
  if (typeof window === "undefined") return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function writeStoredOpen(open: boolean) {
  try {
    if (open) sessionStorage.setItem(STORAGE_KEY, "1")
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore quota / private mode */
  }
}

type VoiceSidebarContextValue = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const VoiceSidebarContext = React.createContext<VoiceSidebarContextValue | null>(null)

export function VoiceSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpenState] = React.useState(false)

  React.useEffect(() => {
    setIsOpenState(readStoredOpen())
  }, [])

  const setOpen = React.useCallback((open: boolean) => {
    setIsOpenState(open)
    writeStoredOpen(open)
  }, [])

  const toggle = React.useCallback(() => {
    setIsOpenState((prev) => {
      const next = !prev
      writeStoredOpen(next)
      return next
    })
  }, [])

  React.useEffect(() => {
    const onCloseLearnerToolSidebars = () => setOpen(false)
    window.addEventListener(CLOSE_LEARNER_TOOL_SIDEBARS_EVENT, onCloseLearnerToolSidebars)
    return () => window.removeEventListener(CLOSE_LEARNER_TOOL_SIDEBARS_EVENT, onCloseLearnerToolSidebars)
  }, [setOpen])

  const value = React.useMemo(() => ({ isOpen, setOpen, toggle }), [isOpen, setOpen, toggle])

  return <VoiceSidebarContext.Provider value={value}>{children}</VoiceSidebarContext.Provider>
}

export function useVoiceSidebar() {
  const ctx = React.useContext(VoiceSidebarContext)
  if (!ctx) {
    throw new Error("useVoiceSidebar must be used within VoiceSidebarProvider")
  }
  return ctx
}
