import { Suspense } from "react"
import CourseDetailsContent from "./course-details-content"

export default function CourseDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-white items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CourseDetailsContent />
    </Suspense>
  )
}
