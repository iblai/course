/**
 * Real tenant switch -- port of hq's `lib/iblai/tenant-switch.ts`.
 * The naive `localStorage.setItem('tenant', key) + reload` approach
 * doesn't work because the SDK's `<TenantProvider>` re-validates
 * against the platform on mount: if the session-side tenant doesn't
 * match the new `localStorage.tenant`, it calls `handleTenantSwitch`
 * to bounce the user back to the original tenant.
 *
 * The fix: redirect to `${authUrl}/login/complete?tenant=X&token=...`.
 * The auth SPA re-issues all tokens scoped to the requested tenant
 * and sends the user back with a fresh `?data=...` blob -- the
 * `/sso-login-complete` route then writes the new session into
 * localStorage.
 */

import config from "./config";

// Naming convention across the codebase:
//   - URL query param to the auth SPA: `redirect-to` (kebab-case)
//   - localStorage key the SDK's `SsoLogin` reads on the way back:
//     `redirectTo` (camelCase). Matches `redirectPathKey="redirectTo"`
//     on app/sso-login-complete/page.tsx and the key written by
//     `lib/iblai/auth-utils.ts:redirectToAuthSpa` when `saveRedirect=true`.
const REDIRECT_PATH_LS_KEY = "redirectTo";
const REDIRECT_PATH_QUERY = "redirect-to";

function setCrossSpaCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const hostname = window.location.hostname;
  let baseDomain = hostname;
  if (hostname !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    const parts = hostname.split(".");
    if (parts.length > 2) baseDomain = `.${parts.slice(-2).join(".")}`;
  }
  const domainAttr = baseDomain ? `;domain=${baseDomain}` : "";
  document.cookie =
    `${name}=${encodeURIComponent(value)};` +
    `expires=${expires.toUTCString()};path=/;SameSite=None;Secure` +
    domainAttr;
}

export interface TenantSwitchOptions {
  /** Save the current `pathname + search` so the user lands back on it. */
  saveRedirect?: boolean;
  /** Override the post-switch redirect target (defaults to `window.location.origin`). */
  redirectUrl?: string;
  /**
   * If false, skip the cross-tab broadcast + cookie + localStorage
   * clear. The SDK uses this when reacting to a switch initiated by
   * another tab.
   */
  broadcastTenantSwitching?: boolean;
}

export async function handleTenantSwitch(
  tenant: string,
  options: TenantSwitchOptions = {},
): Promise<void> {
  if (typeof window === "undefined") return;

  const {
    saveRedirect = false,
    redirectUrl,
    broadcastTenantSwitching = true,
  } = options;

  // Already switching -- bail to avoid a redirect loop.
  if (
    document.cookie.includes("ibl_tenant_switching") &&
    broadcastTenantSwitching
  ) {
    return;
  }

  // No-op if the requested tenant is already active.
  if (tenant === localStorage.getItem("tenant")) return;

  if (broadcastTenantSwitching) {
    setCrossSpaCookie("ibl_tenant_switching", "true");
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const channel = new BroadcastChannel("ibl-tenant-switch");
        channel.postMessage({ type: "TENANT_SWITCHING", tenant });
        channel.close();
      } catch {
        /* ignore -- older browsers / iframe restrictions */
      }
    }
    try {
      const { clearCurrentTenantCookie } = await import(
        "@iblai/iblai-js/web-utils"
      );
      clearCurrentTenantCookie();
    } catch {
      /* ignore -- SDK may not export it on older versions */
    }
  }

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const jwtToken = localStorage.getItem("edx_jwt_token");

  if (broadcastTenantSwitching) {
    localStorage.clear();
  }

  // The auth-SPA round trip lands on /sso-login-complete, where the
  // SDK's `SsoLogin` does `${window.location.origin}${redirectPath}`.
  // That breaks when `redirectPath` is a full URL (two origins get
  // concatenated). Always pass `${origin}` as `redirect-to` and save
  // the path+search to localStorage so SsoLogin reads it back cleanly.
  let redirectPath: string | null = null;
  if (redirectUrl) {
    try {
      const url = new URL(redirectUrl, window.location.origin);
      redirectPath = `${url.pathname}${url.search}`;
    } catch {
      redirectPath = redirectUrl;
    }
  }

  const params: Record<string, string> = {
    tenant,
    [REDIRECT_PATH_QUERY]: `${window.location.origin}`,
  };
  if (jwtToken) params.token = jwtToken;

  // Restore the destination tenant + redirect path so they survive
  // the round-trip through the auth SPA. `saveRedirect` (legacy) wins
  // over an explicit `redirectUrl` since it's a deliberate "send the
  // user back where they were" signal from the caller.
  localStorage.setItem("tenant", tenant);
  if (saveRedirect) {
    localStorage.setItem(REDIRECT_PATH_LS_KEY, currentPath);
  } else if (redirectPath) {
    localStorage.setItem(REDIRECT_PATH_LS_KEY, redirectPath);
  }

  // Tiny delay lets the cookie writes flush before navigation.
  await new Promise((r) => setTimeout(r, 100));

  const url = `${config.authUrl()}/login/complete?${new URLSearchParams(
    params,
  ).toString()}`;
  window.location.href = url;
}
