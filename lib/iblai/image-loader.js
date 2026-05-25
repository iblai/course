// Custom `next/image` loader that prepends `NEXT_PUBLIC_BASE_PATH` to
// absolute paths and otherwise behaves like the unoptimized loader
// (returns the src as-is). Required because Next's auto-prefixing is
// disabled when a custom loader is in play — every `<Image>` would
// 404 under a sub-path mount without this.
//
// External URLs (`https://...`, `data:...`, etc.), already-prefixed
// paths, and relative paths pass through unchanged.

export default function imageLoader({ src }) {
  if (!src) return src
  if (/^[a-z]+:\/\//i.test(src)) return src // external (https://, data:, etc.)
  if (!src.startsWith('/')) return src // relative path

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  if (!basePath) return src
  if (src === basePath || src.startsWith(`${basePath}/`)) return src

  return `${basePath}${src}`
}
