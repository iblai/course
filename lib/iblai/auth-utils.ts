
/**
 * ibl.ai auth helper utilities.
 *
 * Redirects go through the SDK's `redirectToAuthSpa(options)` directly
 * at every call site. This module only exports the static, app-specific
 * options (`authSpaOptions`) and the token-expiry check the SDK depends
 * on (`hasNonExpiredAuthToken`).
 *
 * NOTE: the SDK hardcodes the `redirect-to` query param to
 * `window.location.origin`. Tauri-mobile custom-scheme redirects
 * (`iblai-courseai://`) are no longer wired — re-introduce via an SDK
 * PR exposing a `redirectToUrl` option.
 */

import type { RedirectToAuthSpaOptions } from "@iblai/iblai-js/web-utils";

import config from "./config";
import { resolveAppTenant } from "./tenant";

/** Check if running inside a Tauri app. */
export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  return "__TAURI_INTERNALS__" in window || "__TAURI__" in window;
}

/**
 * Parse an `axd_token_expires` value written by the Auth SPA into a
 * millisecond timestamp. The SPA can send any of:
 *   - ISO string ("2099-01-01T00:00:00Z")
 *   - epoch in milliseconds ("1735689600000")
 *   - epoch in seconds  ("1735689600")
 *
 * Epoch strings fed straight to `new Date(...)` return `Invalid Date`,
 * so without this every post-login check reported the token as expired
 * and the SDK looped back to the Auth SPA.
 */
function parseExpiryMs(raw: string): number {
  const trimmed = raw.trim();
  if (/^-?\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    // Anything below 10^12 is treated as seconds (year 2001 in ms
    // is 10^12; any sane future expiry in seconds sits well below).
    return n < 1e12 ? n * 1000 : n;
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? NaN : parsed;
}

/** Check whether a non-expired auth token exists in localStorage. */
export function hasNonExpiredAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("axd_token");
  if (!token) return false;
  const expiry = localStorage.getItem("axd_token_expires");
  if (!expiry) return false;
  const expiryMs = parseExpiryMs(expiry);
  if (!Number.isFinite(expiryMs)) return false;
  return expiryMs > Date.now();
}

/**
 * Per-app defaults to spread into every SDK `redirectToAuthSpa` call.
 *
 *   import { redirectToAuthSpa } from "@iblai/iblai-js/web-utils";
 *   import { authSpaOptions } from "@/lib/iblai/auth-utils";
 *   redirectToAuthSpa({ ...authSpaOptions(), logout: true });
 *
 * Returns a fresh object so per-call overrides (logout, redirectTo,
 * platformKey, saveRedirect) compose via spread without leaking state.
 */
export function authSpaOptions(): RedirectToAuthSpaOptions {
  return {
    authUrl: config.authUrl(),
    appName: "custom",
    platformKey: resolveAppTenant(),
    // SsoLogin reads `redirectTo` (camelCase) from localStorage on
    // the way back; SDK default is `redirect_to`.
    redirectPathStorageKey: "redirectTo",
    // Enables the SDK's cross-SPA login/logout-timestamp guard.
    hasNonExpiredAuthToken,
    isNativeApp: isTauri,
    preserveTokenKey: "edx_jwt_token",
  };
}

/** Handle logout: clear state and redirect to the Auth SPA logout page. */
export function handleLogout() {
  const tenant = resolveAppTenant();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  localStorage.clear();
  window.location.href = `${config.authUrl()}/logout?redirect-to=${origin}&tenant=${encodeURIComponent(tenant)}`;
}
