"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Mentor {
  id: number
  title: string
  avatar: string
  initials: string
}

interface MentorCategory {
  category: string
  mentors: Mentor[]
}

interface MentorGridSectionProps {
  mentorCategories: MentorCategory[]
  onInstructorClick?: (mentor: { name: string; image: string }) => void
}

export function MentorGridSection({ mentorCategories, onInstructorClick }: MentorGridSectionProps) {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dimensions, setDimensions] = useState({
    containerWidth: 0,
    cardWidth: 180,
    cardHeight: 180,
    cardsPerRow: 5,
    gridGap: 12,
    stackedSpacing: 50,
  })

  // Calculate dimensions based on container width
  const updateDimensions = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const availableWidth = container.offsetWidth
    const minCardWidth = 140
    const maxCardWidth = 200
    const minGap = 10
    const maxGap = 14

    // Calculate optimal cards per row based on available width
    let cardsPerRow = 5
    if (availableWidth < 400) {
      cardsPerRow = 2
    } else if (availableWidth < 600) {
      cardsPerRow = 3
    } else if (availableWidth < 900) {
      cardsPerRow = 4
    } else {
      cardsPerRow = 5
    }

    // Calculate card width to fill available space
    const gap = availableWidth < 600 ? minGap : maxGap
    const totalGapWidth = (cardsPerRow - 1) * gap
    let cardWidth = Math.floor((availableWidth - totalGapWidth) / cardsPerRow)
    
    // Clamp card width
    cardWidth = Math.max(minCardWidth, Math.min(maxCardWidth, cardWidth))
    
    // Card height proportional to width
    const cardHeight = Math.floor(cardWidth * 1.1)
    
    // Stacked spacing scales with card size
    const stackedSpacing = Math.floor(cardWidth * 0.28)

    setDimensions({
      containerWidth: availableWidth,
      cardWidth,
      cardHeight,
      cardsPerRow,
      gridGap: gap,
      stackedSpacing,
    })
  }, [])

  useEffect(() => {
    updateDimensions()
    
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener("resize", updateDimensions)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateDimensions)
    }
  }, [updateDimensions])

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionTop = rect.top

      const startExpand = windowHeight * 0.8
      const expandDistance = windowHeight * 0.4

      let progress = 0
      if (sectionTop < startExpand) {
        const scrolledIntoSection = startExpand - sectionTop
        progress = Math.min(scrolledIntoSection / expandDistance, 1)
      }

      // Ease in-out quad
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setScrollProgress(Math.max(0, Math.min(1, easedProgress)))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { cardWidth, cardHeight, cardsPerRow, gridGap, stackedSpacing, containerWidth } = dimensions

  // Check if mobile (2 cards per row means we show 4 total in 2 rows)
  const isMobile = cardsPerRow === 2
  const totalCardsToShow = isMobile ? 4 : cardsPerRow

  // Prepare category rows with limited mentors
  const categoryRows = mentorCategories.map((categoryGroup) => {
    const limitedMentors = categoryGroup.mentors.slice(0, totalCardsToShow)
    return {
      category: categoryGroup.category,
      mentors: limitedMentors,
    }
  })

  return (
    <section ref={sectionRef} className="w-full px-4 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-14 overflow-hidden">
      <div ref={containerRef} className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="h-px bg-gradient-to-r from-transparent to-gray-300 flex-1 max-w-[80px] sm:max-w-[200px]" />
          <h2 className="text-gray-800 bg-gray-100 text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-4 sm:px-8 rounded-full whitespace-nowrap">
            Instructors
          </h2>
          <div className="h-px bg-gradient-to-l from-transparent to-gray-300 flex-1 max-w-[80px] sm:max-w-[200px]" />
        </div>

        {/* Categories */}
        <div className="space-y-8 sm:space-y-12">
          {categoryRows.map((categoryGroup) => {
            const mentors = categoryGroup.mentors
            const numCards = mentors.length

            // Calculate number of rows needed
            const numRows = Math.ceil(numCards / cardsPerRow)
            const cardsInFirstRow = Math.min(numCards, cardsPerRow)

            // Calculate stacked dimensions (initial state) - only stack cards from first row
            const stackedWidth = (cardsInFirstRow - 1) * stackedSpacing + cardWidth
            const centerIdx = (cardsInFirstRow - 1) / 2
            const maxStackedYOffset = Math.max(...Array.from({ length: cardsInFirstRow }, (_, i) => Math.abs(i - centerIdx) * 8))
            const stackedHeight = cardHeight + maxStackedYOffset

            // Calculate expanded dimensions (final state) - grid with multiple rows
            const expandedWidth = cardsInFirstRow * cardWidth + (cardsInFirstRow - 1) * gridGap
            const expandedHeight = numRows * cardHeight + (numRows - 1) * gridGap

            // Interpolate between stacked and expanded
            const currentWidth = stackedWidth + (expandedWidth - stackedWidth) * scrollProgress
            const currentHeight = stackedHeight + (expandedHeight - stackedHeight) * scrollProgress

            // Ensure we don't exceed container width
            const maxWidth = Math.min(currentWidth, containerWidth)

            return (
              <div key={categoryGroup.category}>
                <h3 className="text-sm sm:text-base font-bold text-[#616a76] mb-3 sm:mb-4 text-center">
                  {categoryGroup.category}
                </h3>
                
                <div
                  className="relative mx-auto"
                  style={{
                    width: `${maxWidth}px`,
                    height: `${currentHeight}px`,
                  }}
                >
                  {mentors.map((mentor, index) => {
                    // Determine which row/col this card belongs to in expanded grid
                    const rowIndex = Math.floor(index / cardsPerRow)
                    const colIndex = index % cardsPerRow
                    const cardsInThisRow = Math.min(cardsPerRow, numCards - rowIndex * cardsPerRow)
                    const rowCenterIndex = (cardsInThisRow - 1) / 2

                    // For stacked view, only first row cards are visible initially
                    const isFirstRow = rowIndex === 0
                    const stackedCenterIndex = (cardsInFirstRow - 1) / 2

                    // Stacked position (fan effect) - cards from other rows start hidden behind
                    const stackedRotation = isFirstRow ? (colIndex - stackedCenterIndex) * 4 : 0
                    const stackedXOffset = isFirstRow ? (colIndex - stackedCenterIndex) * stackedSpacing : 0
                    const stackedYOffset = isFirstRow ? Math.abs(colIndex - stackedCenterIndex) * 8 : 0

                    // Grid position (expanded) - proper row/col layout
                    const gridRotation = 0
                    const gridXOffset = (colIndex - rowCenterIndex) * (cardWidth + gridGap)
                    const gridYOffset = rowIndex * (cardHeight + gridGap)

                    // Interpolate
                    const rotation = stackedRotation + (gridRotation - stackedRotation) * scrollProgress
                    const xOffset = stackedXOffset + (gridXOffset - stackedXOffset) * scrollProgress
                    const yOffset = stackedYOffset + (gridYOffset - stackedYOffset) * scrollProgress
                    
                    // Z-index: first row cards on top when stacked, all equal when expanded
                    const stackedZIndex = isFirstRow ? cardsInFirstRow - Math.abs(colIndex - stackedCenterIndex) : 0
                    const expandedZIndex = 1
                    const zIndex = Math.round(stackedZIndex + (expandedZIndex - stackedZIndex) * scrollProgress)
                    
                    // Opacity: cards not in first row fade in as we expand
                    const opacity = isFirstRow ? 1 : scrollProgress

                    // Scale avatar based on card size
                    const avatarSize = Math.floor(cardWidth * 0.45)

                    return (
                      <Card
                        key={mentor.id}
                        className="group cursor-pointer overflow-hidden border-0 transition-shadow duration-300 absolute flex flex-col items-center justify-center text-center bg-white"
                        style={{
                          width: `${cardWidth}px`,
                          height: `${cardHeight}px`,
                          left: "50%",
                          top: 0,
                          transform: `translateX(calc(-50% + ${xOffset}px)) translateY(${yOffset}px) rotate(${rotation}deg)`,
                          zIndex,
                          opacity,
                          transformOrigin: "center center",
                          willChange: scrollProgress > 0 && scrollProgress < 1 ? "transform, opacity" : "auto",
                          boxShadow: "0 2px 16px 0 rgba(0, 0, 0, 0.08)",
                          padding: `${cardWidth * 0.1}px`,
                        }}
                        onClick={() => {
                          if (onInstructorClick) {
                            onInstructorClick({ name: mentor.title, image: mentor.avatar })
                          } else {
                            router.push("/login")
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(0, 0, 0, 0.12)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(0, 0, 0, 0.08)"
                        }}
                      >
                        <Avatar 
                          className="ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-blue-100 transition-all mb-2 sm:mb-3"
                          style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
                        >
                          <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.title} />
                          <AvatarFallback className="bg-slate-50 text-gray-700 font-semibold text-xs sm:text-sm">
                            {mentor.initials}
                          </AvatarFallback>
                        </Avatar>
                        <p 
                          className="font-medium text-[#616a76] line-clamp-2 sm:line-clamp-3 leading-tight transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#38A1E5] group-hover:to-[#7284FF] group-hover:bg-clip-text group-hover:text-transparent px-1"
                          style={{ fontSize: cardWidth < 160 ? '10px' : '12px' }}
                        >
                          {mentor.title}
                        </p>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* More Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/instructors">
            <Button
              variant="outline"
              className="text-brand-primary border-brand-primary hover:bg-accent-blue px-6 sm:px-8 text-sm bg-transparent"
            >
              More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
