"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { TooltipFlowbite, TooltipProvider } from "@/components/ui/tooltip-flowbite"
import { LLMProviderSelectionModal } from "@/components/modals/llm-provider-selection-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
}: HeaderProps) {
  const router = useRouter()
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false)
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

  return (
      <header className="sticky top-0 z-40 bg-card border-b" style={{ borderColor: "#D0E0FF" }}>
        <div className="flex items-center justify-between px-4 py-3.5">
        {/* Left Section - same vertical padding as sidebar top section */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-8 w-8" onClick={onMenuClick || onMobileMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>

          {/* Model Selector */}
          {showModelSelector && (
            <TooltipProvider>
              <TooltipFlowbite content="LLM Selection" position="bottom">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-[#646464] hover:text-[#484848] transition-colors md:ml-4"
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
            {isLoggedIn ? (
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
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#00A3EC] focus:text-[#00A3EC] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>
  )
}
