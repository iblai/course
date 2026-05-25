"use client"

import type React from "react"
import { useEffect } from "react"

import config from "@/lib/iblai/config"

/**
 * Redirect-only shell for `/course-content/[id]/*`.
 *
 * The course player lives on skillsAI — the LMS sets
 * `Content-Security-Policy: frame-ancestors 'self'` on its edX iframe
 * routes, which blocks every non-LMS origin (including courseai) from
 * embedding the player. skillsAI is allow-listed by the LMS, so we
 * forward the user there with the same path / search / hash.
 *
 * The catalog click already hands users straight to the skillsAI URL
 * (`config.skillsaiUrl()/course-content/<id>/course`); this layout
 * exists as a safety net for direct URL visits, bookmarks, and the
 * back button from skillsAI back to the in-app route.
 *
 * Browsers carry the user's SSO cookies for `*.iblai.app`, so they
 * land on skillsAI already authenticated.
 */
export default function CourseContentRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const base = config.skillsaiUrl().replace(/\/+$/, "")
    const pathAndQuery =
      window.location.pathname + window.location.search + window.location.hash
    window.location.replace(`${base}${pathAndQuery}`)
  }, [])

  // Children (the per-tab pages) never render — we replace the
  // location before React has a chance to mount them. The bare
  // wrapper avoids a flash of unstyled / mismatched content during
  // the redirect tick.
  void children
  return (
    <div className="flex min-h-screen-dvh items-center justify-center bg-background text-sm text-gray-500">
      Opening course in skillsAI…
    </div>
  )
}
