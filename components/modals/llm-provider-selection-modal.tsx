"use client"

import * as React from "react"
import { ChevronLeft, Loader2, Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useGetLlmsQuery } from "@iblai/iblai-js/data-layer"
import { useUrlContext } from "@/lib/iblai/use-url-context"
import { asset } from "@/lib/iblai/asset-url"
import { getLLMProviderDetails } from "@/lib/iblai/llm-provider-details"

interface Provider {
  id: string
  name: string
  logo: string
}

export interface LLM {
  id: string
  /** Display name (e.g., "GPT-5.1") shown to the user. */
  name: string
  /** Raw model id (e.g., "gpt-5.1") — what `mentor.llm_name` stores. */
  llmName: string
  icon: string
  /** Provider key as returned by the API (e.g., "openai") — what
   *  `mentor.llm_provider` stores. Same as `providerName`. */
  providerId?: string
  providerName?: string
}

/**
 * Raw shape returned by `useGetLlmsQuery` (per `LLMResponse` in
 * `@iblai/iblai-api`). The endpoint returns `Array<LLMResponse>` where each
 * row is a *provider* (OpenAI / Anthropic / etc.) and `chat_models` is the
 * list of model identifiers that provider exposes.
 */
interface LLMProviderRow {
  id: number | string
  name: string
  logo?: string | null
  chat_models?: unknown
}

interface LLMProviderSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (provider: Provider) => void
  onLLMSelect?: (llm: LLM) => void
}

const PLACEHOLDER_LOGO = asset("/llm-logos/openai.svg")

/**
 * `row.name` IS the provider key (e.g., `"openai"`, `"anthropic"`).
 * `mentor_settings.llm_provider` stores this same key, and it's what
 * `getLLMProviderDetails` switches on. Don't slug it.
 */
function rowToProvider(row: LLMProviderRow): Provider {
  const details = getLLMProviderDetails(row.name)
  return {
    id: row.name,
    name: details.name,
    logo: details.logo || row.logo || PLACEHOLDER_LOGO,
  }
}

/**
 * `chat_models` items match `iblai-api`'s `LLM` shape — `llm_name` is the
 * id you save to `mentor_settings.llm_name`, `display_name` is the
 * human-friendly label.
 */
function modelsFromRow(row: LLMProviderRow): LLM[] {
  const providerKey = row.name
  const providerDetails = getLLMProviderDetails(providerKey)
  const providerLogo = providerDetails.logo || row.logo || PLACEHOLDER_LOGO
  const raw = row.chat_models

  if (!Array.isArray(raw)) return []

  return raw
    .map((entry, idx): LLM | null => {
      if (typeof entry === "string") {
        return {
          id: `${providerKey}:${entry}`,
          name: entry,
          llmName: entry,
          icon: providerLogo,
          providerId: providerKey,
          providerName: providerKey,
        }
      }
      if (entry && typeof entry === "object") {
        const obj = entry as {
          id?: string
          llm_name?: string
          name?: string
          display_name?: string
          logo?: string
        }
        const llmName = obj.llm_name ?? obj.name ?? obj.id
        if (!llmName) return null
        return {
          id: `${providerKey}:${llmName ?? idx}`,
          name: obj.display_name ?? llmName,
          llmName,
          icon: obj.logo ?? providerLogo,
          providerId: providerKey,
          providerName: providerKey,
        }
      }
      return null
    })
    .filter((m): m is LLM => m !== null)
}

