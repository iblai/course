"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export function WatchSection() {
  return (
    <section id="watch-section" className="bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[var(--sidebar-foreground)] leading-tight lg:text-5xl">
                <span className="block">Create engaging</span>
                <span className="block">courses</span>
                <span className="block">
                  in <span className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent font-bold">minutes</span>
                </span>
              </h1>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-gradient-to-r from-[#00A3EC] to-[#6988FF]">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--sidebar-foreground)] text-lg">Personalized content based on learning goals</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-gradient-to-r from-[#00A3EC] to-[#6988FF]">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--sidebar-foreground)] text-lg">AI-powered content and curriculum creation</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-gradient-to-r from-[#00A3EC] to-[#6988FF]">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--sidebar-foreground)] text-lg">24/7 support and development assistance</p>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="pt-4">
              <Button className="bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90 text-white border-0 px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative flex items-center justify-center">
            {/* Video Container - YouTube 16:9 size (e.g. 640×360) */}
            <div
              className="relative w-full max-w-[640px] aspect-video flex items-center justify-center overflow-hidden mx-4 shadow-sm"
              style={{
                background: "linear-gradient(135deg, rgba(0,163,236,0.09) 0%, rgba(105,136,255,0.09) 100%)",
                borderRadius: "35px",
                borderBottomLeftRadius: "35px",
                borderBottomRightRadius: "70px",
              }}
            >
              {/* Play Button - Positioned on Left Top */}
              <button
                className="absolute left-4 sm:left-8 top-4 sm:top-8 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10"
                style={{ border: "2px solid #C1C5C3" }}
              >
                <div
                  className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-700 flex items-center justify-center"
                  style={{
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    marginLeft: "2px",
                  }}
                ></div>
              </button>

              {/* Vertical Logo - Centered with proper spacing */}
              <div className="flex flex-col items-center justify-center px-8 sm:px-12 md:px-16 gap-3">
                <Image
                  src="/images/skillsAI-logo.webp"
                  alt="Ibl.ai Wink"
                  width={80}
                  height={32}
                  className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
                />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent">
                  Ibl.ai Wink
                </span>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-12 h-12 sm:w-20 sm:h-20 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
