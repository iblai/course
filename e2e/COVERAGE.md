# courseAI E2E Coverage — User Journey Checklist

> Last updated: 2026-06-15 | 45 checkpoints (45 active) | 12 journeys | 100% covered | Auth: admin + learner storageState

## How This Works

Each **checkpoint** maps to a concrete user action or verification within a spec file.
Coverage = `covered_checkpoints / total_checkpoints * 100`.

When adding a new page or modifying an existing user flow:

1. Add checkpoints to the relevant journey below (or create a new journey).
2. Write Playwright tests for each checkpoint under `e2e/journeys/` (admin) or
   `e2e/journeys/learner/` (non-admin only).
3. Mark the checkpoint `[x]` once the spec is in the suite. The status flips to
   `covered` in `coverage.json` and the summary at the top recomputes.
4. Pair the spec with one of the existing role projects (`*-admin`, `*-learner`)
   in `playwright.config.ts` — if a new role is needed, extend the config and
   `auth.setup.ts`.

Pre-flight `assertAdmin` / `assertNotAdmin` in the gating journeys
guarantees that mis-roled credentials fail loudly with a clear
diagnostic instead of silently corrupting downstream assertions.

---

## Journey 1: Authentication (2 checkpoints) — `journeys/auth.journey.spec.ts`

**Source files:** `app/sso-login-complete/page.tsx`, `providers/iblai-providers.tsx`

- [x] Authenticated user lands on the home page (SSO setup completes,
      `AuthProvider` does not bounce back to the auth SPA)
- [x] Auth tokens are persisted in `localStorage` (`axd_token`, `userData`
      with `user_nicename`)

---

## Journey 2: Branding (4 checkpoints) — `journeys/branding.journey.spec.ts`

**Source files:** `app/layout.tsx`, `app/favicon.ico`,
`public/images/iblai-logo.png`, `components/landing/footer.tsx`,
`components/platform/platform-footer.tsx`,
`components/sections/faq-section.tsx`, `components/landing/header.tsx`,
`components/landing/benefits.tsx`, `components/sections/watch-section (3).tsx`,
`components/sidebar.tsx`, `components/platform/sidebar.tsx`,
`components/sections/faq-section.tsx`

- [x] `<title>` includes `courseAI` (replaces the previous `wink.school` brand)
- [x] No surviving `wink.school` strings in the rendered DOM on `/`
- [x] `/favicon.ico` is served as an image (Next auto-emits `app/favicon.ico`)
- [x] `/images/iblai-logo.png` (footer + sidebar) loads with a `200` PNG

---

## Journey 3: Legal Pages (3 checkpoints) — `journeys/legal-pages.journey.spec.ts`

**Source files:** `app/privacy/page.tsx`, `app/terms/page.tsx`,
`components/landing/footer.tsx`, `components/platform/platform-footer.tsx`

- [x] `/privacy` redirects to `https://ibl.ai/privacy-policy` (HTTP 307)
- [x] `/terms` redirects to `https://ibl.ai/terms-of-use` (HTTP 307)
- [x] Platform footer Privacy / Terms links target `/privacy` and `/terms`
      (regression: previously `href="#"`)

---

## Journey 4: Course Catalog (5 checkpoints) — `journeys/course-catalog.journey.spec.ts`

**Source files:** `app/course-catalog/page.tsx`,
`app/course-content/[id]/layout.tsx`, `lib/iblai/config.ts`
(`skillsaiUrl()`, `lmsBrowserUrl()`)

- [x] Catalog lists courses with images served from the direct LMS host
      (no `/lms/asset-v1:` proxy URL appears in any rendered `<img>` src)
- [x] Clicking a course card navigates top-level to
      `https://skillsai.iblai.app/courses/<id>` (the About / preview page —
      not the in-course player; that path is reserved for deep links
      and the legacy `/course-content/<id>/<tab>` redirect)
- [x] Direct visits to `/course-content/<id>/<tab>` redirect to the matching
      skillsAI URL (bookmark + back-button parity)
