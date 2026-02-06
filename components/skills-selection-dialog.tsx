"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import Image from "next/image"

interface SkillsSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: (selections: SkillsSelections) => void
  initialSelections?: Partial<SkillsSelections>
  showHeader?: boolean
  logoSrc?: string
  logoText?: string
}

export interface SkillsSelections {
  subjects: string[]
  goals: string[]
  certificateChoice: string
  educationLevel: string
  courseFormats: string[]
}

const subjects = [
  "Art, Design & Architecture",
  "Business & Management",
  "Data Science, Analytics & Computer Technology",
  "Education & Teaching",
  "Energy, Climate & Sustainability",
  "Engineering",
  "Health & Medicine",
  "Humanities",
  "Innovation & Entrepreneurship",
  "Science & Math",
  "Social Sciences",
]

const learningGoals = [
  {
    title: "Academic Boost",
    description: "Support my degree studies with supplemental learning.",
  },
  {
    title: "Career Growth",
    description: "Advance my career through new skills and certifications.",
  },
  {
    title: "Lifelong Learning",
    description: "Learn about topics that spark my curiosity.",
  },
]

const certificateOptions = ["Yes, I am looking for a certificate", "No, I am not looking for a certificate", "Not Sure"]

const educationOptions = [
  "High School",
  "Some College",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
  "Professional Degree",
]

const formatOptions = ["Online", "In-Person", "Hybrid", "Offline"]

