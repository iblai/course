"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";

import { NotificationsCenter } from "./notifications-center";
import { PageLoader } from "@/components/iblai/page-loader";

/**
 * `/notifications` — the notification center (Inbox; Alerts + Send for
 * admins). Linked from the sidebar "Notifications" item and the header
 * bell's "View all". See the `/iblai-notification` skill.
 *
 * The SDK tree can read `useSearchParams`, which requires a Suspense
 * boundary in the App Router — mirrors the per-agent chat page.
 */
export default function NotificationsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NotificationsCenter />
    </Suspense>
  );
}
