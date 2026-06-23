/**
 * Agent (mentor) per-tool toggles. Currently only the `course-creation`
 * tool — courseai's New Course flow needs every default agent to expose
 * the Course Creation toolkit so the SDK chat can call it.
 *
 * Endpoint (same path for GET + PUT — `EDIT_MENTOR_SETTINGS` in the SDK
 * data-layer, used by `useEditMentorJsonMutation`):
 *
 *   {dmUrl}/api/ai-mentor/orgs/<tenant>/users/<username>/mentors/<unique_id>/settings/
 *
 * Auth: `Authorization: Token <dm_token>` (stored by the SDK at
 * `localStorage.dm_token`; see `STORAGE_KEYS.DM_TOKEN_KEY`).
 *
 * The PUT body is **JSON** and a **partial merge** — only the fields we
 * send are updated; everything else on the agent is left intact. Setting
 * up the course-creator agent writes two things:
 *
 *   {
 *     "tool_slugs": ["<existing-slug-1>", ..., "course-creation"],
 *     "can_use_tools": true,
 *     "system_prompt": "<existing prompt>\n\n<Studio-link instruction>"
 *   }
 *
 * `tool_slugs` is the **full** list of slugs to keep enabled, not a
 * delta — earlier attempts to send a single string or a single-element
 * array silently dropped every other tool on the agent. We read the
 * current slugs from `mentor_tools[].slug` and append `course-creation`
 * iff missing.
 *
 * `system_prompt` is **appended** (never replaced) with one instruction:
 * after creating a course, hand the user a Studio link to edit it, built
 * from the `course_id` the course-creation tool returns
 * (`<studioUrl>/course/<course_id>`). A fixed phrase in that instruction
 * (`COURSE_LINK_MARKER`) is the idempotency marker, so it's added at most
 * once per agent.
 *
 * The whole operation is idempotent — once the tool is on and the prompt
 * has the Studio-link instruction, subsequent GETs short-circuit and we
 * skip the PUT. Failures are logged but never thrown; the New Course flow
 * continues navigating either way.
 */

import { toast } from "sonner";

import config from "@/lib/iblai/config";

const COURSE_CREATION_SLUG = "course-creation";

/**
 * Stable marker for the Studio-link instruction appended to the
 * course-creator agent's `system_prompt`. The Studio host is
 * deployment-specific (`config.studioUrl()`), so idempotency keys off
 * this fixed phrase rather than the full URL — if the prompt already
 * contains it, we don't re-append.
 */
const COURSE_LINK_MARKER = "open and edit it in Studio";

/**
 * The instruction appended to the course-creator agent's system prompt:
 * after creating a course, hand the user a Studio link to edit it. The
 * course-creation tool returns the new course's `course_id` (an edX
 * locator like `course-v1:org+number+run`), and Studio opens it at
 * `<studioUrl>/course/<course_id>` — same shape as `studioOutlineUrl` in
 * `course-actions.ts`. `COURSE_LINK_MARKER` stays a substring of the
 * returned text so the append is idempotent.
 */
function courseLinkInstruction(): string {
  const studioBase = config.studioUrl().replace(/\/+$/, "");
  return (
    `After you create a course, the course-creation tool returns the new ` +
    `course's "course_id" — an edX course locator like ` +
    `"course-v1:org+number+run". Always give the user a link to ` +
    `${COURSE_LINK_MARKER} by appending that course_id to ` +
    `${studioBase}/course/ (for example, ` +
    `${studioBase}/course/course-v1:org+number+run).`
  );
}

interface MentorToolEntry {
  slug?: string | null;
}

interface MentorSettingsResponse {
  mentor_tools?: MentorToolEntry[] | null;
  system_prompt?: string | null;
}

/**
 * Outcome of an enable attempt.
 *
 * - `ok` — whether the agent can be expected to expose the tool. `false`
 *   only when an enable attempt was actually made and failed.
 * - `justEnabled` — `true` when this call's PUT wrote the agent settings
 *   (freshly enabled the `course-creation` tool and/or appended the
 *   Studio-link instruction to its system prompt). The chat websocket
 *   connects before this runs, so the caller must remount the chat to
 *   reconnect for the new tool/prompt to take effect.
 */
export interface CourseCreationEnableResult {
  ok: boolean;
  justEnabled: boolean;
}

function readDmToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("dm_token") ?? "";
}

function settingsUrl(
  tenantKey: string,
  username: string,
  mentorUniqueId: string,
): string {
  const base = config.dmUrl();
  return `${base}/api/ai-mentor/orgs/${encodeURIComponent(
    tenantKey,
  )}/users/${encodeURIComponent(username)}/mentors/${encodeURIComponent(
    mentorUniqueId,
  )}/settings/`;
}

