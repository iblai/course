"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirectToAuthSpa, hasNonExpiredAuthToken } from "@/lib/iblai/auth-utils";
import { resolveAppTenant } from "@/lib/iblai/tenant";
import config from "@/lib/iblai/config";

/**
 * Real login + post-login agent auto-select.
 *
 * Behaviour by token state:
 *   - Already signed in: pick the best agent for the active tenant
 *     (mentorai-style: recent > featured-default > featured-first >
 *      any) and route straight to `/platform/<tenant>/<agent>`. Falls
 *     back to `/agents` when no mentor can be resolved.
 *   - Not signed in: kick the SPA redirect.
 *
 * `app/page.tsx` re-exports this page, so `/` is also handled here.
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (!hasNonExpiredAuthToken()) {
      redirectToAuthSpa();
      return;
    }

    let cancelled = false;

    void (async () => {
      const tenant = resolveAppTenant();
      if (!tenant) {
        if (!cancelled) router.replace("/agents");
        return;
      }

      const slug = await resolveLandingMentor(tenant);
      if (cancelled) return;

      if (slug) {
        router.replace(`/platform/${encodeURIComponent(tenant)}/${slug}`);
      } else {
        router.replace("/agents");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    </main>
  );
}

/**
 * Mentorai-style mentor resolution (`hooks/use-mentor-redirect.ts`):
 *   1. recently-accessed -> first
 *   2. featured -> mentor with `metadata.default === true`, else first
 *   3. non-featured -> first
 *   4. nothing -> null (caller routes to the picker)
 *
 * Hits the same DM endpoint mentorai uses:
 *   GET {dmUrl}/api/search/orgs/{org}/users/{username}/mentors/
 *     ?order_by=...&featured=...&limit=10
 */
async function resolveLandingMentor(tenant: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("dm_token");
  if (!token) return null;

  let username = "";
  try {
    const raw = localStorage.getItem("userData");
    if (raw) {
      const parsed = JSON.parse(raw);
      username = parsed.user_nicename ?? parsed.username ?? "";
    }
  } catch {
    // ignore
  }
  if (!username) return null;

  const base =
    `${config.dmUrl()}/api/search/orgs/${encodeURIComponent(tenant)}` +
    `/users/${encodeURIComponent(username)}/mentors/`;
  const headers = {
    Authorization: `Token ${token}`,
    Accept: "application/json",
  };

  const fetchMentors = async (
    qs: Record<string, string>,
  ): Promise<Array<Record<string, any>>> => {
    const url = `${base}?${new URLSearchParams(qs).toString()}`;
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return [];
      const data = await res.json();
      const list = Array.isArray(data?.results) ? data.results : [];
      return list;
    } catch {
      return [];
    }
  };

  const slugOf = (m: Record<string, any>): string =>
    m?.slug ?? m?.unique_id ?? m?.id ?? "";

  // 1. recent
  const recent = await fetchMentors({
    order_by: "recently_accessed_at",
    limit: "10",
  });
  if (recent.length > 0) {
    const s = slugOf(recent[0]);
    if (s) return s;
  }

  // 2. featured (prefer default)
  const featured = await fetchMentors({ featured: "true", limit: "10" });
  if (featured.length > 0) {
    const def = featured.find(
      (m) => m?.metadata?.default === true,
    );
    const pick = def ?? featured[0];
    const s = slugOf(pick);
    if (s) return s;
  }

  // 3. non-featured
  const nonFeatured = await fetchMentors({ featured: "false", limit: "10" });
  if (nonFeatured.length > 0) {
    const s = slugOf(nonFeatured[0]);
    if (s) return s;
  }

  return null;
}
