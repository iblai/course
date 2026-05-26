"use client"

import { useEffect, useState } from "react"
import { UpgradePackageModal } from "@iblai/iblai-js/web-containers"

import { useIsAdmin } from "@/hooks/use-is-admin"
import { resolveAppTenant } from "@/lib/iblai/tenant"
import { hasStripeCheckoutMarker } from "@/lib/iblai/stripe-callback"
import config from "@/lib/iblai/config"

/**
 * Resolve the signed-in user's email from the SDK's `userData` blob in
 * localStorage (same source `useUrlContext` reads the username from).
 */
function currentUserEmail(): string {
  if (typeof window === "undefined") return ""
  try {
    const parsed = JSON.parse(localStorage.getItem("userData") || "{}")
    return parsed.user_email ?? parsed.email ?? ""
  } catch {
    return ""
  }
}

/** Non-empty `tenants` localStorage means the SDK has hydrated the list. */
function hasTenantsData(): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = localStorage.getItem("tenants")
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0
  } catch {
    return false
  }
}

/**
 * True while a Stripe-checkout return / cross-SPA tenant switch is in
 * flight. Suppresses the modal during the brief window where the user
 * has landed on the new tenant but the SDK hasn't finished refreshing
 * the tenants list yet (and `useIsAdmin` would briefly return false).
 */
function isCallbackInFlight(): boolean {
  if (typeof window === "undefined") return false
  if (
    typeof document !== "undefined" &&
    document.cookie.includes("ibl_tenant_switching")
  ) {
    return true
  }
  return hasStripeCheckoutMarker(window.location.search)
}

/**
 * Upgrade-subscription prompt for non-admin users, backed by the SDK
 * `UpgradePackageModal`.
 *
 * Ported from videoai's `UpdateSubscriptionModal` (which itself replaces
 * the old `AdminGuard` 403 page). The courseai version checks only
 * platform-admin rights (no per-tenant credential equivalent).
 *
 * Two modes:
 *  - **Controlled**: pass `open` + `onClose` — the sidebar's "New
 *    Course" button uses this to cancel navigation and show the modal
 *    when a non-admin clicks it.
 *  - **Uncontrolled**: omit props — self-opens once on mount. Useful
 *    if a future page wants the modal to auto-open on direct visits.
 *
 * Renders nothing while admin state is still resolving, or when the
 * caller doesn't need access (admins always pass through silently).
 */
interface UpdateSubscriptionModalProps {
  open?: boolean
  onClose?: () => void
}

export function UpdateSubscriptionModal({
  open: openProp,
  onClose,
}: UpdateSubscriptionModalProps = {}) {
  const isAdmin = useIsAdmin()
  const [tenantsReady, setTenantsReady] = useState(() => hasTenantsData())
  const [openState, setOpenState] = useState(true)

  // Wait for `localStorage.tenants` to populate. After a Stripe upgrade
  // the tenant switch wipes localStorage; until the SDK refetches the
  // tenants list, `useIsAdmin` returns false and the modal would flash
  // for users who are admins of the freshly-purchased tenant.
  useEffect(() => {
    if (tenantsReady) return
    let cancelled = false
    let attempts = 0
    const id = window.setInterval(() => {
      attempts += 1
      if (cancelled) return
      if (hasTenantsData() || attempts >= 40) {
        setTenantsReady(true)
        window.clearInterval(id)
      }
    }, 50)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [tenantsReady])

  if (!tenantsReady) return null
  if (isCallbackInFlight()) return null

  const tenant = resolveAppTenant()
  const email = currentUserEmail()
  const needsAccess = !isAdmin

  if (!needsAccess || !email) return null

  const controlled = openProp !== undefined
  const open = controlled ? openProp : openState
  const handleClose = () => {
    if (controlled) onClose?.()
    else setOpenState(false)
  }

  // Mount the SDK modal ONLY when it should be visible. The SDK's
  // `UpgradePackageModal` fires its Stripe pricing-page session +
  // redirect logic at mount time, regardless of the `open` prop —
  // mounting it with `open={false}` (every page, all the time) caused
  // the "it keeps redirecting" loop. Mentorai's `ModalContainer` uses
  // the same conditional-mount pattern.
  if (!open) return null

  return (
    <UpgradePackageModal
      open={open}
      onClose={handleClose}
      redirectUrl={
        typeof window !== "undefined" ? window.location.href : ""
      }
      mainPlatformKey={config.mainTenantKey()}
      sourcePlatformKey={tenant}
      currentUserEmail={email}
    />
  )
}
