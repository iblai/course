"use client"

import { ChevronUp } from "lucide-react"

interface ScrollToTopButtonProps {
  showScrollTop: boolean
  scrollToTop: () => void
}

export function ScrollToTopButton({ showScrollTop, scrollToTop }: ScrollToTopButtonProps) {
  if (!showScrollTop) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  )
}
