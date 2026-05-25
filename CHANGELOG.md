# Changelog

All notable changes to courseAI.

## [Unreleased]

## [1.0.0] - 2026-05-25

First production cut: rebrand to **courseAI**, real ibl.ai catalog wiring,
admin-gated sidebar, dockerised build, sub-path mount at `/courseai`, and a
full unit + e2e test suite.

### Added

- **Course Catalog (`/course-catalog`)** — wired to the SDK `useDiscover`
  hook with server-side search (`?q=` URL-synced), `<DiscoverFilterDrawer>`
  filters via `FacetFilterContext`, active filter chips with per-chip
  removal + "clear all", pagination via `discover.pagination.total_pages` /
  `setPage`, real `level` chip from the API row (with rotation fallback),
  empty state with reset CTA, Share + Copy-link buttons, and the
  `?openCreateAcademy=1` deep link from the sidebar.
- **Course content shell (`app/course-content/[id]/*`)** — replaces the v0
  mock with a thin client-side redirect to skillsAI
  (`<skillsai>/course-content/<id>/<tab>`). Preserves the tab segment, query
  string, and hash so deep links and bookmarks land in the same place. The
  edX learner experience itself lives on skillsAI because the LMS sets
  `Content-Security-Policy: frame-ancestors 'self'` and blocks any other
  origin from embedding the iframe.
- **Admin gating** — `requireAdmin` helper in
  `components/platform/sidebar-learner.tsx` gates **New Course**,
  **Configure**, **Chats**, **New Project**, **Invites**, **Users**,
  **API**, **Billing**, **Monetization**, **Settings**, and the catalog /
  My Courses **Create School** CTAs. Non-admins get the SDK
  `UpgradePackageModal` instead of the gated action; the modal is
  conditionally mounted so it only fires its Stripe pricing-page session
  when open (was the "keeps redirecting" loop).
- **`UpdateSubscriptionModal`** — `components/iblai/update-subscription-modal.tsx`,
  ported from videoai. Wraps the SDK `UpgradePackageModal` with admin /
  email pre-flight checks and the conditional mount.
- **Privacy + Terms pages** — `/privacy` and `/terms` server-side
  `redirect()`s to `https://ibl.ai/privacy-policy` and
  `https://ibl.ai/terms-of-use`. Footer links updated to target them.
- **Branding rebrand** — `wink.school` → `courseAI` across `<title>`,
  sidebars, footer, header, landing benefits, FAQ section, and watch
  section. New `app/favicon.ico` from `ibl.ai/favicon.ico`. Footer "ibl.ai
  OS" icon now uses `public/images/iblai-logo.png`.
- **`config.skillsaiUrl()`** — new config helper. Defaults to
  `https://skillsai.<domain>`, overridable via `NEXT_PUBLIC_SKILLSAI_URL`.
- **Sub-path mount** — `next.config.mjs` reads
  `NEXT_PUBLIC_BASE_PATH` (default `/courseai`), feeds Next's `basePath` /
  `assetPrefix` / `trailingSlash` and the `Service-Worker-Allowed` header
  for `/sw.js`. Custom `lib/iblai/image-loader.js` prefixes every
  `<Image>` src with basePath. `lib/iblai/asset-url.ts` exposes
  `asset(path)` for plain `<img>` paths. `components/iblai/base-path-img-rewriter.tsx`
  is a global `MutationObserver` safety net that prefixes any inline
  `<img src="/…">` / `<source srcset>` the explicit helpers miss.
- **Build + release infrastructure**
  - `Dockerfile` (3-stage Node 25.3.0 / pnpm / standalone Next output).
  - `entrypoint.sh` — renders runtime env into `/app/public/env.js`
    (`window.__ENV__`).
  - `.release-it.json` (commit `chore(release): v${version}`, tag, push,
    GitHub release, require `main`).
  - `.github/workflows/release.yml` — runs `pnpm release --ci` on every
    push to `main` (skips its own release commits).
  - `.github/workflows/trigger-docker-build.yml` — gates on release
    commits and dispatches to
    `iblai/iblai-web-ops/.github/workflows/reusable-spa-docker-build.yml@main`
    with `app_name: courseai` → produces image `iblai-courseai-spa-pro`.
  - `release-it@^20.0.1` dev dependency.
  - `output: "standalone"` in `next.config.mjs` so the Docker runner
    stage has `server.js` to run.
- **Unit tests** — 84 tests in `__tests__/` covering
  `lib/iblai/config.ts`, `lib/iblai/course-actions.ts`, and
  `app/course-content/[id]/_iframe-props.ts`. Coverage threshold
  enforced at **95%** (statements / branches / functions / lines) via
  `pnpm test:coverage`. `@vitest/coverage-v8` + `jsdom` wired into
  `vitest.config.ts`.
