"use client"

import { AlertTriangle } from "lucide-react"

export default function CourseProgressPage() {
  const course = {
    grade: 75,
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className="border rounded-md p-6 mb-8"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        <h2 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
          Grades
        </h2>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          This represents your weighted grade against the grade needed to pass this course.
        </p>
        <div className="relative w-full rounded-full h-2.5 mb-4" style={{ backgroundColor: "var(--hover-bg)" }}>
          <div
            className="absolute top-0 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 shadow-md mt-1"
            style={{
              left: `${Math.min(100, Math.max(0, course.grade))}%`,
              top: "1px",
              borderColor: "var(--primary-color)",
            }}
          ></div>
          <div className="h-2.5 rounded-full" style={{ width: `${course.grade}%`, background: "var(--gradient-bg)" }}></div>
        </div>
      </div>
      <div
        className="border-l-4 p-4 mt-12"
        style={{
          backgroundColor: "var(--accent-color)",
          borderLeftColor: "var(--primary-color)",
        }}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5" style={{ color: "var(--warning-color, #f59e0b)" }} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Warning</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Your grade is below the passing threshold. Please review the course materials and complete additional
              assignments to improve your understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
