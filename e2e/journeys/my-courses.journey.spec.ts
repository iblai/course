import { test, expect } from '@playwright/test';

/**
 * `/courses` ("My Courses") regression set. Two recent bugs lived
 * here, so the journey pins their fixes:
 *
 *   1. "course id empty" — when the AI-mentor course-creation API
 *      returned records without a populated `xblock_id`, every row's
 *      action button silently opened `https://learn.<domain>/courses//about`.
 *      The fix toasts on empty courseId instead. We verify the
 *      defensive toast (or the happy-path `window.open`) never lands
 *      on a malformed URL.
 *
 *   2. Footer rebrand — same Privacy / Terms / iblai-logo as the
 *      landing pages; covered in legal-pages + branding.
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

test.describe('/courses page', () => {
  test('My Courses heading and footer render together', async ({ page }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    await expect(
      page.getByRole('heading', { name: /my courses/i }),
    ).toBeVisible({ timeout: 30_000 });

    // Footer also visible — it's mounted by the same shell. Catches a
    // layout regression where the footer slips off-screen.
    await expect(
      page.getByRole('link', { name: /privacy policy/i }).first(),
    ).toBeVisible();
  });

  test('action buttons either work or toast — never open a malformed URL', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    // Wait for either the courses-loaded grid or the empty/loading
    // state to settle.
    await page.waitForFunction(
      () => document.body.innerText.toLowerCase().indexOf('loading courses') === -1,
      { timeout: 30_000 },
    );

    // Grab the first row action (About Course / Schedule / Edit /
    // Preview / View Prompt / Delete). All five share the same
    // handler; testing one is enough for the malformed-URL guard.
    const aboutButton = page
      .locator('button[aria-label="About Course"], button:has-text("About Course")')
      .first();
    const hasAbout = await aboutButton.count();
    if (hasAbout === 0) {
      // No courses for this user — that's a valid empty state, and
      // there's nothing else to assert. Tag the result so failures
      // in CI can be triaged.
      test.info().annotations.push({
        type: 'note',
        description: 'no AI-generated courses for this user; row-action path skipped',
      });
      return;
    }

    // Capture any new-tab pop-up triggered by `window.open`.
    const popupPromise = page
      .waitForEvent('popup', { timeout: 5_000 })
      .catch(() => null);

    await aboutButton.click();
    const popup = await popupPromise;

    if (popup) {
      // Happy path — the row had a real edX locator. Verify the URL
      // is well-formed (no empty path segment after `/courses/`).
      const url = popup.url();
      expect(url).not.toMatch(/\/courses\/\/[^/]*$/);
      expect(url).toMatch(/\/courses\/[^/]+(?:\/|$)/);
      await popup.close();
    } else {
      // No popup → record is missing its courseId. The handler
      // toasts so the user gets feedback instead of a broken tab.
      await expect(
        page.getByText(/missing its edX locator/i),
      ).toBeVisible({ timeout: 5_000 });
    }
  });
});
