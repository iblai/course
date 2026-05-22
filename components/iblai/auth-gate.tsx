"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { IblaiProviders } from "@/providers/iblai-providers";

// Module-load purge. Runs ONCE the moment the bundle executes,
// before any React tree mounts. Any value left over from a previous
// session (no matter who wrote it -- old app code, a dev poking the
// browser console, a long-dead version of the SDK) is gone before
// providers, hooks, or other auth code can read it.
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem("app_tenant");
  } catch {
    /* ignore */
  }
}

/**
 * Normalize `current_tenant` in localStorage to the JSON shape the
 * SDK expects (`{"key": "<tenant>"}`). The SsoLogin callback can
 * write the raw tenant string; providers downstream read `.key` and
 * fail without coercion. Idempotent.
 */
function normalizeStorage(): void {
  if (typeof window === "undefined") return;

  // Defense-in-depth: also strip on every render in case something
  // in this session (an SDK update, a stray devtools snippet) puts
  // it back.
  localStorage.removeItem("app_tenant");

  const raw = localStorage.getItem("current_tenant");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.key === "string") {
      return;
    }
    if (typeof parsed === "string" && parsed) {
      localStorage.setItem("current_tenant", JSON.stringify({ key: parsed }));
      return;
    }
  } catch {
    if (raw.trim()) {
      localStorage.setItem("current_tenant", JSON.stringify({ key: raw }));
    }
  }
}

/**
 * Wraps every route in IblaiProviders EXCEPT `/sso-login-complete`
 * (and any future `/sso-login*` callback). The SSO callback must
 * receive its tokens before AuthProvider runs, otherwise AuthProvider
 * detects "no tokens" and redirects to login -> infinite loop.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isSsoCallback = pathname.startsWith("/sso-login");

  // Synchronous during render (not in useEffect) so localStorage is
  // in the right shape BEFORE any child provider's render-time read
  // or mount-time effect fires. Self-guards SSR. Idempotent.
  normalizeStorage();

  if (isSsoCallback) return <>{children}</>;
  return <IblaiProviders>{children}</IblaiProviders>;
}
