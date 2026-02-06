"use client"

import Image from "next/image"

interface NavigationBarProps {
  showNavBar: boolean
  activeSection: string
  scrollToWatch: () => void
  scrollToPricing: () => void
  scrollToFAQ: () => void
  scrollToTop: () => void
}

export function NavigationBar({ showNavBar, scrollToWatch, scrollToFAQ, scrollToTop }: NavigationBarProps) {
  if (!showNavBar) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={scrollToTop} className="flex items-center gap-2">
          <Image
            src="/images/iblai-academy-logo.png"
            alt="ibl.ai university"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg bg-gradient-to-r from-[#38A1E5] to-[#0078FF] bg-clip-text text-transparent">
            ibl.ai university
          </span>
        </button>
        <div className="flex items-center gap-6">
          <button onClick={scrollToWatch} className="text-gray-600 hover:text-blue-500 transition-colors">
            Features
          </button>
          <button onClick={scrollToFAQ} className="text-gray-600 hover:text-blue-500 transition-colors">
            FAQ
          </button>
          <button
            onClick={scrollToTop}
            className="bg-gradient-to-r from-[#BACEFF] to-[#0078FF] text-white px-4 py-2 rounded-lg hover:from-[#A9BDFF] hover:to-[#0069E0] transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
