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
  platform_name?: string
  is_admin?: boolean
}

function readCurrentTenant(): Tenant | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('current_tenant')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Tenant) : null
  } catch {
    return null
  }
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
 * Help / Logout items, and the SDK's own Profile modal.
 *
 * The dedicated "Account" item is turned off (`showAccountTab={false}`),
 * and the tenant switcher is shown to admins only
 * (`showTenantSwitcher={isAdmin}`) — matching the reference app (os/main).
 *
 * Replaces hq's hand-rolled DropdownMenu + tenant Select + AccountDialog /
 * OrgAccountDialog mounts. hq-specific items the SDK has no slot for
 * (Pricing, Usage) are intentionally dropped.
 */
export function HeaderAccountMenu({ className }: { className?: string }) {
  const { tenantKey: activeTenantKey } = useUrlContext()
  const isAdmin = useIsAdmin()
  // Read userData / tenants synchronously on the very first render so the
  // SDK dropdown never mounts with an empty `username`. The SDK calls
  // `useProfile(username)` internally with no `skip` guard, so a single
  // render with `username=""` fires
  // `GET /api/ibl/users/manage/metadata/?username=` → 400. The SSR pass
  // returns null (no window), so we hydrate to the real values on the
  // first client render and skip rendering until they're present.
  const [userData, setUserData] = React.useState<UserData | null>(() =>
    readUserData(),
  )
  const [tenants, setTenants] = React.useState<Tenant[]>(() => readTenants())
  const [currentTenant, setCurrentTenant] = React.useState<Tenant | null>(() =>
    readCurrentTenant(),
  )

  // Re-read after mount in case another tab wrote new values while this
  // one was hydrating (rare, but cheap).
  React.useEffect(() => {
    setUserData(readUserData())
    setTenants(readTenants())
    setCurrentTenant(readCurrentTenant())
  }, [])

  const email = userData?.email || userData?.user_email || ''
  // `user_nicename` first: the SDK fetches the avatar from
  // `/users/manage/metadata/?username=<this>`, which only resolves the
  // profile image for the canonical nicename slug — not a display
  // `username`. When the two differ, keying on `username` returns no
  // metadata and the avatar renders blank. The rest of the app
  // (`use-url-context`, course-actions, the iblai-profile skill) keys on
  // `user_nicename` too.
  const username = userData?.user_nicename || userData?.username || ''

  // Don't mount the SDK dropdown until we know the username. The SDK
  // fires `getUserMetadata?username=<value>` unconditionally on mount,
  // so passing an empty string produces a 400 on every page load.
  if (!username) return null

  return (
    <div className={cn('flex items-center', className)}>
      <UserProfileDropdown
        email={email}
        username={username}
        mainPlatformKey={config.mainTenantKey()}
        tenantKey={activeTenantKey || ''}
        userTenants={tenants as any}
        // The full active-tenant object (key + platform_name, …). Without
        // it the SDK switcher can't resolve the current tenant and falls
        // back to a generic "Community" label — os/main passes this too.
        currentTenant={currentTenant as any}
        userIsAdmin={isAdmin}
        userIsStudent={!isAdmin}
        showProfileTab
        // Drop the dedicated "Account" item — the tenant switcher below is
        // the only org control we want in this dropdown.
        showAccountTab={false}
        // Admins only — matches os/main (`showTenantSwitcher={userIsAdmin}`).
        // For a non-admin the SDK renders just the current-tenant name (e.g.
        // "Community") with no working switch list, so we hide it.
        showTenantSwitcher={isAdmin}
        showHelpLink
        showLogoutButton
        // Fall back to the user's Gravatar (from their email) when they
        // have no uploaded profile image. Defaults true; set explicitly so
        // the avatar never renders blank.
        enableGravatarOnProfilePic
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
