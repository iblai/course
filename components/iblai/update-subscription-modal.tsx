"use client"

import { useEffect, useState } from "react"
import { UpgradePackageModal } from "@iblai/iblai-js/web-containers"

import { useIsAdmin } from "@/hooks/use-is-admin"
import { resolveAppTenant } from "@/lib/iblai/tenant"
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
  const [resolved, setResolved] = useState(false)
  const [openState, setOpenState] = useState(true)

  // One-tick delay so admin state from localStorage settles before the
  // first render — otherwise admins briefly see the modal flash.
  useEffect(() => {
    const id = window.setTimeout(() => setResolved(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  if (!resolved) return null

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
        typeof window !== "undefined" ? window.location.origin : ""
      }
      mainPlatformKey={config.mainTenantKey()}
      sourcePlatformKey={tenant}
      currentUserEmail={email}
    />
  )
}
