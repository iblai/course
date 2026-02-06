import { Button } from "@/components/ui/button"
import { CourseCard } from "./course-card"
import Link from "next/link"

const courses = [
  {
    id: 1,
    title: "Statistics Fundamentals",
    image: "/images/course-1.png",
    type: "COURSE",
  },
  {
    id: 2,
    title: "Probability Theory",
    image: "/images/course-2.png",
    type: "COURSE",
  },
  {
    id: 3,
    title: "Mathematical Modeling",
    image: "/images/course-3.png",
    type: "COURSE",
  },
  {
    id: 4,
    title: "Data Analysis",
    image: "/images/course-4.png",
    type: "COURSE",
  },
]

interface CoursesGridProps {
  isLoggedIn?: boolean
}

export function CoursesGrid({ isLoggedIn = true }: CoursesGridProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-center text-lg font-semibold text-text-primary">Select one of these courses to start</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <div key={course.id}>
            <CourseCard {...course} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href="/courses">
          <Button
            variant="outline"
            size="sm"
            className="text-brand-primary border-brand-primary hover:bg-accent-blue px-4 bg-transparent"
          >
            More
          </Button>
        </Link>
      </div>
    </section>
  )
}
