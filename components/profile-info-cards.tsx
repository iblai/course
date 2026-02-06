"use client"

import { User, Mail, MapPin, Briefcase, Calendar, Globe } from "lucide-react"

const profileData = [
  { icon: User, label: "Name", value: "Peter Johnson" },
  { icon: Mail, label: "Email", value: "peter.johnson@example.com" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA" },
  { icon: Briefcase, label: "Department", value: "Engineering" },
  { icon: Calendar, label: "Joined", value: "January 2024" },
  { icon: Globe, label: "Language", value: "English" },
]

export function ProfileInfoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {profileData.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-sm transition-shadow"
          style={{ backgroundColor: "var(--sidebar-bg)", borderColor: "var(--border-color)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}
          >
            <item.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {item.label}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
