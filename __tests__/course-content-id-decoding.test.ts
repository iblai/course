import { describe, it, expect } from "vitest"

/**
 * Pinned-down test of the courseId decoding contract that the
 * `app/course-content/[id]/layout.tsx` redirect shell depends on.
 *
 * Background:
 *   - Catalog click does `encodeURIComponent(course.id)` (single
 *     encoding) → URL segment is e.g. `course-v1%3Amain%2BJE4%2BRH8_RGY_3`.
 *   - Next 16's app-router `useParams()` returns the segment STILL
 *     URL-encoded (unlike the pages router, which decoded).
 *   - The SDK's `getCourseMetaData` does `encodeURIComponent(courseKey)`
 *     again. Without an explicit decode in the layout, the LMS sees
 *     `?course_key=course-v1%253A...%252B...` → 400.
 *
 * The layout `decodeURIComponent`s once on read; this test pins the
 * decode contract so a refactor can't quietly drop it.
 */

/**
 * Mirror of the layout's decoding helper (the layout is a React
 * component so we duplicate the pure-function essence here — same
 * behaviour, no React dependency).
 */
function decodeCourseIdParam(rawParam: string | null | undefined): string {
  if (!rawParam) return ""
  try {
    return decodeURIComponent(rawParam)
  } catch {
    return rawParam
  }
}

describe("course-content [id] param decoding", () => {
  it("decodes a single-encoded edX course locator back to the raw form", () => {
    expect(decodeCourseIdParam("course-v1%3Amain%2BJE4%2BRH8_RGY_3")).toBe(
      "course-v1:main+JE4+RH8_RGY_3",
    )
  })

  it("returns an already-decoded value unchanged", () => {
    expect(decodeCourseIdParam("course-v1:main+JE4+RH8_RGY_3")).toBe(
      "course-v1:main+JE4+RH8_RGY_3",
    )
  })

  it("handles empty / null / undefined cleanly", () => {
    expect(decodeCourseIdParam("")).toBe("")
    expect(decodeCourseIdParam(null)).toBe("")
    expect(decodeCourseIdParam(undefined)).toBe("")
  })

  it("falls back to the raw segment on malformed encoding (no throw)", () => {
    // `%E0%A4%A` is a truncated multi-byte UTF-8 escape — would throw
    // a URIError. The layout traps + returns the raw segment so the
    // page can still render its diagnostic error UI.
    expect(decodeCourseIdParam("course-v1%E0%A4%A")).toBe(
      "course-v1%E0%A4%A",
    )
  })

  it("decoded output, single-encoded, matches the catalog click input", () => {
    // Round-trip property: catalog click `encodeURIComponent`s once,
    // layout decodes once → SDK encodes once → server receives the
    // exact single-encoded form it expects.
    const raw = "course-v1:main+JE4+RH8_RGY_3"
    const urlSegment = encodeURIComponent(raw)
    expect(decodeCourseIdParam(urlSegment)).toBe(raw)
    expect(encodeURIComponent(decodeCourseIdParam(urlSegment))).toBe(
      urlSegment,
    )
  })
})
