'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useLazyGetMentorsQuery,
} from '@iblai/iblai-js/data-layer'

import { useUrlContext } from './use-url-context'
import { agentExists, enableCourseCreationToolIfMissing } from './agent-tools'
import {
  getPlatformDefaultAgentId,
  setPlatformDefaultAgentId,
} from './platform-metadata'
import { customErrorMessages } from '@/lib/error'

interface MentorListItem {
  unique_id?: string | null
  metadata?: { default?: boolean } | null
}

interface UseMentorRedirectOptions {
  /**
   * Optional path suffix appended to `/platform/<tenant>/<mentor>` on
   * redirect. Use for sub-routes like `/customize` so a callsite that
   * resolves a mentor lands directly on the right tab. Must start with
   * `/` (or omit / pass `""`).
   */
  pathSuffix?: string
  /**
   * Optional query string to append (`?foo=bar`). Useful for the
   * "New Chat" pattern (`?new=<ts>`).
   */
  query?: string
}

/**
 * Resolve the user's "current" mentor and redirect there. Mirrors the
 * mentorai flow (`hooks/use-mentor-redirect.ts`):
 *
 *   recently_accessed → featured (default → first) → non-featured → /agents
 *
 * Returns `{ resolving, hasResolved }` so the caller can render a spinner
 * while we figure out where to send the user. After resolution, the page
 * is replaced — the caller component unmounts.
 */
export function useMentorRedirect(options: UseMentorRedirectOptions = {}) {
  const { pathSuffix = '', query = '' } = options
  const router = useRouter()
  const { tenantKey, username, ready } = useUrlContext()
  const [fetchMentors] = useLazyGetMentorsQuery()
  const [resolving, setResolving] = useState(true)
  const [hasResolved, setHasResolved] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (hasResolved) return

    // Without a tenant + username we have no way to fetch — treat as resolved
    // so the caller can fall through to its non-redirect render path.
    if (!tenantKey || !username) {
      setResolving(false)
      setHasResolved(true)
      return
    }

    let cancelled = false

    const pickFirst = (list: MentorListItem[]) =>
      list.find((m) => m?.metadata?.default === true) ?? list[0]

    const go = (uniqueId: string, options: { persist?: boolean } = {}) => {
      if (!uniqueId) return false
      // courseai requirement: every resolved mentor must expose the
      // `course-creation` tool. Fire-and-forget; the helper GETs first
      // and only PUTs when the tool isn't already present.
      void enableCourseCreationToolIfMissing(tenantKey, username, uniqueId)
      // Stash the resolved agent on platform metadata so the next visit
      // skips the recently_accessed → featured → first scan. Only persist
      // for ids we actually resolved from the mentor list — re-PATCHing
      // the already-stored id on every shortcut hit is pointless work.
      if (options.persist) {
        void setPlatformDefaultAgentId(tenantKey, uniqueId)
      }
      router.replace(`/platform/${tenantKey}/${uniqueId}${pathSuffix}${query}`)
      return true
    }

    const callMentors = (extra: Record<string, unknown>) =>
      // SDK arg shape: flat — { org, username, orderBy, limit, ... }.
      fetchMentors({
        org: tenantKey,
        username,
        ...extra,
      } as never)
        .unwrap()
        .catch(() => null)

    ;(async () => {
      try {
        // 0. Sticky default — set on first successful resolution (see
        //    step 1/2 below) and stored on platform metadata. Honoring
        //    it here lets repeat visits skip the mentor-list scan.
        //    Validate first via the settings endpoint: a stale id (agent
        //    deleted) would otherwise strand the user on a dead route,
        //    so a non-200 falls through to fresh resolution which will
        //    overwrite the stored id via `persist: true`.
        const storedDefault = await getPlatformDefaultAgentId(tenantKey)
        if (cancelled) return
        if (storedDefault) {
          const stillExists = await agentExists(tenantKey, username, storedDefault)
          if (cancelled) return
          if (stillExists && go(storedDefault)) {
            // No toast — the resolve happens on every fresh chat
            // landing and the success message was lingering on the
            // chat UI for too long.
            setHasResolved(true)
            return
          }
        }

        // 1. Most recently accessed
        const recent = await callMentors({
          orderBy: 'recently_accessed_at',
          limit: 10,
        })
        if (cancelled) return
        const recentList: MentorListItem[] =
          (recent as { results?: MentorListItem[] } | null)?.results ?? []
        if (
          recentList.length > 0 &&
          go(recentList[0].unique_id ?? '', { persist: true })
        ) {
          setHasResolved(true)
          return
        }

        // 2. Any mentor (defaults to featured/created order)
        const all = await callMentors({ limit: 10 })
        if (cancelled) return
        if (all === null) {
          // The mentor-list fetch itself failed (network / server) — as
          // opposed to succeeding with an empty list. We can't load an
          // agent to host the course-creation tool, so surface the error
          // page rather than stranding the caller on its spinner.
          router.replace(
            `/error/500?errorType=${customErrorMessages.agentLoadFailed.key}`,
          )
          setHasResolved(true)
          return
        }
        const list: MentorListItem[] =
          (all as { results?: MentorListItem[] })?.results ?? []
        if (list.length > 0) {
          const pick = pickFirst(list)
          if (go(pick?.unique_id ?? '', { persist: true })) {
            setHasResolved(true)
            return
          }
        }

        // 3. Fall back to the explore page so the user can pick / create one.
        //    Reached only when the list loaded successfully but is empty —
        //    the user simply has no agents yet, which is not an error.
        router.replace('/agents')
        setHasResolved(true)
      } catch (e) {
        if (cancelled) return
        console.error('[mentor-redirect] failed to resolve mentor', e)
        // Unexpected failure while resolving — show the error page instead
        // of leaving the caller spinning forever.
        router.replace(
          `/error/500?errorType=${customErrorMessages.agentLoadFailed.key}`,
        )
        setHasResolved(true)
      } finally {
        if (!cancelled) setResolving(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ready, tenantKey, username, hasResolved, fetchMentors, router, pathSuffix, query])

  return { resolving, hasResolved }
}