export function LLMProviderSelectionModal({
  isOpen,
  onClose,
  onSelect = () => {},
  onLLMSelect = () => {},
}: LLMProviderSelectionModalProps) {
  const { tenantKey, username, ready } = useUrlContext()

  const { data, isFetching, isError } = useGetLlmsQuery(
    { org: tenantKey, userId: username ?? "" } as never,
    { skip: !isOpen || !ready || !tenantKey || !username },
  )

  const rows: LLMProviderRow[] = Array.isArray(data) ? (data as LLMProviderRow[]) : []
  const providers: Provider[] = React.useMemo(() => rows.map(rowToProvider), [rows])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentView, setCurrentView] = React.useState<"providers" | "llms">("providers")
  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null)

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentView("providers")
      setSelectedProvider(null)
      setSearchQuery("")
    }
  }, [isOpen])

  const filteredProviders = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return providers
    return providers.filter((p) => p.name.toLowerCase().includes(q))
  }, [providers, searchQuery])

  const filteredLLMs = React.useMemo(() => {
    if (!selectedProvider) return []
    const row = rows.find((r) => r.name === selectedProvider.id)
    if (!row) return []
    const models = modelsFromRow(row)
    const q = searchQuery.trim().toLowerCase()
    if (!q) return models
    return models.filter((m) => m.name.toLowerCase().includes(q))
  }, [rows, selectedProvider, searchQuery])

  const handleClose = () => {
    setCurrentView("providers")
    setSelectedProvider(null)
    setSearchQuery("")
    onClose()
  }

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setSearchQuery("")
    setCurrentView("llms")
  }

  const handleLLMSelect = (llm: LLM) => {
    if (selectedProvider) {
      onSelect(selectedProvider)
      onLLMSelect(llm)
      handleClose()
    }
  }

  const handleBackToProviders = () => {
    setCurrentView("providers")
    setSelectedProvider(null)
    setSearchQuery("")
  }

  if (!isOpen) return null

  const showLoading =
    isFetching && providers.length === 0 && !isError

  return (
    <div className="dialog-modal-safe-padding fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative mx-4 flex h-[min(32rem,85vh)] max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
          {currentView === "llms" && selectedProvider ? (
            <h2 className="flex min-w-0 items-center text-base font-semibold leading-tight text-sidebar-foreground sm:text-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProvider.logo}
                alt={selectedProvider.name}
                className="mr-1.5 h-5 w-5 shrink-0 object-contain sm:mr-2 sm:h-6 sm:w-6"
              />
              <span className="truncate">{selectedProvider.name} Models</span>
            </h2>
          ) : (
            <h2 className="text-base font-semibold leading-tight text-sidebar-foreground sm:text-xl">
              LLM Provider
            </h2>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close LLM picker"
          >
            <X className="size-4 sm:size-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-3">
          <div className="flex min-h-full flex-col gap-4">
            <div className="flex items-center gap-2">
              {currentView === "llms" ? (
                <button
                  type="button"
                  onClick={handleBackToProviders}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                  aria-label="Back to providers"
                >
                  <ChevronLeft className="size-[18px] shrink-0" aria-hidden strokeWidth={2} />
                </button>
              ) : null}
              <p className="min-w-0 flex-1 text-xs leading-snug text-gray-600 sm:text-sm">
                {currentView === "providers"
                  ? "Select an LLM provider to customize your experience."
                  : `Choose your preferred model from ${selectedProvider?.name} to tailor your experience.`}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search"
                className="h-9 min-h-9 pl-12 pr-4 text-sm placeholder:text-muted-foreground sm:h-10 sm:min-h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {!ready || !tenantKey || !username ? (
              <p className="px-1 py-8 text-center text-sm text-gray-500">
                Sign in to load LLM providers.
              </p>
            ) : showLoading ? (
              <div className="flex min-h-[14rem] flex-1 flex-col items-center justify-center py-10">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-500" />
                <p className="text-xs text-gray-600 sm:text-sm">
                  Loading providers...
                </p>
              </div>
            ) : isError ? (
              <p className="px-1 py-8 text-center text-sm text-red-600">
                Could not load LLM providers. Try again.
              </p>
            ) : currentView === "providers" ? (
              filteredProviders.length === 0 ? (
                <p className="px-1 py-8 text-center text-sm text-gray-500">
                  {searchQuery.trim()
                    ? `No providers match "${searchQuery.trim()}".`
                    : "No LLM providers configured for this tenant."}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {filteredProviders.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider)}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={provider.logo}
                          alt={`${provider.name} logo`}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <span className="truncate text-xs font-medium text-[#646464] sm:text-sm">
                        {provider.name}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLLMs.map((llm) => (
                  <button
                    key={llm.id}
                    onClick={() => handleLLMSelect(llm)}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={llm.icon}
                        alt={`${llm.name} icon`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="truncate text-xs font-medium text-[#646464] sm:text-sm">
                      {llm.name}
                    </span>
                  </button>
                ))}
                {filteredLLMs.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    <p className="text-xs sm:text-sm">
                      {searchQuery.trim()
                        ? `No models match "${searchQuery.trim()}".`
                        : `No models exposed by ${selectedProvider?.name}.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
