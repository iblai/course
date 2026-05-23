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

  React.useEffect(() => {
    if (!ready) return
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('tenants')
      if (!raw) return
      const parsed = JSON.parse(raw) as TenantEntry[]
      if (Array.isArray(parsed)) {
        const match = parsed.find((t) => t.key === tenantKey)
        setIsAdmin(Boolean(match?.is_admin))
      }
    } catch {
      /* ignore */
    }
  }, [ready, tenantKey])

  return isAdmin
}
