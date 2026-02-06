import { ForYouGrid } from "@/components/for-you-grid"

interface InstructorsSectionProps {
  onInstructorClick?: (mentor: { name: string; image: string }) => void
}

export function InstructorsSection({ onInstructorClick }: InstructorsSectionProps) {
  return <ForYouGrid onInstructorClick={onInstructorClick} />
}
