import Link from "next/link"

interface CourseCardProps {
  id: number
  title: string
  image: string
  type: string
  isLoggedIn?: boolean
}

export function CourseCard({ id, title, image, type, isLoggedIn = false }: CourseCardProps) {
  const href = isLoggedIn
    ? `/course/${id}?loggedIn=true&image=${encodeURIComponent(image)}&title=${encodeURIComponent(title)}`
    : "/login"

  return (
    <Link href={href} className="group">
      <div className="bg-card border border-border p-3 shadow-sm hover:shadow-md transition-shadow rounded-sm">
        <div className="relative rounded-lg overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-[160px] sm:h-32 object-cover border rounded-none" />
          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-white text-xs font-medium rounded" style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}>
            {type}
          </span>
        </div>
        <div className="pt-3">
          <h3 className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
