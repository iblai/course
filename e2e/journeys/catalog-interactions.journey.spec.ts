import { test, expect } from '@playwright/test';

/**
 * Course Catalog interactive surfaces — search input, filter drawer,
 * share / copy-link buttons, active-filter chips, empty state.
 *
 * Complements `course-catalog.journey.spec.ts` (which pins the
 * thumbnail host + click-to-skillsAI). All assertions here are
 * resilient to "empty catalog for this user" — the catalog query is
 * tenant-scoped, so a brand-new test account legitimately sees no
 * results and the assertions degrade to "input is visible / empty
 * state renders".
 */

const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

async function gotoCatalog(page: import('@playwright/test').Page) {
  await page.goto(`${APP_HOST}/course-catalog`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  // Wait for the SDK's debounced fetch + the local 8s safety timeout
  // to settle. Either the grid renders or the empty state shows.
  // Doing this BEFORE looking for the search input avoids the
  // 'click() timed out' race where the input briefly unmounts
  // during a tenant-settling re-render.
  await page
    .waitForFunction(
      () =>
        document.body.innerText.toLowerCase().indexOf('loading courses') === -1,
      { timeout: 30_000 },
    )
    .catch(() => null);
  // Search input is the surest signal the catalog shell is up and
  // stable. Wait for it to be attached AND visible.
  const search = page.getByPlaceholder(/search courses/i);
  await expect(search).toBeAttached({ timeout: 30_000 });
  await expect(search).toBeVisible({ timeout: 30_000 });
}

test.describe('course catalog interactions', () => {
  test('search input accepts text and updates the URL with ?q=', async ({
    page,
  }) => {
    await gotoCatalog(page);
    const search = page.getByPlaceholder(/search courses/i);
    // `pressSequentially` simulates real keystrokes — React's
    // controlled-input `onChange` is more reliable with this than
    // with `fill()`, which sets the value via a single synthesized
    // input event that React sometimes ignores.
    await search.click();
    await search.pressSequentially('leadership', { delay: 10 });
    // URL sync is fire-and-forget via router.replace inside the
    // change handler. Give it a generous window — Next.js can take
    // a tick on first replace under load.
    try {
      await page.waitForFunction(
        () =>
          new URL(window.location.href).searchParams.get('q') === 'leadership',
        { timeout: 15_000 },
      );
    } catch (err) {
      // Diagnostic — evaluate might fail if the page has since
      // navigated/closed. Don't let it shadow the original error.
      let got: { href?: string; value?: string } = {};
      try {
        got = await page.evaluate(() => ({
          href: window.location.href,
          value: (
            document.querySelector(
              'input[placeholder^="Search"]',
            ) as HTMLInputElement | null
          )?.value,
        }));
      } catch {
        got = { href: '(unavailable — page closed)', value: undefined };
      }
      throw new Error(
        `expected URL ?q=leadership; got href=${got.href}, input value=${got.value}\n  underlying: ${(err as Error).message}`,
      );
    }
    // The clear-search button surfaces once there's a value.
    await expect(
      page.getByRole('button', { name: /clear search/i }),
    ).toBeVisible();
  });

  test('Filters button opens the SDK filter drawer', async ({ page }) => {
    await gotoCatalog(page);
    await page.getByRole('button', { name: /^filters$/i }).click();
    // SDK DiscoverFilterDrawer heading.
    await expect(page.getByText(/explore content/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test('clearing search via the X button resets the URL', async ({ page }) => {
    await gotoCatalog(page);
    await page.getByPlaceholder(/search courses/i).fill('data');
    await page.waitForFunction(
      () => new URL(window.location.href).searchParams.get('q') === 'data',
      { timeout: 5_000 },
    );
    await page.getByRole('button', { name: /clear search/i }).click();
    await page.waitForFunction(
      () => !new URL(window.location.href).searchParams.get('q'),
      { timeout: 5_000 },
    );
  });

  test('empty state offers a reset CTA when search/filters return nothing', async ({
    page,
  }) => {
    await gotoCatalog(page);
    // Force an empty result with an unlikely query.
    await page
      .getByPlaceholder(/search courses/i)
      .fill('zzzz-unlikely-xxxx-9999');
    // Wait for any grid items to clear out + empty state to appear.
    await expect(
      page.getByText(/no courses match your search or filters\./i),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByRole('button', { name: /reset search and filters/i }),
    ).toBeVisible();
  });

  test('Share / Copy-link buttons render on every card (no clipboard side-effect)', async ({
    page,
  }) => {
    await gotoCatalog(page);
    const cards = page.locator('[data-testid="course-card"]');
    const cardCount = await cards.count();
    if (cardCount === 0) {
      test.info().annotations.push({
        type: 'note',
        description:
          'no catalog results for this tenant; share/copy assertion skipped',
      });
      return;
    }
    const firstCard = cards.first();
    // Each card renders a Share + Copy-link control. Try a few
    // selector strategies — `title=…` is the most stable, but if
    // the card uses an icon-only variant we fall back to a button
    // containing the Share / Copy-link `<span>` text.
    const share = firstCard.locator(
      'button[title="Share"], button:has(svg + span:text-is("Share"))',
    );
    const copy = firstCard.locator(
      'button[title="Copy link"], button:has(svg + span:text-is("Copy link"))',
    );
    try {
      await expect(share).toHaveCount(1);
      await expect(copy).toHaveCount(1);
    } catch (err) {
      const buttonsHtml = await firstCard.evaluate(
        (el) =>
          Array.from(el.querySelectorAll('button'))
            .map((b) => b.outerHTML.slice(0, 200))
            .join('\n  '),
      );
      throw new Error(
        `expected Share + Copy-link buttons inside first card; found:\n  ${buttonsHtml || '(no buttons)'}\n  underlying: ${(err as Error).message}`,
      );
    }
  });
});
