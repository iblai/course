"use client"

import { useMentorRedirect } from "@/lib/iblai/use-mentor-redirect"
import { PageLoader } from "@/components/iblai/page-loader"

/**
 * `/home` is a thin redirect to `/platform/<tenantKey>/<unique_id>`, where
 * `unique_id` is always the agent's UUID (never a slug or English name).
 * Falls back to `/agents` only when the user has no mentors at all.
 *
 * The v0 chat-and-templates UI that used to live at this route now lives
 * at `@/components/v0-home` and is composed by `/platform/[tenantId]/
 * [mentorId]/page.tsx` (and `/chat/page.tsx`).
 */
export default function HomePage() {
  // Admins default to the dedicated "Content Creation" agent (created on the
  // fly if missing); students are routed to /course-catalog inside the hook.
  useMentorRedirect({ preferContentCreationAgent: true })
  return <PageLoader className="bg-[#fafafa]" />
}
