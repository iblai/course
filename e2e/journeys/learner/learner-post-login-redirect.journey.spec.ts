import { test, expect } from '@playwright/test';

import { waitForTenantsPopulated } from '../../utils/wait-for-tenants';
import { assertNotAdmin } from '../../utils/assert-admin';

/**
 * Post-login routing — learner path.
 *
 * Students (non-admins) must never land on the per-agent authoring
 * surface (`/platform/<t>/<m>`). Two independent gates enforce this, and
 * this journey pins both:
 *
 *  1. The `/` landing — `lib/iblai/use-mentor-redirect.ts` +
 *     `hooks/use-admin-status.ts`. SSO drops every user on `/`
 *     (`defaultRedirectPath`); `useMentorRedirect` sends admins into the
 *     chat and students to the catalog.
 *  2. Direct navigation — `app/platform/[tenantId]/[mentorId]/layout.tsx`.
 *     A bookmark, shared link, or the SDK's saved `redirectTo` reaches
 *     `/platform/...` without passing through `useMentorRedirect`, so the
 *     segment layout re-checks admin status and bounces students out.
 *
 * Runs only under the `*-learner` projects. `assertNotAdmin` bails with
 * a clear diagnostic if the storage state is accidentally an admin
 * account (which would land on `/platform/...` and fail the redirect
 * assertion for the wrong reason).
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

test.describe('post-login routing — learner', () => {
  test('a student landing on / is redirected to the course catalog', async ({
    page,
  }) => {
    await page.goto(`${APP_HOST}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    // Role detection needs the SDK's tenants list in localStorage; the
    // redirect itself also waits on it, so guard before asserting.
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    // Student → catalog. `useMentorRedirect` replaces the URL once the
    // admin status settles to "denied".
    await page.waitForURL(/\/course-catalog(?:[/?#]|$)/, { timeout: 30_000 });
    expect(page.url()).toContain('/course-catalog');

    // And crucially NOT funneled into a per-agent chat (the admin path).
    expect(page.url()).not.toContain('/platform/');
  });

  test('a student deep-linking into a per-agent route is bounced to the catalog', async ({
    page,
  }) => {
    // Load any app page first so the SDK's saved storage state (tenants,
    // current_tenant) is applied to localStorage for this origin.
    await page.goto(`${APP_HOST}/course-catalog`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertNotAdmin(page);

    // Resolve the learner's active tenant key from storage. The mentor id
    // is irrelevant — the segment layout gates on admin status before the
    // agent ever loads — so a well-formed placeholder is enough.
    const tenantKey = await page.evaluate(() => {
      const raw = window.localStorage.getItem('current_tenant');
      if (!raw) return window.localStorage.getItem('tenant') ?? '';
      try {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.key === 'string'
        ) {
          return parsed.key;
        }
      } catch {
        if (raw.trim()) return raw;
      }
      return '';
    });
    expect(
      tenantKey,
      'could not resolve the active tenant key from storage',
    ).toBeTruthy();

    await page.goto(
      `${APP_HOST}/platform/${tenantKey}/00000000-0000-0000-0000-000000000000`,
      { waitUntil: 'domcontentloaded', timeout: 30_000 },
    );

    // The segment layout redirects non-admins out before the chat mounts.
    await page.waitForURL(/\/course-catalog(?:[/?#]|$)/, { timeout: 30_000 });
    expect(page.url()).toContain('/course-catalog');
    expect(page.url()).not.toMatch(/\/platform\//);
  });
});
