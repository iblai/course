/**
 * Shared host URLs for `<CourseContentTabPage>` props.
 *
 * Per `/iblai-course-access`: `lmsUrl` + `legacyLmsUrl` + `mfeUrl` are
 * the user-facing hosts the SDK builds learner-iframe URLs against.
 * edX serves `/courses/...` and `/asset-v1:...` only on the direct LMS
 * host (`learn.<domain>`) — the API gateway proxy (`api.<domain>/lms`)
 * does not, and returns 500. So we use `config.lmsBrowserUrl()` even
 * though `config.lmsUrl()` exists for programmatic access.
 */

import config from "@/lib/iblai/config"

export function getIframeProps() {
  const lmsHost = config.lmsBrowserUrl()
  return {
    lmsUrl: lmsHost,
    mfeUrl: config.mfeUrl(),
    legacyLmsUrl: lmsHost,
  }
}
