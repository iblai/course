"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Loader2, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Provider {
  id: string
  name: string
  logo: string
}

const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: "/logos/openai.svg",
  },
  {
    id: "gemini",
    name: "Google",
    logo: "/logos/google.webp",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "/logos/claude.png",
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    logo: "/logos/nvidia.svg",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    logo: "/logos/deepseek.png",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "/logos/meta.png",
  },
  {
    id: "xai",
    name: "xAI",
    logo: "/logos/grok.png",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    logo: "/logos/perplexity.png",
  },
]

interface LLM {
  id: string
  name: string
  icon: string
  providerId?: string
}

const allLLMs: LLM[] = [
  // OpenAI models
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5.1",
    name: "GPT-5.1",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 mini",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5-nano",
    name: "GPT-5 nano",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5.1-codex",
    name: "GPT-5.1 Codex",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5.1-codex-max",
    name: "GPT-5.1-Codex-Max",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5-codex",
    name: "GPT-5-Codex",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5.2-pro",
    name: "GPT-5.2 pro",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-5-pro",
    name: "GPT-5 pro",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "o4-mini",
    name: "o4-mini",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 mini",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 nano",
    icon: "/logos/openai.svg",
    providerId: "openai",
  },

  // Google Gemini models
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    icon: "/logos/google.webp",
    providerId: "gemini",
  },
  {
    id: "gemini-2-ultra",
    name: "Gemini 2 Ultra",
    icon: "/logos/google.webp",
    providerId: "gemini",
  },

  // Anthropic models
  {
    id: "claude-opus-4.5",
    name: "Claude Opus 4.5",
    icon: "/logos/claude.png",
    providerId: "anthropic",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    icon: "/logos/claude.png",
    providerId: "anthropic",
  },
  {
    id: "claude-haiku-3.5",
    name: "Claude Haiku 3.5",
    icon: "/logos/claude.png",
    providerId: "anthropic",
  },

  // NVIDIA models
  {
    id: "nemotron-70b",
    name: "Nemotron-70B",
    icon: "/logos/nvidia.svg",
    providerId: "nvidia",
  },
  {
    id: "nemotron-340b",
    name: "Nemotron-340B",
    icon: "/logos/nvidia.svg",
    providerId: "nvidia",
  },

  // DeepSeek models
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    icon: "/logos/deepseek.png",
    providerId: "deepseek",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek-V3",
    icon: "/logos/deepseek.png",
    providerId: "deepseek",
  },

  // Meta models
  {
    id: "llama-4",
    name: "Llama 4",
    icon: "/logos/meta.png",
    providerId: "meta",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    icon: "/logos/meta.png",
    providerId: "meta",
  },

  // xAI models
  {
    id: "grok-4.1",
    name: "Grok 4.1",
    icon: "/logos/grok.png",
    providerId: "xai",
  },
  {
    id: "grok-3",
    name: "Grok 3",
    icon: "/logos/grok.png",
    providerId: "xai",
  },
]

interface LLMProviderSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (provider: Provider) => void
  onLLMSelect?: (llm: LLM) => void
}

export function LLMProviderSelectionModal({
  isOpen,
  onClose,
  onSelect = () => {},
  onLLMSelect = () => {},
}: LLMProviderSelectionModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentView, setCurrentView] = React.useState<"providers" | "llms">("providers")
  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  React.useEffect(() => {
    if (!isOpen) {
      setCurrentView("providers")
      setSelectedProvider(null)
      setSearchQuery("")
      setIsLoading(false)
    }
  }, [isOpen])

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredLLMs = React.useMemo(() => {
    if (!selectedProvider) return []
    return allLLMs
      .filter((llm) => llm.providerId === selectedProvider.id)
      .filter((llm) => llm.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [selectedProvider, searchQuery])

  const handleClose = () => {
    if (!isLoading) {
      setCurrentView("providers")
      setSelectedProvider(null)
      setSearchQuery("")
      onClose()
    }
  }

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setSearchQuery("")
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setCurrentView("llms")
    }, 800)
  }

  const handleLLMSelect = (llm: LLM) => {
    if (selectedProvider) {
      if (typeof onSelect === "function") {
        onSelect(selectedProvider)
      }
      if (typeof onLLMSelect === "function") {
        onLLMSelect(llm)
      }
      handleClose()
    }
  }

  const handleBackToProviders = () => {
    setCurrentView("providers")
    setSelectedProvider(null)
    setSearchQuery("")
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] flex flex-col z-[100] border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          {currentView === "llms" && selectedProvider ? (
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <img
                src={selectedProvider.logo || "/placeholder.svg"}
                alt={selectedProvider.name}
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2 object-contain"
              />
              {selectedProvider.name} Models
            </h2>
          ) : (
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">LLM Provider</h2>
          )}
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm text-gray-600">
              {currentView === "providers"
                ? "Select an LLM provider to customize your experience."
                : `Choose your preferred model from ${selectedProvider?.name} to tailor your experience.`}
            </p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-9 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-xs sm:text-sm text-gray-600">Loading {selectedProvider?.name} models...</p>
              </div>
            ) : currentView === "providers" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider)}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center flex-shrink-0">
                      <img
                        src={provider.logo || "/placeholder.svg"}
                        alt={`${provider.name} logo`}
                        className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-[#646464] truncate">{provider.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredLLMs.map((llm) => (
                  <button
                    key={llm.id}
                    onClick={() => handleLLMSelect(llm)}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={llm.icon || "/placeholder.svg"}
                        alt={`${llm.name} icon`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-[#646464] truncate">{llm.name}</span>
                  </button>
                ))}
                {filteredLLMs.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    <p className="text-sm">No models found for your search.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
