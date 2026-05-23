/**
 * Thin wrapper around the SDK's `getLLMProviderDetails` (added in
 * `@iblai/web-containers@1.6.x`). The SDK's mapping returns logo paths
 * like `/llm-openai-provider.jpg` that match the asset filenames it
 * ships under `node_modules/@iblai/web-containers/public/` — we copied
 * those into hq's `/public/` so the paths resolve.
 *
 * One adjustment: hq mounts under `NEXT_PUBLIC_BASE_PATH` (e.g., `/hq`),
 * so plain `<img>` tags need the basePath prefix. `<Image>` from
 * `next/image` would handle this via our custom loader, but the LLM
 * picker uses bare `<img>` for simplicity.
 */

import { getLLMProviderDetails as sdkGetLLMProviderDetails } from '@iblai/iblai-js/web-containers/next'

export type { LLMProviderDetails } from '@iblai/iblai-js/web-containers/next'

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '')

function withBasePath(path: string): string {
  if (!BASE_PATH) return path
  if (!path.startsWith('/')) return path
  if (path.startsWith(`${BASE_PATH}/`) || path === BASE_PATH) return path
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_PATH}${path}`
}

export function getLLMProviderDetails(llmProvider: string, llmName?: string) {
  const details = sdkGetLLMProviderDetails(llmProvider, llmName)
  return {
    ...details,
    logo: withBasePath(details.logo),
  }
}
