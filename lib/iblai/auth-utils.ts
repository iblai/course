
/**
 * ibl.ai auth helper utilities.
 *
 * These are thin wrappers used by IblaiProviders. You can customise the
 * redirect behaviour here without touching the provider component.
 */

import config from "./config";
import { resolveAppTenant } from "./tenant";

/** Check if running inside a Tauri app. */
export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  return "__TAURI_INTERNALS__" in window || "__TAURI__" in window;
}

/** Check if running inside a Tauri mobile app (iOS/Android). */
export function isTauriMobile(): boolean {
  if (!isTauri()) return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Get the redirect origin for the Auth SPA.
 *  - Mobile Tauri: custom scheme (e.g. `iblai-skills://`)
 *  - Desktop Tauri / Web: window.location.origin
 */
function getRedirectOrigin(): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (isTauriMobile()) {
    const scheme = config.tauriCustomScheme();
    if (scheme) return `${scheme}://`;
  }
  return origin;
}

/** Redirect the browser to the ibl.ai Auth SPA for login. */
export async function redirectToAuthSpa(
  redirectTo?: string,
  platformKey?: string,
  logout?: boolean,
  saveRedirect?: boolean,
) {
  const redirectOrigin = getRedirectOrigin();
  const path = redirectTo ?? (typeof window !== "undefined" ? window.location.pathname : "/");

  if (saveRedirect) {
    localStorage.setItem("redirectTo", path);
  }

  const tenant = platformKey || resolveAppTenant();
  let authUrl = `${config.authUrl()}/login?app=custom&redirect-to=${redirectOrigin}`;
  if (tenant) authUrl += `&tenant=${encodeURIComponent(tenant)}`;
  if (logout) authUrl += "&logout=1";

  // All platforms (web, desktop Tauri, mobile Tauri): navigate the window
  // to the Auth SPA.  On desktop Tauri the auth page loads in-app, and
  // the Rust on_navigation filter opens OAuth providers (Google, Apple)
  // in a popup window automatically.
  window.location.href = authUrl;
}

/**
 * Parse an `axd_token_expires` value written by the Auth SPA into a
 * millisecond timestamp. The SPA can send any of:
 *   - ISO string ("2099-01-01T00:00:00Z")
 *   - epoch in milliseconds ("1735689600000")
 *   - epoch in seconds  ("1735689600")
 *
 * The original generator only handled the ISO case; an epoch value
 * fed straight to `new Date(...)` returned `Invalid Date`, so every
 * post-login check reported the token as expired and AuthProvider
 * looped back to the Auth SPA.
 */
function parseExpiryMs(raw: string): number {
  const trimmed = raw.trim();
  if (/^-?\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    // Seconds vs milliseconds: anything below 10^12 is treated as
    // seconds (year 2001 in ms is 10^12; any sane future expiry in
    // seconds is well below that, in ms well above it).
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

/** Handle logout: clear state and redirect to the Auth SPA logout page. */
export function handleLogout() {
  const tenant = resolveAppTenant();
  const redirectOrigin = getRedirectOrigin();
  localStorage.clear();
  window.location.href = `${config.authUrl()}/logout?redirect-to=${redirectOrigin}&tenant=${encodeURIComponent(tenant)}`;
}
