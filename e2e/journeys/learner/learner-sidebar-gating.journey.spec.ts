import { test, expect } from '@playwright/test';

import { waitForTenantsPopulated } from '../../utils/wait-for-tenants';

/**
 * Broader sidebar gating contract.
 *
 * `learner-gating.journey.spec.ts` covers New Course + Create School
 * + Settings. This file exercises the remaining gated surfaces
 * routed through `requireAdmin` in
 * `components/platform/sidebar-learner.tsx`:
 *
 *   - Configure (top nav)
 *   - Chats section expand
 *   - New Project section expand
 *   - Invites (admin footer)
 *   - Users (admin footer)
 *   - API (admin footer)
 *   - Billing (admin footer)
 *   - Monetization (admin footer)
 *
 * Each click should open the SDK upgrade modal instead of performing
 * its action. Per-button assertions so a regression in any single
 * one surfaces individually in the report.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';
const UPGRADE_HEADER = /subscribe to unlock full features/i;

async function gotoCourses(page: import('@playwright/test').Page) {
  await page.goto(`${APP_HOST}/courses`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await waitForTenantsPopulated(page);
}

async function expectGated(
  page: import('@playwright/test').Page,
  name: RegExp,
) {
  const urlBefore = page.url();
  // Loose substring match (not `^name$`). Several sidebar items
  // render with both an `<img alt={item.label}>` and a `<span>label</span>`
  // inside the same button, so the computed accessible name is
  // "Label Label" — an anchored regex would miss it. Substring +
  // `.first()` lands on the leaf button when wrappers also match.
  const button = page.getByRole('button', { name }).first();
  await expect(button).toBeVisible({ timeout: 15_000 });
  await button.click();
  await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
    timeout: 15_000,
  });
  // No navigation should have occurred — `requireAdmin` swallows the
  // action and only opens the modal.
  expect(page.url()).toBe(urlBefore);
  // Reset for the next assertion in the file.
  await page.keyboard.press('Escape');
  await expect(page.getByText(UPGRADE_HEADER)).toHaveCount(0, {
    timeout: 5_000,
  });
}

test.describe('admin gating — learner: remaining sidebar items', () => {
  test('Configure opens the upgrade modal', async ({ page }) => {
    await gotoCourses(page);
    await expectGated(page, /configure/i);
  });

  test('Chats expands → upgrade modal', async ({ page }) => {
    await gotoCourses(page);
    await expectGated(page, /chats/i);
  });

  test('New Project section header opens the upgrade modal', async ({
    page,
  }) => {
    await gotoCourses(page);
    await expectGated(page, /new project/i);
  });

  test('Invites (admin footer) opens the upgrade modal', async ({ page }) => {
    await gotoCourses(page);
    await expectGated(page, /^invites$/i);
  });

  test('Users (admin footer) opens the upgrade modal', async ({ page }) => {
    await gotoCourses(page);
    await expectGated(page, /^users$/i);
  });

  test('API (admin footer) opens the upgrade modal', async ({ page }) => {
    await gotoCourses(page);
    await expectGated(page, /^api$/i);
  });

  test('Billing (admin footer) opens the upgrade modal', async ({ page }) => {
    await gotoCourses(page);
    await expectGated(page, /^billing$/i);
  });

  test('Monetization (admin footer) opens the upgrade modal', async ({
    page,
  }) => {
    await gotoCourses(page);
    await expectGated(page, /^monetization$/i);
  });
});
