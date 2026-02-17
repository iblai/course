"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing-section" className="bg-white flex items-center justify-center py-16 px-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Plan for Hobby */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-auto md:h-[380px]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[var(--sidebar-foreground)] mb-2">Basic Plan for Hobby</h3>
              <div className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-1">Free</div>
              <p className="text-sm text-[var(--muted-foreground)]">No credit card required</p>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00A3EC" }} />
                  <span className="text-sm text-[var(--sidebar-foreground)]">Create your courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00A3EC" }} />
                  <span className="text-sm text-[var(--sidebar-foreground)]">Launch your school</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00A3EC" }} />
                  <span className="text-sm text-[var(--sidebar-foreground)]">Get advice from our agent</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-auto bg-white border border-gray-300 text-[var(--sidebar-foreground)] hover:bg-gray-50">
              Get started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col h-auto md:h-[380px]">
            <div className="absolute -top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] rounded-t-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">PRO</span>
            </div>
            <div
              className="border-2 border-[#00A3EC]/30 rounded-lg p-6 flex flex-col h-full mt-4"
              style={{
                background: "linear-gradient(to bottom, rgba(0,163,236,0.09) 0%, rgba(0,163,236,0.05) 30%, rgba(105,136,255,0.06) 100%)",
              }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--sidebar-foreground)] mb-2">Pro Plan</h3>
                <div className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-1">$9.95 / month</div>
                <p className="text-sm text-[var(--muted-foreground)]">All Basic features, plus:</p>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">$9.95 of included usage credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">Fully branded school</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">Chat / email support</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-auto bg-white border border-gray-300 text-[var(--sidebar-foreground)] hover:bg-gray-50">
                Get started
              </Button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="rounded-lg p-6 flex flex-col min-h-[380px] bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-0.5">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-sm text-white/90">All Pro features, plus:</p>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 text-white" />
                  <span className="text-sm text-white">Critical security, platform SLAs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 text-white" />
                  <span className="text-sm text-white">Custom project</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 text-white" />
                  <span className="text-sm text-white">Code ownership</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-auto bg-white text-[#00A3EC] hover:bg-gray-50">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
