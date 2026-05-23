"use client"

import { Loader2 } from "lucide-react"

import { useMentorRedirect } from "@/lib/iblai/use-mentor-redirect"

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
  useMentorRedirect()
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-[#fafafa]">
      <Loader2 className="size-5 animate-spin text-[#5f5f61]" aria-hidden />
    </div>
  )
}
