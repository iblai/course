/**
 * Catalog of user-facing error messages for the `/error/[code]` page,
 * mirroring agentai's `lib/error.ts`. Each entry is keyed by the
 * `?errorType=<key>` query param the error page reads; `header` and
 * `message` are passed straight to the SDK `<ClientErrorPage>`.
 *
 * courseai surfaces two course-creation failures here:
 *
 *   - `agentLoadFailed`         — `useMentorRedirect` couldn't load any
 *                                 agent to host the course-creation tool
 *                                 (the mentor-list fetch failed, or an
 *                                 unexpected error was thrown).
 *   - `courseCreationUnavailable` — the per-agent `course-creation` tool
 *                                 could not be enabled (the settings
 *                                 GET/PUT failed), so the chat can't
 *                                 create courses on this agent.
 */
export const customErrorMessages = {
  agentLoadFailed: {
    key: "agentLoadFailed",
    header: "Unable to load an agent",
    message:
      "Please contact our support team to enable course creation for you.",
  },
  courseCreationUnavailable: {
    key: "courseCreationUnavailable",
    header: "Course creation unavailable",
    message:
      "Please contact our support team to enable course creation for you.",
  },
} as const;

export type CustomErrorKey = keyof typeof customErrorMessages;
