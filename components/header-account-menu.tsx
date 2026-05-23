'use client'

import * as React from 'react'
import { UserProfileDropdown } from '@iblai/iblai-js/web-containers/next'

import { handleLogout } from '@/lib/iblai/auth-utils'
import { handleTenantSwitch } from '@/lib/iblai/tenant-switch'
import { useUrlContext } from '@/lib/iblai/use-url-context'
import { useIsAdmin } from '@/hooks/use-is-admin'
import config from '@/lib/iblai/config'
import { cn } from '@/lib/utils'

interface UserData {
  user_nicename?: string
  username?: string
  email?: string
  user_email?: string
}

interface Tenant {
  key: string
  name?: string
  display_name?: string
  is_admin?: boolean
}

function readUserData(): UserData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('userData')
    return raw ? (JSON.parse(raw) as UserData) : null
  } catch {
    return null
  }
}

function readTenants(): Tenant[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('tenants')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Tenant[]) : []
  } catch {
    return []
  }
}

/**
 * Account menu. SDK `UserProfileDropdown` handles the entire dropdown
 * shell: avatar trigger, name/email label, tenant switcher, Profile /
 * Account / Help / Logout items, and the SDK's own Profile + Account
 * modals.
 *
 * Replaces hq's hand-rolled DropdownMenu + tenant Select + AccountDialog /
 * OrgAccountDialog mounts. hq-specific items the SDK has no slot for
 * (Pricing, Usage) are intentionally dropped.
 */
export function HeaderAccountMenu({ className }: { className?: string }) {
  const { tenantKey: activeTenantKey } = useUrlContext()
  const isAdmin = useIsAdmin()
  const [userData, setUserData] = React.useState<UserData | null>(null)
  const [tenants, setTenants] = React.useState<Tenant[]>([])

  React.useEffect(() => {
    setUserData(readUserData())
    setTenants(readTenants())
  }, [])

  const email = userData?.email || userData?.user_email || ''
  const username = userData?.username || userData?.user_nicename || ''

  return (
    <div className={cn('flex items-center', className)}>
      <UserProfileDropdown
        email={email}
        username={username}
        mainPlatformKey={config.mainTenantKey()}
        tenantKey={activeTenantKey || ''}
        userTenants={tenants as any}
        userIsAdmin={isAdmin}
        showProfileTab
        showAccountTab
        showTenantSwitcher
        showHelpLink
        showLogoutButton
        helpCenterUrl="https://ibl.ai/docs"
        authURL={config.authUrl()}
        currentPlatformBaseDomain={config.platformBaseDomain()}
        onTenantChange={(key: string) => {
          if (typeof window === 'undefined') return
          // Cross-SPA tenant switch -- re-issues tokens scoped to the
          // new tenant via the auth SPA. Plain `localStorage.setItem +
          // reload` gets bounced back by `<TenantProvider>`.
          void handleTenantSwitch(key, { saveRedirect: true })
        }}
        onLogout={() => handleLogout()}
        // SDK requires it but hq has no profile-update side-effect to
        // hook -- the SDK Profile modal owns its own write path.
        onTenantUpdate={() => {}}
      />
    </div>
  )
}
