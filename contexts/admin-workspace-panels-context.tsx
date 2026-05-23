"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useVoiceSidebar } from "@/contexts/voice-sidebar-context"
import { CreateMentorDialog } from "@/components/modals/create-mentor-dialog"
import { LLMProviderSelectionModal } from "@/components/modals/llm-provider-selection-modal"
import { MyMentorDialog } from "@/components/my-agents-dialog"

export type AdminWorkspacePanelsContextValue = {
  isDocumentSidebarOpen: boolean
  isAgentSidebarOpen: boolean
  isVoiceSidebarOpen: boolean
  rightPanelOpen: boolean
  handleDocumentSidebarToggle: () => void
  handleAgentSidebarToggle: () => void
  handleVoiceSidebarToggle: () => void
  setDocumentSidebarOpen: (open: boolean) => void
  setAgentSidebarOpen: (open: boolean) => void
  openCreateAgentDialog: () => void
  openMyAgentsDialog: () => void
  openLlmProviderModal: () => void
}

const AdminWorkspacePanelsContext = createContext<AdminWorkspacePanelsContextValue | null>(null)

export function AdminWorkspacePanelsProvider({ children }: { children: ReactNode }) {
  const [isDocumentSidebarOpen, setIsDocumentSidebarOpen] = useState(false)
  const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false)
  const { isOpen: isVoiceSidebarOpen, setOpen: setVoiceSidebarOpen } = useVoiceSidebar()
  const [createMentorOpen, setCreateMentorOpen] = useState(false)
  const [myAgentsOpen, setMyAgentsOpen] = useState(false)
  const [headerLlmModalOpen, setHeaderLlmModalOpen] = useState(false)

  const openCreateAgentDialog = useCallback(() => {
    setCreateMentorOpen(true)
  }, [])

  const openMyAgentsDialog = useCallback(() => {
    setMyAgentsOpen(true)
  }, [])

  const handleDocumentSidebarToggle = useCallback(() => {
    setIsDocumentSidebarOpen((wasOpen) => {
      const willOpen = !wasOpen
      if (willOpen) {
        setIsAgentSidebarOpen(false)
        setVoiceSidebarOpen(false)
      }
      return willOpen
    })
  }, [setVoiceSidebarOpen])

  const handleAgentSidebarToggle = useCallback(() => {
    setIsAgentSidebarOpen((wasOpen) => {
      const willOpen = !wasOpen
      if (willOpen) {
        setIsDocumentSidebarOpen(false)
        setVoiceSidebarOpen(false)
      }
      return willOpen
    })
  }, [setVoiceSidebarOpen])

  const handleVoiceSidebarToggle = useCallback(() => {
    const willOpen = !isVoiceSidebarOpen
    if (willOpen) {
      setIsDocumentSidebarOpen(false)
      setIsAgentSidebarOpen(false)
    }
    setVoiceSidebarOpen(willOpen)
  }, [isVoiceSidebarOpen, setVoiceSidebarOpen])

  const rightPanelOpen = isDocumentSidebarOpen || isAgentSidebarOpen || isVoiceSidebarOpen

  const openLlmProviderModal = useCallback(() => setHeaderLlmModalOpen(true), [])

  const value = useMemo(
    (): AdminWorkspacePanelsContextValue => ({
      isDocumentSidebarOpen,
      isAgentSidebarOpen,
      isVoiceSidebarOpen,
      rightPanelOpen,
      handleDocumentSidebarToggle,
      handleAgentSidebarToggle,
      handleVoiceSidebarToggle,
      setDocumentSidebarOpen: setIsDocumentSidebarOpen,
      setAgentSidebarOpen: setIsAgentSidebarOpen,
      openCreateAgentDialog,
      openMyAgentsDialog,
      openLlmProviderModal,
    }),
    [
      isDocumentSidebarOpen,
      isAgentSidebarOpen,
      isVoiceSidebarOpen,
      rightPanelOpen,
      handleDocumentSidebarToggle,
      handleAgentSidebarToggle,
      handleVoiceSidebarToggle,
      openCreateAgentDialog,
      openMyAgentsDialog,
      openLlmProviderModal,
    ],
  )

  return (
    <AdminWorkspacePanelsContext.Provider value={value}>
      {children}
      <CreateMentorDialog
        open={createMentorOpen}
        onOpenChange={setCreateMentorOpen}
      />
      <LLMProviderSelectionModal
        isOpen={headerLlmModalOpen}
        onClose={() => setHeaderLlmModalOpen(false)}
        onLLMSelect={() => setHeaderLlmModalOpen(false)}
      />
      <MyMentorDialog isOpen={myAgentsOpen} onClose={() => setMyAgentsOpen(false)} />
    </AdminWorkspacePanelsContext.Provider>
  )
}

export function useAdminWorkspacePanelsOptional() {
  return useContext(AdminWorkspacePanelsContext)
}

export function useAdminWorkspacePanels() {
  const v = useContext(AdminWorkspacePanelsContext)
  if (!v) {
    throw new Error("useAdminWorkspacePanels must be used within AdminWorkspacePanelsProvider")
  }
  return v
}
