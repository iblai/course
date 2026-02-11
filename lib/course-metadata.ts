/**
 * Course metadata by id for clean URLs. Used by course details, schedule, edit.
 * Kept in sync with courses list (app/courses, course-catalog) for known ids.
 */
const COURSE_METADATA: Record<number, { title: string; image: string }> = {
  1: {
    title: "Greenland's Historical Ties: An insightful Perspective on Origins and U.S. Involvement",
    image: "/images/course-1.png",
  },
  2: {
    title: "Evaluating the Impact of Trump Administration Policies: An Economic Perspective",
    image: "/images/course-2.png",
  },
  3: { title: "Introduction to Debian for Beginners", image: "/images/course-3.png" },
  4: { title: "Debian for Beginners: An Introductory Guide 9", image: "/images/data-driven-decision.png" },
  5: { title: "Advanced Introduction to Debian for Beginners II", image: "/images/team-performance.png" },
  6: { title: "Integrating MySQL with Django: A Comprehensive Guide", image: "/images/leadership-is-language.png" },
  7: { title: "Essential Ubuntu Linux Administration for Beginners", image: "/images/leadership-development.png" },
  8: { title: "Introduction to Debian Linux Administration", image: "/images/strategic-leadership.png" },
  9: { title: "Mastering AI Prompt Engineering: A Comprehensive Guide", image: "/images/teamwork-growth.png" },
  10: { title: "AI in Academia: Driving Innovation and Efficiency", image: "/images/coaching-culture.png" },
  11: { title: "AI to Empower Students with Hyper-Personalized Learning", image: "/images/course-1.png" },
  12: { title: "AI in Autonomous Vehicles: Driving the Future", image: "/images/course-2.png" },
  13: { title: "Managing Cybersecurity Incident Response", image: "/images/course-3.png" },
}

const DEFAULT_IMAGES = ["/images/course-1.png", "/images/course-2.png", "/images/course-3.png", "/images/course-4.png"]

export function getCourseMetadata(courseId: string): { title: string; image: string } {
  const id = parseInt(courseId, 10)
  const meta = Number.isNaN(id) ? null : COURSE_METADATA[id]
  const defaultImage =
    Number.isNaN(id) || id < 1 ? DEFAULT_IMAGES[0] : DEFAULT_IMAGES[(id - 1) % DEFAULT_IMAGES.length]
  return {
    title: meta?.title ?? "Course Title",
    image: meta?.image ?? defaultImage,
  }
}
