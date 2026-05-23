'use client'

import * as React from 'react'
import { CreditBalance } from '@iblai/iblai-js/web-containers'

import config from '@/lib/iblai/config'
import { useUrlContext } from '@/lib/iblai/use-url-context'

interface UserData {
  email?: string
  user_email?: string
}

interface TenantEntry {
  key: string
  show_paywall?: boolean
}

/**
 * Navbar credit balance dropdown, following the mentorai pattern at
 * `app/platform/[tenantKey]/[mentorId]/_components/nav-bar/index.tsx`.
 *
 * Renders nothing unless:
 *   - the user is signed in (has `userData` in localStorage)
 *   - `current_tenant.show_paywall === true` (paywall enabled for this tenant)
 *
 * The SDK component itself fetches billing info, plan, and auto-recharge
 * config; the host only supplies tenant / username / email / URLs.
 */
export function HeaderCreditBalance() {
  const { tenantKey, username, ready } = useUrlContext()
  const [showPaywall, setShowPaywall] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [redirectUrl, setRedirectUrl] = React.useState('')

  React.useEffect(() => {
    if (!ready) return
    if (typeof window === 'undefined') return

    setRedirectUrl(window.location.origin)

    try {
      const raw = localStorage.getItem('userData')
      if (raw) {
        const parsed = JSON.parse(raw) as UserData
        setEmail(parsed.email ?? parsed.user_email ?? '')
      }
    } catch {
      /* ignore */
    }

    // `show_paywall` lives on each tenant entry in `localStorage.tenants`
    // (set by SDK TenantProvider after SSO). `localStorage.current_tenant`
    // is just the active tenant key — no flags.
    try {
      const raw = localStorage.getItem('tenants')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const match = (parsed as TenantEntry[]).find(
            (t) => t.key === tenantKey,
          )
          setShowPaywall(Boolean(match?.show_paywall))
        }
      }
    } catch {
      /* ignore */
    }
  }, [ready, tenantKey])

  if (!ready || !tenantKey || !username || !showPaywall) {
    return null
  }

  return (
    <CreditBalance
      tenant={tenantKey}
      enabled={true}
      redirectUrl={redirectUrl}
      mainPlatformKey={config.mainTenantKey()}
      currentUserEmail={email}
      username={username}
    />
  )
}
