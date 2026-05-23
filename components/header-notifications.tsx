'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { NotificationDropdown } from '@iblai/iblai-js/web-containers'

import { useUrlContext } from '@/lib/iblai/use-url-context'

interface TenantEntry {
  key: string
  is_admin?: boolean
}

/**
 * Navbar notification bell, following the mentorai pattern. Click "View
 * notifications" routes to `/notifications/{id}` so a future page can
 * render `<NotificationDisplay>`.
 */
export function HeaderNotifications() {
  const router = useRouter()
  const { tenantKey, username, ready } = useUrlContext()
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    if (!ready) return
    try {
      const raw = localStorage.getItem('tenants')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const match = (parsed as TenantEntry[]).find(
            (t) => t.key === tenantKey,
          )
          setIsAdmin(Boolean(match?.is_admin))
        }
      }
    } catch {
      /* ignore */
    }
  }, [ready, tenantKey])

  const handleViewNotifications = React.useCallback(
    (notificationId?: string) => {
      router.push(`/notifications/${notificationId ?? ''}`)
    },
    [router],
  )

  if (!ready || !tenantKey || !username) return null

  return (
    <NotificationDropdown
      org={tenantKey}
      userId={username}
      isAdmin={isAdmin}
      onViewNotifications={handleViewNotifications}
    />
  )
}
