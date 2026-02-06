"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"

export function FAQSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0) // First question expanded by default

  const faqData = [
    {
      question: "How does courseAI help me create better courses?",
      answer:
        "courseAI uses advanced AI algorithms to analyze your teaching goals, subject matter, student level, and learning objectives to help you create engaging, personalized course content that aligns with your educational vision and student needs.",
    },
    {
      question: "What kind of course content can I create?",
      answer:
        "You can create various types of educational content including interactive lessons, assessments, quizzes, assignments, video scripts, reading materials, and personalized learning paths for different student skill levels.",
    },
    {
      question: "How do I customize my course content?",
      answer:
        "Simply input your course objectives, target audience, and subject matter. courseAI will generate tailored content that you can further customize, edit, and adapt to match your teaching style and student requirements.",
    },
    {
      question: "How do I update my course preferences?",
      answer:
        "You can update your course preferences anytime through your profile settings. The AI will re-analyze your updated information and suggest new content approaches that better match your current teaching goals.",
    },
    {
      question: "How do I track my course development progress?",
      answer:
        "Navigate to your dashboard to view course creation history, track learning objectives, review AI-generated content, and monitor your educational content development journey over time.",
    },
    {
      question: "Can I create multiple courses simultaneously?",
      answer:
        "You can work on multiple course projects simultaneously by creating different course outlines and generating content for various subjects based on your diverse teaching needs and educational goals.",
    },
    {
      question: "Can I use courseAI for free?",
      answer:
        "Yes! We offer a free Basic plan that includes 3 course templates, 4 AI-powered content generations, access to 10 educational resources, and 50 community interactions. Perfect for getting started with course creation.",
    },
    {
      question: "Can I upgrade my account at any time?",
      answer:
        "You can upgrade your plan at any time from your account settings. Changes take effect immediately and you'll have access to additional course templates and premium AI features.",
    },
    {
      question: "Can I cancel courseAI at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period, and you'll retain access to your course creation history.",
    },
  ]

  // Toggle FAQ expansion
  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <section
      id="faq-section"
      className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-16 px-4 mt-0 xl:mt-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-[#3D4F5F] mb-6 lg:text-5xl">Frequently asked questions</h1>
        </div>

        {/* FAQ Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - FAQ Items */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
            {faqData.map((faq, index) => (
              <div key={index}>
                <div
                  className="p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#4A5568] font-medium text-base pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {expandedFAQ === index ? (
                        <Minus className="w-5 h-5 text-[#7C9AB6]" />
                      ) : (
                        <Plus className="w-5 h-5 text-[#7C9AB6]" />
                      )}
                    </div>
                  </div>
                  {expandedFAQ === index && (
                    <div className="mt-4 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
                  )}
                </div>
                {index < faqData.length - 1 && <div className="border-b border-[#E5E7EB]"></div>}
              </div>
            ))}
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-6 bg-white border border-[#E5E7EB] rounded-lg p-6">
            <div>
              <h2 className="text-2xl font-bold text-[#3D4F5F] mb-2">Still have questions?</h2>
              <p className="text-gray-500 text-sm">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3D4F5F] mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full h-10 border border-[#E5E7EB] rounded-md"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#3D4F5F] mb-1">
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Enter your subject"
                  className="w-full h-10 border border-[#E5E7EB] rounded-md"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#3D4F5F] mb-1">
                  Description *
                </label>
                <Textarea
                  id="description"
                  rows={4}
                  className="w-full border border-[#E5E7EB] rounded-md resize-none"
                  placeholder="Please provide all relevant details, include steps to reproduce or screenshots of the issue if important"
                />
              </div>

              <div>
                <label htmlFor="impact" className="block text-sm font-medium text-[#3D4F5F] mb-1">
                  How does this issue limit your use of courseAI?
                </label>
                <Select>
                  <SelectTrigger className="w-full h-10 border border-[#E5E7EB] rounded-md">
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical - Cannot use the platform</SelectItem>
                    <SelectItem value="high">High - Significantly impacts usage</SelectItem>
                    <SelectItem value="medium">Medium - Some impact on usage</SelectItem>
                    <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-[#3D4F5F] mb-1">
                  Upload a Screenshot or File
                </label>
                <div className="flex items-center gap-2">
                  <input type="file" id="file" className="hidden" />
                  <label
                    htmlFor="file"
                    className="px-3 py-2 border border-[#E5E7EB] rounded-md text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500">No file chosen</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button className="bg-[#3B82C4] hover:bg-[#2E6BA8] text-white px-6 py-2 rounded-md">Submit</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 -mx-4">
          <div className="border-t border-gray-200 pt-8 px-4">
            <div className="flex items-center justify-center text-sm text-[#3E6BAD]">
              <span className="flex items-center gap-2">
                Powered by
                <Image
                  src="/images/iblai-logo.png"
                  alt="ibl.ai"
                  width={80}
                  height={22}
                  className="h-5 w-auto mb-0.5 pb-[3.5px]"
                />
                in New York
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
