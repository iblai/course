"use client"

import { Calendar, CalendarCheck, CalendarDays, CalendarRange, BookOpen, GraduationCap, FileCheck } from "lucide-react"
import { useParams } from "next/navigation"

export default function DatesTab() {
  const params = useParams<{ id: string }>()
  // Mock course data
  const importantDates = [
    {
      date: "Wed, Jan 31, 2024",
      title: "Course starts",
      description: "Welcome to ITIL 4 Foundation. Course materials will be available from this date.",
      isPast: true,
      icon: "BookOpen",
    },
    {
      date: "Fri, Feb 16, 2024",
      title: "Assignment 1 due",
      description: "Submit your first homework assignment by 11:59 PM.",
      isPast: true,
      icon: "FileCheck",
    },
    {
      date: "Mon, Mar 11, 2024",
      title: "Midterm exam",
      description: "Online proctored exam covering modules 1-3. Duration: 90 minutes.",
      isPast: true,
      icon: "FileCheck",
    },
    {
      date: "Sun, Apr 27, 2025",
      title: "Today",
      description: "Current date",
      isToday: true,
      icon: "CalendarDays",
    },
    {
      date: "Fri, May 10, 2025",
      title: "Assignment 2 due",
      description: "Submit your second homework assignment by 11:59 PM.",
      isPast: false,
      icon: "FileCheck",
    },
    {
      date: "Mon, Jun 3, 2025",
      title: "Final exam",
      description: "Comprehensive final exam covering all course material. Duration: 120 minutes.",
      isPast: false,
      icon: "GraduationCap",
    },
    {
      date: "Fri, Jun 14, 2025",
      title: "Course ends",
      description: "Last day to complete all course requirements and submit any outstanding work.",
      isPast: false,
      icon: "CalendarCheck",
    },
  ]

  // Function to get the appropriate icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="h-5 w-5" />
      case "FileCheck":
        return <FileCheck className="h-5 w-5" />
      case "CalendarDays":
        return <CalendarDays className="h-5 w-5" />
      case "GraduationCap":
        return <GraduationCap className="h-5 w-5" />
      case "CalendarCheck":
        return <CalendarCheck className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-medium text-gray-700 mb-6 text-xl">Dates</h1>

      <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {importantDates.map((event, index) => (
              <div key={index} className="relative pl-14">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 w-12 h-12 rounded-full flex items-center justify-center ${
                    event.isToday
                      ? "bg-[var(--accent-light)]"
                      : event.isPast
                        ? "bg-gray-100"
                        : "bg-[var(--accent-light)]"
                  }`}
                >
                  <div
                    className={`${
                      event.isToday ? "text-[var(--primary)]" : event.isPast ? "text-gray-500" : "text-[var(--primary)]"
                    }`}
                  >
                    {getIconComponent(event.icon)}
                  </div>
                </div>

                {/* Date badge */}
                <div className="flex items-center mb-1">
                  <h3 className="font-medium text-gray-800 text-base">{event.date}</h3>
                  {event.isToday && (
                    <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded bg-[var(--accent-light)] text-[var(--primary)]">
                      Today
                    </span>
                  )}
                </div>

                {/* Event details */}
                <div className={`${event.isToday ? "text-[var(--primary)]" : "text-gray-700"} font-medium`}>
                  {event.title}
                </div>
                <p className="text-gray-600 mt-1">{event.description}</p>

                {/* Add to calendar button for future events */}
                {!event.isPast && !event.isToday && (
                  <button className="mt-2 inline-flex items-center text-sm hover:opacity-80 text-[var(--primary)]">
                    <CalendarRange className="h-4 w-4 mr-1" />
                    Add to calendar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
