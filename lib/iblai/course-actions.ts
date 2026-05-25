/**
 * Course action helpers for the /courses page.
 *
 * Routes / external URLs for the row actions (about, schedule, edit,
 * preview, view-prompt, delete) and a `deleteCourse` REST helper that
 * targets the Course Creation API as documented in `/iblai-course-create`:
 *
 *   DELETE {dmUrl}/api/ai-mentor/orgs/{org}/users/{user_id}/course-creation/course/{course_id}/
 *
 * The user-scoped path means a learner cannot delete a course they don't
 * own. Pass the active tenant + username via `useUrlContext`.
 */

import config from "@/lib/iblai/config";

/** Reader-facing course-content tabs (see `/iblai-course-access`). */
export const courseContentUrl = (courseId: string, tab: "course" | "dates" | "progress" | "discussion" | "instructor" = "course") =>
  `/course-content/${encodeURIComponent(courseId)}/${tab}`;

/** edX Studio outline page (authoring UI). */
export const studioOutlineUrl = (courseId: string) =>
  `${config.studioUrl()}/course/${encodeURIComponent(courseId)}`;

/** LMS course view (read-only learner preview). User-facing host. */
export const lmsCoursePreviewUrl = (courseId: string) =>
  `${config.lmsBrowserUrl()}/courses/${encodeURIComponent(courseId)}/course`;

/** LMS course "about" page (description, schedule, enroll button). */
export const lmsCourseAboutUrl = (courseId: string) =>
  `${config.lmsBrowserUrl()}/courses/${encodeURIComponent(courseId)}/about`;

/** Learner MFE dates tab (real schedule + key date list). */
export const mfeCourseDatesUrl = (courseId: string) =>
  `${config.mfeUrl()}/learning/course/${encodeURIComponent(courseId)}/dates`;

function readDmToken(): string {
  if (typeof window === "undefined") return "";
  // The DM service auths via its own session token, stored at
  // `localStorage.dm_token` by the data-layer (see SDK
  // `STORAGE_KEYS.DM_TOKEN_KEY`). Earlier we read `axd_token` -- that
  // token is scoped to the AXD service and silently 404s on DM routes.
  return localStorage.getItem("dm_token") ?? "";
}

/**
 * Pull both the numeric `user_id` and the `user_nicename` slug from
 * `localStorage.userData` -- DM endpoints scoped by `{user_id}` accept
 * either (see SDK doc: "user_id e.g developer@ibleducation.com or
 * dev123 (username|email)"), but the actual ORM filter depends on the
 * endpoint, so let the caller try both.
 */
function readUserIdentifiers(): { numeric: string; nicename: string } {
  if (typeof window === "undefined") return { numeric: "", nicename: "" };
  try {
    const raw = localStorage.getItem("userData");
    if (!raw) return { numeric: "", nicename: "" };
    const parsed = JSON.parse(raw);
    return {
      numeric: parsed?.user_id != null ? String(parsed.user_id) : "",
      nicename: parsed?.user_nicename != null ? String(parsed.user_nicename) : "",
    };
  } catch {
    return { numeric: "", nicename: "" };
  }
}

export interface CourseApiContext {
  tenant: string;
  username: string;
}

/**
 * Convert an `EdxCourse.xblock_id` (course-block locator) back to the
 * edX course locator:
 *   block-v1:nerv-test+Dz4+7JQ_G3C_5+type@course+block@course
 *     -> course-v1:nerv-test+Dz4+7JQ_G3C_5
 * Used to derive routable course ids for About/Schedule/Edit/Preview
 * buttons from the course-creation list response.
 */
export function blockLocatorToCourseLocator(xblockId: string | undefined | null): string {
  if (!xblockId) return "";
  // Already a course locator (some endpoints return `course-v1:...`
  // directly instead of wrapping it in a block locator). Pass through.
  if (xblockId.startsWith("course-v1:")) return xblockId;
  if (!xblockId.startsWith("block-v1:")) return xblockId;
  const stripped = xblockId
    .slice("block-v1:".length)
    .replace(/\+type@course\+block@course$/, "");
  return `course-v1:${stripped}`;
}

/**
 * Best-effort course locator extraction from a course-creation record.
 * Different versions of the AI-mentor API expose the locator under
 * different field names; reading just `xblock_id` produced an empty
 * string when the field was named e.g. `course_id` or `course_key`,
 * which then made every action button (About / Schedule / Edit /
 * Preview / Delete) open a URL with an empty course id.
 */
export function recordToCourseLocator(r: EdxCourseRecord): string {
  const candidates = [
    r.xblock_id,
    (r as { course_id?: string }).course_id,
    (r as { course_key?: string }).course_key,
    (r as { course_locator?: string }).course_locator,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) {
      return blockLocatorToCourseLocator(c);
    }
  }
  return "";
}

