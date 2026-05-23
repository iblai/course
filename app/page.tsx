"use client"

import { Loader2 } from "lucide-react"

import { useMentorRedirect } from "@/lib/iblai/use-mentor-redirect"

/**
 * Root route. Authenticated users are redirected to
 * `/platform/<tenantKey>/<unique_id>` (where `unique_id` is always the
 * mentor's UUID). Unauthenticated users are pushed to `/login` by
 * `AuthProvider` inside `IblaiProviders` before this component ever
 * mounts. Falls through to `/agents` when the user has no mentors.
 */
export default function RootPage() {
  useMentorRedirect()
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-[#fafafa]">
      <Loader2 className="size-5 animate-spin text-[#5f5f61]" aria-hidden />
    </div>
  )
}
