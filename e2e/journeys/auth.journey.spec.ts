import { test, expect } from '@playwright/test';

/**
 * Auth journey — verifies the SSO authentication flow.
 *
 * Requires auth.setup.ts to have run first (via the "setup" dependency).
 * The setup saves browser storage state so the user is already logged in.
 */
test.describe('auth journey', () => {
  test('authenticated user lands on the home page', async ({ page }) => {
    const appHost = process.env.APP_HOST || 'http://localhost:3000';

    await page.goto(appHost);

    // User should reach the home page without being redirected to auth SPA
    await page.waitForURL((url) => url.href.startsWith(appHost + '/'), {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(new RegExp(`^${appHost}`));
  });

  test('auth tokens are stored in localStorage', async ({ page }) => {
    const appHost = process.env.APP_HOST || 'http://localhost:3000';

    await page.goto(appHost);

    // The page can redirect through the mentor-redirect chain
    // (/ → /platform/<t>/<m>) mid-test, which destroys execution
    // contexts and makes one-shot `page.evaluate` calls throw
    // "Execution context was destroyed". `waitForFunction` retries
    // until the navigation settles, so we read tokens inside it.
    const axdToken = await page
      .waitForFunction(
        () => window.localStorage.getItem('axd_token') || false,
        { timeout: 30_000 },
      )
      .then((handle) => handle.jsonValue() as Promise<string>);
    expect(axdToken).toBeTruthy();

    const userData = await page
      .waitForFunction(
        () => window.localStorage.getItem('userData') || false,
        { timeout: 30_000 },
      )
      .then((handle) => handle.jsonValue() as Promise<string>);
    expect(userData).toBeTruthy();

    const parsed = JSON.parse(userData);
    expect(parsed).toHaveProperty('user_nicename');
  });
});