import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

// Every NEXT_PUBLIC_* env this suite mutates. `beforeEach` clears all
// of them and `afterEach` restores the original values, so a forgotten
// key can't bleed between tests (the bug that produced
// `expected '…/login.iblai.app' to be '…/my-auth.example.com'`).
const ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_AUTH_URL",
  "NEXT_PUBLIC_PLATFORM_BASE_DOMAIN",
  "NEXT_PUBLIC_MAIN_TENANT_KEY",
  "NEXT_PUBLIC_SKILLSAI_URL",
  "NEXT_PUBLIC_MFE_URL",
  "NEXT_PUBLIC_BASE_WS_URL",
  "NEXT_PUBLIC_TAURI_CUSTOM_SCHEME",
] as const

/**
 * `config.ts` reads `process.env.NEXT_PUBLIC_*` at module-init time
 * (literal references — that's how Next inlines them at build). To
 * exercise each fallback in isolation we have to reset the module
 * cache after mutating env so the literal reads pick up the new
 * value.
 */
async function loadConfig() {
  vi.resetModules()
  const mod = await import("@/lib/iblai/config")
  return mod.default
}

describe("iblai config", () => {
  const snapshot: Record<string, string | undefined> = {}
  beforeEach(() => {
    for (const k of ENV_KEYS) snapshot[k] = process.env[k]
    for (const k of ENV_KEYS) delete process.env[k]
  })
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (snapshot[k] === undefined) delete process.env[k]
      else process.env[k] = snapshot[k]
    }
  })

  it("mainTenantKey() defaults to 'main' when env is unset", async () => {
    // Empty fallback was the source of "Failed to load upgrade options":
    // SDK fired `pricing-page-session/?platform_key=`. Default must be
    // a valid platform key.
    const config = await loadConfig()
    expect(config.mainTenantKey()).toBe("main")
  })

  it("mainTenantKey() respects NEXT_PUBLIC_MAIN_TENANT_KEY override", async () => {
    process.env.NEXT_PUBLIC_MAIN_TENANT_KEY = "my-platform"
    const config = await loadConfig()
    expect(config.mainTenantKey()).toBe("my-platform")
  })

  it("skillsaiUrl() defaults to skillsai.<domain>", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.skillsaiUrl()).toBe("https://skillsai.iblai.app")
  })

  it("skillsaiUrl() respects NEXT_PUBLIC_SKILLSAI_URL override", async () => {
    process.env.NEXT_PUBLIC_SKILLSAI_URL = "https://my-skills.example.com"
    const config = await loadConfig()
    expect(config.skillsaiUrl()).toBe("https://my-skills.example.com")
  })

  it("lmsUrl() resolves through API_BASE_URL/lms when set (matches edx JWT routing)", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.iblai.app"
    const config = await loadConfig()
    expect(config.lmsUrl()).toBe("https://api.iblai.app/lms")
  })

  it("lmsBrowserUrl() always returns the direct LMS host (used for assets + iframe)", async () => {
    // Even with API_BASE_URL set, asset paths and CSP-bound iframes
    // need the direct host (`learn.<domain>`); the API gateway 500s
    // on `/asset-v1:...` paths. Catalog images + course-content
    // iframe-props depend on this.
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.iblai.app"
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.lmsBrowserUrl()).toBe("https://learn.iblai.app")
  })

  // --- The remaining getters: exercised for coverage so the bare URL
  // builders can't quietly drift away from the documented defaults.

  it("authUrl() defaults to login.<domain>", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.authUrl()).toBe("https://login.iblai.app")
  })

  it("authUrl() respects NEXT_PUBLIC_AUTH_URL override", async () => {
    process.env.NEXT_PUBLIC_AUTH_URL = "https://my-auth.example.com"
    const config = await loadConfig()
    expect(config.authUrl()).toBe("https://my-auth.example.com")
  })

  it("lmsUrl() falls back to learn.<domain> when API_BASE_URL is unset", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.lmsUrl()).toBe("https://learn.iblai.app")
  })

  it("dmUrl() resolves via API_BASE_URL/dm when set, else base.manager.<domain>", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.iblai.app"
    expect((await loadConfig()).dmUrl()).toBe("https://api.iblai.app/dm")

    delete process.env.NEXT_PUBLIC_API_BASE_URL
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    expect((await loadConfig()).dmUrl()).toBe("https://base.manager.iblai.app")
  })

  it("axdUrl() resolves via API_BASE_URL/axd when set, else base.manager.<domain>", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.iblai.app"
    expect((await loadConfig()).axdUrl()).toBe("https://api.iblai.app/axd")

    delete process.env.NEXT_PUBLIC_API_BASE_URL
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    expect((await loadConfig()).axdUrl()).toBe("https://base.manager.iblai.app")
  })

  it("studioUrl() always points at studio.learn.<domain>", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.studioUrl()).toBe("https://studio.learn.iblai.app")
  })

  it("mfeUrl() defaults to apps.learn.<domain>", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.mfeUrl()).toBe("https://apps.learn.iblai.app")
  })

  it("baseWsUrl() / wsUrl() default to wss://asgi.data.<domain>", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    expect(config.baseWsUrl()).toBe("wss://asgi.data.iblai.app")
    expect(config.wsUrl()).toBe("wss://asgi.data.iblai.app")
  })

  it("baseWsUrl() / wsUrl() respect NEXT_PUBLIC_BASE_WS_URL override", async () => {
    process.env.NEXT_PUBLIC_BASE_WS_URL = "wss://my-ws.example.com"
    const config = await loadConfig()
    expect(config.baseWsUrl()).toBe("wss://my-ws.example.com")
    expect(config.wsUrl()).toBe("wss://my-ws.example.com")
  })

  it("tauriCustomScheme() defaults to empty (Tauri-only host)", async () => {
    const config = await loadConfig()
    expect(config.tauriCustomScheme()).toBe("")
  })

  it("platformBaseDomain() reflects the configured / default domain", async () => {
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    expect((await loadConfig()).platformBaseDomain()).toBe("iblai.app")

    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "custom.example.com"
    expect((await loadConfig()).platformBaseDomain()).toBe("custom.example.com")
  })

  it("domain falls back to iblai.app when NEXT_PUBLIC_PLATFORM_BASE_DOMAIN is unset", async () => {
    // Internal `domain()` is exercised through every getter that
    // composes a URL from it; we only test the boundary here.
    const config = await loadConfig()
    expect(config.authUrl()).toBe("https://login.iblai.app")
  })

  it("treats window.__ENV__ being undefined as empty (falls through to process.env)", async () => {
    // Pins the `window.__ENV__ || {}` short-circuit branch — without
    // this test, vitest counts only the truthy branch as covered.
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    const w = (globalThis as { window?: Window }).window
    try {
      ;(globalThis as { window: object }).window = {} as unknown as Window
      expect(config.authUrl()).toBe("https://login.iblai.app")
    } finally {
      if (w === undefined) {
        delete (globalThis as { window?: Window }).window
      } else {
        ;(globalThis as { window: Window }).window = w
      }
    }
  })

  it("runtime window.__ENV__ overrides build-time process.env when set", async () => {
    // Simulates the Vercel/Docker runtime-config injection path that
    // `getEnv()` consults before falling back to `process.env`.
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    const config = await loadConfig()
    // No window in node — direct call uses process.env path.
    expect(config.authUrl()).toBe("https://login.iblai.app")
    const w = (globalThis as { window?: Window }).window
    try {
      ;(globalThis as { window: object }).window = {
        __ENV__: { NEXT_PUBLIC_AUTH_URL: "https://runtime-auth.example.com" },
      } as unknown as Window
      expect(config.authUrl()).toBe("https://runtime-auth.example.com")
    } finally {
      if (w === undefined) {
        delete (globalThis as { window?: Window }).window
      } else {
        ;(globalThis as { window: Window }).window = w
      }
    }
  })
})
