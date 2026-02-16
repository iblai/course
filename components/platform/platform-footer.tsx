"use client"

import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { FloatingMicrophoneButton } from "@/components/accessibility/floating-microphone-button"
import { FloatingAccessibilityButton } from "@/components/accessibility/floating-accessibility-button"
import { useEffect, useState } from "react"

export function PlatformFooter() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256) // default expanded width (w-64 = 256px)
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 text-sm text-text-secondary">
          <div className="hidden sm:flex items-center gap-4">
            <Link href="#" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <Image
              src="/images/iblai-logo.png"
              alt="ibl.ai"
              width={80}
              height={24}
              className="w-auto h-[18px] mb-1.5"
            />
          </div>
        </div>
      </div>

      {!isChatOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-6 right-6 hidden md:flex flex-col gap-3 z-50 pointer-events-none [&>*]:pointer-events-auto">
            <FloatingMicrophoneButton />
            <FloatingAccessibilityButton />
          </div>,
          document.body
        )}
    </footer>
  )
}
