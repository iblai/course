"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type PricingCardProps = {
  title: string
  /** Shown below the title in large type (e.g. “Free”, “$9.95/mo”). */
  priceLine?: string
  /** Optional intro line above the feature list. */
  subtitle?: string
  features: string[]
  button: ReactNode
  highlighted?: boolean
}

function PricingCard({ title, priceLine, subtitle, features, button, highlighted }: PricingCardProps) {
  return (
    <div className="flex h-auto flex-col md:h-[380px]">
      <div
        className={cn(
          "flex flex-1 flex-col rounded-lg border-2 p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl",
          highlighted ? "border-[#00A3EC]/30" : "border-gray-200 bg-white",
        )}
        style={
          highlighted
            ? {
                background:
                  "linear-gradient(to bottom, rgba(0,163,236,0.09) 0%, rgba(0,163,236,0.05) 30%, rgba(105,136,255,0.06) 100%)",
              }
            : undefined
        }
      >
        <div className="mb-6">
          {priceLine ? (
            <div className="mb-2 flex w-full flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-xl font-semibold text-[var(--sidebar-foreground)]">{title}</h3>
              <span className="shrink-0 text-xl font-bold text-[var(--sidebar-foreground)]">{priceLine}</span>
            </div>
          ) : (
            <h3 className="mb-2 text-xl font-semibold text-[var(--sidebar-foreground)]">{title}</h3>
          )}
          {subtitle ? (
            <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="space-y-3">
            {features.map((text) => (
              <div key={text} className="flex items-center gap-2 pb-5">
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#00A3EC" }} aria-hidden />
                <span className="text-sm text-[var(--sidebar-foreground)]">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto">{button}</div>
      </div>
    </div>
  )
}

export function PricingSection() {
  return (
    <section id="pricing-section" className="flex items-center justify-center bg-[#F8F9FA] px-4 py-[55px]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--sidebar-foreground)] sm:text-3xl">Pricing</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PricingCard
            title="Free"
            features={["Build your first course.", "Launch your school", "See what's possible", "No credit card"]}
            button={
              <Button className="w-full border border-gray-300 bg-white text-[var(--sidebar-foreground)] hover:bg-gray-50">
                Start free
              </Button>
            }
          />

          <PricingCard
            title="Pro"
            priceLine="$9.95/mo"
            features={[
              "Unlimited AI course generation.",
              "Your own brand.",
              "Chat & email support.",
              "Everything you need to run a real business.",
            ]}
            highlighted
            button={
              <Button className="w-full border border-gray-300 bg-white text-[var(--sidebar-foreground)] hover:bg-gray-50">
                Get started
              </Button>
            }
          />

          {/* Enterprise — full gradient card (original layout) */}
          <div className="flex h-auto min-h-[380px] flex-col rounded-lg bg-gradient-to-r from-[#00A3EC] to-[#6988FF] p-6 text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl md:h-[380px]">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Enterprise</h3>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 pb-5">
                  <Check className="h-4 w-4 flex-shrink-0 text-white" aria-hidden />
                  <span className="text-sm text-white">For organizations.</span>
                </div>
                <div className="flex items-center gap-2 pb-5">
                  <Check className="h-4 w-4 flex-shrink-0 text-white" aria-hidden />
                  <span className="text-sm text-white">Custom security</span>
                </div>
                <div className="flex items-center gap-2 pb-5">
                  <Check className="h-4 w-4 flex-shrink-0 text-white" aria-hidden />
                  <span className="text-sm text-white">SLAs</span>
                </div>
                <div className="flex items-center gap-2 pb-5">
                  <Check className="h-4 w-4 flex-shrink-0 text-white" aria-hidden />
                  <span className="text-sm text-white">API access + dedicated support</span>
                </div>
              </div>
            </div>
            <Button className="mt-auto w-full bg-white text-[#00A3EC] hover:bg-gray-50">Contact us</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
