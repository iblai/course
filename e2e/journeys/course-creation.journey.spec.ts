import { test, expect, type WebSocket } from '@playwright/test';

import { waitForTenantsPopulated } from '../utils/wait-for-tenants';
import { assertAdmin } from '../utils/assert-admin';

/**
 * Course-creation journey — the New Course → agent-chat path.
 *
 * Source: `components/platform/sidebar-learner.tsx` (`startNewChat`),
 * `app/platform/[tenantId]/[mentorId]/page.tsx` (mounts the SDK
 * `<Chat>` and enables the `course-creation` tool), and
 * `lib/iblai/agent-tools.ts` (`enableCourseCreationToolIfMissing`).
 *
 * Why this exists: enabling the `course-creation` tool happens on the
 * mentor page *after* the SDK opens the chat websocket, so a brand-new
 * agent's first socket predates the tool. The page now remounts
 * `<Chat>` (bumping its key) when the tool is *freshly* enabled, which
 * reconnects the websocket against the updated agent. This journey pins
 * that path end to end.
 *
 * Determinism: course generation runs through a live LLM + an async
 * backend task, so it can't be made deterministic. We split assertions:
 *
 *   HARD (gates the fix, selector/LLM-independent):
 *     - New Course routes into `/platform/<t>/<m>` and NOT the
 *       course-creation error page.
 *     - The mentor-settings call fires (the enable path ran).
 *     - The chat websocket connects (proves the remount reconnected).
 *
 *   BEST-EFFORT (drives the live agent — annotated, never fails the
 *   suite, since the chat UI is a compiled SDK surface and the agent is
 *   non-deterministic):
 *     - Type a "create a course" prompt and submit it.
 *     - Observe a course-creation request fire (over the websocket or
 *       HTTP).
 *     - The new course shows up in My Courses.
 *
 * Admin-only: course creation is gated behind `requireAdmin`, so this
 * runs under the `*-admin` projects (it lives outside `journeys/learner/`).
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

/** Poll `predicate` until it returns true or `timeout` elapses. */
async function pollUntil(
  predicate: () => boolean,
  timeout: number,
  interval = 500,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (predicate()) return true;
    await new Promise((r) => setTimeout(r, interval));
  }
  return predicate();
}

