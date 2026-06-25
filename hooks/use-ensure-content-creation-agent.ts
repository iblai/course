"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  useLazyGetMentorsQuery,
  useCreateMentorMutation,
} from "@iblai/iblai-js/data-layer";

import { useUrlContext } from "@/lib/iblai/use-url-context";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { enableCourseCreationToolIfMissing } from "@/lib/iblai/agent-tools";

/** The dedicated content-creator agent's display name. */
export const CONTENT_CREATION_AGENT_NAME = "Content Creation";

/**
 * Template the agent is cloned from. Resolved server-side by the create
 * endpoint against the seeded mentor's `name` OR `slug` on the `main`
 * platform (`get_mentor_template`) — NOT an id. `"agentAI"` matches the
 * seeded template by name (its slug is `ai-mentor`, the os/onboarding
 * default). Passing a `unique_id` here would fail to resolve.
 */
const TEMPLATE_MENTOR = "agentAI";

/**
 * Slug of the course-creation toolkit the agent must expose. This is a fixed
 * backend tool id — distinct from the agent's display name above.
 */
const COURSE_CREATION_TOOL_SLUG = "course-creation";

type SdkMentor = { name?: string | null; unique_id?: string | null };

/**
 * Dependencies the resolver needs — the RTK Query trigger functions, already
 * `.unwrap()`-ed so each resolves to the response body. Supplied by whichever
 * hook calls the resolver (the sidebar's ensure hook, or `useMentorRedirect`),
 * so the resolver itself stays a plain, shareable async function.
 */
export interface ContentCreationAgentDeps {
  listMentors: (args: {
    org: string;
    username: string;
    query: string;
    limit: number;
  }) => Promise<unknown>;
  createMentor: (args: {
    org: string;
    userId: string;
    formData: Record<string, unknown>;
  }) => Promise<unknown>;
}

// Module-level (shared across EVERY caller — the sidebar hook AND the mentor
// redirect) so a get-or-create started by one is reused by the others. Without
// this, each hook instance would have its own guard and two surfaces resolving
// at once could create two agents.
//   - `resolvedIdByTenant`: the agent id once known, so later calls are instant.
//   - `inflightByTenant`: the live get-or-create promise, so concurrent callers
//     await the same one instead of racing into a second create.
const resolvedIdByTenant = new Map<string, string>();
const inflightByTenant = new Map<string, Promise<string | null>>();

/**
 * Get-or-create the tenant's admin-only "Content Creation" agent and resolve
 * to its `unique_id`. Plain async fn (not a hook) so both the sidebar's
 * `useEnsureContentCreationAgent` and `useMentorRedirect` can share it — and
 * share the module-level de-dup above.
 *
 *   1. Returns the cached id if already resolved this session.
 *   2. Else lists the tenant's agents (narrowed by `query`, confirmed with an
 *      exact case-insensitive `name` match — for an admin the list includes
 *      `viewable_by_tenant_admins` agents).
 *   3. If absent, creates one cloned from the `agentAI` template, admin-only,
 *      then enables the course-creation tool (GET → spread existing settings →
 *      PUT, so nothing is wiped) before returning, so the agent is usable
 *      immediately with no first-use enable + chat remount.
 *
 * Resolves `null` on any failure (callers fall back). Never throws.
 */
export async function resolveOrCreateContentCreationAgent(
  tenantKey: string,
  username: string,
  deps: ContentCreationAgentDeps,
): Promise<string | null> {
  if (!tenantKey || !username) return null;

  const cached = resolvedIdByTenant.get(tenantKey);
  if (cached) return cached;
  const existing = inflightByTenant.get(tenantKey);
  if (existing) return existing;

  const run = (async (): Promise<string | null> => {
    try {
      // 1. Look for an existing "Content Creation" agent (exact name match;
      //    `query` only narrows the payload server-side).
      const listed = await deps.listMentors({
        org: tenantKey,
        username,
        query: CONTENT_CREATION_AGENT_NAME,
        limit: 20,
      });
      const results =
        (listed as { results?: SdkMentor[] } | undefined)?.results ?? [];
      const found = results.find(
        (m) =>
          (m.name ?? "").trim().toLowerCase() ===
          CONTENT_CREATION_AGENT_NAME.toLowerCase(),
      );
      const foundId =
        typeof found?.unique_id === "string" ? found.unique_id : null;
      if (foundId) {
        resolvedIdByTenant.set(tenantKey, foundId);
        return foundId;
      }

      // 2. Not found → create it, cloned from agentAI, admin-only.
      const created = await deps.createMentor({
        org: tenantKey,
        userId: username,
        formData: {
          new_mentor_name: CONTENT_CREATION_AGENT_NAME,
          display_name: CONTENT_CREATION_AGENT_NAME,
          description: "Create and edit courses with AI.",
          template_name: TEMPLATE_MENTOR,
          mentor_visibility: "viewable_by_tenant_admins",
          // Best-effort born tool-ready; the settings PUT below guarantees it.
          tool_slugs: [COURSE_CREATION_TOOL_SLUG],
        },
      });
      const id =
        typeof (created as { unique_id?: string } | undefined)?.unique_id ===
        "string"
          ? (created as { unique_id: string }).unique_id
          : null;
      if (!id) return null;

      // 3. Guarantee the course-creation tool before exposing the id, so the
      //    chat that opens needs no first-use enable + remount. Idempotent;
      //    full-replace PUT that carries the agent's existing settings.
      await enableCourseCreationToolIfMissing(tenantKey, username, id);
      resolvedIdByTenant.set(tenantKey, id);
      toast.success("Content Creation agent ready");
      return id;
    } catch (err) {
      console.error("[content-creation-agent] ensure failed", err);
      return null;
    } finally {
      inflightByTenant.delete(tenantKey);
    }
  })();

  inflightByTenant.set(tenantKey, run);
  return run;
}

export interface EnsureContentCreationAgent {
  /**
   * Get-or-create the "Content Creation" agent and resolve to its `unique_id`.
   * Awaitable so a caller (the New Course button) can create it when missing
   * and only THEN route to it. Resolves `null` for non-admins / unresolved
   * context, or if the lookup-and-create failed.
   */
  ensureAgent: () => Promise<string | null>;
}

/**
 * Admin-only hook around {@link resolveOrCreateContentCreationAgent}: wires the
 * SDK triggers, gates on admin context, and pre-warms the agent on mount so the
 * New Course click is usually instant.
 */
export function useEnsureContentCreationAgent(): EnsureContentCreationAgent {
  const { tenantKey, username, ready } = useUrlContext();
  const isAdmin = useIsAdmin();
  const enabled = ready && !!tenantKey && !!username && isAdmin;

  const [triggerGetMentors] = useLazyGetMentorsQuery();
  const [createMentor] = useCreateMentorMutation();

  const ensureAgent = useCallback(async (): Promise<string | null> => {
    if (!enabled || !tenantKey || !username) return null;
    return resolveOrCreateContentCreationAgent(tenantKey, username, {
      listMentors: (args) => triggerGetMentors(args as never).unwrap(),
      createMentor: (args) => createMentor(args as never).unwrap(),
    });
  }, [enabled, tenantKey, username, triggerGetMentors, createMentor]);

  // Pre-warm: resolve/create in the background as soon as we're in an admin
  // context, so the New Course click is usually instant. Shares the
  // module-level guard, so this never double-creates with a concurrent click
  // or the mentor-redirect default.
  useEffect(() => {
    if (!enabled) return;
    void ensureAgent();
  }, [enabled, ensureAgent]);

  return { ensureAgent };
}
