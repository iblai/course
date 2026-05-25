import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      // Mirror the `paths` entry in tsconfig.json so unit tests can
      // import from `@/lib/...`, `@/app/...`, etc. without needing to
      // duplicate relative-path arithmetic at every callsite.
      "@": path.resolve(__dirname),
    },
  },
  test: {
    include: ["__tests__/**/*.test.ts"],
    // `course-actions.ts` reads `window.localStorage` and calls
    // `fetch`. Running every test under jsdom gives us a real DOM
    // shim — easier than per-test stubbing — without changing how
    // pure-string-only tests behave.
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json-summary"],
      all: true,
      // The unit-test suite is scoped: it covers the pure helpers that
      // moved during the recent admin-gating / catalog-redirect /
      // course-content fixes. We measure coverage on exactly those
      // files so a meaningful threshold can be enforced without
      // dragging in the entire app surface (which is dominated by
      // React components requiring jsdom + a separate test setup).
      include: [
        "lib/iblai/course-actions.ts",
        "lib/iblai/config.ts",
        "app/course-content/[id]/_iframe-props.ts",
      ],
      // Skip pieces inside `course-actions.ts` that hit fetch + DM
      // endpoints; those need an integration test, not a unit test.
      // Same for the unrelated CSS @source verifier.
      exclude: [
        "**/*.d.ts",
        "**/__tests__/**",
      ],
      thresholds: {
        // Per `/iblai-ops-test`: above 95% on the modules we cover.
        // Tracked per-metric so a regression in any one signal fails
        // CI rather than averaging away.
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
});
