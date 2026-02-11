"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, ChevronDown, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import { LLMProviderSelectionModal } from "@/components/modals/llm-provider-selection-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AccountDialog } from "@/components/account-dialog"

interface HeaderProps {
  onMenuClick?: () => void
  onMobileMenuToggle?: () => void
  isLoggedIn?: boolean
  onLogin?: () => void
  onLogout?: () => void
  userName?: string
  showLogo?: boolean
  showBackButton?: boolean
  showModelSelector?: boolean
  /** When true, sidebar is collapsed (narrow). Used for fixed header left offset on desktop. */
  sidebarCollapsed?: boolean
}

export function Header({
  onMenuClick,
  onMobileMenuToggle,
  isLoggedIn = false,
  onLogin,
  onLogout,
  userName = "User",
  showLogo = false,
  showBackButton = false,
  showModelSelector = false,
  sidebarCollapsed,
}: HeaderProps) {
  const router = useRouter()
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [selectedLLM, setSelectedLLM] = useState<{ name: string; icon: string }>({
    name: "GPT-50",
    icon: "/logos/openai.svg",
  })

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    }
    router.push("/login")
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    router.push("/login")
  }

  const leftClass = sidebarCollapsed === undefined ? "" : sidebarCollapsed ? "md:left-16" : "md:left-64"

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-card border-b ${leftClass}`}
        style={{ borderColor: "#D0E0FF" }}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3.5 overflow-visible">
        {/* Left Section - same vertical padding as sidebar top section */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 overflow-visible">
          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-8 w-8" onClick={onMenuClick || onMobileMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>

          {/* Model Selector - always visible when showModelSelector is true */}
          {showModelSelector && (
            <TooltipProvider>
              <TooltipFlowbite content="LLM Selection" position="bottom">
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#646464] hover:text-[#484848] transition-colors md:ml-4"
                  onClick={() => setIsLLMModalOpen(true)}
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full flex-shrink-0">
                    <img
                      src={selectedLLM.icon}
                      alt={selectedLLM.name}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="hidden md:block whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                    {selectedLLM.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </TooltipFlowbite>
            </TooltipProvider>
          )}
        </div>

          <LLMProviderSelectionModal
            isOpen={isLLMModalOpen}
            onClose={() => setIsLLMModalOpen(false)}
            onLLMSelect={(llm) => setSelectedLLM({ name: llm.name, icon: llm.icon })}
          />

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile: Chat button (opens chat panel) */}
            <button
              type="button"
              onClick={() => document.dispatchEvent(new CustomEvent("open-chat"))}
              className="md:hidden w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
              aria-label="Open chat"
            >
              <Image src="/images/toolsAI-logo.png" alt="Chat" width={22} height={22} className="w-5 h-5 object-contain" />
            </button>
            {isLoggedIn ? (
              <TooltipProvider>
                <TooltipFlowbite content="Profile" position="bottom">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-shrink-0"
                        aria-label="Profile menu"
                      >
                        <Image
                          src="/images/user-avatar.webp"
                          alt={userName}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-cover"
                        />
                      </button>
                    </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setIsAccountDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#00A3EC] focus:text-[#00A3EC] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipFlowbite>
              </TooltipProvider>
            ) : null}
          </div>
        </div>

        <AccountDialog
          open={isAccountDialogOpen}
          onOpenChange={setIsAccountDialogOpen}
          onSave={(info) => {
            console.log("Account saved:", info)
          }}
        />
      </header>
      {/* Spacer so content below doesn't sit under the fixed header */}
      <div className="h-14 flex-shrink-0" aria-hidden />
    </>
  )
}
