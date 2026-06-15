import { test, expect } from '@playwright/test';

import { waitForTenantsPopulated } from '../utils/wait-for-tenants';
import { assertAdmin } from '../utils/assert-admin';

/**
 * Admin-side of the gating contract.
 *
 * The matching learner-side journey lives at
 * `journeys/learner/learner-gating.journey.spec.ts` and runs under
 * the learner storage state. Together they pin both branches of
 * `requireAdmin` in `components/platform/sidebar-learner.tsx`.
 *
 * Pre-flight: this test only runs against the admin storage state
 * (`chromium-admin` / `firefox-admin` / `webkit-admin` projects).
 * `assertAdmin` (shared in `utils/assert-admin.ts`) bails fast with a
 * useful error if the storage state somehow lacks admin rights on the
 * active tenant, so a misconfigured `.env.development` fails the
 * gate-keeping test directly instead of corrupting downstream
 * assertions.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

test.describe('admin gating — admin path', () => {
  test('New Course in the sidebar does not show the upgrade modal for admins', async ({
    page,
  }) => {
    // The core admin contract: the click is allowed through — no
    // `<UpgradePackageModal>` interception. Where the user lands
    // afterward depends on their default mentor / `/agents` fallback
    // / current path, which is too tenant-dependent to assert
    // precisely. We only pin "navigated away from /courses AND no
    // upgrade modal".
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertAdmin(page);

    // The sidebar mounts once `useUrlContext().ready` flips true,
    // which trails the tenants write. Wait for the button to
    // actually attach to the DOM before clicking.
    const newCourse = page.getByRole('button', { name: /new course/i });
    await expect(newCourse.first()).toBeVisible({ timeout: 30_000 });

    // Race "we navigated away from /courses" vs "the upgrade modal
    // appeared". The admin contract is exactly: navigation wins. We
    // need the race so we don't false-pass on a slow nav OR
    // false-fail by reading `page.url()` mid-navigation.
    const navigated = page
      .waitForURL((u) => !/\/courses(?:\?|\/|$)/.test(u.pathname + u.search), {
        timeout: 30_000,
      })
      .then(() => 'navigated' as const)
      .catch(() => 'nav-timeout' as const);
    const modalOpened = page
      .getByText(/subscribe to unlock full features/i)
      .waitFor({ state: 'visible', timeout: 30_000 })
      .then(() => 'modal' as const)
      .catch(() => 'modal-timeout' as const);

    await newCourse.first().click();
    const outcome = await Promise.race([navigated, modalOpened]);
    expect(
      outcome,
      `expected admin click to navigate away from /courses; got "${outcome}". ` +
        `Page is currently at ${page.url()}.`,
    ).toBe('navigated');
    // And the modal still must not be present.
    await expect(
      page.getByText(/subscribe to unlock full features/i),
    ).toHaveCount(0);
  });

  test('Create School is hidden for admins on /courses', async ({ page }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertAdmin(page);

    // Admins either see View Academy (when they have one) or
    // nothing. Either way, no Create School button.
    await expect(
      page.getByRole('button', { name: /create school/i }),
    ).toHaveCount(0);
  });

  test('admin-footer Settings opens (no upgrade modal interception)', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertAdmin(page);

    const settings = page.getByRole('button', { name: /^settings$/i }).first();
    await expect(settings).toBeVisible({ timeout: 15_000 });
    await settings.click();

    // The Settings click routes into the SDK Account dialog at the
    // Advanced tab — admin path. No upgrade modal on this code path.
    await expect(
      page.getByText(/subscribe to unlock full features/i),
    ).toHaveCount(0);
  });
});
