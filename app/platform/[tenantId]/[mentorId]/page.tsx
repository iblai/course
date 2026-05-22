"use client";

import HomePage from "@/app/home/page";

/**
 * Per-agent route. URL format: `/platform/<tenant-key>/<agent-id>`.
 *
 * Reuses the full v0 HomePage UI so the chat / jumpstart / templates
 * surface stays identical to `/home`; the tenant + agent ids live in
 * the URL and are available to any descendant via
 * `next/navigation`'s `useParams()` (or our `useUrlContext()` hook).
 * Replaces the SDK `<Chat>` mount that previously lived here.
 */
export default function PlatformAgentPage() {
  return <HomePage />;
}
