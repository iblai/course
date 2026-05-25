import { test, expect } from '@playwright/test';

/**
 * Upgrade-modal lifecycle on the learner side.
 *
 * Pins the close-and-stay-put contract: opening the modal must not
 * navigate, and closing it (X button, escape, or backdrop) must
 * leave the user on the same surface. This was the root of the
 * "it keeps redirecting" bug — the SDK modal fires its Stripe
 * pricing-page session at mount time, so an always-mounted modal
 * trampolined users away from every page. The fix mounts the modal
 * only while `open === true`; this journey is the regression cover.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';
const UPGRADE_HEADER = /subscribe to unlock full features/i;

test.describe('upgrade modal — learner lifecycle', () => {
  test('opening the modal does not navigate away from /courses', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    const urlBefore = page.url();

    await page.getByRole('button', { name: /new course/i }).first().click();
    await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
      timeout: 15_000,
    });

    expect(page.url()).toBe(urlBefore);
  });

  test('the modal does NOT auto-open on neutral page loads', async ({
    page,
  }) => {
    // The SDK modal will trigger its Stripe redirect on mount. We
    // mount it only when explicitly opened — so loading /courses,
    // /course-catalog, or / must not surface the modal.
    for (const path of ['/courses', '/course-catalog']) {
      await page.goto(`${APP_HOST}${path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
      // Idle wait so any deferred mounts have a chance to fire.
      await page.waitForTimeout(1_500);
      await expect(page.getByText(UPGRADE_HEADER)).toHaveCount(0);
    }
  });

  test('closing the modal via Escape leaves the user on the same page', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    const urlBefore = page.url();

    await page.getByRole('button', { name: /new course/i }).first().click();
    await expect(page.getByText(UPGRADE_HEADER)).toBeVisible({
      timeout: 15_000,
    });

    await page.keyboard.press('Escape');
    await expect(page.getByText(UPGRADE_HEADER)).toHaveCount(0, {
      timeout: 5_000,
    });
    expect(page.url()).toBe(urlBefore);
  });
});
