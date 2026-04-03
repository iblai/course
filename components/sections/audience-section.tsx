"use client"

import { useState } from "react"
import { Sparkles, School } from "lucide-react"
import { cn } from "@/lib/utils"

type AudienceTab = "instructors" | "entrepreneurs"

export function AudienceSection() {
  const [tab, setTab] = useState<AudienceTab>("instructors")

  return (
    <section className="flex justify-center bg-white px-4 py-[55px]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="min-w-0 space-y-6 lg:h-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--sidebar-foreground)] leading-tight">
              Tell Wink what you teach
              <br />
              and who you teach it to
            </h2>
            <div className="w-full space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-[#00A3EC]/20 bg-white p-5 sm:p-6 shadow-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#00A3EC]/10 before:via-transparent before:to-[#6988FF]/15">
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A3EC] to-[#6988FF] text-white shadow-md shadow-[#00A3EC]/25"
                    aria-hidden
                  >
                    <Sparkles className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--sidebar-foreground)] leading-snug">
                      AI builds your curriculum
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed">
                      Full course structure, lessons, quizzes, and resources — generated in minutes, not months.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6 transition-colors hover:border-gray-300 hover:bg-[#F7F7F7]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#6988FF] shadow-sm"
                    aria-hidden
                  >
                    <School className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--sidebar-foreground)] leading-snug">
                      Launch your school
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed">
                      Your own branded platform, payment processing, student management — all included.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-gray-200 bg-[#FBFBFB] p-4 sm:p-6 lg:h-full">
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setTab("instructors")}
                className={cn(
                  "flex-1 rounded-xl border px-4 py-3 text-left transition-colors",
                  tab === "instructors"
                    ? "border-[#00A3EC] bg-white shadow-sm"
                    : "border-gray-200 bg-transparent hover:bg-white",
                )}
              >
                <div className="flex items-center gap-2 font-semibold leading-none text-[var(--sidebar-foreground)]">
                  <span className="h-2 w-2 rounded-full bg-[#00A3EC]" aria-hidden="true" />
                  <span className="whitespace-nowrap">For Instructors</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setTab("entrepreneurs")}
                className={cn(
                  "flex-1 rounded-xl border px-4 py-3 text-left transition-colors",
                  tab === "entrepreneurs"
                    ? "border-[#00A3EC] bg-white shadow-sm"
                    : "border-gray-200 bg-transparent hover:bg-white",
                )}
              >
                <div className="flex items-center gap-2 font-semibold leading-none">
                  <span className="h-2 w-2 rounded-full bg-[#6988FF]" aria-hidden="true" />
                  <span className="whitespace-nowrap bg-gradient-to-r from-[#00A3EC] to-[#6988FF] bg-clip-text text-transparent">
                    For Entrepreneurs
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              {tab === "instructors" ? (
                <p className="text-[var(--sidebar-foreground)] text-base leading-relaxed">
                  You&apos;ve spent years mastering your subject. Wink turns that into a professional online school — without hiring a dev team, a designer, or spending months on content. Your expertise + our AI = courses your students will actually complete.
                </p>
              ) : (
                <p className="text-[var(--sidebar-foreground)] text-base leading-relaxed">
                  You don&apos;t need to be a professor. If you have knowledge people will pay for — fitness, business, cooking, coding, leadership — Wink gives you the AI tools and the platform to monetize it. From idea to revenue in a weekend.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

