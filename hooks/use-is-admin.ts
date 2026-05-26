'use client'

import * as React from 'react'

import { useUrlContext } from '@/lib/iblai/use-url-context'

interface TenantEntry {
  key: string
  is_admin?: boolean
}

/**
 * Returns whether the active user is an admin of the current tenant.
 * Reads `localStorage.tenants` (set by the SDK's `<TenantProvider>`)
 * and matches the entry whose `key` equals the active tenant key from
 * `useUrlContext()`. Returns `false` until the URL context is ready or
 * if no matching tenant entry exists.
 *
 * Mentorai's `useIsAdmin` lives at `@/hooks/use-user.ts`; this is the
 * hq-only port. Centralized so navbar / sidebar / dialogs can gate on
 * a single source of truth instead of each repeating the parse.
 */
export function useIsAdmin(): boolean {
  const { tenantKey, ready } = useUrlContext()
  const [isAdmin, setIsAdmin] = React.useState(false)

  // Poll localStorage briefly so we pick up the `tenants` list once the
  // SDK's TenantProvider hydrates it. Same-tab writes don't fire a
  // `storage` event, and `tenants` is reset to empty during a tenant
  // switch (e.g. the Stripe-upgrade round-trip), so a one-shot read on
  // mount can return stale `false` and let the upgrade modal flash.
  React.useEffect(() => {
    if (!ready) return
    if (typeof window === 'undefined') return

    let cancelled = false
    let attempts = 0

    const check = (): boolean => {
      try {
        const raw = localStorage.getItem('tenants')
        if (!raw) return false
        const parsed = JSON.parse(raw) as TenantEntry[]
        if (!Array.isArray(parsed) || parsed.length === 0) return false
        if (cancelled) return true
        const match = parsed.find((t) => t.key === tenantKey)
        setIsAdmin(Boolean(match?.is_admin))
        return true
      } catch {
        return false
      }
    }

    if (check()) return

    const id = window.setInterval(() => {
      attempts += 1
      if (cancelled || check() || attempts >= 40) {
        window.clearInterval(id)
      }
    }, 50)

    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [ready, tenantKey])

  return isAdmin
}
