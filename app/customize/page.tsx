"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"

export default function ConfigurePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"instructions" | "system-prompt">("instructions")
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [instructionsValue, setInstructionsValue] = useState(`ROLE:
You are an expert course creator and educational content designer.

OBJECTIVE:
Create a COMPLETE, EDUCATIONAL, and IN-DEPTH course about the topic specified below. This course must strictly follow the edX course structure and output format specified in the system prompt.

LANGUAGE:
English (clear, professional, neutral)

COURSE STRUCTURE (MANDATORY):
- SECTION (name only - descriptive and specific)
- SUBSECTION (name only - descriptive and specific)
- UNIT (name only - descriptive and specific)
- BLOCK (real educational content)

Section, Subsection, and Unit must contain ONLY descriptive titles (no explanations).`)
  const [systemPromptValue, setSystemPromptValue] = useState("")
  const router = useRouter()

  const isLoggedIn = true

  const handleSave = () => {
    console.log("Saving:", activeTab === "instructions" ? instructionsValue : systemPromptValue)
    // Handle save logic
    toast.success("Question saved successfully!", {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        padding: "14px 18px",
        fontSize: "15px",
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(0, 163, 236, 0.3)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      },
      className: "toast-success",
    })
  }

  const handleRestoreDefaultClick = () => {
    setIsRestoreDialogOpen(true)
  }

  const handleConfirmRestore = () => {
    if (activeTab === "instructions") {
      setInstructionsValue(`ROLE:
You are an expert course creator and educational content designer.

OBJECTIVE:
Create a COMPLETE, EDUCATIONAL, and IN-DEPTH course about the topic specified below. This course must strictly follow the edX course structure and output format specified in the system prompt.

LANGUAGE:
English (clear, professional, neutral)

COURSE STRUCTURE (MANDATORY):
- SECTION (name only - descriptive and specific)
- SUBSECTION (name only - descriptive and specific)
- UNIT (name only - descriptive and specific)
- BLOCK (real educational content)

Section, Subsection, and Unit must contain ONLY descriptive titles (no explanations).`)
    } else {
      setSystemPromptValue("")
    }
    setIsRestoreDialogOpen(false)
    toast.success("Instructions restored successfully from default!", {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        padding: "14px 18px",
        fontSize: "15px",
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(0, 163, 236, 0.3)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      },
      className: "toast-success",
    })
  }

  return (
    <div className="h-screen-dvh overflow-y-auto bg-background">
      {/* Sidebar */}
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen-dvh transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        {/* Header */}
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={isLoggedIn}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex flex-1">
          <main className="flex-1 transition-all duration-300 pb-[200px] md:pb-[200px]">
            <div className="flex">
              <div className="flex-1 px-5 sm:px-2 py-4 sm:py-8 w-full sm:pl-8 sm:pr-8 md:pr-20">
              {/* Page Header */}
              <div className="mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: "rgb(113,121,133)" }}>
                  Configure
                </h1>
                <p className="text-xs sm:text-sm" style={{ color: "rgb(113,121,133)" }}>Manage instructions and system prompt</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("instructions")}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "instructions"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  Instructions
                </button>
                <button
                  onClick={() => setActiveTab("system-prompt")}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === "system-prompt"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  System Prompt
                </button>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mr-5">
                {activeTab === "instructions" ? (
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: "rgb(113,121,133)" }}>
                      Instructions Template
                    </h2>
                    <Textarea
                      value={instructionsValue}
                      onChange={(e) => setInstructionsValue(e.target.value)}
                      className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] font-mono text-xs sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter instructions template..."
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: "rgb(113,121,133)" }}>
                      System Prompt
                    </h2>
                    <Textarea
                      value={systemPromptValue}
                      onChange={(e) => setSystemPromptValue(e.target.value)}
                      className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] font-mono text-xs sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter system prompt..."
                    />
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-[200px] md:mb-[200px]">
                <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Loading prompt for user: test_admin
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleRestoreDefaultClick}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Restore Default
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
                  >
                    {activeTab === "instructions" ? "Save Instructions" : "Save System Prompt"}
                  </Button>
                </div>
              </div>
            </div>

            </div>

            {/* Footer */}
            <PlatformFooter />
          </main>
        </div>
      </div>

      {/* Restore Default Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="sm:max-w-[500px] gap-3">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-0.5 text-[var(--sidebar-foreground)]">
              Restore Default {activeTab === "instructions" ? "Instructions" : "System Prompt"}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-0.5">This action cannot be undone</p>
            <p className="text-sm text-gray-700 leading-relaxed mt-0">
              Are you sure you want to restore the default {activeTab === "instructions" ? "instructions template" : "system prompt"}? This will replace the current {activeTab === "instructions" ? "instructions" : "system prompt"} with the default version.
            </p>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-0">
            <Button
              variant="outline"
              onClick={() => setIsRestoreDialogOpen(false)}
              className="w-full sm:w-auto px-6 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRestore}
              className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