export interface EdxCourseRecord {
  /** Integer EdxCourse record id (path param for delete/detail). */
  id: number;
  name: string;
  xblock_id?: string;
  course_id?: string;
  course_key?: string;
  course_locator?: string;
  run?: string;
  number?: string;
  description?: string;
  task?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CourseCreationTask {
  id: number;
  name: string;
  description: string;
  target_audience: string;
  provider?: string;
  model?: string;
  desired_number_of_sections?: number;
  status?: string;
  publish_course?: boolean;
  platform_key?: string;
  date_created?: string;
  last_modified?: string;
  logs?: string;
  files?: unknown[];
}

/**
 * Get the per-user course-creation course list. This is what powers
 * the All Courses page -- the list returns the integer `EdxCourse`
 * record ids that the delete endpoint expects, so no separate lookup
 * is needed.
 *
 * Endpoint:
 *   GET /api/ai-mentor/orgs/{org}/users/{user_id}/course-creation/course/
 *
 * Tries the caller-supplied `username` first, then the numeric
 * `user_id`, then `user_nicename` -- whichever form the backend
 * accepts.
 */
export async function listCourseCreationCourses({
  tenant,
  username,
  page = 1,
  pageSize = 100,
}: CourseApiContext & { page?: number; pageSize?: number }): Promise<{
  results: EdxCourseRecord[];
  count: number;
  next: string | null;
  previous: string | null;
  userIdUsed: string;
}> {
  if (!tenant) throw new Error("Missing tenant");

  const token = readDmToken();
  const ids = readUserIdentifiers();
  const candidates = Array.from(
    new Set(
      [username, ids.numeric, ids.nicename].filter(
        (v): v is string => typeof v === "string" && v.length > 0,
      ),
    ),
  );
  if (candidates.length === 0) throw new Error("Missing user identifier");

  let lastRes: Response | null = null;
  for (const uid of candidates) {
    const url = `${config.dmUrl()}/api/ai-mentor/orgs/${encodeURIComponent(tenant)}/users/${encodeURIComponent(uid)}/course-creation/course/?page=${page}&page_size=${pageSize}`;
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        results: Array.isArray(data?.results) ? data.results : [],
        count: data?.count ?? 0,
        next: data?.next ?? null,
        previous: data?.previous ?? null,
        userIdUsed: uid,
      };
    }
    lastRes = res;
    if (res.status !== 404) break;
  }
  // `candidates.length > 0` is enforced above and every fetch result
  // sets `lastRes`, so the loop is guaranteed to have populated it.
  // The non-null assertion lets us collapse the previously-defensive
  // `if (lastRes)` branch — it was unreachable.
  const errRes = lastRes!;
  let detail = "";
  try {
    const j = await errRes.json();
    detail = (j && (j.detail || j.error || j.message)) ?? "";
  } catch {
    /* ignore */
  }
  throw new Error(detail || `List failed (HTTP ${errRes.status})`);
}

/**
 * Fetch a single course-creation task (the AI brief that generated a
 * course). Used by the "View Creation Prompt" dialog.
 *
 * Endpoint:
 *   GET /api/ai-mentor/orgs/{org}/users/{user_id}/course-creation/tasks/{id}/
 *
 * Returns the full task body (name, description, target_audience,
 * provider, model, etc.) per the `CourseCreationTask` schema.
 */
export async function getCourseCreationTask(
  taskId: number | string,
  { tenant, username }: CourseApiContext,
): Promise<CourseCreationTask> {
  const idStr = String(taskId);
  if (!/^\d+$/.test(idStr))
    throw new Error("Task id must be the integer CourseCreationTask.id");
  if (!tenant) throw new Error("Missing tenant");

  const token = readDmToken();
  const ids = readUserIdentifiers();
  const candidates = Array.from(
    new Set(
      [username, ids.numeric, ids.nicename].filter(
        (v): v is string => typeof v === "string" && v.length > 0,
      ),
    ),
  );
  if (candidates.length === 0) throw new Error("Missing user identifier");

  let lastRes: Response | null = null;
  for (const uid of candidates) {
    const url = `${config.dmUrl()}/api/ai-mentor/orgs/${encodeURIComponent(tenant)}/users/${encodeURIComponent(uid)}/course-creation/tasks/${idStr}/`;
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    });
    if (res.ok) return (await res.json()) as CourseCreationTask;
    lastRes = res;
    if (res.status !== 404) break;
  }
  // See `listCourseCreationCourses` for the non-null-assertion rationale.
  const errRes = lastRes!;
  let detail = "";
  try {
    const j = await errRes.json();
    detail = (j && (j.detail || j.error || j.message)) ?? "";
  } catch {
    /* ignore */
  }
  throw new Error(detail || `Task fetch failed (HTTP ${errRes.status})`);
}

/**
 * Delete a course via the Course Creation API. Cascades on EdX
 * (sections → subsections → units → components) and is irreversible.
 * Throws on non-2xx.
 *
 * `{id}` MUST be the integer `EdxCourse.id` from the list endpoint --
 * NOT the edX locator. Auth: `Authorization: Token <dm_token>`.
 */
export async function deleteCourse(
  recordId: number | string,
  { tenant, username }: CourseApiContext,
): Promise<void> {
  const idStr = String(recordId);
  if (!/^\d+$/.test(idStr))
    throw new Error("Course id must be the integer EdxCourse.id");
  if (!tenant) throw new Error("Missing tenant");

  const token = readDmToken();
  const ids = readUserIdentifiers();
  const candidates = Array.from(
    new Set(
      [username, ids.numeric, ids.nicename].filter(
        (v): v is string => typeof v === "string" && v.length > 0,
      ),
    ),
  );
  if (candidates.length === 0) throw new Error("Missing user identifier");

  let lastRes: Response | null = null;
  for (const uid of candidates) {
    const url = `${config.dmUrl()}/api/ai-mentor/orgs/${encodeURIComponent(tenant)}/users/${encodeURIComponent(uid)}/course-creation/course/${idStr}/`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    });
    if (res.ok) return;
    lastRes = res;
    if (res.status !== 404) break;
  }
  // See `listCourseCreationCourses` for the non-null-assertion rationale.
  const errRes = lastRes!;
  let detail = "";
  try {
    const j = await errRes.json();
    detail = (j && (j.detail || j.error || j.message)) ?? "";
  } catch {
    /* ignore */
  }
  throw new Error(detail || `Delete failed (HTTP ${errRes.status})`);
}