- [x] Redirect preserves the per-tab segment (`progress` / `dates` /
      `discussion` / `bookmarks` / `instructor`)
- [x] Redirect preserves query string and hash (e.g. `?unit_id=…` deep links)

---

## Journey 5: Course Catalog Interactions (5 checkpoints) — `journeys/catalog-interactions.journey.spec.ts`

**Source files:** `app/course-catalog/page.tsx` (search + filters + share),
`@iblai/iblai-js/web-containers` (`FacetFilterContext`, `DiscoverFilterDrawer`,
`useDiscover`)

- [x] Search input accepts text and updates the URL with `?q=`
- [x] "Filters" button opens the SDK `<DiscoverFilterDrawer>` (heading
      "Explore Content")
- [x] Clearing search via the X button resets the URL (drops `?q=`)
- [x] Empty state offers a "Reset search and filters" CTA when nothing matches
- [x] Share + Copy-link buttons render on every catalog card

---

## Journey 6: My Courses (2 checkpoints) — `journeys/my-courses.journey.spec.ts`

**Source files:** `app/courses/page.tsx`, `lib/iblai/course-actions.ts`
(`recordToCourseLocator`)

- [x] "My Courses" heading and the platform footer render together (layout
      regression guard)
- [x] Row action buttons either work (popup opens with a well-formed URL) or
      toast `"missing its edX locator"` — never silently open
      `https://learn.<domain>/courses//about` (regression: empty `xblock_id`
      on unsynced AI-generated records)

---

## Journey 7: Admin Gating — Admin Path (3 checkpoints) — `journeys/admin-gating.journey.spec.ts`

**Source files:** `components/platform/sidebar-learner.tsx`
(`requireAdmin`), `components/iblai/update-subscription-modal.tsx`,
`hooks/use-is-admin.ts`

> Runs under the `*-admin` projects only.

- [x] "New Course" in the sidebar routes the admin into the mentor chat
      (`/` or `/platform/<t>/<m>?new=<ts>`), with NO upgrade modal
- [x] "Create School" is hidden for admins on `/courses` (admins own the
      academy; they see View Academy or nothing)
- [x] Admin-footer "Settings" opens without the upgrade modal intercepting

---

## Journey 8: Admin Gating — Learner Path (5 checkpoints) — `journeys/learner/learner-gating.journey.spec.ts`

**Source files:** `components/platform/sidebar-learner.tsx`
(`requireAdmin`), `components/iblai/update-subscription-modal.tsx`,
`app/courses/page.tsx`, `app/course-catalog/page.tsx`

> Runs under the `*-learner` projects only.

- [x] Clicking "New Course" opens the SDK `<UpgradePackageModal>` (header
      "Subscribe to unlock full features") with NO navigation
- [x] Clicking "Create School" on `/courses` opens the upgrade modal — the
      legacy `CreateAcademyDialog` does NOT open
- [x] Clicking "Create School" on `/course-catalog` opens the upgrade modal
- [x] Admin-footer "Settings" opens the upgrade modal
- [x] `/course-catalog` itself stays accessible (no auto-open upgrade modal —
      catalog is a public surface for learners)

---

## Journey 9: Upgrade Modal Lifecycle — Learner (3 checkpoints) — `journeys/learner/learner-modal-lifecycle.journey.spec.ts`

**Source files:** `components/iblai/update-subscription-modal.tsx`
(conditional-mount fix)

> Runs under the `*-learner` projects only.

- [x] Opening the modal does NOT navigate away from `/courses` (the
      "it keeps redirecting" regression cover — the SDK modal fires its
      Stripe pricing-page session at mount time, so it must mount only
      while `open === true`)
- [x] Modal does NOT auto-open on neutral page loads
      (`/courses`, `/course-catalog`) — it is contextual to a gated click
- [x] Closing the modal via Escape leaves the user on the same page
      (no orphaned navigation)

---

