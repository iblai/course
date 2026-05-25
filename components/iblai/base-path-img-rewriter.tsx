"use client"

import { useEffect } from "react"

import { BASE_PATH } from "@/lib/iblai/asset-url"

/**
 * Client-side safety net that rewrites root-absolute `<img src>` /
 * `<source srcset>` URLs to include `NEXT_PUBLIC_BASE_PATH`.
 *
 * Why this exists: with the app mounted at `/courseai`, plain
 * `<img src="/images/foo.png">` requests `https://host/images/foo.png`
 * (404) instead of `https://host/courseai/images/foo.png`. The
 * `next/image` loader already handles its own prefixing
 * (`lib/iblai/image-loader.js`), and the icon-dir consts at
 * `SIDEBAR_ICONS` / `PROMPT_ICONS` / `iconDir` / `PLACEHOLDER_LOGO`
 * are explicitly wrapped in `asset()` — but inline `<img>` and
 * `<source>` tags spread across ~20 files would each need editing
 * otherwise. This observer rewrites them in one place, including any
 * elements React adds after the initial paint.
 *
 * No-op when `BASE_PATH` is empty (root mount).
 */
export function BasePathImgRewriter() {
  useEffect(() => {
    if (!BASE_PATH) return

    /**
     * `/foo.png` → `/courseai/foo.png`. Skips external URLs (`http://`,
     * `https://`, `data:`, `blob:`), relative paths, and anything
     * already prefixed.
     */
    function rewriteOne(value: string): string | null {
      if (!value) return null
      if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null // external scheme
      if (!value.startsWith("/")) return null // relative
      if (value === BASE_PATH || value.startsWith(`${BASE_PATH}/`)) return null
      return `${BASE_PATH}${value}`
    }

    /**
     * `srcset` is a comma-separated list of `url descriptor` pairs.
     * Rewrite each url independently.
     */
    function rewriteSrcset(srcset: string): string | null {
      const parts = srcset.split(",").map((p) => p.trim()).filter(Boolean)
      let changed = false
      const next = parts.map((part) => {
        const [url, ...descriptor] = part.split(/\s+/)
        const newUrl = rewriteOne(url)
        if (newUrl) {
          changed = true
          return [newUrl, ...descriptor].join(" ")
        }
        return part
      })
      return changed ? next.join(", ") : null
    }

    function fixElement(el: Element) {
      if (el instanceof HTMLImageElement || el.tagName === "SOURCE") {
        const src = el.getAttribute("src")
        if (src) {
          const next = rewriteOne(src)
          if (next) el.setAttribute("src", next)
        }
        const srcset = el.getAttribute("srcset")
        if (srcset) {
          const next = rewriteSrcset(srcset)
          if (next) el.setAttribute("srcset", next)
        }
      }
    }

    // Initial sweep — handles whatever rendered before this effect ran.
    document.querySelectorAll("img, source").forEach(fixElement)

    // Live sweep — catches anything React adds later.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target instanceof Element) {
          fixElement(m.target)
          continue
        }
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue
          fixElement(node)
          node.querySelectorAll?.("img, source").forEach(fixElement)
        }
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset"],
    })

    return () => observer.disconnect()
  }, [])

  return null
}