export function SkillsSelectionDialog({
  open,
  onOpenChange,
  onComplete,
  initialSelections,
  showHeader = true,
  logoSrc = "/images/skillsAI-logo.webp",
  logoText = "SkillsAI",
}: SkillsSelectionDialogProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSelections?.subjects || [])
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialSelections?.goals || [])
  const [certificateChoice, setCertificateChoice] = useState<string>(initialSelections?.certificateChoice || "")
  const [educationLevel, setEducationLevel] = useState<string>(initialSelections?.educationLevel || "")
  const [courseFormats, setCourseFormats] = useState<string[]>(initialSelections?.courseFormats || [])

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentSlide(0)
      setSelectedSubjects(initialSelections?.subjects || [])
      setSelectedGoals(initialSelections?.goals || [])
      setCertificateChoice(initialSelections?.certificateChoice || "")
      setEducationLevel(initialSelections?.educationLevel || "")
      setCourseFormats(initialSelections?.courseFormats || [])
    }
  }, [open, initialSelections])

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal))
    } else {
      setSelectedGoals([...selectedGoals, goal])
    }
  }

  const toggleFormat = (format: string) => {
    if (courseFormats.includes(format)) {
      setCourseFormats(courseFormats.filter((f) => f !== format))
    } else {
      setCourseFormats([...courseFormats, format])
    }
  }

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1)
    } else {
      // Complete
      onComplete?.({
        subjects: selectedSubjects,
        goals: selectedGoals,
        certificateChoice,
        educationLevel,
        courseFormats,
      })
      onOpenChange(false)
    }
  }

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slideTitle = [
    "What are you interested in learning about?",
    "What are your learning goals?",
    "Are you seeking a certificate?",
    "What is your current level of education?",
    "What course format are you interested in?",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="p-4 max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px] w-full h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] border-0 rounded-xl overflow-hidden bg-white flex flex-col [&>button]:hidden">
          {/* Header */}
          {showHeader && (
            <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex-shrink-0">
              <div className="w-8" /> {/* Spacer for centering */}
              <div className="flex items-center gap-2">
                <Image
                  src={logoSrc || "/placeholder.svg"}
                  alt={logoText}
                  width={28}
                  height={28}
                  className="w-6 h-6 md:w-7 md:h-7"
                />
                <span
                  className="text-lg md:text-xl font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #38A1E5, #7284FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {logoText}
                </span>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </header>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Progress Bar */}
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-8 md:mb-12">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`w-10 md:w-16 h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                      currentSlide >= index ? "" : "bg-gray-300"
                    }`}
                    style={currentSlide >= index ? { background: "linear-gradient(135deg, #38A1E5, #7284FF)" } : {}}
                  />
                ))}
                <span className="ml-2 md:ml-4 text-xs md:text-sm" style={{ color: "#616A76" }}>
                  {currentSlide + 1}/5
                </span>
              </div>

              {/* Title */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-4 px-4" style={{ color: "#616A76" }}>
                  {slideTitle[currentSlide]}
                </h1>
                {(currentSlide === 0 || currentSlide === 1 || currentSlide === 4) && (
                  <p className="text-sm md:text-base" style={{ color: "#616A76" }}>
                    Select all that apply:
                  </p>
                )}
              </div>

              {/* Slides Container */}
              <div className="w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {/* Slide 0: Subjects */}
                  <div className="w-full flex-shrink-0 px-2 md:px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12 max-w-6xl mx-auto">
                      {subjects.map((subject) => (
                        <div
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-colors bg-white ${
                            selectedSubjects.includes(subject)
                              ? "border-blue-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm font-medium mr-1" style={{ color: "#616A76" }}>
                              {subject}
                            </span>
                            <div
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                                selectedSubjects.includes(subject) ? "border-transparent" : "border-gray-300"
                              }`}
                              style={
                                selectedSubjects.includes(subject)
                                  ? { background: "linear-gradient(135deg, #38A1E5, #7284FF)" }
                                  : {}
                              }
                            >
                              {selectedSubjects.includes(subject) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide 1: Learning Goals */}
                  <div className="w-full flex-shrink-0 px-2 md:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12 max-w-4xl mx-auto">
                      {learningGoals.map((goal) => (
                        <div
                          key={goal.title}
                          onClick={() => toggleGoal(goal.title)}
                          className={`border rounded-lg p-4 md:p-6 cursor-pointer transition-colors bg-white ${
                            selectedGoals.includes(goal.title)
                              ? "border-blue-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-sm md:text-base font-semibold pr-2" style={{ color: "#374151" }}>
                              {goal.title}
                            </h3>
                            <div
                              className={`min-w-[20px] w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                                selectedGoals.includes(goal.title) ? "border-transparent" : "border-gray-300"
                              }`}
                              style={
                                selectedGoals.includes(goal.title)
                                  ? { background: "linear-gradient(135deg, #38A1E5, #7284FF)" }
                                  : {}
                              }
                            >
                              {selectedGoals.includes(goal.title) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            {goal.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide 2: Certificate */}
                  <div className="w-full flex-shrink-0 px-2 md:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12 max-w-4xl mx-auto">
                      {certificateOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => setCertificateChoice(option)}
                          className={`border rounded-lg p-4 md:p-6 cursor-pointer transition-colors bg-white ${
                            certificateChoice === option ? "border-blue-500" : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className="text-xs md:text-sm font-medium leading-relaxed"
                              style={{ color: "#616A76" }}
                            >
                              {option}
                            </span>
                            <div
                              className={`min-w-[20px] w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                                certificateChoice === option ? "border-transparent" : "border-gray-300"
                              }`}
                              style={
                                certificateChoice === option
                                  ? { background: "linear-gradient(135deg, #38A1E5, #7284FF)" }
                                  : {}
                              }
                            >
                              {certificateChoice === option && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide 3: Education Level */}
                  <div className="w-full flex-shrink-0 px-2 md:px-4">
                    <div className="max-w-2xl mx-auto mb-8 md:mb-12">
                      <div className="relative">
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-xs md:text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
                          style={{ color: "#616A76" }}
                        >
                          <option value="">Please Select</option>
                          {educationOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Slide 4: Course Format */}
                  <div className="w-full flex-shrink-0 px-2 md:px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12 max-w-4xl mx-auto">
                      {formatOptions.map((format) => (
                        <div
                          key={format}
                          onClick={() => toggleFormat(format)}
                          className={`border rounded-lg p-4 md:p-6 cursor-pointer transition-colors bg-white ${
                            courseFormats.includes(format) ? "border-blue-500" : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 md:gap-3">
                            <span
                              className="text-xs md:text-sm font-medium leading-relaxed"
                              style={{ color: "#374151" }}
                            >
                              {format}
                            </span>
                            <div
                              className={`min-w-[20px] w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                                courseFormats.includes(format) ? "border-transparent" : "border-gray-300"
                              }`}
                              style={
                                courseFormats.includes(format)
                                  ? { background: "linear-gradient(135deg, #38A1E5, #7284FF)" }
                                  : {}
                              }
                            >
                              {courseFormats.includes(format) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-center gap-4 px-4 md:px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
            <button
              onClick={handleBack}
              disabled={currentSlide === 0}
              className={`flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-lg border transition-colors ${
                currentSlide === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #38A1E5, #7284FF)" }}
            >
              <span className="text-sm font-medium">{currentSlide === 4 ? "Finish" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
