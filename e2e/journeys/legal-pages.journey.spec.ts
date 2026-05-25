import { test, expect } from '@playwright/test';

/**
 * `/privacy` and `/terms` are thin server-side `redirect()` shells
 * pointing at the canonical iblai legal pages. The in-app path is
 * what the footer links target, so a future iblai-domain or
 * route rename only needs to update those two files instead of every
 * footer in the app.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

test.describe('legal pages', () => {
  test('/privacy redirects to ibl.ai/privacy-policy', async ({ page }) => {
    await page.goto(`${APP_HOST}/privacy`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    await page.waitForURL(
      (url) => url.href.startsWith('https://ibl.ai/privacy-policy'),
      { timeout: 15_000 },
    );
  });

  test('/terms redirects to ibl.ai/terms-of-use', async ({ page }) => {
    await page.goto(`${APP_HOST}/terms`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    // 30s budget — cross-origin top-level navigations to ibl.ai can
    // be slower than the local-origin /privacy case, depending on
    // how the upstream page resolves.
    await page.waitForURL(
      (url) => url.href.startsWith('https://ibl.ai/terms-of-use'),
      { timeout: 30_000 },
    );
  });

  test('platform footer links target /privacy and /terms (not "#")', async ({ page }) => {
    // The footer is mounted on every authenticated page. `/courses`
    // is a stable surface to inspect it from — it's part of the
    // public-to-students nav and loads without admin rights.
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    // Platform footer is `position: fixed; bottom: 0` — wait for it
    // to be attached before searching its content. WebKit in
    // particular can run our test before the footer's first paint
    // when the page is busy with auth/tenant providers.
    await page
      .locator('footer')
      .first()
      .waitFor({ state: 'attached', timeout: 30_000 })
      .catch(() => null);

    // Match the link by `href` directly — more stable than the
    // accessible-name regex (the platform footer text was tweaked a
    // few times during the rebrand and we don't want to recheck
    // surface copy here).
    const privacyByHref = page.locator('a[href="/privacy"]').first();
    const termsByHref = page.locator('a[href="/terms"]').first();
    try {
      await expect(privacyByHref).toHaveCount(1, { timeout: 30_000 });
      await expect(termsByHref).toHaveCount(1, { timeout: 30_000 });
    } catch (err) {
      // If the footer isn't mounted at all (page errored out), dump
      // every <a href> on the page so the failure points at the real
      // root cause instead of "link not found".
      const allHrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a')).map((a) => a.getAttribute('href')),
      );
      throw new Error(
        `expected <a href="/privacy"> and <a href="/terms"> on /courses.\n` +
          `  hrefs seen: ${JSON.stringify(allHrefs)}\n  underlying: ${(err as Error).message}`,
      );
    }
  });
});
