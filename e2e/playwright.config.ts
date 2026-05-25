import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env.development'),
});

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

/**
 * Playwright configuration.
 *
 * Each (role × browser) pair has its own setup project, which runs
 * the SSO login flow once and writes the resulting storage state to
 * `playwright/.auth/user-setup-<role>-<browser>.json`. Journey
 * projects depend on the matching setup and inherit the
 * pre-authenticated state.
 *
 * Two roles are wired in: `admin` and `learner`. Tests under
 * `journeys/learner/**` only execute against the learner storage
 * state; everything else runs against the admin state (the more
 * privileged account, which can also reach learner-visible
 * surfaces).
 *
 * To run tests:
 *   pnpm test:e2e                  # headless, all role × browser
 *   pnpm test:e2e:ui               # interactive UI
 *   pnpm test:e2e:headed           # headed browser
 *   pnpm test:e2e --project=chromium-admin
 *   pnpm test:e2e --project=chromium-learner
 *
 * Edit e2e/.env.development to configure APP_HOST and the two
 * credential pairs:
 *   PLAYWRIGHT_ADMIN_USERNAME / PLAYWRIGHT_ADMIN_PASSWORD
 *   PLAYWRIGHT_LEARNER_USERNAME / PLAYWRIGHT_LEARNER_PASSWORD
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One worker, no parallelism between projects. The courseai dev
  // server is a real Next.js process — at 4 parallel browsers it
  // struggles, and previously-passing tests time out at 30s waiting
  // for routes to compile. Sequential execution trades wall-clock
  // for determinism.
  workers: 1,
  // Default 30s isn't enough for the auth-provider settling +
  // tenant-provider fetch + page hydration chain when the dev server
  // is warming up. 60s headroom across the board; the truly fast
  // assertions still complete in <1s.
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: APP_HOST,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // ---- Auth setup, per (role × browser) ----
    {
      name: 'setup-admin-chromium',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup-admin-firefox',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'setup-admin-webkit',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'setup-learner-chromium',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup-learner-firefox',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'setup-learner-webkit',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // ---- Admin journeys — run against the admin storage state ----
    {
      name: 'chromium-admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState:
          'playwright/.auth/user-setup-admin-chromium.json',
      },
      dependencies: ['setup-admin-chromium'],
      testMatch: ['journeys/**/*.spec.ts'],
      testIgnore: ['journeys/learner/**'],
    },
    {
      name: 'firefox-admin',
      use: {
        ...devices['Desktop Firefox'],
        storageState:
          'playwright/.auth/user-setup-admin-firefox.json',
      },
      dependencies: ['setup-admin-firefox'],
      testMatch: ['journeys/**/*.spec.ts'],
      testIgnore: ['journeys/learner/**'],
    },
    {
      name: 'webkit-admin',
      use: {
        ...devices['Desktop Safari'],
        storageState:
          'playwright/.auth/user-setup-admin-webkit.json',
      },
      dependencies: ['setup-admin-webkit'],
      testMatch: ['journeys/**/*.spec.ts'],
      testIgnore: ['journeys/learner/**'],
    },

    // ---- Learner journeys — only the gating contract ----
    {
      name: 'chromium-learner',
      use: {
        ...devices['Desktop Chrome'],
        storageState:
          'playwright/.auth/user-setup-learner-chromium.json',
      },
      dependencies: ['setup-learner-chromium'],
      testMatch: ['journeys/learner/**/*.spec.ts'],
    },
    {
      name: 'firefox-learner',
      use: {
        ...devices['Desktop Firefox'],
        storageState:
          'playwright/.auth/user-setup-learner-firefox.json',
      },
      dependencies: ['setup-learner-firefox'],
      testMatch: ['journeys/learner/**/*.spec.ts'],
    },
    {
      name: 'webkit-learner',
      use: {
        ...devices['Desktop Safari'],
        storageState:
          'playwright/.auth/user-setup-learner-webkit.json',
      },
      dependencies: ['setup-learner-webkit'],
      testMatch: ['journeys/learner/**/*.spec.ts'],
    },
  ],
});
