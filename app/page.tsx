"use client"

import { useMentorRedirect } from "@/lib/iblai/use-mentor-redirect"
import { PageLoader } from "@/components/iblai/page-loader"

/**
 * Root route. Authenticated users are redirected to
 * `/platform/<tenantKey>/<unique_id>` (where `unique_id` is always the
 * mentor's UUID). Unauthenticated users are pushed to `/login` by
 * `AuthProvider` inside `IblaiProviders` before this component ever
 * mounts. Falls through to `/agents` when the user has no mentors.
 */
export default function RootPage() {
  // Admins default to the dedicated "Content Creation" agent (created on the
  // fly if missing); students are routed to /course-catalog inside the hook.
  useMentorRedirect({ preferContentCreationAgent: true })
  return <PageLoader className="bg-[#fafafa]" />
}
