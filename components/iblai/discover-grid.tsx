"use client";

import { useRouter } from "next/navigation";
import {
  useDiscover,
  DiscoverContentCard,
} from "@iblai/iblai-js/web-containers";

import config from "@/lib/iblai/config";

interface DiscoverGridProps {
  /**
   * Tenant to scope the catalog query to.
   *  - omit -> current tenant (read from `localStorage.tenant` by the
   *    SDK). Use this for "All Courses (tenant-scoped)".
   *  - `"main"` -> cross-tenant public marketplace. Use this for
   *    "Course Catalog (public, all tenants)".
   */
  tenantOverride?: string;
  /** How many rows per page (SDK default 12). */
  limit?: number;
  /** Copy shown in the empty state. */
  emptyState?: string;
}

/**
 * Catalog grid powered by the SDK `useDiscover` hook. Renders one
 * `DiscoverContentCard` per row.
 *
 * `useDiscover.contents` returns RAW API rows
 * (`{ type, data: { name, course_id, edx_data, ... } }`); cards expect
 * formatted entries with `title`/`url`/`image`. Each row goes through
 * `discover.handleFormatContents` first.
 *
 * Image fallback: SDK builds `${lmsUrl}${edx_data.course_image_asset_path}`.
 * When no asset path, that string is just `lmsUrl` (not an image)
 * which leaves the browser stuck loading. Blank it pre-render so the
 * card uses its own `getRandomCourseImage()` fallback immediately.
 *
 * URL fix: SDK formatter sets `/courses/<course_id>` for courses,
 * but wink mounts the learner viewer at `/course-content/[id]/course`.
 * Rewrite the URL accordingly for `course` type entries before
 * passing to the card.
 */
export function DiscoverGrid({
  tenantOverride,
  limit = 12,
  emptyState = "No courses found.",
}: DiscoverGridProps) {
  const router = useRouter();

  const handleNavigate = (href: string) => router.push(href);

  const discover = useDiscover({
    limit,
    lmsUrl: config.lmsUrl(),
    onNavigate: handleNavigate,
    ...(tenantOverride ? { tenantOverride } : {}),
  }) as any;

  const baseLmsUrl = config.lmsUrl().replace(/\/+$/, "");
  const rawContents: any[] = discover?.contents ?? [];
  const formatContent: (row: any) => any =
    discover?.handleFormatContents ?? ((row: any) => row);
  const contents: any[] = rawContents.map((row) => {
    const formatted = formatContent(row);

    // Strip bogus image so the card uses its built-in fallback.
    const img: string = formatted?.image ?? "";
    const trimmedImg = img.replace(/\/+$/, "");
    const cleanImage =
      !trimmedImg || trimmedImg === baseLmsUrl ? "" : formatted.image;

    // Rewrite course URLs to wink's learner-viewer route.
    let url: string = formatted?.url ?? "";
    if (formatted?.contentType === "course") {
      const courseId = formatted?.course_id ?? formatted?.id;
      if (courseId) {
        url = `/course-content/${encodeURIComponent(courseId)}/course`;
      }
    }

    return { ...formatted, image: cleanImage, url };
  });
  const contentsLoading: boolean = !!discover?.contentsLoading;

  if (contentsLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (contents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-accent/40 p-10 text-center text-sm text-muted-foreground">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {contents.map((c) => (
        <DiscoverContentCard
          key={c.id ?? c.url ?? c.title}
          content={c}
          onSelect={() => {
            if (c?.url) router.push(c.url);
          }}
        />
      ))}
    </div>
  );
}
