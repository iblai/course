"use client"

import Image from "next/image"
import { X, Copy, Share2 } from "lucide-react"
import { PlatformFooter } from "@/components/platform/platform-footer"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface CustomCourseModalProps {
  isOpen: boolean
  onClose: () => void
  messages?: Message[]
}

function CustomCourseContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:pr-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full overflow-hidden border-2 border-primary/20 w-8 h-8">
          <img src="/images/mikel-ai.png" alt="Mikel AI" className="w-full h-full object-cover" />
        </div>
        <span className="text-slate-600 font-medium">Mikel AI</span>
      </div>
      <div className="mb-8 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src="/images/course-1.png"
          alt="AI Learning Path Analytics"
          width={800}
          height={256}
          className="w-full h-48 object-contain md:h-96 md:object-cover"
        />
      </div>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600">
          Here's a <strong className="text-slate-700">simple beginner-friendly path to learn AI from scratch:</strong>
        </p>
        <h3 className="flex items-center gap-2 text-slate-700 mt-8 mb-4">
          <span className="text-lg">1️⃣</span>
          <span>Start with AI basics (No coding needed)</span>
        </h3>
        <p className="text-slate-600">
          I've shared <strong>a</strong> Coursera video from <span className="underline">"AI For Everyone"</span> by
          Andrew Ng (DeepLearning.AI) above.
        </p>
        <p className="text-slate-600 mt-4">This course helps you understand:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
          <li>What AI really is (and what it isn't)</li>
          <li>Machine Learning vs Deep Learning</li>
          <li>How AI is used in real life</li>
          <li>AI ethics and future impact</li>
        </ul>
        <p className="text-slate-600 mt-4">
          <span className="mr-1">👉</span> Perfect if you're <span className="underline">new to AI.</span>
        </p>
        <hr className="my-8 border-gray-200" />
        <h3 className="flex items-center gap-2 text-slate-700 mt-8 mb-4">
          <span className="text-lg">2️⃣</span>
          <span>Learn basic programming (Very important)</span>
        </h3>
        <p className="text-slate-600">
          Python is the most popular language for AI and Machine Learning. Start with these fundamentals:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
          <li>Variables and data types</li>
          <li>Control flow (if/else, loops)</li>
          <li>Functions and modules</li>
          <li>Working with data structures</li>
        </ul>
        <hr className="my-8 border-gray-200" />
        <h3 className="flex items-center gap-2 text-slate-700 mt-8 mb-4">
          <span className="text-lg">3️⃣</span>
          <span>Machine Learning Fundamentals</span>
        </h3>
        <p className="text-slate-600">Once you have Python basics, dive into machine learning concepts:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
          <li>Supervised vs Unsupervised Learning</li>
          <li>Common algorithms (Linear Regression, Decision Trees)</li>
          <li>Model training and evaluation</li>
          <li>Feature engineering basics</li>
        </ul>
        <hr className="my-8 border-gray-200" />
        <h3 className="flex items-center gap-2 text-slate-700 mt-8 mb-4">
          <span className="text-lg">4️⃣</span>
          <span>Hands-on Projects</span>
        </h3>
        <p className="text-slate-600">Apply your knowledge with practical projects:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
          <li>Build a simple chatbot</li>
          <li>Create an image classifier</li>
          <li>Develop a recommendation system</li>
          <li>Analyze real-world datasets</li>
        </ul>
      </div>
    </div>
  )
}

export function CustomCourseModal({ isOpen, onClose, messages }: CustomCourseModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Custom AI Learning Course",
          text: "Check out my personalized AI learning path!",
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Bottom sheet - slides up from bottom, fixed to edges */}
      <div className="absolute bottom-0 left-0 right-0 top-12 bg-white rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Drag handle indicator */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Custom Course</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Copy link"
            >
              <Copy className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <CustomCourseContent />
          <PlatformFooter />
        </div>
      </div>
    </div>
  )
}
