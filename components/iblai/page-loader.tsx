import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The shared spinner glyph — one source of truth for the loading look
 * across the app. Use this directly for inline / content-area loaders
 * (a grid that's fetching, a dialog body that's hydrating); use
 * `PageLoader` below for full-viewport route loading. Replaces the
 * assorted `Loading…` text + ad-hoc border-spinners that used to stand
 * in for a loading state.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-5 animate-spin text-[#5f5f61]", className)}
      aria-hidden
    />
  );
}

/**
 * Full-viewport loading spinner — the single source of truth for the
 * "page is hydrating / redirecting" state.
 *
 * This exact markup was previously copy-pasted across the root (`/`),
 * `/home`, `/customize`, the per-agent chat page, and the project page.
 * Centralizing it keeps the glyph, size, and colour identical everywhere
 * a route is waiting to resolve.
 *
 * `className` is merged last (via `cn` / tailwind-merge) so a caller can
 * override the background without forking the markup — the redirect
 * landing routes (`/`, `/home`) use `bg-[#fafafa]`, while the in-app
 * surfaces keep the default `bg-white`.
 */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-dvh w-full items-center justify-center bg-white",
        className,
      )}
    >
      <Spinner />
    </div>
  );
}
