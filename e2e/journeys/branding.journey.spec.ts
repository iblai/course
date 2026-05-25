import { test, expect } from '@playwright/test';

/**
 * Pins the rebrand from `wink.school` → `courseAI`:
 *   - <title> says courseAI
 *   - /favicon.ico is served (Next auto-emits the file under app/)
 *   - footer renders the iblai-logo asset (no broken image)
 *
 * A regression here would otherwise only surface visually.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

test.describe('branding', () => {
  test('document title contains courseAI', async ({ page }) => {
    await page.goto(APP_HOST, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await expect(page).toHaveTitle(/courseAI/);
  });

  test('no surviving wink.school strings in the DOM', async ({ page }) => {
    // The rebrand replaced every visible wink.school reference. This
    // test guards against future copy regressing back.
    await page.goto(APP_HOST, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page.waitForLoadState('domcontentloaded');
    const html = await page.content();
    expect(html.toLowerCase()).not.toContain('wink.school');
  });

  test('/favicon.ico is served as an image', async ({ page }) => {
    // Next.js auto-detects `app/favicon.ico` and emits it at the
    // root. Skipping the explicit `icons` metadata block (so the
    // ibl.ai PNG wins over the old light/dark variants) is part of
    // this fix — a 404 here means the auto-detection regressed.
    const response = await page.goto(`${APP_HOST}/favicon.ico`, {
      timeout: 15_000,
    });
    expect(response?.status()).toBe(200);
    const ct = response?.headers()['content-type'] ?? '';
    expect(ct).toMatch(/image\/(x-icon|png|vnd\.microsoft\.icon)/);
  });

  test('the iblai-logo asset loads (footer + sidebar share it)', async ({ page }) => {
    const response = await page.goto(`${APP_HOST}/images/iblai-logo.png`, {
      timeout: 15_000,
    });
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type'] ?? '').toMatch(/image\/png/);
  });
});
