/**
 * basePath-aware asset URL helpers.
 *
 * Next.js's `next/image` loader handles basePath automatically (see
 * `lib/iblai/image-loader.js`). But plain `<img src="/foo.png">`,
 * `background-image: url(/foo.png)`, and any string concatenation off
 * a const like `"/icons/sidebar"` does NOT — Next only prefixes asset
 * paths in HTML it controls (`<Link>`, `<Image>`, generated CSS).
 *
 * Use `asset("/icons/foo.svg")` everywhere you'd otherwise write a
 * root-absolute asset path in component code, so the result matches
 * what the server actually serves at the basePath mount.
 */

export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prepend `NEXT_PUBLIC_BASE_PATH` to a root-absolute asset path.
 * Pass-through for: empty strings, external URLs (`https://…`,
 * `data:…`, `blob:…`), already-prefixed paths, and relative paths.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path; // external / data: / blob:
  if (!path.startsWith("/")) return path; // relative
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
