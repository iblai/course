import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function FeaturedCourse() {
  return (
    <section className="space-y-4">
      <h2 className="text-center text-lg font-semibold text-text-primary">
        Please start with this custom course, part of your new learning path
      </h2>

      <div className="bg-card rounded-xl border border-border p-3 shadow-sm max-w-xl mx-auto">
        {/* Course Image */}
        <div className="relative rounded-lg overflow-hidden mb-3">
          <img
            src="/images/course-1.png"
            alt="Data analytics and statistics course thumbnail"
            className="w-full h-40 sm:h-52 object-cover"
          />
          <span className="absolute bottom-3 left-3 px-3 py-1 bg-brand-gradient text-white text-sm font-medium rounded-sm">
            Beginner
          </span>
        </div>

        {/* Course Details */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Here&apos;s a friendly path to learn:</p>
          <ul className="space-y-1 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>In this course you will understand...</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>What the faith really is</span>
            </li>
          </ul>

          {/* Start Learning Link */}
          <div className="flex justify-end pt-2">
            <Link
              href="/custom-course"
              className="inline-flex items-center gap-1.5 text-brand-primary hover:text-primary-dark font-medium text-sm transition-colors"
            >
              Start learning
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
