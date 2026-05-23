"use client"

import { useEffect, useState } from "react"

import { AnalyticsFinancialStats } from "@iblai/iblai-js/web-containers"

import { resolveAppTenant } from "@/lib/iblai/tenant"

/**
 * Financial analytics. Same surface hq's `footer-billing` action routes
 * to. Per `/iblai-analytics` skill, `AnalyticsFinancialStats` does NOT
 * accept a `basePath` prop.
 */
export default function AnalyticsFinancialPage() {
  const [tenantKey, setTenantKey] = useState("")
  useEffect(() => {
    setTenantKey(resolveAppTenant())
  }, [])
  if (!tenantKey) return null
  return <AnalyticsFinancialStats tenantKey={tenantKey} mentorId="" />
}
