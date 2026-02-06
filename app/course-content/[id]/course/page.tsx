"use client"

import { Play, ChevronRight, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function CourseTab() {
  const router = useRouter()
  const params = useParams<{ id: string }>()

  return (
    <div className="max-w-4xl mx-auto p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <h1 className="font-bold text-gray-800 mb-4 text-xl">Obtain/Build</h1>
      <p className="text-gray-600 mb-6">
        Part of the 4 Dimensions is the dimension of partners and suppliers. You use the Obtain/Build activity to help
        acquire service components from our suppliers as we discover in this episode.
      </p>

      <div className="bg-black aspect-video rounded-md mb-6 flex items-center justify-center">
        <button className="bg-white bg-opacity-20 rounded-full p-4">
          <Play className="h-8 w-8 text-primary" />
        </button>
      </div>


      <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Video Transcript</h3>
        <p className="text-gray-600 text-sm">Start of transcript. Skip to the end.</p>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">
            &gt;&gt; So what are the key activities of the six key activities of the Service Value Chain where we reach
            outside of our own organization?
          </p>
          <p className="mb-2">Let's talk about it.</p>
          <p className="mb-2">&gt;&gt; You're watching ITProTV.</p>
          <p>
            &gt;&gt; Hello, welcome back to ITIL4 Foundation. So nice to have you join us as always. I'm your host Zach
            Membas and this time...
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="rounded-sm px-4 py-2 border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center">
          <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
          Previous Lesson
        </button>
        <button className="rounded-sm bg-brand-gradient px-4 py-2 text-sm font-medium text-white flex items-center hover:opacity-90">
          Next Lesson
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  )
}
