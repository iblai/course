"use client"

import Image from "next/image"

type ShowcaseCard = {
  title: string
  org: string
  meta?: string
  badge?: string
  coverSrc: string
  /** University / org logo (Wikimedia Commons or local /public path). */
  logoSrc: string
  logoAlt: string
}

type ShowcaseCardContent = Omit<ShowcaseCard, "coverSrc">

/** Four distinct course thumbnails — keep paths unique (one per card). */
const SHOWCASE_ROWS: readonly [string, ShowcaseCardContent][] = [
  [
    "/images/course-1.png",
    {
      org: "Massachusetts Institute of Technology",
      title: "Introduction to machine learning and neural networks",
      logoSrc: "https://upload.wikimedia.org/wikipedia/commons/5/5d/MIT_logo_2003-2023.svg",
      logoAlt: "MIT logo",
    },
  ],
  [
    "/images/course-2.png",
    {
      org: "Stanford University",
      title: "Design thinking and human-centered product innovation",
      logoSrc: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_Cardinal_logo.svg",
      logoAlt: "Stanford University logo",
    },
  ],
  [
    "/images/course-3.png",
    {
      org: "University of Oxford",
      title: "Critical reasoning, logic, and structured argumentation",
      logoSrc: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg",
      logoAlt: "University of Oxford logo",
    },
  ],
  [
    "/images/data-driven-decision.png",
    {
      org: "Harvard University",
      title: "Data science fundamentals and statistical inference",
      logoSrc: "/logos/harvard-coat-of-arms.svg",
      logoAlt: "Harvard University coat of arms",
    },
  ],
]

const cards: ShowcaseCard[] = SHOWCASE_ROWS.map(([coverSrc, rest]) => ({ ...rest, coverSrc }))

if (process.env.NODE_ENV === "development") {
  const covers = SHOWCASE_ROWS.map(([src]) => src)
  if (new Set(covers).size !== covers.length) {
    console.error("[BuiltWithWinkSection] Showcase cards must use 4 unique cover images. Got:", covers)
  }
}

export function BuiltWithWinkSection() {
  return (
    <section className="flex justify-center bg-white py-[55px] px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--sidebar-foreground)]">Built with Wink</h2>
        </div>
        <div className="min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.title} className="w-full rounded-2xl bg-[#F8F9FA] border border-gray-200 shadow-sm overflow-hidden">
                <div className="w-full bg-white p-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white">
                    <Image
                      src={c.coverSrc}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      priority={false}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-lg border border-black/10" />
                    <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/15 via-black/0 to-black/0" />
                    {c.badge && (
                      <div className="absolute top-3 right-3 rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-[var(--sidebar-foreground)] backdrop-blur">
                        {c.badge}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
                    >
                      <Image
                        src={c.logoSrc}
                        alt={c.logoAlt}
                        width={28}
                        height={28}
                        className="h-full w-full object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 text-sm text-[var(--muted-foreground)] leading-snug line-clamp-2">{c.org}</div>
                  </div>
                  <div className="mt-2 text-base font-semibold text-[var(--sidebar-foreground)] leading-snug line-clamp-2">{c.title}</div>
                  {typeof c.meta === "string" && c.meta.length > 0 && (
                    <div className="mt-1 text-sm text-[var(--muted-foreground)]">{c.meta}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