test.describe('course creation — agent chat', () => {
  test('New Course opens a working chat and a course can be requested', async ({
    page,
  }) => {
    // Course generation is slow (live LLM + async backend task); give
    // the whole flow generous headroom over the 60s suite default.
    test.setTimeout(240_000);

    // ---- Instrumentation: capture websocket connections + frames and
    // course-creation HTTP traffic before anything mounts. ----
    const wsUrls: string[] = [];
    // Frames whose (text) payload mentions a course — the best-effort
    // signal that the agent invoked the course-creation tool.
    const courseFrames: string[] = [];
    page.on('websocket', (ws: WebSocket) => {
      wsUrls.push(ws.url());
      const onFrame = (payload: string | Buffer) => {
        const text = typeof payload === 'string' ? payload : '';
        if (text && /course/i.test(text) && courseFrames.length < 5) {
          courseFrames.push(text.slice(0, 300));
        }
      };
      ws.on('framesent', (d) => onFrame(d.payload));
      ws.on('framereceived', (d) => onFrame(d.payload));
    });

    const settingsCalls: string[] = [];
    const courseHttp: string[] = [];
    page.on('response', (res) => {
      const u = res.url();
      if (/\/mentors\/[^/]+\/settings\//.test(u)) {
        settingsCalls.push(`${res.request().method()} ${res.status()}`);
      }
      if (/\/course-creation\/(course|tasks)\//.test(u)) {
        courseHttp.push(`${res.request().method()} ${res.status()} ${u}`);
      }
    });

    // ---- 1. Land on /courses as a verified admin. ----
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await waitForTenantsPopulated(page);
    await assertAdmin(page);

    // ---- 2. New Course → routes into the agent chat. The sidebar
    // fires the enable (fire-and-forget) and the mentor page re-checks +
    // remounts on arrival. ----
    const newCourse = page.getByRole('button', { name: /new course/i }).first();
    await expect(newCourse).toBeVisible({ timeout: 30_000 });
    await newCourse.click();

    // HARD: we land on the per-agent chat route, not the
    // course-creation error page.
    await page.waitForURL(/\/platform\/[^/]+\/[^/?#]+/, { timeout: 60_000 });
    expect(
      page.url(),
      'New Course bounced to the course-creation error page — the tool could not be enabled',
    ).not.toContain('courseCreationUnavailable');

    // HARD: the enable path ran (the mentor page always GETs settings;
    // the sidebar/page PUTs when the tool is missing).
    expect(
      await pollUntil(() => settingsCalls.length > 0, 60_000),
      `expected a mentor-settings call (course-creation enable path); saw none`,
    ).toBe(true);

    // HARD: the chat websocket connected. This is the crux of the fix —
    // the remount-on-fresh-enable must (re)establish a live socket.
    expect(
      await pollUntil(() => wsUrls.some((u) => /^wss?:\/\//.test(u)), 60_000),
      `chat websocket never connected; saw: ${JSON.stringify(wsUrls)}`,
    ).toBe(true);

    // ---- 3. BEST-EFFORT: drive the live agent to create a course. The
    // chat input is a compiled SDK surface, so use resilient selectors
    // and degrade to an annotation (never a hard failure) if we can't
    // drive it. ----
    const title = `E2E Smoke Course ${Date.now()}`;
    const prompt =
      `Create a minimal course titled "${title}" about software test ` +
      `automation, with exactly 1 section. Use sensible defaults and do ` +
      `not ask me any clarifying questions — start creating it now.`;

    let messageSent = false;
    try {
      const input = page
        .locator('textarea:visible, [contenteditable="true"]:visible')
        .last();
      await input.waitFor({ state: 'visible', timeout: 30_000 });
      await input.click();
      await page.keyboard.type(prompt);

      // Most chat inputs submit on Enter; prefer an explicit Send button
      // when present so we don't double-submit on inputs that treat
      // Enter as a newline.
      const sendBtn = page.getByRole('button', { name: /send/i }).first();
      if (await sendBtn.count().catch(() => 0)) {
        await sendBtn.click().catch(() => page.keyboard.press('Enter'));
      } else {
        await page.keyboard.press('Enter');
      }
      messageSent = true;
    } catch (e) {
      test.info().annotations.push({
        type: 'note',
        description:
          `Could not drive the SDK chat input with best-guess selectors ` +
          `(textarea / contenteditable). The deterministic fix assertions ` +
          `above still passed. Update the selector once the real input is ` +
          `confirmed. Error: ${String(e)}`,
      });
    }

    if (!messageSent) return;

    // BEST-EFFORT: the user's message rendered in the transcript.
    const bubble = page.getByText(title, { exact: false }).first();
    if (
      !(await bubble.isVisible({ timeout: 15_000 }).catch(() => false))
    ) {
      test.info().annotations.push({
        type: 'note',
        description:
          'Prompt submitted but no message bubble matched the course title ' +
          '— the SDK may render messages differently. Continuing.',
      });
    }

    // BEST-EFFORT: a course-creation request fired (a WS frame mentioning
    // a course, or a course-creation HTTP call). The agent + backend are
    // non-deterministic, so annotate-and-pass on timeout.
    const fired = await pollUntil(
      () => courseFrames.length > 0 || courseHttp.length > 0,
      90_000,
    );
    test.info().annotations.push({
      type: 'note',
      description: fired
        ? `course-creation request observed — wsFrames: ${courseFrames.length}, ` +
          `http: ${JSON.stringify(courseHttp.slice(0, 3))}`
        : 'no course-creation request observed within 90s — the live agent ' +
          'did not invoke the tool in time (LLM/backend variance).',
    });
    if (!fired) return;

    // ---- 4. BEST-EFFORT: the new course lands in My Courses. Backend
    // generation is async, so a miss here means "still generating", not
    // a regression — annotate rather than fail. ----
    await page.goto(`${APP_HOST}/courses`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page
      .waitForResponse((r) => /\/course-creation\/course\//.test(r.url()), {
        timeout: 30_000,
      })
      .catch(() => null);

    const listed = await page
      .getByText(title, { exact: false })
      .first()
      .isVisible({ timeout: 15_000 })
      .catch(() => false);

    test.info().annotations.push({
      type: 'note',
      description: listed
        ? `course "${title}" is listed in My Courses — full create + verify path confirmed.`
        : `course "${title}" not yet listed in My Courses (async generation likely still running).`,
    });
  });
});
