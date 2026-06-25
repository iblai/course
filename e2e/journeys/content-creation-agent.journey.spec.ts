import { test, expect, type Page } from '@playwright/test';

import { waitForTenantsPopulated } from '../utils/wait-for-tenants';
import { assertAdmin } from '../utils/assert-admin';

/**
 * Content Creation agent — default-agent resolution journey.
 *
 * Source: `hooks/use-ensure-content-creation-agent.ts`
 * (`resolveOrCreateContentCreationAgent`), `lib/iblai/use-mentor-redirect.ts`
 * (`preferContentCreationAgent`), `app/page.tsx`, `app/home/page.tsx`,
 * `app/customize/page.tsx`, and `components/platform/sidebar-learner.tsx`
 * (New Course button).
 *
 * Why this exists: course authoring must run on ONE dedicated, admin-only
 * "Content Creation" agent (cloned from `agentAI`, created on the fly if
 * missing). Two regressions this pins:
 *   - admins must DEFAULT to that agent (land on it from `/` and `/home`),
 *     not just reach it via New Course;
 *   - Configure must resolve the SAME agent as New Course (it used to drift
 *     to the recently-accessed agent).
 *
 * These assertions are deterministic — agent *resolution* is a redirect, no
 * LLM involved — so they're all HARD. (The separate `course-creation`
 * journey covers the non-deterministic live-generation path.)
 *
 * Admin-only: the agent + New Course are gated behind admin, so this runs
 * under the `*-admin` projects (it lives outside `journeys/learner/`).
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

/** Per-agent route shape: `/platform/<tenant>/<mentorId>[/sub][?q]`. */
const PLATFORM_URL = /\/platform\/[^/]+\/[^/?#]+/;

/** Pull the `<mentorId>` (2nd segment) out of a `/platform/...` URL. */
function mentorIdFromUrl(url: string): string | null {
  const m = url.match(/\/platform\/[^/]+\/([^/?#]+)/);
  return m ? m[1] : null;
}

/** Land as a verified admin on `path`, settling the SDK tenant state. */
async function gotoAsAdmin(page: Page, path: string): Promise<void> {
  await page.goto(`${APP_HOST}${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await waitForTenantsPopulated(page);
  await assertAdmin(page);
}

test.describe('content creation agent — default resolution', () => {
  test('an admin landing on / is routed to the Content Creation agent (not the catalog/error)', async ({
    page,
  }) => {
    // First-ever landing may CREATE the agent (create + tool-enable round
    // trips) before redirecting, so give the redirect generous headroom.
    test.setTimeout(120_000);

    await gotoAsAdmin(page, '/');

    // HARD: admins land on a per-agent route…
    await page.waitForURL(PLATFORM_URL, { timeout: 90_000 });
    const url = page.url();

    // …and NOT the student catalog (that's the non-admin path)…
    expect(url, 'admin was sent to the catalog instead of an agent').not.toContain(
      '/course-catalog',
    );
    // …and NOT the course-creation error page (tool/agent could not be set up).
    expect(
      url,
      'landing bounced to the course-creation error page',
    ).not.toContain('courseCreationUnavailable');
    expect(mentorIdFromUrl(url), `no mentorId in landing URL: ${url}`).toBeTruthy();

    // BEST-EFFORT: the resolved agent is actually named "Content Creation".
    // The chat header is a compiled SDK surface, so annotate (never fail) if
    // the name isn't found with a generic text match.
    const named = await page
      .getByText(/content creation/i)
      .first()
      .isVisible({ timeout: 15_000 })
      .catch(() => false);
    test.info().annotations.push({
      type: 'note',
      description: named
        ? 'agent name "Content Creation" visible on the landing page'
        : 'could not confirm the "Content Creation" name via a generic text ' +
          'match (SDK chat header) — the HARD same-agent assertions still hold',
    });
  });

  test('New Course and Configure resolve the SAME agent as the / landing', async ({
    page,
  }) => {
    test.setTimeout(150_000);

    // 1. Landing default (`/`) → the Content Creation agent.
    await gotoAsAdmin(page, '/');
    await page.waitForURL(PLATFORM_URL, { timeout: 90_000 });
    const landingId = mentorIdFromUrl(page.url());
    expect(landingId, 'no mentorId resolved from the / landing').toBeTruthy();

    // 2. New Course (sidebar, from the current platform page) → same agent.
    const newCourse = page.getByRole('button', { name: /new course/i }).first();
    await expect(newCourse).toBeVisible({ timeout: 30_000 });
    await newCourse.click();
    // New Course appends `?new=<ts>`; wait for that nonce so we read the URL
    // *after* navigation, not the pre-click one.
    await page.waitForURL(/\/platform\/[^/]+\/[^/?#]+\?new=/, { timeout: 90_000 });
    const newCourseId = mentorIdFromUrl(page.url());
    expect(newCourseId, 'no mentorId resolved from New Course').toBeTruthy();
    expect(
      newCourseId,
      'New Course resolved a different agent than the default landing',
    ).toBe(landingId);

    // 3. Configure (`/customize`) → same agent, on its `/customize` sub-route.
    //    This is the regression the fix targets: Configure used to drift to a
    //    recently-accessed agent instead of the Content Creation one.
    await gotoAsAdmin(page, '/customize');
    await page.waitForURL(/\/platform\/[^/]+\/[^/?#]+\/customize/, {
      timeout: 90_000,
    });
    const configureId = mentorIdFromUrl(page.url());
    expect(configureId, 'no mentorId resolved from Configure').toBeTruthy();
    expect(
      configureId,
      'Configure resolved a different agent than New Course / the landing',
    ).toBe(landingId);
  });

  test('the Content Creation agent is reused, not recreated, across entry points', async ({
    page,
  }) => {
    test.setTimeout(150_000);

    // Count create-mentor POSTs across a full sweep of the entry points. The
    // agent is a singleton: at most ONE creation should ever fire (zero once
    // it already exists from an earlier run), never one-per-entry-point.
    const createCalls: string[] = [];
    page.on('response', (res) => {
      const u = res.url();
      // The create-from-template endpoint the SDK `useCreateMentorMutation`
      // hits: POST .../users/<u>/mentors/ (no trailing settings/sub-resource).
      if (
        res.request().method() === 'POST' &&
        /\/users\/[^/]+\/mentors\/?(\?|$)/.test(u)
      ) {
        createCalls.push(`${res.status()} ${u}`);
      }
    });

    await gotoAsAdmin(page, '/');
    await page.waitForURL(PLATFORM_URL, { timeout: 90_000 });
    const landingId = mentorIdFromUrl(page.url());

    // Visit Configure and back to the landing — none of these should spawn a
    // second agent.
    await gotoAsAdmin(page, '/customize');
    await page.waitForURL(/\/platform\/[^/]+\/[^/?#]+\/customize/, {
      timeout: 90_000,
    });
    await gotoAsAdmin(page, '/home');
    await page.waitForURL(PLATFORM_URL, { timeout: 90_000 });

    // HARD: the same agent throughout, and no create-storm.
    expect(mentorIdFromUrl(page.url())).toBe(landingId);
    expect(
      createCalls.length,
      `expected at most one Content Creation agent to be created across ` +
        `three entry points; saw ${createCalls.length}: ${JSON.stringify(createCalls)}`,
    ).toBeLessThanOrEqual(1);
  });
});
