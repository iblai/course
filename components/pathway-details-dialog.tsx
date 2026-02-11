"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, CheckCircle2 } from "lucide-react"

interface PathwayCourse {
  id: string
  title: string
  duration: string
  completed: boolean
}

interface Pathway {
  id: string
  title: string
  description?: string
  progress: number
  totalCourses: number
  completedCourses: number
  courses?: PathwayCourse[]
}

interface PathwayDetailsDialogProps {
  pathway: Pathway | null
  isOpen: boolean
  onClose: () => void
}

export function PathwayDetailsDialog({ pathway, isOpen, onClose }: PathwayDetailsDialogProps) {
  if (!pathway) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg gap-3">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[var(--sidebar-foreground)]">{pathway.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-0">
          {pathway.description && <p className="text-sm text-gray-600">{pathway.description}</p>}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{pathway.progress}%</span>
            </div>
            <Progress value={pathway.progress} className="h-2" />
            <p className="text-xs text-gray-500">
              {pathway.completedCourses} of {pathway.totalCourses} courses completed
            </p>
          </div>

          {pathway.courses && pathway.courses.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Courses</h4>
              <div className="space-y-2">
                {pathway.courses.map((course) => (
                  <div
                    key={course.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      course.completed ? "bg-green-50 border-green-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {course.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={course.completed ? "text-gray-600" : ""}>{course.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1">Continue Learning</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
