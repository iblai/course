
/**
 * Tenant resolution for ibl.ai apps.
 *
 * Priority:
 *   1. `current_tenant` localStorage — JSON `{key: "..."}` written by
 *      the SDK on every login / tenant switch. Source of truth.
 *   2. `NEXT_PUBLIC_MAIN_TENANT_KEY` env var — boot default before the
 *      SDK has written anything.
 *   3. `tenant` localStorage — raw key string the SDK keeps in sync
 *      with `current_tenant.key`; secondary fallback.
 */

import config from "@/lib/iblai/config";

const PLACEHOLDER_PLATFORMS = new Set([
  "your-main-platform",
  "your-platform",
  "your-tenant",
  "your-tenant-key",
  "test-tenant",
  "main",
  "",
]);

/**
 * Pull the active tenant key from `current_tenant` (`{key: "..."}`).
 * Returns `""` when missing or shape-broken.
 */
function readCurrentTenantKey(): string {
  if (typeof window === "undefined") return "";
  const raw = localStorage.getItem("current_tenant");
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.key === "string") {
      return parsed.key;
    }
  } catch {
    // raw is a bare string; treat as the key itself
    if (raw.trim()) return raw;
  }
  return "";
}

/**
 * Resolve the current tenant key.
 *
 * Order: `current_tenant.key` -> `NEXT_PUBLIC_MAIN_TENANT_KEY` -> the
 * SDK's `tenant` localStorage value.
 */
export function resolveAppTenant(): string {
  if (typeof window === "undefined") return "";

  const fromCurrent = readCurrentTenantKey();
  if (fromCurrent) return fromCurrent;

  const envTenant = config.mainTenantKey();
  if (envTenant && !PLACEHOLDER_PLATFORMS.has(envTenant)) return envTenant;

  const sdkTenant = localStorage.getItem("tenant");
  if (sdkTenant) return sdkTenant;

  return "";
}

/**
 * Check if the SDK's `tenant` localStorage differs from the resolved
 * app tenant. If they differ, redirect to the auth SPA to re-login for
 * the correct tenant. Returns `true` if a redirect was triggered
 * (caller should stop rendering).
 */
export function checkTenantMismatch(): boolean {
  if (typeof window === "undefined") return false;

  const appTenant = resolveAppTenant();
  const sdkTenant = localStorage.getItem("tenant") ?? "";

  if (appTenant && sdkTenant && sdkTenant !== appTenant) {
    // Dynamic imports avoid a circular dep on auth-utils from this module.
    Promise.all([
      import("@iblai/iblai-js/web-utils"),
      import("./auth-utils"),
    ]).then(([{ redirectToAuthSpa }, { authSpaOptions }]) => {
      redirectToAuthSpa({
        ...authSpaOptions(),
        platformKey: appTenant,
        saveRedirect: false,
      });
    });
    return true;
  }
  return false;
}
