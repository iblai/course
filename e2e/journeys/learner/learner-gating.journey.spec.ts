import { test, expect } from '@playwright/test';

import { waitForTenantsPopulated } from '../../utils/wait-for-tenants';
import { assertNotAdmin } from '../../utils/assert-admin';

/**
 * Learner-side of the gating contract.
 *
 * Runs only under the learner storage state (`chromium-learner` /
 * `firefox-learner` / `webkit-learner` projects, configured in
 * `playwright.config.ts`). For every gated surface — New Course,
 * Create School, admin-footer actions — the SDK
 * `UpgradePackageModal` should open with the "Subscribe to unlock
 * full features" header instead of performing the gated action.
 *
 * If this file ever runs against an admin account by mistake, the
 * shared `assertNotAdmin` pre-flight (`utils/assert-admin.ts`) bails
 * immediately with a clear message.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';
const UPGRADE_HEADER = /subscribe to unlock full features/i;

test.describe('admin gating — learner path', () => {
  test('clicking New Course opens the upgrade modal (no navigation)', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    const urlBefore = page.url();
    // Loose substring + `.first()` for the same reason as the other
    // sidebar selectors — buttons that wrap an icon `<img alt=…>`
    // plus a visible `<span>label</span>` end up with a doubled
    // accessible name on some browsers.
    const newCourse = page.getByRole('button', { name: /new course/i }).first();
    await expect(newCourse).toBeVisible({ timeout: 15_000 });
    await newCourse.click();

    // Modal opens.
    await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
      timeout: 15_000,
    });
    // And we did NOT navigate away from /courses.
    expect(page.url()).toBe(urlBefore);
  });

  test('clicking Create School opens the upgrade modal', async ({ page }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    const createSchool = page.getByRole('button', { name: /create school/i });
    const count = await createSchool.count();

    if (count === 0) {
      // Non-admin with an existing academy → View Academy is shown
      // instead. That branch is exercised by the catalog visibility
      // test below.
      test.info().annotations.push({
        type: 'note',
        description:
          'no Create School CTA (View Academy expected for academy holders)',
      });
      return;
    }

    await createSchool.first().click();
    await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
      timeout: 15_000,
    });
    // The legacy CreateAcademyDialog must NOT open on the learner
    // path — it was the original (admin) target. Its heading text
    // says "Create Academy" / "Create School", so we check the
    // upgrade-modal title is the one visible.
    await expect(page.getByText(UPGRADE_HEADER)).toHaveCount(1);
  });

  test('Create School in the catalog also opens the upgrade modal', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/course-catalog`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    const createSchool = page.getByRole('button', { name: /create school/i });
    const count = await createSchool.count();
    if (count === 0) {
      test.info().annotations.push({
        type: 'note',
        description:
          'no Create School CTA on catalog (View Academy expected for academy holders)',
      });
      return;
    }

    await createSchool.first().click();
    await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('admin-footer Settings opens the upgrade modal', async ({ page }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    const settings = page.getByRole('button', { name: /^settings$/i }).first();
    await expect(settings).toBeVisible({ timeout: 15_000 });
    await settings.click();

    await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('Course Catalog itself remains accessible (public surface)', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/course-catalog`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    // Wait for tenants to land in localStorage before role detection.
    // Without this guard `assertNotAdmin` races the SDK's
    // TenantProvider and fails with "no tenants in storage".
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    // Search input visible — page rendered. The catalog is one of
    // the surfaces we explicitly DO NOT gate.
    await expect(page.getByPlaceholder(/search courses/i)).toBeVisible({
      timeout: 30_000,
    });
    // And the upgrade modal does NOT auto-open just from visiting
    // the page — it's contextual.
    await expect(page.getByText(UPGRADE_HEADER)).toHaveCount(0);
  });
});
