"use client";

import { Loader2 } from "lucide-react";

import { useMentorRedirect } from "@/lib/iblai/use-mentor-redirect";

/**
 * `/customize` is a thin redirect to
 * `/platform/<tenantKey>/<unique_id>/customize`. Routed through
 * `useMentorRedirect({ pathSuffix: "/customize" })` so it works from
 * anywhere -- pages outside `/platform/...` (e.g. /agents, /courses)
 * have no mentorId in `useUrlContext`, but this hook resolves the
 * user's current mentor via the SDK and pushes the user there.
 *
 * Falls back to `/agents` when the user has no mentors.
 */
export default function CustomizeRedirectPage() {
  useMentorRedirect({ pathSuffix: "/customize" });
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white">
      <Loader2 className="size-5 animate-spin text-[#5f5f61]" aria-hidden />
    </div>
  );
}
