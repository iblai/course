"use client"

import * as React from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Account } from "@iblai/iblai-js/web-containers/next"

import config from "@/lib/iblai/config"
import { useUrlContext } from "@/lib/iblai/use-url-context"
import { STANDARD_DIALOG_CLASSNAME } from "@/lib/iblai/dialog-style"
import { Spinner } from "@/components/iblai/page-loader"

interface Tenant {
  key: string
  is_admin?: boolean
}

export type OrgAccountTab =
  | "organization"
  | "management"
  | "integrations"
  | "advanced"
  | "billing"
  | "monetization"
  | "purchases"

interface OrgAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Optional handler for the SDK's "Invite user" button. */
  onInviteClick?: () => void
  /** Which SDK Account tab to mount. Default `management`. */
  tab?: OrgAccountTab
}

/**
 * Mounts the SDK `<Account>` in a dialog with a single SDK tab selected
 * via `targetTab`. The SDK tab rail is hidden via scoped CSS so the
 * dialog acts as a focused single-purpose surface (Monetization,
 * Billing, etc.) — same pattern hq's `<OrgAccountDialog>` uses.
 *
 * The SDK gates tabs by `tab.id === 'management' ? hasManagementPermissions : isAdmin`.
 *  - `management`: `isAdmin={false}` + `enableRbac={false}` — the
 *    management permission check short-circuits to true.
 *  - everything else (`monetization`, `billing`, `integrations`,
 *    `advanced`): gated on `isAdmin`, so we pass `isAdmin={true}` or
 *    the tab won't render. `monetization` also requires the tenant's
 *    `enable_monetization` flag (set by an ibl.ai operator).
 */
export function OrgAccountDialog({
  open,
  onOpenChange,
  onInviteClick,
  tab = "management",
}: OrgAccountDialogProps) {
  const { tenantKey, username, ready } = useUrlContext()
  const [tenants, setTenants] = React.useState<Tenant[]>([])
  const [email, setEmail] = React.useState("")

  React.useEffect(() => {
    if (!ready) return
    try {
      const raw = localStorage.getItem("tenants")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setTenants(parsed)
      }
    } catch {
      /* ignore */
    }
    try {
      const userRaw = localStorage.getItem("userData")
      if (userRaw) {
        const parsed = JSON.parse(userRaw)
        setEmail(parsed?.user_email ?? parsed?.email ?? "")
      }
    } catch {
      /* ignore */
    }
  }, [ready])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={STANDARD_DIALOG_CLASSNAME} hideCloseButton>
        <DialogTitle className="sr-only">Account</DialogTitle>
        <div className="org-account-dialog flex min-h-0 flex-1 flex-col overflow-hidden">
          {/*
            Hide the SDK's tab-switcher rail since we mount one tab at a
            time. SDK renders the desktop rail as `width: 320px`; the
            mobile tab strip uses `lg:hidden`. Hide both, scoped to this
            wrapper so other dialogs are unaffected.
          */}
          <style>{`
            .org-account-dialog div[style*="width: 320px"] { display: none !important; }
            .org-account-dialog div[style*="width:320px"]  { display: none !important; }
            .org-account-dialog .lg\\:hidden { display: none !important; }
          `}</style>
          {ready && tenantKey && username ? (
            <Account
              tenant={tenantKey}
              tenants={tenants as never}
              username={username}
              email={email}
              mainPlatformKey={config.mainTenantKey()}
              isAdmin={tab !== "management"}
              enableRbac={false}
              rbacPermissions={{}}
              authURL={config.authUrl()}
              currentPlatformBaseDomain={config.platformBaseDomain()}
              currentSPA="agent"
              onInviteClick={onInviteClick ?? (() => {})}
              onClose={() => onOpenChange(false)}
              targetTab={tab as never}
              showPlatformName
              useGravatarPicFallback
            />
          ) : (
            <div className="flex h-full items-center justify-center py-12 text-sm text-muted-foreground">
              {!ready ? <Spinner /> : "Sign in to view account settings."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
