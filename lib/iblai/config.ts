
/**
 * ibl.ai runtime configuration.
 *
 * Supports two modes:
 *   1. Consolidated API (recommended): set NEXT_PUBLIC_API_BASE_URL to a
 *      single origin (e.g. https://api.iblai.app). LMS, DM, and AXD
 *      endpoints are derived as /lms, /dm, /axd path prefixes.
 *   2. Distributed: set NEXT_PUBLIC_PLATFORM_BASE_DOMAIN and each service
 *      resolves to its own subdomain (learn.{domain}, base.manager.{domain}).
 *
 * Priority: runtime window.__ENV__ → build-time process.env → fallback.
 */

// Static env declarations — Next.js inlines NEXT_PUBLIC_* values at build
// time only when they appear as literal process.env.NEXT_PUBLIC_* references.
const env = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_BASE_WS_URL: process.env.NEXT_PUBLIC_BASE_WS_URL,
  NEXT_PUBLIC_PLATFORM_BASE_DOMAIN:
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN,
  NEXT_PUBLIC_MAIN_TENANT_KEY: process.env.NEXT_PUBLIC_MAIN_TENANT_KEY,
  NEXT_PUBLIC_TAURI_CUSTOM_SCHEME: process.env.NEXT_PUBLIC_TAURI_CUSTOM_SCHEME,
  NEXT_PUBLIC_MFE_URL: process.env.NEXT_PUBLIC_MFE_URL,
  NEXT_PUBLIC_SKILLSAI_URL: process.env.NEXT_PUBLIC_SKILLSAI_URL,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
};

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

const runtimeEnv = () =>
  typeof window !== "undefined" ? window.__ENV__ || {} : {};

const getEnv = (key: keyof typeof env, fallback = ""): string =>
  runtimeEnv()[key] ?? env[key] ?? fallback;

const domain = () =>
  getEnv("NEXT_PUBLIC_PLATFORM_BASE_DOMAIN", "iblai.app");

const config = {
  authUrl: () => getEnv("NEXT_PUBLIC_AUTH_URL", `https://login.${domain()}`),

  lmsUrl: () => {
    const apiBase = getEnv("NEXT_PUBLIC_API_BASE_URL");
    if (apiBase) return `${apiBase}/lms`;
    return `https://learn.${domain()}`;
  },

  dmUrl: () => {
    const apiBase = getEnv("NEXT_PUBLIC_API_BASE_URL");
    if (apiBase) return `${apiBase}/dm`;
    return `https://base.manager.${domain()}`;
  },

  axdUrl: () => {
    const apiBase = getEnv("NEXT_PUBLIC_API_BASE_URL");
    if (apiBase) return `${apiBase}/axd`;
    return `https://base.manager.${domain()}`;
  },

  // edX Studio (course authoring UI). User-facing only -- always the
  // direct host `studio.learn.<domain>`. The consolidated API base is
  // for programmatic access only and is not used here.
  studioUrl: () => `https://studio.learn.${domain()}`,

  // LMS browser host -- direct user-facing URL (`learn.<domain>`). Use
  // for new-tab opens and links. The SDK / iframe uses `lmsUrl()` which
  // can be the API-proxied path for programmatic access.
  lmsBrowserUrl: () => `https://learn.${domain()}`,

  // Learner MFE host (`apps.learn.<domain>`). Hosts the modern edX
  // learner experience (course outline, dates, progress, discussion).
  // User-facing only; matches `NEXT_PUBLIC_MFE_URL` in the skill.
  mfeUrl: () => getEnv("NEXT_PUBLIC_MFE_URL", `https://apps.learn.${domain()}`),

  // skillsAI host -- the sibling SPA that owns the in-tenant course
  // player. courseai redirects course-content clicks here because the
  // LMS sets `Content-Security-Policy: frame-ancestors 'self'` on the
  // edX iframe routes, which blocks any non-LMS origin (including
  // courseai) from embedding the player. skillsAI is deployed under
  // the same iblai infrastructure and is already allow-listed.
  // `https://skills.<domain>` 301-redirects to the canonical
  // `https://skillsai.<domain>`.
  skillsaiUrl: () =>
    getEnv("NEXT_PUBLIC_SKILLSAI_URL", `https://skillsai.${domain()}`),

  baseWsUrl: () =>
    getEnv("NEXT_PUBLIC_BASE_WS_URL", `wss://asgi.data.${domain()}`),

  wsUrl: () =>
    getEnv("NEXT_PUBLIC_BASE_WS_URL", `wss://asgi.data.${domain()}`),

  // `main` is the canonical iblai cross-tenant marketplace key. The
  // SDK Stripe upgrade flow calls `/api/.../stripe/pricing-page-session/`
  // scoped to this platform; if it resolves to an empty string the
  // call fires `?platform_key=` and the server rejects it, surfacing
  // as the "Failed to load upgrade options" toast in
  // `UpgradePackageModal`. Mentorai uses the same default.
  mainTenantKey: () => getEnv("NEXT_PUBLIC_MAIN_TENANT_KEY", "main"),

  // Support contact surfaced on the error page. Falls back to the ibl.ai
  // Zendesk support inbox when NEXT_PUBLIC_SUPPORT_EMAIL is unset.
  supportEmail: () =>
    getEnv("NEXT_PUBLIC_SUPPORT_EMAIL", "support@iblai.zendesk.com"),
  tauriCustomScheme: () => getEnv("NEXT_PUBLIC_TAURI_CUSTOM_SCHEME", ""),
  platformBaseDomain: () => domain(),
};

export default config;
export { getEnv };
