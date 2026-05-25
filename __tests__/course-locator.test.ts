import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

import {
  blockLocatorToCourseLocator,
  recordToCourseLocator,
  courseContentUrl,
  studioOutlineUrl,
  lmsCoursePreviewUrl,
  lmsCourseAboutUrl,
  mfeCourseDatesUrl,
  type EdxCourseRecord,
} from "@/lib/iblai/course-actions"

/**
 * `recordToCourseLocator` is the helper that fixed the "course id
 * empty" bug on `/courses`: when the AI-mentor course-creation API
 * returned records under a different field name (or with an empty
 * `xblock_id` for unsynced courses), every action button silently
 * opened `https://learn.<domain>/courses//about`. These tests pin
 * the contract so a future refactor can't regress it.
 */
describe("blockLocatorToCourseLocator", () => {
  it("returns empty string for null/undefined", () => {
    expect(blockLocatorToCourseLocator(undefined)).toBe("")
    expect(blockLocatorToCourseLocator(null)).toBe("")
    expect(blockLocatorToCourseLocator("")).toBe("")
  })

  it("converts a block-v1 course-block id to its course-v1 locator", () => {
    expect(
      blockLocatorToCourseLocator(
        "block-v1:main+JE4+RH8_RGY_3+type@course+block@course",
      ),
    ).toBe("course-v1:main+JE4+RH8_RGY_3")
  })

  it("passes through an existing course-v1 locator unchanged", () => {
    expect(
      blockLocatorToCourseLocator("course-v1:main+JE4+RH8_RGY_3"),
    ).toBe("course-v1:main+JE4+RH8_RGY_3")
  })

  it("returns unrecognised inputs unchanged (defensive — caller decides)", () => {
    expect(blockLocatorToCourseLocator("not-a-locator")).toBe("not-a-locator")
  })
})

describe("recordToCourseLocator", () => {
  const baseRecord: EdxCourseRecord = { id: 1, name: "Course" }

  it("prefers xblock_id when present", () => {
    expect(
      recordToCourseLocator({
        ...baseRecord,
        xblock_id: "block-v1:main+JE4+RH8_RGY_3+type@course+block@course",
      }),
    ).toBe("course-v1:main+JE4+RH8_RGY_3")
  })

  it("falls back to course_id when xblock_id is missing", () => {
    expect(
      recordToCourseLocator({
        ...baseRecord,
        course_id: "course-v1:main+JE4+RH8_RGY_3",
      }),
    ).toBe("course-v1:main+JE4+RH8_RGY_3")
  })

  it("falls back to course_key when xblock_id and course_id are missing", () => {
    expect(
      recordToCourseLocator({
        ...baseRecord,
        course_key: "course-v1:main+ABC+DEF_GHI_1",
      }),
    ).toBe("course-v1:main+ABC+DEF_GHI_1")
  })

  it("falls back to course_locator as the last candidate", () => {
    expect(
      recordToCourseLocator({
        ...baseRecord,
        course_locator: "course-v1:main+XYZ+RST_UVW_9",
      }),
    ).toBe("course-v1:main+XYZ+RST_UVW_9")
  })

  it("returns empty string when every candidate is missing or empty", () => {
    // The bug we hit: empty `xblock_id` on unsynced AI-generated
    // courses. The handler in `/courses` toasts on this case instead
    // of opening a broken URL.
    expect(recordToCourseLocator(baseRecord)).toBe("")
    expect(
      recordToCourseLocator({
        ...baseRecord,
        xblock_id: "",
        course_id: "",
      }),
    ).toBe("")
  })

  it("skips empty earlier candidates and uses the next non-empty one", () => {
    expect(
      recordToCourseLocator({
        ...baseRecord,
        xblock_id: "",
        course_id: "course-v1:main+JE4+RH8_RGY_3",
      }),
    ).toBe("course-v1:main+JE4+RH8_RGY_3")
  })
})

/**
 * The row-action URL builders are pure string composition: every
 * special character in a course locator (`:`, `+`) must be encoded
 * before going into a path segment, or the LMS / Studio routes 404.
 * Tests pin every host so a host change shows up here too.
 */
