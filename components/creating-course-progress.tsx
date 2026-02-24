"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CreatingCourseProgressProps {
  courseName: string
  creationStep: 1 | 2 | 3
  creationProgress: number
  completedActions: { label: string; time: string }[]
  /** When true, hide the step block and show executions expanded (course created state) */
  courseCreated?: boolean
}

export function CreatingCourseProgress({
  courseName,
  creationStep,
  creationProgress,
  completedActions,
  courseCreated = false,
}: CreatingCourseProgressProps) {
  const [showExecutions, setShowExecutions] = useState(courseCreated)

  useEffect(() => {
    if (courseCreated) setShowExecutions(true)
  }, [courseCreated])

  return (
    <div className="w-full space-y-6 min-w-0 px-1">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--sidebar-foreground)] break-words">
          {courseName}
        </h1>
        <p className={cn("text-sm mt-1", courseCreated ? "text-[#00A3EC] font-medium" : "text-muted-foreground")}>
          {courseCreated ? "Course created" : "Creating course"}
        </p>
      </div>

      {!courseCreated && (
        <div className="rounded-lg border border-gray-200 p-4 sm:p-6 bg-white shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Step {creationStep}
            <span className="text-muted-foreground font-normal ml-1.5">· Estimated time: 1–2 minutes</span>
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#00A3EC] to-[#6988FF] rounded-full transition-all duration-500"
              style={{ width: `${creationProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Generating a course. Please stay on this page until the course is generated
          </p>
          <p className="text-sm font-medium text-[#00A3EC] mb-2">
            Step 3: Generating course content
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {creationStep === 3 && creationProgress < 100
                ? "Creating course content..."
                : creationProgress >= 100
                  ? "Course content generated"
                  : "Waiting to generate content..."}
            </span>
            {creationStep === 3 && creationProgress < 100 && (
              <div className="w-4 h-4 border-2 border-[#00A3EC] border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>
        </div>
      )}

      {!courseCreated && (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowExecutions(!showExecutions)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 border-b border-gray-200 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {showExecutions ? "Hide" : "Show"} executions
          </span>
          {showExecutions ? (
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
          )}
        </button>
        {showExecutions && (
          <div
            className="p-4 sm:p-6 shadow-sm border-t border-gray-200"
            style={{
              backgroundColor: "#eff6ff",
              borderColor: "#bfdbfe",
            }}
          >
            <div className="flex items-center gap-2 font-semibold text-[var(--sidebar-foreground)] mb-3">
              <Check className="w-5 h-5 text-blue-600 shrink-0" />
              Completed Actions:
            </div>
            <ul className="space-y-2">
              {completedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <span className="text-gray-500">[{action.time}]</span> {action.label}
                  </span>
                </li>
              ))}
            </ul>
            {completedActions.length > 0 && (
              <details className="mt-4">
                <summary className="text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700">
                  View as JSON
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-gray-900 text-gray-100 text-xs overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(completedActions, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  )
}
