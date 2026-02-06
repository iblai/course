"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { name: "Activity", href: "/profile" },
  { name: "Skills", href: "/profile/skills" },
  { name: "Credentials", href: "/profile/credentials" },
  { name: "Pathways", href: "/profile/pathways" },
  { name: "Programs", href: "/profile/programs" },
  { name: "Courses", href: "/profile/courses" },
  { name: "Public Profile", href: "/profile/public" },
]

export function ProfileTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b w-full max-w-full overflow-hidden bg-background" style={{ borderColor: "var(--border-color)" }}>
      <div className="px-2 sm:px-6 w-full max-w-full overflow-x-auto scrollbar-hide">
        <nav
          className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide pb-px min-w-0 flex-nowrap"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== "/profile" && pathname?.startsWith(tab.href))
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  isActive
                    ? "border-[#0070f3] text-[#0070f3]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
