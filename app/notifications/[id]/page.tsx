"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useParams } from "next/navigation";

import { NotificationsCenter } from "../notifications-center";
import { PageLoader } from "@/components/iblai/page-loader";

/**
 * `/notifications/<id>` — deep link from the header bell to a specific
 * notification. Pre-selects it via `selectedNotificationId`. The bell
 * routes here as `/notifications/${id}` (see
 * `components/header-notifications.tsx`); the bare `/notifications/`
 * (empty id) falls through to the base page.
 */
export default function NotificationDetailPage() {
  const { id } = useParams<{ id?: string }>();
  return (
    <Suspense fallback={<PageLoader />}>
      <NotificationsCenter selectedNotificationId={id} />
    </Suspense>
  );
}
