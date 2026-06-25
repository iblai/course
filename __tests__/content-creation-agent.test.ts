import { beforeEach, describe, expect, it, vi } from "vitest"

// Only the plain `resolveOrCreateContentCreationAgent` is under test — stub the
// SDK data-layer so importing the module doesn't pull the real RTK Query graph
// in (the hooks it exports are never exercised here).
vi.mock("@iblai/iblai-js/data-layer", () => ({
  useLazyGetMentorsQuery: () => [vi.fn()],
  useCreateMentorMutation: () => [vi.fn()],
}))

// The resolver enables the course-creation tool on a freshly created agent via
// this helper (which really does fetch + localStorage). Stub it and assert the
// resolver calls it before returning.
const enableTool = vi.fn(
  async (_tenant: string, _username: string, _id: string) => ({
    ok: true,
    justEnabled: true,
  }),
)
vi.mock("@/lib/iblai/agent-tools", () => ({
  enableCourseCreationToolIfMissing: (
    tenant: string,
    username: string,
    id: string,
  ) => enableTool(tenant, username, id),
  agentExists: vi.fn(async () => true),
}))

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import {
  resolveOrCreateContentCreationAgent,
  CONTENT_CREATION_AGENT_NAME,
} from "@/hooks/use-ensure-content-creation-agent"

