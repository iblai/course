export interface SkillsSlideProps {
  onNext: () => void
  onPrev: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedSkills: string[]
  toggleSkill: (skill: string) => void
  skillRatings: Record<string, number>
  setSkillRating: (skill: string, rating: number) => void
  getSkillRating: (skill: string) => number | undefined
}

export interface RoleSelectionProps {
  onNext: () => void
  onPrev: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedRoles: string[]
  toggleRole: (role: string) => void
}

export interface FinalSlideProps {
  handleGetStarted: () => void
  onClose?: () => void
}
