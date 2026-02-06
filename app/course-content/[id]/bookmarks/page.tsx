"use client"

import { Bookmark } from "lucide-react"

export default function BookmarksTab() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="font-medium mb-6 text-xl" style={{ color: "var(--text-primary)" }}>Your Bookmarks</h1>

      <div className="rounded-md border p-8 text-center shadow-sm" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
        <Bookmark className="h-12 w-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
        <h2 className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>No bookmarks yet</h2>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          Bookmark important content as you go through the course to easily find it later.
        </p>
        <p className="text-sm" style={{ color: "var(--primary-color)" }}>
          Look for the bookmark icon <Bookmark className="h-4 w-4 inline" /> while viewing course content to save it here.
        </p>
      </div>
    </div>
  )
}
