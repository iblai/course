import { expect, type Page } from '@playwright/test';

import { waitForTenantsPopulated } from './wait-for-tenants';

/**
 * Pre-flight gate for admin-only journeys.
 *
 * Asserts the active storage state is genuinely admin on the current
 * tenant, so a misconfigured `.env.development` (member account, or the
 * wrong tenant selected after login) fails the gate directly with a
 * useful diagnostic instead of silently corrupting downstream
 * assertions. Shared by every admin journey (`admin-gating`,
 * `course-creation`, ...) so the gating logic is single-sourced.
 */
export async function assertAdmin(page: Page): Promise<void> {
  // Wait for the tenants list to be NON-EMPTY (not just present —
  // the SDK initially writes "[]" on mount, which made the previous
  // `!!getItem('tenants')` guard pass too early). Then wait for
  // `current_tenant` to land.
  await waitForTenantsPopulated(page).catch(() => {
    // Don't throw here — let the diagnostic below report what's
    // actually in storage so the failure message is useful.
  });
  await page
    .waitForFunction(() => !!window.localStorage.getItem('current_tenant'), {
      timeout: 30_000,
    })
    .catch(() => null);

  const result = await page.evaluate(() => {
    // `current_tenant` is written by the SDK as JSON `{key: "..."}`
    // (see lib/iblai/tenant.ts `readCurrentTenantKey`). The fallback
    // (legacy / SDK-only path) is a bare string. Handle both.
    function readTenantKey(): string {
      const raw = window.localStorage.getItem('current_tenant');
      if (!raw) {
        // Last-ditch fallback: SDK also writes a raw key to `tenant`.
        return window.localStorage.getItem('tenant') ?? '';
      }
      try {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.key === 'string'
        ) {
          return parsed.key;
        }
      } catch {
        // raw is a bare string — treat as the key directly.
        if (raw.trim()) return raw;
      }
      return '';
    }
    try {
      const tenant = readTenantKey();
      const raw = window.localStorage.getItem('tenants');
      if (!raw) {
        return {
          tenant,
          ok: false,
          reason: 'no tenants in storage',
          tenantsRaw: null,
        };
      }
      const parsed = JSON.parse(raw) as Array<{
        key?: string;
        is_admin?: boolean;
      }>;
      const match = parsed.find((t) => t?.key === tenant);
      const tenantList = parsed.map(
        (t) => `${t.key}=${t.is_admin ? 'admin' : 'member'}`,
      );
      return {
        tenant,
        ok: Boolean(match?.is_admin),
        reason: match
          ? match.is_admin
            ? 'admin'
            : `tenant present but is_admin=false (account is a member, not admin, on "${tenant}")`
          : `no entry for tenant="${tenant}"; visible tenants: [${tenantList.join(', ')}]`,
        tenantsRaw: tenantList,
      };
    } catch (e) {
      return { tenant: '', ok: false, reason: String(e), tenantsRaw: null };
    }
  });
  expect(
    result.ok,
    `Admin-only journey requires the admin storage state.\n` +
      `  current_tenant: "${result.tenant}"\n` +
      `  tenants:        ${result.tenantsRaw ? JSON.stringify(result.tenantsRaw) : '(empty)'}\n` +
      `  reason:         ${result.reason}\n` +
      `Action: set PLAYWRIGHT_ADMIN_USERNAME/PASSWORD to an account that is_admin=true on the active tenant, ` +
      `or switch the active tenant after login so the admin entry is selected.`,
  ).toBe(true);
}

/**
 * Pre-flight gate for learner-only journeys — the inverse of
 * `assertAdmin`. Asserts the active storage state is genuinely NON-admin
 * on the current tenant, so a journey that pins learner-tier behaviour
 * (upgrade-modal gating, the post-login catalog redirect) fails loudly
 * with a useful diagnostic if it's accidentally run against an admin
 * account instead of silently passing on the wrong code path.
 */
export async function assertNotAdmin(page: Page): Promise<void> {
  await waitForTenantsPopulated(page).catch(() => null);
  await page
    .waitForFunction(() => !!window.localStorage.getItem('current_tenant'), {
      timeout: 30_000,
    })
    .catch(() => null);
  const result = await page.evaluate(() => {
    function readTenantKey(): string {
      const raw = window.localStorage.getItem('current_tenant');
      if (!raw) return window.localStorage.getItem('tenant') ?? '';
      try {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.key === 'string'
        ) {
          return parsed.key;
        }
      } catch {
        if (raw.trim()) return raw;
      }
      return '';
    }
    try {
      const tenant = readTenantKey();
      const raw = window.localStorage.getItem('tenants');
      if (!raw) {
        return { ok: false, reason: 'no tenants in storage', tenant, tenants: null };
      }
      const parsed = JSON.parse(raw) as Array<{
        key?: string;
        is_admin?: boolean;
      }>;
      const match = parsed.find((t) => t?.key === tenant);
      const tenantList = parsed.map(
        (t) => `${t.key}=${t.is_admin ? 'admin' : 'member'}`,
      );
      return {
        ok: !match?.is_admin,
        reason: match?.is_admin
          ? `tenant="${tenant}" reports is_admin=true (use a non-admin account)`
          : 'non-admin',
        tenant,
        tenants: tenantList,
      };
    } catch (e) {
      return { ok: false, reason: String(e), tenant: '', tenants: null };
    }
  });
  expect(
    result.ok,
    `Learner-only journey requires a non-admin account.\n` +
      `  current_tenant: "${result.tenant}"\n` +
      `  tenants:        ${result.tenants ? JSON.stringify(result.tenants) : '(empty)'}\n` +
      `  reason:         ${result.reason}\n` +
      `Action: set PLAYWRIGHT_LEARNER_USERNAME/PASSWORD to a non-admin account.`,
  ).toBe(true);
}