## Journey 10: Sidebar Gating — Learner: Remaining Items (8 checkpoints) — `journeys/learner/learner-sidebar-gating.journey.spec.ts`

**Source files:** `components/platform/sidebar-learner.tsx` (every gated
top-nav, section, and admin-footer button)

> Runs under the `*-learner` projects only.

- [x] **Configure** (top nav) → upgrade modal opens, no navigation
- [x] **Chats** section header → upgrade modal opens, no navigation
- [x] **New Project** section header → upgrade modal opens, no navigation
- [x] **Invites** (admin footer) → upgrade modal opens, no navigation
- [x] **Users** (admin footer) → upgrade modal opens, no navigation
- [x] **API** (admin footer) → upgrade modal opens, no navigation
- [x] **Billing** (admin footer) → upgrade modal opens, no navigation
- [x] **Monetization** (admin footer) → upgrade modal opens, no navigation

---

## Journey 11: Course Creation (3 checkpoints) — `journeys/course-creation.journey.spec.ts`

**Source files:** `components/platform/sidebar-learner.tsx`
(`startNewChat`), `app/platform/[tenantId]/[mentorId]/page.tsx`
(mounts the SDK `<Chat>`, enables the `course-creation` tool, and
remounts on a fresh enable), `lib/iblai/agent-tools.ts`
(`enableCourseCreationToolIfMissing`)

> Runs under the `*-admin` projects only (course creation is admin-gated).

- [x] **New Course** routes into `/platform/<t>/<m>` and NOT the
      course-creation error page (`courseCreationUnavailable`)
- [x] The mentor-settings call fires on arrival (the `course-creation`
      enable path ran)
- [x] The chat websocket connects after the fresh-enable remount — the
      reconnect contract that lets the agent actually call the tool

The live course-creation drive (type a "create a course" prompt → observe
the request fire over the websocket/HTTP → the new course appears in My
Courses) runs as **best-effort** inside the same test: the chat input is a
compiled SDK surface and the agent is non-deterministic, so those steps
annotate the result rather than fail the suite.

---

## Journey 12: Post-Login Routing — Learner (2 checkpoints) — `journeys/learner/learner-post-login-redirect.journey.spec.ts`

**Source files:** `lib/iblai/use-mentor-redirect.ts` (admin-status gate),
`app/platform/[tenantId]/[mentorId]/layout.tsx` (segment gate),
`hooks/use-admin-status.ts`, `app/page.tsx`

> Runs under the `*-learner` projects only.

- [x] A student landing on `/` (the SSO default redirect) is sent to
      `/course-catalog`, NOT funneled into a per-agent chat
      (`/platform/<t>/<m>`, the admin path)
- [x] A student deep-linking straight to `/platform/<t>/<m>` (bookmark /
      shared link / saved `redirectTo`) is bounced to `/course-catalog`
      by the segment layout before the chat mounts

---

## Surfaces NOT yet covered (known gaps)

These app surfaces have no dedicated journey yet. Tracked here so a future
coverage pass has a clear backlog. Each one is independent of the changes in
this hardening pass — its absence does not affect the 100% number above.

- `app/agents/page.tsx` — agents browse
- `app/analytics/financial/page.tsx` — billing analytics dashboard (admin)
- `app/customize/page.tsx` — mentor customization redirect
- `app/notifications/page.tsx` — notification center
- `app/platform/[tenantId]/[mentorId]/customize/page.tsx` — per-mentor customize
- `app/platform/[tenantId]/[mentorId]/projects/[projectId]/page.tsx` — project view
- `app/course/[id]/edit/page.tsx` — course editor
- `app/course/[id]/schedule/page.tsx` — course schedule
- `app/course/[id]/creation-prompt/page.tsx` — creation-prompt dialog
- `components/iblai/welcome-override.tsx` — "Lets build together…" copy on
  the fresh-chat surface
- `components/header-account-menu.tsx` — verify no `?username=` 400 on the
  metadata endpoint (synchronous localStorage read regression cover)
