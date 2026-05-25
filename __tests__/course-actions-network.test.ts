/**
 * Network + localStorage coverage for `lib/iblai/course-actions.ts`.
 *
 * The fetch wrappers (`listCourseCreationCourses`,
 * `getCourseCreationTask`, `deleteCourse`) and the localStorage
 * helpers they depend on (`readDmToken`, `readUserIdentifiers`) were
 * previously fenced off with c8 ignore comments. That hid every
 * "Course id must be the integer EdxCourse.id" / "Missing tenant" /
 * "Missing user identifier" branch and let the underlying `/courses`
 * row-action behaviour drift without anybody noticing.
 *
 * Strategy here: drive each public function through every branch
 * (input-validation throws, user-candidate fallback, 404 retry,
 * non-404 stop, no-response, bad-JSON detail). `localStorage` and
 * `fetch` are stubbed per test so we don't depend on a running DM.
 */
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockedFunction,
} from "vitest"

import {
  listCourseCreationCourses,
  getCourseCreationTask,
  deleteCourse,
} from "@/lib/iblai/course-actions"

function makeResponse(
  status: number,
  body: unknown,
  { jsonThrows = false }: { jsonThrows?: boolean } = {},
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jsonThrows
      ? async () => {
          throw new Error("bad json")
        }
      : async () => body,
  } as unknown as Response
}

/**
 * Path-only matcher — every config getter is read at module-init time
 * (before any `beforeEach` can set env), so the host is whatever was
 * baked in then. The fetch wrappers compose the path off `dmUrl()`,
 * which is what we want to verify.
 */
function expectMentorPath(
  url: string,
  segment: string,
): void {
  expect(url).toContain(`/api/ai-mentor/orgs/main/users/${segment}`)
}

/**
 * Vitest's jsdom environment exposes `window.localStorage`, but Node
 * 22 ships a partial localStorage of its own that leaks into the
 * jsdom window via `globalThis` aliasing — and that partial impl is
 * missing `.clear()`. Stubbing the global directly per test gives us
 * deterministic behavior across Node versions.
 */
function makeStorageStub(): Storage {
  const store: Record<string, string> = {}
  return {
    get length() {
      return Object.keys(store).length
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k]
    },
    getItem: (k) => (k in store ? store[k] : null),
    key: (i) => Object.keys(store)[i] ?? null,
    removeItem: (k) => {
      delete store[k]
    },
    setItem: (k, v) => {
      store[k] = String(v)
    },
  }
}

