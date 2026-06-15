"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAdminStatus } from "@/hooks/use-admin-status";
import { PageLoader } from "@/components/iblai/page-loader";

/**
 * Admin-only gate for the whole per-agent segment
 * (`/platform/<tenant>/<mentor>/...` — chat, customize, projects).
 *
 * These are course-authoring surfaces; students (non-admins) don't
 * belong on them. The `/` post-login redirect (`useMentorRedirect`)
 * already sends non-admins to the catalog, but it only runs on the
 * landing routes — direct navigation here (a bookmark, a shared link,
 * or the SDK's saved `redirectTo` after an auth bounce) reaches the
 * chat without passing through it. Gating the segment in a layout
 * closes that hole for every entry point in one place.
 *
 * Tri-state on purpose: `loading` (tenants not hydrated yet) renders
 * the spinner — never the deny path — so an admin is never bounced to
 * the catalog mid-hydration. Only a settled `denied` redirects.
 */
export default function MentorSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const adminStatus = useAdminStatus();

  useEffect(() => {
    if (adminStatus === "denied") router.replace("/course-catalog");
  }, [adminStatus, router]);

  // Render children only once we've confirmed admin. `loading` and
  // `denied` both show the spinner (denied for the brief tick before
  // the redirect above lands), so the chat / course-creation enable
  // never mounts for a student.
  if (adminStatus !== "admin") return <PageLoader />;
  return <>{children}</>;
}