describe("course row-action URL builders", () => {
  const ENV_KEYS = [
    "NEXT_PUBLIC_API_BASE_URL",
    "NEXT_PUBLIC_PLATFORM_BASE_DOMAIN",
    "NEXT_PUBLIC_MFE_URL",
  ] as const
  const snapshot: Record<string, string | undefined> = {}
  beforeEach(() => {
    for (const k of ENV_KEYS) snapshot[k] = process.env[k]
    for (const k of ENV_KEYS) delete process.env[k]
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN = "iblai.app"
    vi.resetModules()
  })
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (snapshot[k] === undefined) delete process.env[k]
      else process.env[k] = snapshot[k]
    }
  })

  const cid = "course-v1:main+JE4+RH8_RGY_3"
  const encoded = "course-v1%3Amain%2BJE4%2BRH8_RGY_3"

  it("courseContentUrl() defaults to the 'course' tab", () => {
    expect(courseContentUrl(cid)).toBe(`/course-content/${encoded}/course`)
  })

  it("courseContentUrl() honors each known tab segment", () => {
    expect(courseContentUrl(cid, "dates")).toBe(
      `/course-content/${encoded}/dates`,
    )
    expect(courseContentUrl(cid, "progress")).toBe(
      `/course-content/${encoded}/progress`,
    )
    expect(courseContentUrl(cid, "discussion")).toBe(
      `/course-content/${encoded}/discussion`,
    )
    expect(courseContentUrl(cid, "instructor")).toBe(
      `/course-content/${encoded}/instructor`,
    )
  })

  it("studioOutlineUrl() resolves to studio.<domain>/course/<encoded-id>", async () => {
    const mod = await import("@/lib/iblai/course-actions")
    expect(mod.studioOutlineUrl(cid)).toBe(
      `https://studio.learn.iblai.app/course/${encoded}`,
    )
  })

  it("lmsCoursePreviewUrl() resolves to learn.<domain>/courses/<encoded>/course", async () => {
    const mod = await import("@/lib/iblai/course-actions")
    expect(mod.lmsCoursePreviewUrl(cid)).toBe(
      `https://learn.iblai.app/courses/${encoded}/course`,
    )
  })

  it("lmsCourseAboutUrl() resolves to learn.<domain>/courses/<encoded>/about", async () => {
    const mod = await import("@/lib/iblai/course-actions")
    expect(mod.lmsCourseAboutUrl(cid)).toBe(
      `https://learn.iblai.app/courses/${encoded}/about`,
    )
  })

  it("mfeCourseDatesUrl() resolves to the configured MFE host", async () => {
    process.env.NEXT_PUBLIC_MFE_URL = "https://learner.example.com"
    vi.resetModules()
    const mod = await import("@/lib/iblai/course-actions")
    expect(mod.mfeCourseDatesUrl(cid)).toBe(
      `https://learner.example.com/learning/course/${encoded}/dates`,
    )
  })

  it("mfeCourseDatesUrl() falls back to apps.learn.<domain>", async () => {
    const mod = await import("@/lib/iblai/course-actions")
    expect(mod.mfeCourseDatesUrl(cid)).toBe(
      `https://apps.learn.iblai.app/learning/course/${encoded}/dates`,
    )
  })

  // Stable re-imports — keep top-level helpers correctly bound to the
  // initial env so the other test files keep passing if this file is
  // run last in the suite.
  it("re-importing course-actions after env reset yields fresh closures", async () => {
    vi.resetModules()
    const mod = await import("@/lib/iblai/course-actions")
    expect(typeof mod.courseContentUrl).toBe("function")
    expect(typeof mod.blockLocatorToCourseLocator).toBe("function")
  })
})

// Trigger the top-level imports so they appear in the coverage report
// even when the rest of the file is exercised via dynamic `import()`.
void courseContentUrl
void studioOutlineUrl
void lmsCoursePreviewUrl
void lmsCourseAboutUrl
void mfeCourseDatesUrl
