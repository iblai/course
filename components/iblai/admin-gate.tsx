"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ShieldAlert, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useUrlContext } from "@/lib/iblai/use-url-context"
import { handleLogout } from "@/lib/iblai/auth-utils"

interface TenantEntry {
  key: string
  is_admin?: boolean
}

/**
 * Synchronous tri-state admin check.
 *
 * Returns `"admin"` / `"denied"` only when `localStorage.tenants` is
 * present AND we know the answer. Returns `"loading"` while tenants
 * haven't been written yet (the SDK's TenantProvider fetches them
 * asynchronously on first SSO; on a refresh they're already there).
 *
 * `useIsAdmin` is `useState(false) + useEffect`, which always yields
 * one render where the state is `false` even if the underlying answer
 * is `true`. That tick is what produces the access-denied flash. We
 * compute synchronously here so AdminGate never has to render through
 * a wrong-then-right transition.
 */
function readAdminStatus(tenantKey: string): "loading" | "admin" | "denied" {
  if (typeof window === "undefined") return "loading"
  let raw: string | null
  try {
    raw = window.localStorage.getItem("tenants")
  } catch {
    return "loading"
  }
  if (!raw) return "loading"
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return "loading"
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return "loading"
  const match = (parsed as TenantEntry[]).find((t) => t?.key === tenantKey)
  return match?.is_admin ? "admin" : "denied"
}

/**
 * Routes that bypass admin gating. The auth handshake and login
 * surfaces must always be reachable, even to non-admin users (a
 * student-tier login bouncing in still has to land somewhere). The
 * shell otherwise renders `<AdminAccessRequired>` and blocks the
 * admin tree from mounting at all — so non-admin sessions don't fire
 * any RTK Query calls against admin-only endpoints.
 */
const PUBLIC_PATHS = ["/login", "/sso-login", "/sso-login-complete"] as const

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

interface UserData {
  email?: string
  user_email?: string
  username?: string
  user_nicename?: string
}

function readUserEmail(): string {
  if (typeof window === "undefined") return ""
  try {
    const raw = window.localStorage.getItem("userData")
    if (!raw) return ""
    const u = JSON.parse(raw) as UserData
    return u.email || u.user_email || u.username || u.user_nicename || ""
  } catch {
    return ""
  }
}

function AdminAccessRequired() {
  const [email, setEmail] = React.useState("")
  React.useEffect(() => setEmail(readUserEmail()), [])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#f5f7fb] to-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,163,236,0.12) 0%, rgba(105,136,255,0.12) 100%)",
          }}
        >
          <ShieldAlert className="h-7 w-7 text-[#3b6bff]" aria-hidden />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-gray-900">
          Admin Access Required
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          This area is restricted to platform admins. Your account doesn&apos;t
          have admin privileges on this tenant. Ask a tenant admin to grant
          you access, or sign in with a different account.
        </p>

        {email ? (
          <p className="mb-6 text-xs text-gray-500">
            Signed in as <span className="font-medium text-gray-700">{email}</span>
          </p>
        ) : null}

        <Button
          type="button"
          onClick={() => handleLogout()}
          className="w-full gap-2 rounded-lg text-white shadow-sm hover:opacity-95"
          style={{
            background:
              "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)",
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign in as a different user
        </Button>
      </div>
    </div>
  )
}

/**
 * Platform-admin gate. Sits between `AuthGate` (which mounts the SDK
 * providers) and the rest of the app tree. Renders children only when
 * the active user is admin on the resolved tenant; otherwise shows
 * `<AdminAccessRequired>`. Public auth surfaces (`/login`,
 * `/sso-login*`) bypass the gate so the SSO callback can complete.
 *
 * The admin status is computed synchronously per render via
 * `readAdminStatus` — no `useEffect` round-trip — so a refresh on an
 * admin account doesn't flash the deny screen between mount and the
 * effect tick.
 *
 * Three terminal states:
 *  - `loading`: tenants haven't been written to localStorage yet (first
 *    SSO landing) → render `null`, NOT the deny screen.
 *  - `admin`:   render the children.
 *  - `denied`:  render `<AdminAccessRequired>`.
 *
 * The `storage` event listener picks up the moment `<TenantProvider>`
 * writes `tenants` to localStorage on first login, so the component
 * re-renders without a manual refresh.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ""
  const { tenantKey, ready } = useUrlContext()

  // Force a re-render when `localStorage.tenants` changes (SDK fetch finishes).
  const [storageTick, setStorageTick] = React.useState(0)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tenants" || e.key === null) setStorageTick((t) => t + 1)
    }
    window.addEventListener("storage", onStorage)
    // Fallback poll: the `storage` event only fires for cross-tab writes.
    // Same-tab writes from `<TenantProvider>` won't trigger it, so poll
    // briefly until tenants appear (or the user has clearly resolved).
    let i = 0
    const id = window.setInterval(() => {
      i++
      setStorageTick((t) => t + 1)
      if (i > 30) window.clearInterval(id) // ~6s @ 200ms
    }, 200)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.clearInterval(id)
    }
  }, [])

  if (isPublicPath(pathname)) return <>{children}</>

  if (!ready) return null

  const status = readAdminStatus(tenantKey)
  // `status` depends on the latest `localStorage.tenants`. `storageTick`
  // forces re-evaluation when the SDK writes them.
  void storageTick

  if (status === "loading") return null
  if (status === "denied") return <AdminAccessRequired />
  return <>{children}</>
}
