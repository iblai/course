"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useGetUserProjectDetailsQuery } from "@iblai/iblai-js/data-layer"
import { useCachedSessionId, useUsername } from "@iblai/iblai-js/web-utils"

/**
 * Two SDK-side defects on the ProjectLandingPage's Project Agents grid
 * (web-containers@1.7.5) we patch at the host layer:
 *
 *   1. Click handler is wired through `projectNavigation.navigateToProject`,
 *      a prop the public `Chat` Props type never accepts. With nothing
 *      threaded in, `WelcomeChatNew` falls back to `() => {}` and the
 *      cards are dead. We catch the click in the capture phase, match
 *      the agent name from `aria-label="Select agent <name>"`, and route
 *      to `/platform/<tenant>/<unique_id>/projects/<projectId>`.
 *   2. Avatars fall back to `/placeholder.svg` when the backend omits
 *      `profile_image` -- visually empty. We patch each
 *      `[aria-label^="Select agent "] img[src*="placeholder.svg"]` to a
 *      gradient-initials data URL so the cards aren't blank.
 *
 * Mount once on the project route. Renders nothing.
 */
interface Props {
  tenantKey: string
  projectId: string
}

type ProjectMentor = {
  unique_id?: string | null
  name?: string | null
  profile_image?: string | null
}

const SELECT_AGENT_SELECTOR = '[role="button"][aria-label^="Select agent "]'

function initialsDataUrl(name: string): string {
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?"
  // 96px gradient avatar matching the page's blue palette.
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="48" fill="url(#g)"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
        fill="white" font-family="system-ui, -apple-system, sans-serif"
        font-weight="600" font-size="40">${initials}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function ProjectGridInterceptor({ tenantKey, projectId }: Props) {
  const router = useRouter()
  const username = useUsername()
  const [cachedSessionId, saveCachedSessionId] = useCachedSessionId()

  const { data: projectData } = useGetUserProjectDetailsQuery(
    {
      tenantKey,
      username: username ?? "",
      id: parseInt(projectId, 10),
    } as never,
    { skip: !tenantKey || !username || !projectId },
  )

  const mentors: ProjectMentor[] =
    (projectData as { mentors?: ProjectMentor[] } | undefined)?.mentors ?? []

  useEffect(() => {
    if (mentors.length === 0) return
    const nameToUniqueId = new Map<string, string>()
    for (const m of mentors) {
      if (m.name && m.unique_id) nameToUniqueId.set(m.name, m.unique_id)
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const card = target?.closest<HTMLElement>(SELECT_AGENT_SELECTOR)
      if (!card) return
      const label = card.getAttribute("aria-label") ?? ""
      const name = label.replace(/^Select agent\s+/, "")
      const uniqueId = nameToUniqueId.get(name)
      if (!uniqueId) return
      event.preventDefault()
      event.stopPropagation()
      // Mentorai pattern: clear the target mentor's cached session id
      // before navigating so the SDK starts a fresh conversation (and
      // the ProjectLandingPage stays mounted instead of jumping to a
      // restored chat).
      const next = { ...((cachedSessionId ?? {}) as Record<string, string>) }
      if (next[uniqueId]) {
        delete next[uniqueId]
        saveCachedSessionId(next)
      }
      router.push(`/platform/${tenantKey}/${uniqueId}/projects/${projectId}`)
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [mentors, router, tenantKey, projectId, cachedSessionId, saveCachedSessionId])

  useEffect(() => {
    if (mentors.length === 0) return
    const nameToProfile = new Map<string, string | null | undefined>()
    for (const m of mentors) {
      if (m.name) nameToProfile.set(m.name, m.profile_image)
    }

    const fix = () => {
      const cards = document.querySelectorAll<HTMLElement>(SELECT_AGENT_SELECTOR)
      cards.forEach((card) => {
        const label = card.getAttribute("aria-label") ?? ""
        const name = label.replace(/^Select agent\s+/, "")
        const img = card.querySelector<HTMLImageElement>("img")
        if (!img) return
        const realSrc = nameToProfile.get(name)
        const isPlaceholder =
          !img.src || img.src.endsWith("/placeholder.svg") || img.src === "placeholder.svg"
        if (isPlaceholder) {
          // Prefer the actual profile image when the backend has one;
          // otherwise drop in the initials avatar so the card isn't blank.
          img.src = realSrc && realSrc.length > 0 ? realSrc : initialsDataUrl(name)
        }
      })
    }

    fix()
    const observer = new MutationObserver(() => fix())
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [mentors])

  return null
}