/**
 * Lightweight existence check for an agent — GET its settings and
 * report whether the request succeeded. Used by `useMentorRedirect` to
 * validate the platform-metadata sticky default before honoring it; a
 * 404 (agent deleted) drops back to the recently_accessed → featured
 * scan so the user lands on a real agent.
 *
 * Returns `false` for any non-2xx (including network errors and missing
 * token) so callers can simply skip the shortcut. Never throws.
 */
export async function agentExists(
  tenantKey: string,
  username: string,
  mentorUniqueId: string,
): Promise<boolean> {
  if (!tenantKey || !username || !mentorUniqueId) return false;
  const token = readDmToken();
  if (!token) return false;

  try {
    const resp = await fetch(settingsUrl(tenantKey, username, mentorUniqueId), {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

/**
 * Set up the course-creator agent. GET its settings, then PUT (partial
 * merge) whatever's missing: append `course-creation` to `tool_slugs`
 * (with `can_use_tools=true`) if absent, and append the Studio-link
 * instruction to `system_prompt` if absent. Skips the PUT entirely when
 * both are already in place.
 *
 * Never throws — logs errors to the console so a fire-and-forget caller
 * (the New Course click, `useMentorRedirect`'s pre-warm) is never blocked
 * by a network hiccup or a stale token.
 *
 * Returns a `CourseCreationEnableResult`:
 *   - `ok: false` — a setup attempt was actually made and failed (the
 *     settings GET or PUT errored, or the request threw). The
 *     course-creation chat can't work on this agent, so a caller that
 *     depends on it should surface the error page.
 *   - `ok: true, justEnabled: false` — the tool was already enabled and
 *     the prompt already has the Studio link, or there was nothing to
 *     attempt yet (missing args / auth token still hydrating). Safe to
 *     proceed into the chat as-is.
 *   - `ok: true, justEnabled: true` — this call's PUT just wrote the agent
 *     settings (tool and/or system prompt). The chat connected before
 *     that, so the caller must remount it (reconnect the websocket) for
 *     the change to take effect.
 */
export async function enableCourseCreationToolIfMissing(
  tenantKey: string,
  username: string,
  mentorUniqueId: string,
): Promise<CourseCreationEnableResult> {
  // Nothing to attempt — not a failure (the platform page guards these
  // before calling, so this only trips during the brief hydration window).
  if (!tenantKey || !username || !mentorUniqueId)
    return { ok: true, justEnabled: false };
  const token = readDmToken();
  // Token not in localStorage yet: let the SDK auth flow handle it rather
  // than flashing the error page mid-hydration.
  if (!token) return { ok: true, justEnabled: false };

  const url = settingsUrl(tenantKey, username, mentorUniqueId);

  try {
    const getResp = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    });
    if (!getResp.ok) {
      console.warn(
        "[agent-tools] GET settings failed",
        getResp.status,
        mentorUniqueId,
      );
      return { ok: false, justEnabled: false };
    }
    const data = (await getResp.json()) as MentorSettingsResponse;
    const tools = data.mentor_tools ?? [];
    const currentSlugs = tools
      .map((t) => (typeof t?.slug === "string" ? t.slug : null))
      .filter((s): s is string => !!s);
    const alreadyEnabled = currentSlugs.some(
      (s) => s.toLowerCase() === COURSE_CREATION_SLUG,
    );

    const currentPrompt =
      typeof data.system_prompt === "string" ? data.system_prompt : "";
    // Idempotency marker: if the Studio-link instruction is already in the
    // prompt, this agent has been set up before — leave the prompt alone.
    const promptNeedsInstruction = !currentPrompt.includes(COURSE_LINK_MARKER);

    // Nothing to write — the tool is on and the prompt already has the
    // Studio link. No-op (no toast); the SDK route was a load+sync.
    if (alreadyEnabled && !promptNeedsInstruction) {
      return { ok: true, justEnabled: false };
    }

    // Partial-merge PUT: send only the fields that changed so we never
    // clobber the agent's other settings.
    const body: Record<string, unknown> = {};
    if (!alreadyEnabled) {
      body.tool_slugs = [...currentSlugs, COURSE_CREATION_SLUG];
      body.can_use_tools = true;
    }
    if (promptNeedsInstruction) {
      // Append, never replace — keep whatever the agent already says.
      const instruction = courseLinkInstruction();
      body.system_prompt = currentPrompt
        ? `${currentPrompt.trimEnd()}\n\n${instruction}`
        : instruction;
    }

    const putResp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!putResp.ok) {
      const errText = await putResp.text().catch(() => "");
      console.warn(
        "[agent-tools] PUT course-creator setup failed",
        putResp.status,
        errText,
        mentorUniqueId,
      );
      return { ok: false, justEnabled: false };
    }
    toast.success("Agent settings updated");
    return { ok: true, justEnabled: true };
  } catch (err) {
    console.error("[agent-tools] enableCourseCreationToolIfMissing", err);
    return { ok: false, justEnabled: false };
  }
}
