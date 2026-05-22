"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resolveAppTenant } from "./tenant";

/**
 * Resolve the active platform/tenant and agent (mentor) from the URL.
 * Mirrors hq's `lib/iblai/use-url-context.ts`.
 *
 * Routes that carry context look like `/platform/[tenantId]/[mentorId]/...`
 * -- `tenantId` and `mentorId` are read via `next/navigation`'s
 * `useParams()`. When the URL doesn't carry them (e.g. on the home
 * page), `tenantKey` falls back to `localStorage.tenant` (set by the
 * SDK's TenantProvider after SSO).
 *
 * `username` comes from `localStorage.userData.user_nicename`, the
 * same field the SDK's profile / dropdown components read.
 */
export interface UrlContext {
  /** Tenant from URL `[tenantId]` or `localStorage.tenant`. */
  tenantKey: string;
  /** Mentor from URL `[mentorId]` -- null when not on an agent-scoped route. */
  mentorId: string | null;
  /** `userData.user_nicename` from localStorage. */
  username: string | null;
  /** True after the first mount-effect runs (localStorage/window read). */
  ready: boolean;
}

export function useUrlContext(): UrlContext {
  const params = useParams<{ tenantId?: string; mentorId?: string }>();
  const [fallbackTenant, setFallbackTenant] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setFallbackTenant(resolveAppTenant());
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUsername(parsed.user_nicename ?? null);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const tenantKey = params?.tenantId ?? fallbackTenant;
  const mentorId = params?.mentorId ?? null;

  return { tenantKey, mentorId, username, ready };
}
