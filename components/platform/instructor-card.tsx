import Link from "next/link"

interface InstructorCardProps {
  title: string
  image: string
}

export function InstructorCard({ title, image }: InstructorCardProps) {
  return (
    <Link href="#" className="group">
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow h-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 bg-accent flex-shrink-0">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>
        <h4 className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors leading-tight">
          {title}
        </h4>
      </div>
    </Link>
  )
}
