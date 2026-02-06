"use client"

import { MentorGridSection } from "@/components/mentor-grid-section"

const mentorCategories = [
  {
    category: "AI, Data & Digital Literacy",
    mentors: [
      {
        id: 1,
        title: "Artificial Intelligence for Business Leaders",
        avatar: "/images/mentor1.webp",
        initials: "AI",
      },
      {
        id: 2,
        title: "Prompt Engineering & Applied Generative AI",
        avatar: "/images/mentor2.webp",
        initials: "PE",
      },
      {
        id: 3,
        title: "Data Analytics & Visualization with Excel and Power BI",
        avatar: "/images/mentor3.webp",
        initials: "DA",
      },
      {
        id: 4,
        title: "Machine Learning for Decision-Makers",
        avatar: "/images/mentor4.webp",
        initials: "ML",
      },
      {
        id: 5,
        title: "Digital Transformation Strategy",
        avatar: "/images/mentor5.webp",
        initials: "DT",
      },
    ],
  },
]

interface ForYouGridProps {
  onInstructorClick?: (mentor: { name: string; image: string }) => void
}

export function ForYouGrid({ onInstructorClick }: ForYouGridProps) {
  return <MentorGridSection mentorCategories={mentorCategories} onInstructorClick={onInstructorClick} />
}
