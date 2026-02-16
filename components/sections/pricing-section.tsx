"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing-section" className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-auto md:h-[850px]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[var(--sidebar-foreground)] mb-2">Basic</h3>
              <div className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-1">Free</div>
              <p className="text-sm text-[var(--muted-foreground)]">No credit card required</p>
            </div>
            <Button className="w-full mb-6 bg-white border border-gray-300 text-[var(--sidebar-foreground)] hover:bg-gray-50">
              Get started
            </Button>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--sidebar-foreground)] mb-3">BASIC PLAN INCLUDES</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">3 Mentor Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">4 AI Career Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">10 Mentorship Resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">50 Community Interactions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Starter Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-auto md:h-[850px]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[var(--sidebar-foreground)] mb-2">Starter</h3>
              <div className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-1">$18/mo</div>
              <p className="text-sm text-[var(--muted-foreground)]">Billed yearly. Pay monthly</p>
            </div>
            <Button className="w-full mb-6 bg-white border border-gray-300 text-[var(--sidebar-foreground)] hover:bg-gray-50">
              Get started
            </Button>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--sidebar-foreground)] mb-3">KEY FEATURES</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">Mentor Discovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">AI Matching Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">Global mentor network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">Remove mentorAI branding</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-[var(--sidebar-foreground)] mb-3 mt-6">INCLUDES</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">50 Mentor Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">120 AI Career Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">60 Mentorship Sessions & 10 Group Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                    <span className="text-sm text-[var(--sidebar-foreground)]">Chat/email support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Plan - Most Popular */}
          <div className="relative flex flex-col h-auto md:h-[850px]">
            <div className="absolute -top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] rounded-t-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">MOST POPULAR</span>
            </div>
            <div
              className="border-2 border-[#00A3EC]/30 rounded-lg p-6 flex flex-col h-full mt-4"
              style={{
                background: "linear-gradient(to bottom, rgba(0,163,236,0.09) 0%, rgba(0,163,236,0.05) 30%, rgba(105,136,255,0.06) 100%)",
              }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--sidebar-foreground)] mb-2">Creator</h3>
                <div className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-1">$64/mo</div>
                <p className="text-sm text-[var(--muted-foreground)]">Billed yearly. Pay monthly</p>
              </div>
              <Button className="w-full mb-6 bg-white border border-gray-300 text-[var(--sidebar-foreground)] hover:bg-gray-50">
                Get started
              </Button>
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--sidebar-foreground)] mb-3">WHAT YOU GET IN STARTER +</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">5 Premium Mentor Profiles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">Advanced Career Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">Personalized mentorship dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">API access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">Multiple mentorship tracks</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[var(--sidebar-foreground)] mb-3 mt-6">INCLUDES</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">100 mentor connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">360 AI Career Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">200 Mentorship Sessions & 50 Group Sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#00A3EC" }} />
                      <span className="text-sm text-[var(--sidebar-foreground)]">Priority chat/email support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="relative flex flex-col h-auto md:h-[850px]">
            <div className="absolute -top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] rounded-t-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">FOR TEAMS</span>
            </div>
            <div
              className="rounded-lg p-6 text-white flex flex-col h-full mt-4 bg-gradient-to-r from-[#00A3EC] to-[#6988FF]"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-lg font-medium mb-1">Let's talk.</div>
                <p className="text-sm text-white/80">Custom pricing</p>
              </div>
              <Button className="w-full mb-6 bg-white text-[#00A3EC] hover:bg-gray-50">Book demo</Button>
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-3">WHAT YOU GET IN CREATOR +</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Unlimited Mentor Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Global mentor network in 80+ industries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">230+ mentorship programs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Unlimited Mentorship Sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">SAML/SSO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Team mentorship collaboration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Custom Branding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Career path export</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">AI Career Coaching (paid add-on)</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-3 mt-6">★ ENTERPRISE SUCCESS SUITE</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Tailored onboarding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Implementation services</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Dedicated CSM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Enterprise community</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Access to live events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm">Academy & certifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
