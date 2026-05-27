"use client"

import { useEffect, useState } from "react"

import { AnalyticsReports } from "@iblai/iblai-js/web-containers"

import { resolveAppTenant } from "@/lib/iblai/tenant"

/**
 * Data Reports tab. The SDK `<AnalyticsLayout>` always renders a hard-
 * coded "Data Reports" tab outside the configurable `tabs` array; it
 * routes to `${basePath}/reports`, which 404s without this page.
 */
export default function AnalyticsReportsPage() {
  const [tenantKey, setTenantKey] = useState("")
  useEffect(() => {
    setTenantKey(resolveAppTenant())
  }, [])
  if (!tenantKey) return null
  return <AnalyticsReports tenantKey={tenantKey} selectedMentorId="" />
}
