"use client"

import type React from "react"
import { useState, createContext, useContext, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

// Create a context for tooltip provider (to match shadcn/ui API)
const TooltipProviderContext = createContext<{ delayDuration?: number }>({})

interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
}

export function TooltipProvider({ children, delayDuration = 300 }: TooltipProviderProps) {
  return <TooltipProviderContext.Provider value={{ delayDuration }}>{children}</TooltipProviderContext.Provider>
}

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: "top" | "right" | "bottom" | "left"
  className?: string
  delay?: number
}

export function TooltipFlowbite({ content, children, position = "top", className, delay }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const context = useContext(TooltipProviderContext)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if device is mobile/touch
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Use delay from props or context
  const effectiveDelay = delay ?? context.delayDuration ?? 300

  const calculatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const gap = 8

    let top = 0
    let left = 0

    switch (position) {
      case "top":
        top = rect.top - gap
        left = rect.left + rect.width / 2
        break
      case "right":
        top = rect.top + rect.height / 2
        left = rect.right + gap
        break
      case "bottom":
        top = rect.bottom + gap
        left = rect.left + rect.width / 2
        break
      case "left":
        top = rect.top + rect.height / 2
        left = rect.left - gap
        break
    }

    setTooltipPosition({ top, left })
  }

  const showTooltip = () => {
    calculatePosition()
    const id = setTimeout(() => {
      setIsVisible(true)
    }, effectiveDelay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const handleClick = () => {
    // Hide tooltip on click for mobile devices
    if (isMobile) {
      hideTooltip()
    }
  }

  const getTransformStyle = () => {
    switch (position) {
      case "top":
        return "translateX(-50%) translateY(-100%)"
      case "right":
        return "translateY(-50%)"
      case "bottom":
        return "translateX(-50%)"
      case "left":
        return "translateX(-100%) translateY(-50%)"
      default:
        return ""
    }
  }

  const arrowPositionClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent",
  }

  const tooltipContent = isVisible && isMounted ? (
    createPortal(
      <div
        style={{
          position: "fixed",
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: getTransformStyle(),
          zIndex: 99999,
        }}
        className={cn(
          "px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm transition-opacity duration-300 whitespace-nowrap pointer-events-none",
          className,
        )}
      >
        {content}
        <div className={cn("absolute w-0 h-0 border-4", arrowPositionClasses[position])}></div>
      </div>,
      document.body
    )
  ) : null

  return (
    <div ref={triggerRef} className="relative inline-flex items-center justify-center" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onClick={handleClick}>
      {children}
      {tooltipContent}
    </div>
  )
}

// Additional exports to match shadcn/ui tooltip API if needed
export const Tooltip = TooltipFlowbite
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
