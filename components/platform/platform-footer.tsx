"use client"

import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FloatingMicrophoneButton } from "@/components/accessibility/floating-microphone-button"
import { FloatingAccessibilityButton } from "@/components/accessibility/floating-accessibility-button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const HIDE_VOICE_AND_ACCESSIBILITY_BUTTONS = true

export function PlatformFooter({
  hideFloatingButtons = HIDE_VOICE_AND_ACCESSIBILITY_BUTTONS,
  promptBarVisible = false,
}: { hideFloatingButtons?: boolean; promptBarVisible?: boolean }) {
  const pathname = usePathname()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256) // default expanded width (w-64 = 256px)
  const isChatListView = pathname === "/chat"
  useEffect(() => {
    const checkChatState = () => {
      const chatOpen = getComputedStyle(document.documentElement).getPropertyValue("--chat-open").trim()
      setIsChatOpen(chatOpen === "1")
    }

    checkChatState()

    const observer = new MutationObserver(checkChatState)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const checkSidebarWidth = () => {
      const sidebar = document.querySelector('[data-sidebar="true"]') || document.getElementById('main-sidebar')
      if (sidebar) {
        setSidebarWidth(sidebar.clientWidth)
      }
    }

    checkSidebarWidth()

    // Listen for sidebar width changes
    const resizeObserver = new ResizeObserver(checkSidebarWidth)
    const sidebar = document.querySelector('[data-sidebar="true"]') || document.getElementById('main-sidebar')
    if (sidebar) {
      resizeObserver.observe(sidebar)
    }

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 border-t border-border bg-card z-30 pb-[env(safe-area-inset-bottom)]"
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-sm text-text-secondary">
          <div className="hidden sm:flex items-center gap-4">
            <Link href="#" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/os-logo.png"
              alt="OS"
              width={80}
              height={22}
              className="h-5 w-auto"
            />
            <span>ibl.ai OS</span>
          </div>
        </div>
      </div>

      {!isChatOpen &&
        !hideFloatingButtons &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={cn(
              "fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none [&>*]:pointer-events-auto",
              (isChatListView || promptBarVisible) && "max-[1200px]:hidden"
            )}
          >
            <FloatingMicrophoneButton />
            <FloatingAccessibilityButton />
          </div>,
          document.body
        )}
    </footer>
  )
}
