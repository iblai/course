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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">Free</div>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>
            <Button className="w-full mb-6 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50">
              Get started
            </Button>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-3">BASIC PLAN INCLUDES</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">3 Mentor Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">4 AI Career Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">10 Mentorship Resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">50 Community Interactions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Starter Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-auto md:h-[850px]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">$18/mo</div>
              <p className="text-sm text-gray-500">Billed yearly. Pay monthly</p>
            </div>
            <Button className="w-full mb-6 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50">
              Get started
            </Button>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-3">KEY FEATURES</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">Mentor Discovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">AI Matching Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">Global mentor network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">Remove mentorAI branding</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-3 mt-6">INCLUDES</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">50 Mentor Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">120 AI Career Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">60 Mentorship Sessions & 10 Group Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                    <span className="text-sm text-gray-700">Chat/email support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Plan - Most Popular */}
          <div className="relative flex flex-col h-auto md:h-[850px]">
            <div className="absolute -top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#BACEFF] to-[#0078FF] rounded-t-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">MOST POPULAR</span>
            </div>
            <div className="bg-gradient-to-b from-blue-50 from-30% to-white border-2 border-blue-200 rounded-lg p-6 flex flex-col h-full mt-4">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Creator</h3>
                <div className="text-2xl font-bold text-gray-900 mb-1">$64/mo</div>
                <p className="text-sm text-gray-500">Billed yearly. Pay monthly</p>
              </div>
              <Button className="w-full mb-6 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50">
                Get started
              </Button>
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-3">WHAT YOU GET IN STARTER +</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">5 Premium Mentor Profiles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">Advanced Career Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">Personalized mentorship dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">API access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">Multiple mentorship tracks</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-3 mt-6">INCLUDES</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">100 mentor connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">360 AI Career Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">200 Mentorship Sessions & 50 Group Sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#254dee" }} />
                      <span className="text-sm text-gray-700">Priority chat/email support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="relative flex flex-col h-auto md:h-[850px]">
            <div className="absolute -top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#BACEFF] to-[#0078FF] rounded-t-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">FOR TEAMS</span>
            </div>
            <div
              className="bg-gradient-to-r from-[#3E6BAD] via-[#3E6BAD] to-[#258ACB] rounded-lg p-6 text-white flex flex-col h-full mt-4"
              style={{
                background: "linear-gradient(to right, #3E6BAD 69%, #258ACB 100%)",
              }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-lg font-medium mb-1">Let's talk.</div>
                <p className="text-sm text-blue-100">Custom pricing</p>
              </div>
              <Button className="w-full mb-6 bg-white text-blue-600 hover:bg-gray-50">Book demo</Button>
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
