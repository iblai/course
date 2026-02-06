"use client"
import Image from "next/image"
import { X, Clock } from "lucide-react"

interface PathwayDetailModalProps {
  pathway: {
    id: number
    title: string
    image: string
    progress: number
  }
  onClose: () => void
}

export function PathwayDetailModal({ pathway, onClose }: PathwayDetailModalProps) {
  // Sample courses for the pathway
  const courses = [
    {
      id: 1,
      title: "Introduction to " + pathway.title,
      duration: "30 minutes",
      completed: true,
    },
    {
      id: 2,
      title: "Core Concepts of " + pathway.title,
      duration: "45 minutes",
      completed: pathway.progress >= 30,
    },
    {
      id: 3,
      title: "Advanced " + pathway.title + " Techniques",
      duration: "60 minutes",
      completed: pathway.progress >= 60,
    },
    {
      id: 4,
      title: pathway.title + " in Practice",
      duration: "50 minutes",
      completed: pathway.progress >= 90,
    },
  ]

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div 
        className="bg-white rounded-lg max-w-2xl w-full flex flex-col h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh]"
        style={{ maxHeight: "-webkit-fill-available" }}
      >
        {/* Fixed Header */}
        <div
          className="p-4 border-b rounded-t-lg flex justify-between items-center flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          <h3 className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            Pathway Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="relative h-48 w-full overflow-hidden rounded-lg mb-6 border" style={{ borderColor: "var(--border-color)" }}>
            <Image
              src={pathway.image || "/images/skills-icon.webp"}
              alt={pathway.title}
              fill
              className="object-cover"
            />
            <div 
              className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              PATHWAY
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{pathway.title}</h2>

          <div 
            className="p-4 rounded-lg mb-6 border"
            style={{ backgroundColor: "var(--accent-color)", borderColor: "var(--border-color)" }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "var(--text-secondary)" }}>Progress</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{pathway.progress}%</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: "var(--border-color)" }}>
              <div 
                className="h-2 rounded-full transition-all" 
                style={{ width: `${pathway.progress}%`, backgroundColor: "var(--primary-color)" }}
              ></div>
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: "var(--border-color)" }}>
            <h4 className="text-sm font-medium mb-4" style={{ color: "var(--text-secondary)" }}>Courses in this Pathway</h4>

            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
                  <div 
                    className="px-4 py-3 border-b"
                    style={{ backgroundColor: "var(--accent-color)", borderColor: "var(--border-color)" }}
                  >
                    <h3 className="text-md font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                      <Clock className="h-4 w-4" style={{ color: "var(--primary-color)" }} />
                      Course {course.id}
                    </h3>
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <div 
                      className="w-24 h-16 flex-shrink-0 rounded-md overflow-hidden border"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <Image
                        src="/images/skills-icon.webp"
                        alt={course.title}
                        width={96}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm" style={{ color: "var(--primary-color)" }}>{course.title}</h4>
                      <div className="flex items-center text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            course.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {course.completed ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div
          className="p-4 rounded-b-lg border-t flex justify-end gap-3 flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          {pathway.progress === 0 ? (
            <button 
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: "var(--gradient-bg)" }}
            >
              Enroll Now
            </button>
          ) : (
            <button 
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: "var(--gradient-bg)" }}
            >
              Continue Learning
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border rounded-md text-sm font-medium hover:opacity-80 transition-colors shadow-sm"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
