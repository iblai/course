"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Search, Check, X } from "lucide-react"
import type { SkillsSlideProps } from "./skills-slide/types"
import { skills, RATING_LEVELS } from "./skills-slide/utils"
import { themeConfig } from "@/config/theme"

export default function SkillsSlide({
  onNext,
  onPrev,
  searchQuery,
  setSearchQuery,
  selectedSkills,
  toggleSkill,
  skillRatings,
  setSkillRating,
  getSkillRating,
}: SkillsSlideProps) {
  const filteredSkills = skills.filter(
    (skill) => searchQuery === "" || skill.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <motion.div
      key="slide3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br z-0"
        style={{
          background: `linear-gradient(to bottom right, ${themeConfig.colors.accent.light}20, ${themeConfig.colors.accent.DEFAULT}10)`,
        }}
      ></div>

      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-x-20 -translate-y-20 z-0"
        style={{ backgroundColor: `${themeConfig.colors.accent.light}15` }}
      ></div>

      <div
        className="relative z-10 p-6 sm:p-8 md:p-12 max-h-[70vh] overflow-y-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-600 text-center mb-6 sm:mb-8">
          Add Skills to Your Profile
        </h2>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a skill"
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={
              {
                "--tw-ring-color": themeConfig.colors.primary.DEFAULT,
                "--tw-ring-opacity": "0.5",
              } as React.CSSProperties
            }
          />
        </div>

        <p className="text-sm font-medium text-gray-500 mb-4">{selectedSkills.length} Selected Skills</p>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <button
                key={index}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[5px] text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedSkills.includes(skill)
                    ? "border text-gray-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-100 border border-transparent"
                }`}
                style={{
                  borderColor: selectedSkills.includes(skill) ? themeConfig.colors.primary.DEFAULT : "transparent",
                  backgroundColor: selectedSkills.includes(skill)
                    ? `${themeConfig.colors.primary.DEFAULT}10`
                    : undefined,
                }}
                onClick={() => toggleSkill(skill)}
              >
                {selectedSkills.includes(skill) && <Check className="h-3 w-3 inline mr-1" />}
                {skill}
              </button>
            ))
          ) : (
            <div className="w-full text-center py-4">
              <p className="text-gray-500">No skills found matching your search.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 hover:opacity-80"
                style={{ color: themeConfig.colors.primary.DEFAULT }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-4">Self Rate Your Skills</h3>

          {selectedSkills.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
                <div className="col-span-3 text-sm font-medium text-gray-600">Skill</div>
                <div className="col-span-4 text-sm font-medium text-gray-600">Self Rating</div>
                <div className="col-span-3 text-sm font-medium text-gray-600">Source</div>
                <div className="col-span-2 text-sm font-medium text-gray-600 text-right">Remove</div>
              </div>

              {/* Mobile List View / Desktop Grid View */}
              {selectedSkills.map((skill, index) => {
                const currentRating = getSkillRating(skill)
                const ratingLabel = currentRating
                  ? RATING_LEVELS[currentRating as keyof typeof RATING_LEVELS]
                  : "NOT RATED"

                return (
                  <div
                    key={index}
                    className={`sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center p-4 ${
                      index !== selectedSkills.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    {/* Mobile View - List Item */}
                    <div className="flex flex-col sm:hidden">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">★</span>
                          <span className="text-sm font-medium text-gray-800">{skill}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600" onClick={() => toggleSkill(skill)}>
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mb-2">
                        <div className="text-xs font-medium text-gray-500 mb-1">Self Rating</div>
                        <div className="flex items-center">
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  currentRating === rating
                                    ? "text-white"
                                    : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                }`}
                                style={{
                                  backgroundColor:
                                    currentRating === rating ? themeConfig.colors.primary.DEFAULT : undefined,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSkillRating(skill, rating)
                                }}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{ratingLabel}</div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Source</div>
                        <div className="text-sm text-gray-600">Added Skill</div>
                      </div>
                    </div>

                    {/* Desktop View - Grid Layout */}
                    <div className="hidden sm:flex sm:col-span-3 items-center">
                      <span className="text-gray-400 mr-2">★</span>
                      <span className="text-sm font-medium text-gray-800">{skill}</span>
                    </div>

                    <div className="hidden sm:block sm:col-span-4">
                      <div className="flex items-center">
                        <div className="flex space-x-4">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                currentRating === rating ? "text-white" : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                              }`}
                              style={{
                                backgroundColor:
                                  currentRating === rating ? themeConfig.colors.primary.DEFAULT : undefined,
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSkillRating(skill, rating)
                              }}
                              title={RATING_LEVELS[rating as keyof typeof RATING_LEVELS]}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{ratingLabel}</div>
                    </div>

                    <div className="hidden sm:block sm:col-span-3 text-sm text-gray-600">Added Skill</div>

                    <div className="hidden sm:block sm:col-span-2 text-right">
                      <button className="text-gray-400 hover:text-gray-600" onClick={() => toggleSkill(skill)}>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600 mb-2">No skills selected yet</p>
              <p className="text-xs text-gray-500">Select skills above to rate your proficiency</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
