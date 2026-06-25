"use client";

import { useMentorRedirect } from "@/lib/iblai/use-mentor-redirect";
import { PageLoader } from "@/components/iblai/page-loader";

/**
 * `/customize` is a thin redirect to
 * `/platform/<tenantKey>/<unique_id>/customize`. Routed through
 * `useMentorRedirect({ pathSuffix: "/customize" })` so it works from
 * anywhere -- pages outside `/platform/...` (e.g. /agents, /courses)
 * have no mentorId in `useUrlContext`, but this hook resolves the
 * user's current mentor via the SDK and pushes the user there.
 *
 * `preferContentCreationAgent` so Configure lands on the SAME dedicated
 * "Content Creation" agent the New Course button uses (creating it if
 * missing) — otherwise Configure would resolve a different,
 * recently-accessed agent than the one course authoring runs on.
 *
 * Falls back to `/agents` when the user has no mentors.
 */
export default function CustomizeRedirectPage() {
  useMentorRedirect({
    pathSuffix: "/customize",
    preferContentCreationAgent: true,
  });
  return <PageLoader />;
}
