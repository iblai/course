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
 * PUT body is **JSON** (matches mentorai's `updateMCPServers` and the
 * SDK mutation):
 *
 *   {
 *     "tool_slugs": ["<existing-slug-1>", ..., "course-creation"],
 *     "can_use_tools": true
 *   }
 *
 * `tool_slugs` is the **full** list of slugs to keep enabled, not a
 * delta — earlier attempts to send a single string or a single-element
 * array silently dropped every other tool on the agent. We read the
 * current slugs from `mentor_tools[].slug` and append `course-creation`
 * iff missing.
 *
 * The operation is idempotent — once enabled, subsequent GETs include
 * the tool in `mentor_tools[]`, so we skip the PUT. Failures are logged
 * but never thrown; the New Course flow continues navigating either way.
 */

import { toast } from "sonner";

import config from "@/lib/iblai/config";

const COURSE_CREATION_SLUG = "course-creation";

interface MentorToolEntry {
  slug?: string | null;
}

interface MentorSettingsResponse {
  mentor_tools?: MentorToolEntry[] | null;
}

/**
 * Outcome of an enable attempt.
 *
 * - `ok` — whether the agent can be expected to expose the tool. `false`
 *   only when an enable attempt was actually made and failed.
 * - `justEnabled` — `true` only when this call's PUT freshly enabled the
 *   tool. The chat websocket connects before this runs, so when the tool
 *   was just added the caller must remount the chat to reconnect, or the
 *   agent won't be able to call it.
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
 * GET the agent's settings and, if `mentor_tools[]` does not already
 * contain `slug: "course-creation"`, PUT a JSON body with the full
 * (existing + course-creation) `tool_slugs` array and `can_use_tools=true`.
 *
 * Never throws — logs errors to the console so a fire-and-forget caller
 * (the New Course click, `useMentorRedirect`'s pre-warm) is never blocked
 * by a network hiccup or a stale token.
 *
 * Returns a `CourseCreationEnableResult`:
 *   - `ok: false` — an enable attempt was actually made and failed (the
 *     settings GET or PUT errored, or the request threw). The
 *     course-creation chat can't work on this agent, so a caller that
 *     depends on it should surface the error page.
 *   - `ok: true, justEnabled: false` — the tool was already enabled, or
 *     there was nothing to attempt yet (missing args / auth token still
 *     hydrating). Safe to proceed into the chat as-is.
 *   - `ok: true, justEnabled: true` — this call's PUT just enabled the
 *     tool. The chat connected before that, so the caller must remount the
 *     chat (reconnect the websocket) for the agent to be able to call it.
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
    if (alreadyEnabled) {
      // No-op: the SDK route was a load + sync, and the toast that
      // used to confirm it lingered too long on the configure page.
      // Successful writes still toast (see `Agent settings updated`
      // below).
      return { ok: true, justEnabled: false };
    }

    const updatedSlugs = [...currentSlugs, COURSE_CREATION_SLUG];

    const putResp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool_slugs: updatedSlugs,
        can_use_tools: true,
      }),
    });
    if (!putResp.ok) {
      const errText = await putResp.text().catch(() => "");
      console.warn(
        "[agent-tools] PUT course-creation failed",
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
