// ibl.ai: Node.js 22+ ships a partial localStorage that some bundlers
// expect at module-init time during SSR. Polyfill the missing methods.
if (
  typeof window === "undefined" &&
  typeof localStorage !== "undefined" &&
  typeof localStorage.getItem !== "function"
) {
  const _s = {}
  globalThis.localStorage = {
    getItem: (k) => (_s[k] ?? null),
    setItem: (k, v) => { _s[k] = String(v) },
    removeItem: (k) => { delete _s[k] },
    clear: () => { for (const k in _s) delete _s[k] },
    get length() { return Object.keys(_s).length },
    key: (i) => Object.keys(_s)[i] ?? null,
  }
}

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

/**
 * Resolve a package to its root directory so webpack never loads
 * duplicate copies (npm/pnpm hoisting with differing peer deps).
 * Without this, @reduxjs/toolkit may be duplicated and SDK components
 * get a different ReactReduxContext — RTK Query hooks then silently
 * return undefined.
 */
function dedup(packageName) {
  try {
    const entry = require.resolve(packageName)
    const marker = `node_modules/${packageName}`
    const idx = entry.lastIndexOf(marker)
    if (idx !== -1) return entry.slice(0, idx + marker.length)
    return undefined
  } catch {
    return undefined
  }
}

const resolveAliases = {}
for (const pkg of [
  '@iblai/data-layer',
  '@iblai/web-utils',
  '@iblai/web-containers',
  '@iblai/iblai-js',
  '@reduxjs/toolkit',
  'react-redux',
  'react',
  'react-dom',
]) {
  const dir = dedup(pkg)
  if (dir) resolveAliases[pkg] = dir
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  // The SDK's `useVoiceChat` has an `isMounted` ref that only ever gets
  // reset to `false` (effect cleanup), never back to `true` on setup.
  // React StrictMode double-invokes effects in dev
  // (mount->cleanup->remount), so the ref stays false and audio-to-text
  // resolves but the `isMounted`-guarded `setProcessing(false)` never
  // runs -> stuck "Processing...". SDK bug; disabling StrictMode is the
  // host workaround per iblai-agent-chat skill known-issues.
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/**',
      },
    ],
  },
  // Keep Turbopack scoped to this app. The previous hardcoded macOS
  // path was outside the project, which made Next reject the derived
  // distDirRoot ("...should not navigate out of the projectPath").
  //
  // Do NOT pass absolute `resolveAlias` paths here -- Turbopack treats
  // absolute paths as relative-to-project and ends up resolving things
  // like `/home/lain/.../node_modules/@iblai/data-layer` into the
  // project root (`Module not found: ./home/lain/...`). Native pnpm
  // resolution gives Turbopack a single copy per package on its own;
  // the webpack alias block below is only used for production builds.
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    Object.assign(config.resolve.alias, resolveAliases)
    return config
  },
}

export default nextConfig
