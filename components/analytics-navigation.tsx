"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", href: "/profile" },
  { label: "Courses", href: "/profile/courses" },
  { label: "Pathways", href: "/profile/pathways" },
  { label: "Skills", href: "/profile/skills" },
  { label: "Credentials", href: "/profile/credentials" },
  { label: "Programs", href: "/profile/programs" },
]

export default function AnalyticsNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            pathname === item.href ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
