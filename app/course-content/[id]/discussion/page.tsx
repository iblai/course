"use client"

import { MessageCircle } from "lucide-react"

export default function DiscussionTab() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-medium mb-6 text-xl" style={{ color: "var(--text-primary)" }}>Your Discussions</h1>

      <div className="rounded-lg border p-8 text-center shadow-sm" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
        <div className="flex justify-center mb-4">
          <MessageCircle className="h-16 w-16" style={{ color: "var(--text-muted)" }} />
        </div>
        <h2 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>No discussions yet</h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
          Start or join discussions about course content to engage with your peers and instructors.
        </p>
        <p style={{ color: "var(--primary-color)" }}>
          Look for the discussion icon <MessageCircle className="h-4 w-4 inline mx-1" /> while viewing course content to participate.
        </p>
      </div>
    </div>
  )
}
