import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Statistics Fundamentals",
    image: "/placeholder.svg?height=200&width=300",
    level: "Beginner",
    category: "COURSE",
  },
  {
    id: 2,
    title: "Probability Theory",
    image: "/placeholder.svg?height=200&width=300",
    level: "Intermediate",
    category: "COURSE",
  },
  {
    id: 3,
    title: "Mathematical Modeling",
    image: "/placeholder.svg?height=200&width=300",
    level: "Advanced",
    category: "COURSE",
  },
  {
    id: 4,
    title: "Data Analysis",
    image: "/placeholder.svg?height=200&width=300",
    level: "Beginner",
    category: "COURSE",
  },
]

export function FeaturedCourses() {
  return (
    <section id="courses" className="py-20 lg:py-28 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-balance">
            No need of a custom learning plan?
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Select one of these courses to start your learning journey today
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-[var(--border-color)] hover:border-[var(--primary-color)]/30 bg-[var(--card-bg)]"
            >
              <div className="relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute bottom-3 left-3 bg-brand-gradient text-white border-0">
                  {course.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1">{course.level}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="gap-2 bg-transparent border-[var(--border-color)] text-text-primary hover:bg-accent-blue hover:text-brand-primary"
          >
            View More Courses
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
