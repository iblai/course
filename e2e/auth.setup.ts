import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({
  path: path.resolve(__dirname, '.env.development'),
});

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

/**
 * Auth setup — runs once per (role × browser) combination and saves
 * the resulting storage state so journey tests can re-use it.
 *
 * Project name convention: `setup-<role>-<browser>` (e.g.
 * `setup-admin-chromium`, `setup-learner-webkit`). The role piece
 * determines which credentials we pull from
 * `e2e/.env.development`:
 *
 *   PLAYWRIGHT_ADMIN_USERNAME / PLAYWRIGHT_ADMIN_PASSWORD
 *   PLAYWRIGHT_LEARNER_USERNAME / PLAYWRIGHT_LEARNER_PASSWORD
 *
 * `PLAYWRIGHT_USERNAME` / `PLAYWRIGHT_PASSWORD` are accepted as a
 * legacy fallback (the single-account setup we started with).
 */
setup('authenticate', async ({ page }) => {
  setup.setTimeout(120_000);

  const projectName = setup.info().project.name; // e.g. setup-admin-chromium
  const role = projectName.includes('learner') ? 'learner' : 'admin';

  const username =
    process.env[`PLAYWRIGHT_${role.toUpperCase()}_USERNAME`] ||
    process.env.PLAYWRIGHT_USERNAME ||
    '';
  const password =
    process.env[`PLAYWRIGHT_${role.toUpperCase()}_PASSWORD`] ||
    process.env.PLAYWRIGHT_PASSWORD ||
    '';

  if (!username || !password) {
    throw new Error(
      `Missing credentials for role "${role}". Set ` +
        `PLAYWRIGHT_${role.toUpperCase()}_USERNAME / PLAYWRIGHT_${role.toUpperCase()}_PASSWORD ` +
        `in e2e/.env.development.`,
    );
  }

  // Navigate to the app — AuthProvider redirects to the auth SPA
  // almost immediately. Firefox aborts the initial response under
  // `waitUntil: 'domcontentloaded'` with `NS_BINDING_ABORTED` when
  // the redirect cancels the in-flight load. `commit` just confirms
  // navigation started; the `waitForURL(/login)` below catches the
  // redirect target.
  await page
    .goto(APP_HOST, { waitUntil: 'commit', timeout: 30_000 })
    .catch(() => null);

  // Wait for the auth SPA login page
  await page.waitForURL(
    (url) => url.href.includes('/login'),
    { timeout: 60_000 },
  );

  // Click "Continue with Password" to reveal the password fields
  const continueWithPassword = page.getByRole('button', {
    name: /continue with password/i,
  });
  await expect(continueWithPassword).toBeVisible({ timeout: 30_000 });
  await continueWithPassword.click();

  // Fill in credentials
  await page.getByRole('textbox', { name: /email/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);

  // Submit
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Wait for redirect back to the app
  await page.waitForURL((url) => url.href.startsWith(APP_HOST), {
    timeout: 120_000,
  });

  // Wait for auth tokens to be stored in localStorage
  await page.waitForFunction(
    () => !!window.localStorage.getItem('dm_token'),
    { timeout: 30_000 },
  );

  // Save storage state keyed by role + browser so each test project
  // can pick up the one it needs.
  const authDir = 'playwright/.auth';
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  await page
    .context()
    .storageState({ path: `${authDir}/user-${projectName}.json` });
});
