import type { Page } from '@playwright/test';

/**
 * Wait for the SDK's `TenantProvider` to actually populate
 * `localStorage.tenants` with at least one entry (the previous
 * `!!getItem('tenants')` check passed on the empty-array string
 * `"[]"`, which was the cause of every "tenants: []" diagnostic
 * failure during the first hardening round).
 *
 * Returns silently on success; throws (or times out) only when
 * tenants are genuinely never populated, which is itself a useful
 * signal — the calling test should then bail with its own
 * higher-level diagnostic.
 */
export async function waitForTenantsPopulated(
  page: Page,
  { timeout = 30_000 }: { timeout?: number } = {},
): Promise<void> {
  await page.waitForFunction(
    () => {
      try {
        const raw = window.localStorage.getItem('tenants');
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    },
    { timeout },
  );
}
