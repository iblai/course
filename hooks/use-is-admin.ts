'use client'

import { useAdminStatus } from './use-admin-status'

/**
 * Returns whether the active user is an admin of the current tenant.
 *
 * Thin boolean wrapper over `useAdminStatus()` (which reads + polls
 * `localStorage.tenants`). Returns `false` until the tenant list has
 * hydrated (`loading`) and for non-admins (`denied`) — preserving the
 * original contract, while keeping the `tenants` parse single-sourced.
 *
 * Callers that need to tell "still hydrating" apart from "confirmed not
 * admin" (e.g. redirect logic) should use `useAdminStatus()` directly so
 * they don't act on a transient `false`.
 */
export function useIsAdmin(): boolean {
  return useAdminStatus() === 'admin'
}
