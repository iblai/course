'use client'

import * as React from 'react'

import { useUrlContext } from '@/lib/iblai/use-url-context'

export type AdminStatus = 'loading' | 'admin' | 'denied'

interface TenantEntry {
  key: string
  is_admin?: boolean
}

/**
 * Synchronous tri-state admin read for the active tenant.
 *
 *  - `loading` — `localStorage.tenants` hasn't been written yet (first
 *    SSO landing, or reset mid tenant-switch). Callers MUST NOT treat
 *    this as "not admin": doing so flashes the deny screen for admins on
 *    refresh, and misroutes them away from admin surfaces during the
 *    brief hydration window.
 *  - `admin` / `denied` — the matched tenant entry's `is_admin`, or
 *    `denied` when the active tenant has no entry.
 *
 * Single source of truth for the `tenants` parse, shared by `AdminGate`
 * (synchronous, render-time), `useIsAdmin`, and `useMentorRedirect`.
 */
export function readAdminStatus(tenantKey: string): AdminStatus {
  if (typeof window === 'undefined') return 'loading'
  let raw: string | null
  try {
    raw = window.localStorage.getItem('tenants')
  } catch {
    return 'loading'
  }
  if (!raw) return 'loading'
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return 'loading'
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return 'loading'
  const match = (parsed as TenantEntry[]).find((t) => t?.key === tenantKey)
  return match?.is_admin ? 'admin' : 'denied'
}

/**
 * Reactive tri-state admin status for the active tenant.
 *
 * Polls `localStorage` briefly after mount so the value flips from
 * `loading` to `admin`/`denied` once the SDK's `<TenantProvider>`
 * hydrates `tenants` — same-tab writes don't fire a `storage` event, so
 * a one-shot read on mount can return a stale `loading`. Stays `loading`
 * until `useUrlContext().ready`, and re-evaluates when the active tenant
 * changes.
 */
export function useAdminStatus(): AdminStatus {
  const { tenantKey, ready } = useUrlContext()
  const [status, setStatus] = React.useState<AdminStatus>('loading')

  React.useEffect(() => {
    if (!ready) return
    if (typeof window === 'undefined') return

    let cancelled = false
    let attempts = 0

    // Returns true once tenants have hydrated (terminal state reached),
    // so the caller can stop polling.
    const check = (): boolean => {
      const next = readAdminStatus(tenantKey)
      if (cancelled) return true
      setStatus(next)
      return next !== 'loading'
    }

    if (check()) return

    const id = window.setInterval(() => {
      attempts += 1
      if (cancelled || check() || attempts >= 60) {
        window.clearInterval(id) // ~6s @ 100ms
      }
    }, 100)

    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [ready, tenantKey])

  return status
}