describe("course-actions network helpers", () => {
  let fetchMock: MockedFunction<typeof fetch>
  let storage: Storage

  beforeEach(() => {
    storage = makeStorageStub()
    // Stub both globals — the code reads `localStorage` (global) and
    // tests sometimes inspect via `window.localStorage`.
    vi.stubGlobal("localStorage", storage)
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: storage,
    })

    fetchMock = vi.fn() as MockedFunction<typeof fetch>
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ----- input validation (shared across the three wrappers) ---------------

  describe("input validation", () => {
    it("listCourseCreationCourses throws when tenant is missing", async () => {
      await expect(
        listCourseCreationCourses({ tenant: "", username: "jaden" }),
      ).rejects.toThrow(/Missing tenant/i)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("listCourseCreationCourses throws when every user candidate is empty", async () => {
      // No username arg, no localStorage userData → no candidates.
      await expect(
        listCourseCreationCourses({ tenant: "main", username: "" }),
      ).rejects.toThrow(/Missing user identifier/i)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("getCourseCreationTask rejects non-integer task ids", async () => {
      await expect(
        getCourseCreationTask("not-a-number", {
          tenant: "main",
          username: "jaden",
        }),
      ).rejects.toThrow(/integer CourseCreationTask\.id/)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("getCourseCreationTask requires a tenant", async () => {
      await expect(
        getCourseCreationTask(42, { tenant: "", username: "jaden" }),
      ).rejects.toThrow(/Missing tenant/i)
    })

    it("getCourseCreationTask requires a user identifier", async () => {
      await expect(
        getCourseCreationTask(42, { tenant: "main", username: "" }),
      ).rejects.toThrow(/Missing user identifier/i)
    })

    it("deleteCourse rejects non-integer record ids (must be EdxCourse.id)", async () => {
      await expect(
        deleteCourse("course-v1:main+JE4+RH8_RGY_3", {
          tenant: "main",
          username: "jaden",
        }),
      ).rejects.toThrow(/integer EdxCourse\.id/)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it("deleteCourse requires a tenant", async () => {
      await expect(
        deleteCourse(1, { tenant: "", username: "jaden" }),
      ).rejects.toThrow(/Missing tenant/i)
    })

    it("deleteCourse requires a user identifier", async () => {
      await expect(
        deleteCourse(1, { tenant: "main", username: "" }),
      ).rejects.toThrow(/Missing user identifier/i)
    })
  })

  // ----- listCourseCreationCourses happy/failure paths ---------------------

  describe("listCourseCreationCourses", () => {
    it("returns the paginated list and reports which user identifier worked", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, {
          results: [{ id: 1, name: "Foo", xblock_id: "x" }],
          count: 1,
          next: null,
          previous: null,
        }),
      )

      const out = await listCourseCreationCourses({
        tenant: "main",
        username: "jaden",
      })

      expect(out.results).toHaveLength(1)
      expect(out.count).toBe(1)
      expect(out.next).toBeNull()
      expect(out.previous).toBeNull()
      expect(out.userIdUsed).toBe("jaden")

      const callUrl = (fetchMock.mock.calls[0] as [string, RequestInit])[0]
      expectMentorPath(callUrl, "jaden/")
      expect(callUrl).toContain("page=1")
      expect(callUrl).toContain("page_size=100")
    })

    it("sends the DM token from localStorage as Authorization header when present", async () => {
      window.localStorage.setItem("dm_token", "abc123")
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: [], count: 0 }),
      )

      await listCourseCreationCourses({ tenant: "main", username: "jaden" })

      const init = (fetchMock.mock.calls[0] as [string, RequestInit])[1]
      expect(init?.headers).toMatchObject({ Authorization: "Token abc123" })
    })

    it("omits the Authorization header when no DM token is stored", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: [], count: 0 }),
      )

      await listCourseCreationCourses({ tenant: "main", username: "jaden" })

      const init = (fetchMock.mock.calls[0] as [string, RequestInit])[1]
      expect((init?.headers as Record<string, string>).Authorization).toBeUndefined()
    })

    it("falls back to user_id then user_nicename when each previous candidate 404s", async () => {
      window.localStorage.setItem(
        "userData",
        JSON.stringify({ user_id: 445, user_nicename: "jadent" }),
      )
      fetchMock
        .mockResolvedValueOnce(makeResponse(404, {}))
        .mockResolvedValueOnce(makeResponse(404, {}))
        .mockResolvedValueOnce(
          makeResponse(200, { results: [], count: 0 }),
        )

      const out = await listCourseCreationCourses({
        tenant: "main",
        username: "jaden",
      })

      expect(out.userIdUsed).toBe("jadent")
      const urls = fetchMock.mock.calls.map((c) => (c as [string])[0])
      expect(urls[0]).toContain("/users/jaden/")
      expect(urls[1]).toContain("/users/445/")
      expect(urls[2]).toContain("/users/jadent/")
    })

    it("stops on the first non-404 error and surfaces server detail", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(403, { detail: "Forbidden access" }),
      )
      await expect(
        listCourseCreationCourses({ tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/Forbidden access/)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("falls back to a generic message when error body has no detail", async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(500, {}))
      await expect(
        listCourseCreationCourses({ tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/HTTP 500/)
    })

    it("treats a non-JSON error body as an empty detail", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(503, null, { jsonThrows: true }),
      )
      await expect(
        listCourseCreationCourses({ tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/HTTP 503/)
    })

    it("normalises non-array results / missing pagination fields", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: null }),
      )

      const out = await listCourseCreationCourses({
        tenant: "main",
        username: "jaden",
      })

      expect(out.results).toEqual([])
      expect(out.count).toBe(0)
      expect(out.next).toBeNull()
      expect(out.previous).toBeNull()
    })

    it("dedupes user identifiers (the localStorage numeric == username case)", async () => {
      window.localStorage.setItem(
        "userData",
        JSON.stringify({ user_id: "jaden", user_nicename: "jaden" }),
      )
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: [], count: 0 }),
      )

      await listCourseCreationCourses({ tenant: "main", username: "jaden" })

      // Only one fetch — the Set dedupe collapsed all three candidates.
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  // ----- getCourseCreationTask --------------------------------------------

  describe("getCourseCreationTask", () => {
    it("returns the parsed task body on 200", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { id: 7, name: "Brief", description: "" }),
      )
      const task = await getCourseCreationTask(7, {
        tenant: "main",
        username: "jaden",
      })
      expect(task).toMatchObject({ id: 7, name: "Brief" })

      const url = (fetchMock.mock.calls[0] as [string])[0]
      expect(url).toContain("/course-creation/tasks/7/")
    })

    it("accepts a numeric id and stringifies it for the URL", async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(200, { id: 99, name: "" }))
      await getCourseCreationTask(99, { tenant: "main", username: "jaden" })
      const url = (fetchMock.mock.calls[0] as [string])[0]
      expect(url).toContain("/tasks/99/")
    })

    it("retries through every candidate on 404 then bubbles the last detail", async () => {
      window.localStorage.setItem(
        "userData",
        JSON.stringify({ user_id: 445, user_nicename: "jadent" }),
      )
      fetchMock
        .mockResolvedValueOnce(makeResponse(404, {}))
        .mockResolvedValueOnce(makeResponse(404, {}))
        .mockResolvedValueOnce(
          makeResponse(404, { detail: "Not Found" }),
        )

      await expect(
        getCourseCreationTask(5, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/Not Found/)
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it("stops on the first non-404 server error", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(500, { error: "internal" }),
      )
      await expect(
        getCourseCreationTask(5, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/internal/)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("falls back to 'Task fetch failed (HTTP …)' when no detail/error/message field", async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(502, {}))
      await expect(
        getCourseCreationTask(5, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/Task fetch failed \(HTTP 502\)/)
    })

    it("falls back when the error body isn't JSON", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(504, null, { jsonThrows: true }),
      )
      await expect(
        getCourseCreationTask(5, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/HTTP 504/)
    })
  })

  // ----- deleteCourse -----------------------------------------------------

  describe("deleteCourse", () => {
    it("returns void on 200 and sends DELETE", async () => {
      window.localStorage.setItem("dm_token", "abc123")
      fetchMock.mockResolvedValueOnce(makeResponse(204, undefined))
      await expect(
        deleteCourse(141, { tenant: "main", username: "jaden" }),
      ).resolves.toBeUndefined()

      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(url).toContain("/course-creation/course/141/")
      expect(init.method).toBe("DELETE")
      expect(init.headers).toMatchObject({ Authorization: "Token abc123" })
    })

    it("retries through user candidates on 404 then surfaces the detail", async () => {
      window.localStorage.setItem(
        "userData",
        JSON.stringify({ user_id: 445, user_nicename: "jadent" }),
      )
      fetchMock
        .mockResolvedValueOnce(makeResponse(404, {}))
        .mockResolvedValueOnce(makeResponse(404, {}))
        .mockResolvedValueOnce(
          makeResponse(404, { message: "no such course" }),
        )

      await expect(
        deleteCourse(1, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/no such course/)
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it("stops on the first non-404 server error", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(403, { detail: "nope" }),
      )
      await expect(
        deleteCourse(1, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/nope/)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("falls back to 'Delete failed (HTTP …)' when body has no detail", async () => {
      fetchMock.mockResolvedValueOnce(makeResponse(409, {}))
      await expect(
        deleteCourse(1, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/Delete failed \(HTTP 409\)/)
    })

    it("falls back gracefully on a non-JSON error body", async () => {
      fetchMock.mockResolvedValueOnce(
        makeResponse(500, null, { jsonThrows: true }),
      )
      await expect(
        deleteCourse(1, { tenant: "main", username: "jaden" }),
      ).rejects.toThrow(/HTTP 500/)
    })
  })

  // ----- localStorage edge cases -------------------------------------------

  describe("user-identifier extraction edge cases (drives readUserIdentifiers)", () => {
    it("ignores localStorage.userData when it isn't valid JSON", async () => {
      window.localStorage.setItem("userData", "{not json")
      // username arg is the only candidate left.
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: [], count: 0 }),
      )
      await listCourseCreationCourses({ tenant: "main", username: "jaden" })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("treats userData with no user_id / user_nicename as 'no extras'", async () => {
      window.localStorage.setItem(
        "userData",
        JSON.stringify({ unrelated: 1 }),
      )
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: [], count: 0 }),
      )
      await listCourseCreationCourses({ tenant: "main", username: "jaden" })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("uses localStorage candidates when the caller supplies no username", async () => {
      window.localStorage.setItem(
        "userData",
        JSON.stringify({ user_id: 445, user_nicename: "jaden" }),
      )
      fetchMock.mockResolvedValueOnce(
        makeResponse(200, { results: [], count: 0 }),
      )

      const out = await listCourseCreationCourses({
        tenant: "main",
        username: "",
      })

      expect(out.userIdUsed).toBe("445")
      expect((fetchMock.mock.calls[0] as [string])[0]).toContain("/users/445/")
    })
  })
})
