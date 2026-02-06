"use client"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/accessibility-context"
import Image from "next/image"
import { AccessibilityToolbar } from "./accessibility-toolbar"

export function FloatingAccessibilityButton() {
  const { isToolbarOpen, setIsToolbarOpen } = useAccessibility()

  return (
    <>
      <Button
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        className="h-14 w-14 rounded-full bg-[#5bc5f2] hover:bg-[#3db8ed] shadow-lg transition-all duration-200 hover:scale-105"
        size="icon"
        aria-label="Open Accessibility Menu"
      >
        <Image
          src="/icons/accessibility-icon.svg"
          alt="Accessibility"
          width={32}
          height={32}
          className="brightness-0 invert"
        />
      </Button>

      <AccessibilityToolbar />
    </>
  )
}

export default FloatingAccessibilityButton