- **E2E tests** — 40 checkpoints across 10 journeys under
  `e2e/journeys/`, documented in `e2e/COVERAGE.md` + `e2e/coverage.json`
  (mentorai's format). Role-aware Playwright setup runs the suite under
  both `*-admin` and `*-learner` storage states; the gating contract is
  asserted from both sides. Pre-flight `assertAdmin` /
  `assertNotAdmin` fail loudly when credentials are mis-roled.

### Changed

- **Catalog image host** — `useDiscover({ lmsUrl: … })` now points at
  `config.lmsBrowserUrl()` (the direct LMS host) instead of the API
  gateway proxy. The proxy 500s on `/asset-v1:…` asset paths, which
  produced empty thumbnails for every card.
- **`config.mainTenantKey()`** — fallback `""` → `"main"`. Empty fallback
  was the source of the "Failed to load upgrade options" toast: the SDK
  fired `pricing-page-session?platform_key=` and the server rejected it.
  `.env.example` documents the override.
- **Catalog click destination** — cards now navigate to
  `<skillsai>/courses/<id>` (the About / preview landing) instead of
  `<skillsai>/course-content/<id>/course` (which dropped users straight
  into the player). The in-app `/course-content/<id>/<tab>` redirect path
  is unchanged so deep links keep working.
- **`/courses` row actions** — `recordToCourseLocator()` walks
  `xblock_id` → `course_id` → `course_key` → `course_locator` instead of
  blindly reading `xblock_id`, and the action handler toasts
  `"missing its edX locator"` on empty locators instead of opening a
  broken `…/courses//about` URL.
- **`<HeaderAccountMenu>`** — reads `localStorage` synchronously in the
  initial `useState` so the SDK `<UserProfileDropdown>` doesn't mount
  with `username=""` and fire the
  `GET /api/ibl/users/manage/metadata/?username=` 400 on every page load.
- **`app/course-content/[id]/layout.tsx`** — URL-decodes `params.id`
  once before handing it to the SDK. Next 16's app-router
  `useParams()` returns the segment still URL-encoded; the SDK then
  encodes it again and the LMS receives a course key it can't decode
  (the "Course not found" regression).
- **Welcome chat surface** — `components/iblai/welcome-override.tsx`
  hides the agent name + default welcome text and shows a single
  blue-gradient "Lets build together a great course!" headline.
- **Analytics page** — outer `min-h-dvh` + matched `bg-[#f5f7fb]` so the
  page background extends past the viewport (scroll-down no longer
  reveals the white body background).
- **Nested dialog stacking** — `components/ui/dialog.tsx` adds
  `data-slot` attributes; `app/globals.css` lifts unmarked nested
  dialogs above the courseai shell so secondary modals opened from
  sidebar modals don't sit behind their parents.
- **`/courses` & `/course-catalog` Create School** — admins see View
  Academy (or nothing); non-admins see Create School which now opens
  the upgrade modal instead of `CreateAcademyDialog`.

### Fixed

- "Course not found" on real catalog clicks — caused by Next 16's
  encoded `params` colliding with the SDK's own `encodeURIComponent`.
- Catalog thumbnails 500'ing — caused by the SDK building URLs against
  `api.iblai.app/lms/asset-v1:…` (gateway doesn't proxy assets);
  switched the image host to the direct LMS host and added a graceful
  per-card `onError` fallback to the v0 placeholders.
- Upgrade modal redirect loop — SDK fires Stripe pricing-page session at
  mount time, so an always-mounted modal trampolined users away from
  every page. The modal is now conditionally mounted.
- `HeaderAccountMenu` firing 400 on `/api/ibl/users/manage/metadata/?username=`
  because `useState(null)` → `useEffect` produced one render with an
  empty username before localStorage was read.
- `/courses` row actions silently opening `…/courses//about` when the
  AI-mentor record had no `xblock_id`.

### Removed

- **Hard admin gate** — `<AdminGate>` no longer wraps the provider tree
  in `app/layout.tsx`. Non-admin students reach every route and hit the
  upgrade modal contextually instead of a full-page "Admin Access
  Required" screen. The component file is kept around for any future
  route-level use.
- **Pinned sidebar section** — `pinnedItem` / `pinnedData` /
  `setPinnedData` + the entire Pinned JSX block + the "Pin" dropdown
  item inside the (already-hidden) Recent section.
- **Two noisy toasts** — `"Agent loaded"` (fired on every chat landing
  from `use-mentor-redirect.ts`) and `"Agent settings loaded"` (fired
  on every configure-page visit from `agent-tools.ts`). The
  `"Agent settings updated"` write-success toast is retained.
- **Course-content mock content** — the v0 placeholder course tabs
  (hard-coded "Strategic Leadership Development", fake modules, etc.)
  in favour of the skillsAI redirect.