// A deferred so a test can hold `createMentor` open and observe in-flight
// de-dup before it settles.
function deferred<T>() {
  let resolve!: (v: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

beforeEach(() => {
  enableTool.mockClear()
})

describe("resolveOrCreateContentCreationAgent", () => {
  it("returns an existing agent's id without creating or enabling", async () => {
    const listMentors = vi.fn(async () => ({
      results: [{ name: "Content Creation", unique_id: "cc-existing" }],
    }))
    const createMentor = vi.fn()

    const id = await resolveOrCreateContentCreationAgent(
      "tenant-existing",
      "admin",
      { listMentors, createMentor },
    )

    expect(id).toBe("cc-existing")
    expect(createMentor).not.toHaveBeenCalled()
    expect(enableTool).not.toHaveBeenCalled()
  })

  it("creates an admin-only agentAI clone (with the tool) when missing", async () => {
    const listMentors = vi.fn(async () => ({ results: [] }))
    const createMentor = vi.fn(
      async (_arg: {
        org: string
        userId: string
        formData: Record<string, unknown>
      }) => ({ unique_id: "cc-new" }),
    )

    const id = await resolveOrCreateContentCreationAgent(
      "tenant-create",
      "admin",
      { listMentors, createMentor },
    )

    expect(id).toBe("cc-new")
    expect(createMentor).toHaveBeenCalledTimes(1)
    const form = createMentor.mock.calls[0][0].formData
    expect(form.new_mentor_name).toBe(CONTENT_CREATION_AGENT_NAME)
    expect(form.display_name).toBe(CONTENT_CREATION_AGENT_NAME)
    expect(form.template_name).toBe("agentAI")
    expect(form.mentor_visibility).toBe("viewable_by_tenant_admins")
    expect(form.tool_slugs).toEqual(["course-creation"])
    // Tool enabled (full-replace PUT) before the id is returned.
    expect(enableTool).toHaveBeenCalledWith("tenant-create", "admin", "cc-new")
  })

  it("matches the name EXACTLY — a fuzzy 'Content Creation Helper' does not count", async () => {
    const listMentors = vi.fn(async () => ({
      results: [{ name: "Content Creation Helper", unique_id: "helper" }],
    }))
    const createMentor = vi.fn(async () => ({ unique_id: "cc-exact" }))

    const id = await resolveOrCreateContentCreationAgent(
      "tenant-fuzzy",
      "admin",
      { listMentors, createMentor },
    )

    // Helper is not an exact match → a real "Content Creation" agent is created.
    expect(id).toBe("cc-exact")
    expect(createMentor).toHaveBeenCalledTimes(1)
  })

  it("caches the id — a second call neither re-lists nor re-creates", async () => {
    const listMentors = vi.fn(async () => ({ results: [] }))
    const createMentor = vi.fn(async () => ({ unique_id: "cc-cached" }))
    const deps = { listMentors, createMentor }

    const first = await resolveOrCreateContentCreationAgent("tenant-cache", "admin", deps)
    const second = await resolveOrCreateContentCreationAgent("tenant-cache", "admin", deps)

    expect(first).toBe("cc-cached")
    expect(second).toBe("cc-cached")
    expect(createMentor).toHaveBeenCalledTimes(1)
    expect(listMentors).toHaveBeenCalledTimes(1)
  })

  it("does NOT cache a failed create (no unique_id) — a later call retries", async () => {
    const listMentors = vi.fn(async () => ({ results: [] }))
    let calls = 0
    const createMentor = vi.fn(
      async (_arg: {
        org: string
        userId: string
        formData: Record<string, unknown>
      }) => (++calls === 1 ? {} : { unique_id: "cc-retry" }),
    )
    const deps = { listMentors, createMentor }

    const first = await resolveOrCreateContentCreationAgent("tenant-retry", "admin", deps)
    const second = await resolveOrCreateContentCreationAgent("tenant-retry", "admin", deps)

    expect(first).toBeNull()
    expect(second).toBe("cc-retry")
    // No id cached the first time → the second call retried instead of
    // returning a bad/cached value.
    expect(createMentor).toHaveBeenCalledTimes(2)
  })

  it("matches the name case-insensitively and trims surrounding whitespace", async () => {
    const listMentors = vi.fn(async () => ({
      results: [{ name: "  cONTENT cREATION  ", unique_id: "cc-trim" }],
    }))
    const createMentor = vi.fn()

    const id = await resolveOrCreateContentCreationAgent(
      "tenant-trim",
      "admin",
      { listMentors, createMentor },
    )

    expect(id).toBe("cc-trim")
    expect(createMentor).not.toHaveBeenCalled()
  })

  it("de-dups concurrent callers — one create for the same tenant (no double-create)", async () => {
    const create = deferred<{ unique_id: string }>()
    const listMentors = vi.fn(async () => ({ results: [] }))
    const createMentor = vi.fn(() => create.promise)
    const deps = { listMentors, createMentor }

    // Two surfaces (e.g. the redirect + the sidebar pre-warm) resolve at once.
    const p1 = resolveOrCreateContentCreationAgent("tenant-concurrent", "admin", deps)
    const p2 = resolveOrCreateContentCreationAgent("tenant-concurrent", "admin", deps)

    // Let the single in-flight run reach `createMentor`, then settle it.
    await vi.waitFor(() => expect(createMentor).toHaveBeenCalled())
    create.resolve({ unique_id: "cc-once" })

    await expect(p1).resolves.toBe("cc-once")
    await expect(p2).resolves.toBe("cc-once")
    expect(createMentor).toHaveBeenCalledTimes(1)
  })

  it("resolves null when the lookup fails, so the caller can fall back", async () => {
    const listMentors = vi.fn(async () => {
      throw new Error("network")
    })
    const createMentor = vi.fn()

    const id = await resolveOrCreateContentCreationAgent(
      "tenant-error",
      "admin",
      { listMentors, createMentor },
    )

    expect(id).toBeNull()
    expect(createMentor).not.toHaveBeenCalled()
  })

  it("returns null (and touches nothing) without a tenant or username", async () => {
    const listMentors = vi.fn()
    const createMentor = vi.fn()

    expect(
      await resolveOrCreateContentCreationAgent("", "admin", { listMentors, createMentor }),
    ).toBeNull()
    expect(
      await resolveOrCreateContentCreationAgent("t", "", { listMentors, createMentor }),
    ).toBeNull()
    expect(listMentors).not.toHaveBeenCalled()
    expect(createMentor).not.toHaveBeenCalled()
  })
})
