import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/iblai/config", () => ({
  default: { authUrl: () => "https://auth.test" },
}))

// The helper does a dynamic `import("@iblai/iblai-js/web-utils")` inside
// a try/catch to call `clearCurrentTenantCookie()`. Stub it so the test
// doesn't pull the real SDK module graph in (and we can verify it gets
// called as part of the broadcast path).
const clearCurrentTenantCookie = vi.fn()
vi.mock("@iblai/iblai-js/web-utils", () => ({
  clearCurrentTenantCookie,
}))

import { handleTenantSwitch } from "@/lib/iblai/tenant-switch"

interface MutableLocation {
  href: string
  origin: string
  pathname: string
  search: string
  hostname: string
}

const originalLocation = window.location
let location: MutableLocation

function setLocation(href: string) {
  const url = new URL(href)
  location = {
    href,
    origin: url.origin,
    pathname: url.pathname,
    search: url.search,
    hostname: url.hostname,
  }
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: location,
  })
}

function clearCookies() {
  if (typeof document === "undefined") return
  for (const c of document.cookie.split(";")) {
    const eq = c.indexOf("=")
    const name = (eq > -1 ? c.slice(0, eq) : c).trim()
    if (!name) continue
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }
}

/**
 * Node 22's built-in localStorage leaks into jsdom via globalThis
 * aliasing and is missing `.clear()`. Stubbing per-test gives us a
 * deterministic Storage impl across Node versions. Same pattern as
 * `course-actions-network.test.ts`.
 */
function makeStorageStub(): Storage {
  const store: Record<string, string> = {}
  return {
    get length() {
      return Object.keys(store).length
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k]
    },
    getItem: (k) => (k in store ? store[k] : null),
    key: (i) => Object.keys(store)[i] ?? null,
    removeItem: (k) => {
      delete store[k]
    },
    setItem: (k, v) => {
      store[k] = String(v)
    },
  }
}

describe("handleTenantSwitch", () => {
  let storage: Storage
  let cookieWrites: string[]
  const originalCookieDescriptor = Object.getOwnPropertyDescriptor(
    Document.prototype,
    "cookie",
  )

  beforeEach(() => {
    storage = makeStorageStub()
    vi.stubGlobal("localStorage", storage)
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      writable: true,
      value: storage,
    })
    // JSDOM rejects `Secure` cookies on its non-HTTPS default URL, so
    // capture writes ourselves to assert what the helper attempted.
    cookieWrites = []
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => cookieWrites.join("; "),
      set: (val: string) => {
        cookieWrites.push(val)
      },
    })
    clearCurrentTenantCookie.mockClear()
    setLocation("https://app.test/courses?ref=email")
  })
  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: originalLocation,
    })
    vi.unstubAllGlobals()
    if (originalCookieDescriptor) {
      Object.defineProperty(Document.prototype, "cookie", originalCookieDescriptor)
    }
  })

  it("no-ops when tenant equals the active one", async () => {
    localStorage.setItem("tenant", "acme")
    const before = location.href
    await handleTenantSwitch("acme")
    expect(location.href).toBe(before)
    // The broadcast/cookie path is also skipped on the equality return.
    expect(cookieWrites).toHaveLength(0)
  })

  it("clears localStorage and writes the new tenant key before redirecting", async () => {
    localStorage.setItem("tenant", "old")
    localStorage.setItem("axd_token", "stale")
    await handleTenantSwitch("new-tenant")
    expect(localStorage.getItem("tenant")).toBe("new-tenant")
    expect(localStorage.getItem("axd_token")).toBeNull()
  })

  it("redirects to /login/complete with tenant + redirect-to defaulted to the origin", async () => {
    await handleTenantSwitch("new-tenant")
    const url = new URL(location.href)
    expect(url.origin + url.pathname).toBe("https://auth.test/login/complete")
    expect(url.searchParams.get("tenant")).toBe("new-tenant")
    expect(url.searchParams.get("redirect-to")).toBe("https://app.test")
  })

  it("uses the provided redirectUrl when set", async () => {
    await handleTenantSwitch("new-tenant", {
      redirectUrl: "https://app.test/courses",
    })
    const url = new URL(location.href)
    expect(url.searchParams.get("redirect-to")).toBe("https://app.test/courses")
  })

  it("forwards the edx_jwt_token as the `token` query when present", async () => {
    localStorage.setItem("edx_jwt_token", "jwt-value")
    await handleTenantSwitch("new-tenant")
    const url = new URL(location.href)
    expect(url.searchParams.get("token")).toBe("jwt-value")
  })

  it("omits the `token` query when no edx_jwt_token exists", async () => {
    await handleTenantSwitch("new-tenant")
    const url = new URL(location.href)
    expect(url.searchParams.get("token")).toBeNull()
  })

  it("sets the cross-SPA `ibl_tenant_switching` cookie before redirecting", async () => {
    await handleTenantSwitch("new-tenant")
    const wrote = cookieWrites.find((c) => c.startsWith("ibl_tenant_switching="))
    expect(wrote).toBeDefined()
    expect(wrote).toContain("ibl_tenant_switching=true")
    expect(wrote).toContain("path=/")
  })

  it("invokes clearCurrentTenantCookie from the SDK on the broadcast path", async () => {
    await handleTenantSwitch("new-tenant")
    expect(clearCurrentTenantCookie).toHaveBeenCalledTimes(1)
  })

  it("bails (no localStorage mutation, no redirect) when the switching cookie is already set", async () => {
    // Seed the cookie store via our capture array; the helper reads it
    // back through `document.cookie` (mocked above).
    cookieWrites.push("ibl_tenant_switching=true;path=/")
    localStorage.setItem("tenant", "old")
    const before = location.href
    await handleTenantSwitch("new-tenant")
    expect(location.href).toBe(before)
    expect(localStorage.getItem("tenant")).toBe("old")
  })

  it("still proceeds when the cookie is set but broadcastTenantSwitching is false", async () => {
    cookieWrites.push("ibl_tenant_switching=true;path=/")
    localStorage.setItem("tenant", "old")
    await handleTenantSwitch("new-tenant", {
      broadcastTenantSwitching: false,
    })
    // Reached the redirect path despite the cookie being set.
    const url = new URL(location.href)
    expect(url.origin + url.pathname).toBe("https://auth.test/login/complete")
    // And localStorage is intact since the broadcast/clear branch is skipped.
    expect(localStorage.getItem("tenant")).toBe("new-tenant")
  })

  it("preserves the redirect-to localStorage key when saveRedirect=true", async () => {
    setLocation("https://app.test/courses?tab=catalog")
    await handleTenantSwitch("new-tenant", { saveRedirect: true })
    expect(localStorage.getItem("redirect-to")).toBe("/courses?tab=catalog")
  })
})
