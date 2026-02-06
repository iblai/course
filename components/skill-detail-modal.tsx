"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface SkillRating {
  level: number
  description: string
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "Basic understanding of fundamentals; requires significant guidance.",
  2: "Familiar with core concepts; can complete routine tasks with some supervision.",
  3: "Capable of managing varied tasks; understands nuances but may seek guidance for complexities.",
  4: "Proficient with advanced concepts; can work independently on complex tasks.",
  5: "Expert level mastery; can innovate and teach others in this domain.",
}

interface SkillDetailModalProps {
  open: boolean
  skill: {
    id?: string
    name: string
    level?: number
    starred?: boolean
  } | null
  onClose: () => void
  onRatingChange?: (rating: number) => void
  onDelete?: () => void
  onDeleteSkill?: () => void
  onConfirm?: () => void
}

export function SkillDetailModal({ open, skill, onClose, onRatingChange, onDelete, onDeleteSkill, onConfirm }: SkillDetailModalProps) {
  const [originalRating] = useState<number>(skill?.level || 1)
  const [tempRating, setTempRating] = useState<number>(skill?.level || 1)

  useEffect(() => {
    setTempRating(skill?.level || 1)
  }, [skill])

  const handleDelete = onDelete || onDeleteSkill
  const handleTempRatingChange = (rating: number) => {
    setTempRating(rating)
  }

  const handleConfirm = () => {
    if (onRatingChange && tempRating !== originalRating) {
      onRatingChange(tempRating)
    }

    if (onConfirm) {
      onConfirm()
    }

    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!open || !skill) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div 
        className="bg-white rounded-lg max-w-md w-full flex flex-col h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh]"
        style={{ maxHeight: "-webkit-fill-available" }}
      >
        {/* Header with close button */}
        <div
          className="p-4 border-b flex justify-between items-center flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          <h3 className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            <span className="hidden md:block">Rate your expertise in "{skill.name}"</span>
            <span className="block md:hidden">{skill.name}</span>
          </h3>
          <button
            onClick={handleCancel}
            className="rounded-full p-1 hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Rating Scale */}
          <div className="mb-8">
            <div className="relative mb-10 pt-3">
              {/* Track background */}
              <div className="h-2 rounded-full" style={{ backgroundColor: "var(--accent-color)" }}></div>

              {/* Rating markers - positioned at 0%, 25%, 50%, 75%, and 100% */}
              {[1, 2, 3, 4, 5].map((rating) => {
                const position = ((rating - 1) / 4) * 100
                return (
                  <div
                    key={rating}
                    onClick={() => handleTempRatingChange(rating)}
                    className={`absolute top-3 -mt-1 -ml-2 w-4 h-4 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                      rating <= tempRating ? "border-white" : "bg-white"
                    }`}
                    style={{
                      left: `${position}%`,
                      backgroundColor: rating <= tempRating ? "var(--primary-color)" : "white",
                      borderColor: rating <= tempRating ? "white" : "var(--border-color)",
                    }}
                  />
                )
              })}

              {/* Filled track - positioned to match exactly with the current rating dot */}
              <div
                className="absolute top-3 left-0 h-2 rounded-full transition-all duration-200"
                style={{
                  background: "var(--gradient-bg)",
                  width:
                    tempRating === 1
                      ? "0%" // For rating 1, don't show any filled track
                      : `${((tempRating - 1) / 4) * 100}%`, // For other ratings, fill to the dot
                }}
              ></div>

              {/* Rating numbers - positioned at the same positions as the markers */}
              {[1, 2, 3, 4, 5].map((rating) => {
                const position = ((rating - 1) / 4) * 100
                return (
                  <div
                    key={`label-${rating}`}
                    onClick={() => handleTempRatingChange(rating)}
                    className={`absolute top-7 -ml-2 text-center w-4 cursor-pointer transition-all duration-200`}
                    style={{ left: `${position}%` }}
                  >
                    <span
                      className={`text-sm font-medium`}
                      style={{
                        color: rating === tempRating ? "var(--primary-color)" : "var(--text-muted)",
                      }}
                    >
                      {rating}
                    </span>
                  </div>
                )
              })}

              {/* Slider thumb - positioned based on current rating */}
              <div
                className="absolute top-3 -mt-2 -ml-3 w-6 h-6 rounded-full border-2 border-white shadow-md transition-all duration-200"
                style={{
                  left: `${((tempRating - 1) / 4) * 100}%`,
                  background: "var(--gradient-bg)",
                }}
              ></div>

              {/* Hidden input for accessibility and interaction */}
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={tempRating}
                onChange={(e) => handleTempRatingChange(Number.parseInt(e.target.value))}
                className="absolute top-2 w-full h-4 opacity-0 cursor-pointer z-10"
                style={{ margin: 0, padding: 0 }}
                aria-label="Skill rating"
              />
            </div>

            <div className="flex justify-between mt-4 text-sm font-medium">
              <span style={{ color: "var(--text-secondary)" }}>Beginner</span>
              <span style={{ color: "var(--primary-color)" }}>Level {tempRating}</span>
              <span style={{ color: "var(--text-secondary)" }}>Expert</span>
            </div>
          </div>

          {/* Rating Circle */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-20 h-20 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={`${(100 - ((tempRating || 1) / 5) * 100) * 2.512}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: "var(--text-secondary)" }}>
                  {tempRating}
                </span>
              </div>
            </div>
            <p className="text-center text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
              {RATING_DESCRIPTIONS[tempRating]}
            </p>
          </div>
        </div>

        {/* Footer with buttons */}
        <div
          className="p-4 border-t flex justify-between flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:opacity-80 transition-colors"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-secondary)",
                backgroundColor: "white",
              }}
            >
              Cancel
            </button>
            {handleDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 border rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                style={{ borderColor: "var(--border-color)" }}
              >
                Delete skill
              </button>
            )}
          </div>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md text-sm font-medium transition-all ${
              tempRating !== originalRating ? "animate-pulse hover:opacity-90" : "hover:opacity-90"
            }`}
            style={{ background: "var(--gradient-bg)" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
