'use client'

import * as React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import {
  useEditMentorMutation,
  useGetMentorSettingsQuery,
} from '@iblai/iblai-js/data-layer'
import { toast } from 'sonner'

import { getLLMProviderDetails } from '@/lib/iblai/llm-provider-details'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { useUrlContext } from '@/lib/iblai/use-url-context'

import { HeaderAccountMenu } from '@/components/header-account-menu'
import { HeaderCreditBalance } from '@/components/header-credit-balance'
import { HeaderNotifications } from '@/components/header-notifications'
import { LLMProviderSelectionModal } from '@/components/modals/llm-provider-selection-modal'
import { Button } from '@/components/ui/button'
import { AdminWorkspacePanelsProvider } from '@/contexts/admin-workspace-panels-context'
import { VoiceSidebarProvider } from '@/contexts/voice-sidebar-context'
import { cn } from '@/lib/utils'

/**
 * Ported from `hq/components/agent-app-shell.tsx`'s `<header>` block.
 * Renders:
 *   - mobile sidebar trigger on the left (callback-driven; supply
 *     `onMobileMenuOpen` to wire your existing drawer)
 *   - mentor-scoped LLM picker (admin-only), visible only on
 *     `/platform/[tenantId]/[mentorId]` routes
 *   - HeaderCreditBalance + HeaderNotifications + HeaderAccountMenu on
 *     the right
 *
 * The hq agent dropdown (agent name + edit-mentor tabs) was removed
 * for courseai — settings live in the sidebar's admin footer instead.
 *
 * Wrap pages that mount this header in `<HqHeaderProviders>` so the
 * LLM picker can resolve the active sidebar/voice context.
 */
export const HEADER_CONTROL =
  'inline-flex shrink-0 items-center gap-1 rounded-lg border-0 bg-transparent px-1 py-1 text-xs font-medium text-[#5f5f61] transition-colors hover:bg-[#f0f0f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4c4c8] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:gap-2 sm:px-1.5 sm:py-1.5 sm:text-sm'

const DEFAULT_LLM_ICON = '/llm-logos/openai.svg'

/** Same glyph hq uses for the desktop sidebar rail toggle. */
export function SidebarRailIcon({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path d="M16.5 4A1.5 1.5 0 0 1 18 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5v-9A1.5 1.5 0 0 1 3.5 4zM7 15h9.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7zM3.5 5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H6V5z" />
    </svg>
  )
}

export interface HqHeaderProps {
  /**
   * Fires when the user taps the mobile menu icon on the left. Wire to
   * your existing sidebar / drawer. Hidden at `md` and up.
   */
  onMobileMenuOpen?: () => void
}

function HqHeaderInner({ onMobileMenuOpen }: HqHeaderProps) {
  const pathname = usePathname()
  // LLM picker is mentor-scoped — visible on `/platform/<tenant>/<mentor>`
  // and sub-routes (`/customize`, `/projects/<projectId>`). `usePathname()`
  // strips Next's `basePath`.
  const isMentorHomeRoute =
    !!pathname && /^\/platform\/[^/]+\/[^/]+(?:\/.*)?$/.test(pathname)
  const { tenantKey, mentorId, username, ready } = useUrlContext()
  const isAdmin = useIsAdmin()

  const { data: mentorSettings } = useGetMentorSettingsQuery(
    {
      mentor: mentorId,
      org: tenantKey,
      userId: username ?? '',
    } as never,
    { skip: !ready || !mentorId || !tenantKey || !username },
  )

  const [llmSelectionModalOpen, setLlmSelectionModalOpen] = React.useState(false)

  const llmProviderFromSettings =
    (mentorSettings as { llm_provider?: string } | undefined)?.llm_provider ?? ''
  const llmNameFromSettings =
    (mentorSettings as { llm_name?: string } | undefined)?.llm_name ?? ''

  const [overrideLlm, setOverrideLlm] = React.useState<{
    name: string
    icon: string
  } | null>(null)

  const selectedLlmDisplayName =
    overrideLlm?.name || llmNameFromSettings || 'Select LLM'
  const selectedLlmIcon =
    overrideLlm?.icon ||
    (llmProviderFromSettings
      ? getLLMProviderDetails(llmProviderFromSettings, llmNameFromSettings).logo
      : DEFAULT_LLM_ICON)

  const [editMentor] = useEditMentorMutation()

  return (
    <>
      <header className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 border-b border-[#cfe8fa] bg-[#fafafa] px-2.5 py-2 sm:gap-2 sm:px-3 sm:py-2.5 sm:flex-nowrap md:gap-4 md:px-6 md:py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden -ml-0.5 shrink-0 text-[#5f5f61]"
          onClick={() => onMobileMenuOpen?.()}
          aria-label="Open navigation menu"
        >
          <SidebarRailIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </Button>
        <div
          className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-2.5 md:gap-3"
          hidden={!isMentorHomeRoute}
        >
          {isAdmin ? (
            <button
              type="button"
              className={HEADER_CONTROL}
              onClick={() => setLlmSelectionModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={llmSelectionModalOpen}
            >
              <Image
                src={selectedLlmIcon}
                alt=""
                width={20}
                height={20}
                className="size-4 shrink-0 object-contain sm:size-5"
              />
              <span className="hidden whitespace-nowrap sm:inline">
                {selectedLlmDisplayName}
              </span>
              <ChevronDown
                className="size-3.5 shrink-0 text-[#8b8b92] sm:size-4"
                strokeWidth={2}
                aria-hidden
              />
            </button>
          ) : null}

        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-2.5 md:gap-3">
          <HeaderCreditBalance />
          <HeaderNotifications />
          <HeaderAccountMenu />
        </div>
      </header>

      <LLMProviderSelectionModal
        isOpen={llmSelectionModalOpen}
        onClose={() => setLlmSelectionModalOpen(false)}
        onLLMSelect={async (llm) => {
          setOverrideLlm({ name: llm.name, icon: llm.icon || DEFAULT_LLM_ICON })
          setLlmSelectionModalOpen(false)

          if (!mentorId || !tenantKey || !username) return
          if (!llm.providerName || !llm.llmName) {
            toast.error('Could not resolve LLM provider for this model.')
            return
          }
          try {
            await editMentor({
              mentor: mentorId,
              org: tenantKey,
              // @ts-expect-error - userId is passed but not in generated API types
              userId: username,
              formData: {
                llm_provider: llm.providerName,
                llm_name: llm.llmName,
              },
            }).unwrap()
            toast.success('LLM updated')
            setOverrideLlm(null)
          } catch (err) {
            console.error('[HqHeader] failed to update LLM:', err)
            toast.error('Failed to update LLM')
            setOverrideLlm(null)
          }
        }}
      />
    </>
  )
}

/**
 * Wraps `HqHeader` (and any other consumers) in the contexts the agent
 * dropdown + LLM picker rely on. Mount at or above any subtree that
 * renders the header. If your app already wraps a higher level in
 * either provider, you can swap this for `<HqHeader>` alone.
 */
export function HqHeaderProviders({ children }: { children: React.ReactNode }) {
  return (
    <VoiceSidebarProvider>
      <AdminWorkspacePanelsProvider>{children}</AdminWorkspacePanelsProvider>
    </VoiceSidebarProvider>
  )
}

export function HqHeader(props: HqHeaderProps) {
  return <HqHeaderInner {...props} />
}
