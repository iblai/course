import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

const ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_PLATFORM_BASE_DOMAIN",
  "NEXT_PUBLIC_MFE_URL",
] as const

/**
 * `_iframe-props.ts` reads `process.env.NEXT_PUBLIC_*` via the config
 * helpers at module-init. We `resetModules` per test so each can
 * pin its own env.
 */
async function loadHelper() {
  vi.resetModules()
  const mod = await import("@/app/course-content/[id]/_iframe-props")
  return mod.getIframeProps
}

/**
 * The course-content tab pages share `getIframeProps()` to build
 * the URLs handed to `<CourseContentTabPage>`. After the CSP fight
 * with `learn.<domain>`, both LMS slots (lmsUrl + legacyLmsUrl) must
 * resolve to the direct LMS host, never the API gateway proxy — the
 * gateway returns 500 on courseware iframe routes. MFE is its own
 * host.
 */
describe("course-content getIframeProps", () => {
  const snapshot: Record<string, string | undefined> = {}
  beforeEach(() => {
    for (const k of ENV_KEYS) snapshot[k] = process.env[k]
    for (const k of ENV_KEYS) delete process.env[k]
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
  })
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (snapshot[k] === undefined) delete process.env[k]
      else process.env[k] = snapshot[k]
    }
  })

  it("uses the direct LMS host for both lmsUrl and legacyLmsUrl", async () => {
    const getIframeProps = await loadHelper()
    const props = getIframeProps()
    expect(props.lmsUrl).toBe("https://learn.iblai.app")
    expect(props.legacyLmsUrl).toBe("https://learn.iblai.app")
  })

  it("uses NEXT_PUBLIC_MFE_URL for mfeUrl when set", async () => {
    process.env.NEXT_PUBLIC_MFE_URL = "https://learner.example.com"
    const getIframeProps = await loadHelper()
    expect(getIframeProps().mfeUrl).toBe("https://learner.example.com")
  })

  it("falls back to apps.learn.<domain> for mfeUrl when env is unset", async () => {
    const getIframeProps = await loadHelper()
    expect(getIframeProps().mfeUrl).toBe("https://apps.learn.iblai.app")
  })

  it("ignores NEXT_PUBLIC_API_BASE_URL for the iframe LMS host (CSP guard)", async () => {
    // Even when the data layer points at the API gateway, iframe URLs
    // must stay on the direct LMS host. Anything else loops in CSP
    // failures or 500s on /asset-v1 / /xblock routes.
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.iblai.app"
    const getIframeProps = await loadHelper()
    const props = getIframeProps()
    expect(props.lmsUrl).toBe("https://learn.iblai.app")
    expect(props.legacyLmsUrl).toBe("https://learn.iblai.app")
    expect(props.lmsUrl).not.toContain("/lms")
  })
})
