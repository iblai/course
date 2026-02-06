"use client"

import { useState, useEffect } from "react"
import { FileText, ChevronRight, Radio, X } from "lucide-react"

interface Document {
  id: string
  title: string
  description: string
  score: number
  updatedAt: string
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Introduction - Document...",
    description:
      "Introduction to AI Mentor Pro Documentations. Documentation home page search navigation. Welcome to ... What about open Licenses. The project is licensed under MIT License. Do anything u'll like, is built to be easily hosted by anyone, all you need to setup are the data connectors.",
    score: 0.7,
    updatedAt: "Updated 20 days ago",
  },
  {
    id: "2",
    title: "AI Mentor Chat - Document...",
    description:
      "Advanced context retrieval, multiple chunks per search - Maintain user/system/retrieval context during Chat - LLM to decide if it needs to fetch more context at each step - Multi-session support - Chat related metrics",
    score: 0.7,
    updatedAt: "Updated 20 days ago",
  },
  {
    id: "3",
    title: "Guide - Document...",
    description:
      "Allowing users to maintain continuous conversations across different timeframes. By tracking chat-related metrics, it ensures that insights can be drawn from user interactions, improving the overall efficiency and personalization of the responses. This robust framework makes adaptable for various industries where real-time guidance and context-awareness.",
    score: 0.7,
    updatedAt: "Updated 20 days ago",
  },
]

interface DocumentSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isModal?: boolean
}

export function DocumentSidebar({ isOpen = false, onClose, isModal = false }: DocumentSidebarProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])

  useEffect(() => {
    if (!isModal) {
      document.documentElement.style.setProperty("--document-sidebar-open", isOpen ? "1" : "0")
      return () => {
        document.documentElement.style.setProperty("--document-sidebar-open", "0")
      }
    }
  }, [isOpen, isModal])

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  // For modal mode, always render the content
  if (!isModal && !isOpen) return null

  // Modal mode - render content without the fixed positioning wrapper
  if (isModal) {
    return (
      <div className="flex flex-col h-full">
        {/* Documents List */}
        <div className="flex-1">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleDocSelection(doc.id)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <Radio className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{doc.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-gray-500 text-sm">{doc.score}</span>
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedDocs.includes(doc.id) ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {selectedDocs.includes(doc.id) && (
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{doc.updatedAt}</p>
                  <p className="text-sm text-gray-600 line-clamp-4">{doc.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Documents Footer */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-900">Selected Documents ({selectedDocs.length})</span>
          </div>
          {selectedDocs.length > 0 ? (
            <div className="space-y-2">
              {mockDocuments
                .filter((doc) => selectedDocs.includes(doc.id))
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">{doc.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDocSelection(doc.id)
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Select documents from the retrieved document section to chat specifically with them!
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 md:top-[65px] right-0 w-full md:w-[380px] h-full md:h-[calc(100vh-65px)] border-l border-gray-200 bg-[#FAFBFC] z-50 md:z-40 overflow-hidden flex flex-col">
      {/* Retrieved Documents Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-gray-900">Retrieved Documents</span>
        </div>
        <button onClick={onClose} className="hover:bg-gray-100 rounded p-1">
          <X className="h-5 w-5 text-gray-400 md:hidden" />
          <ChevronRight className="h-5 w-5 text-gray-400 hidden md:block" />
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        {mockDocuments.map((doc) => (
          <div
            key={doc.id}
            className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleDocSelection(doc.id)}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <Radio className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{doc.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-500 text-sm">{doc.score}</span>
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDocs.includes(doc.id) ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selectedDocs.includes(doc.id) && (
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2">{doc.updatedAt}</p>
                <p className="text-sm text-gray-600 line-clamp-4">{doc.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Documents Footer */}
      <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-gray-900">Selected Documents ({selectedDocs.length})</span>
        </div>
        {selectedDocs.length > 0 ? (
          <div className="space-y-2">
            {mockDocuments
              .filter((doc) => selectedDocs.includes(doc.id))
              .map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200"
                >
                  <span className="text-sm text-gray-700 truncate flex-1">{doc.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDocSelection(doc.id)
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Select documents from the retrieved document section to chat specifically with them!
          </p>
        )}
      </div>
    </div>
  )
}
