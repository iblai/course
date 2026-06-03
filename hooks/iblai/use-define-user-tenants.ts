"use client";

import { useEffect, useState } from "react";
// @ts-ignore — the SDK ships hooks without strict types here
import { useLazyGetUserTenantsQuery } from "@iblai/iblai-js/data-layer";

type Tenant = { key: string; [k: string]: unknown };

/**
 * Explicitly populate `localStorage.tenants` and
 * `localStorage.current_tenant` by calling the LMS endpoint
 * `GET /api/ibl/users/manage/platform/` (mirrors lms's
 * `useDefineUserTenants`).
 *
 * The SDK's `<TenantProvider>` also calls this endpoint via its
 * internal `fetchUserTenants()`, but it does so asynchronously after
 * mount — so the `<UserProfileDropdown>` (whose `userTenants` prop is
 * read synchronously from `localStorage` on first render) sees an
 * empty list and the SDK's `TenantSwitcher` hides itself.
 *
 * This hook front-loads the fetch and blocks rendering of downstream
 * children until `localStorage.tenants` is populated, so the dropdown
 * mounts with a real list.
 */
export function useDefineUserTenants() {
  const [getUserTenants, { isLoading }] = useLazyGetUserTenantsQuery();
  const [tenantsLoaded, setTenantsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (typeof window === "undefined") return;

      const existingTenants = window.localStorage.getItem("tenants");
      const existingCurrent = window.localStorage.getItem("current_tenant");
      if (existingTenants && existingCurrent) {
        if (!cancelled) setTenantsLoaded(true);
        return;
      }

      try {
        // SDK signature: useLazyGetUserTenantsQuery() takes no arg
        const { data: tenants } = await getUserTenants();
        if (Array.isArray(tenants) && tenants.length > 0) {
          const list = tenants as unknown as Tenant[];
          window.localStorage.setItem("tenants", JSON.stringify(list));

          const activeKey = window.localStorage.getItem("tenant");
          const current =
            list.find((t) => t.key === activeKey) ?? list[0];
          window.localStorage.setItem(
            "current_tenant",
            JSON.stringify(current),
          );
        }
      } catch (e) {
        console.error("[useDefineUserTenants] fetch failed:", e);
      } finally {
        if (!cancelled) setTenantsLoaded(true);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [getUserTenants]);

  return { tenantsLoading: isLoading || !tenantsLoaded };
}
