"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams } from "next/navigation";

import {
  AgentPromptsTab,
  AgentSettingsProvider,
} from "@iblai/iblai-js/web-containers/next";
import { useUsername } from "@iblai/iblai-js/web-utils";

import { Header } from "@/components/platform/header";
import { SidebarLearner } from "@/components/platform/sidebar-learner";
import { Spinner } from "@/components/iblai/page-loader";
import { cn } from "@/lib/utils";
import config from "@/lib/iblai/config";

/**
 * Configure (Prompts) for the active agent. URL:
 *   `/platform/<tenantId>/<mentorId>/customize`
 *
 * Mounts the SDK `<AgentPromptsTab>` inside `<AgentSettingsProvider>`,
 * which is the same shape hq's edit-mentor dialog uses for the prompt
 * tab. The provider supplies the agent identity (tenant + mentor +
 * username); the SDK handles fetch/save/render internally.
 */
export default function ConfigurePromptsPage() {
  const { tenantId, mentorId } = useParams<{
    tenantId?: string;
    mentorId?: string;
  }>();
  const username = useUsername();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const tenantKey = tenantId || config.mainTenantKey();

  return (
    <div className="h-dvh w-full bg-white">
      <SidebarLearner
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isLoggedIn
      />
      <div
        className={cn(
          "flex min-h-dvh flex-col transition-all duration-300",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          sidebarCollapsed={isCollapsed}
          onMobileMenuToggle={() => setIsMobileOpen(true)}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
          {!mentorId || !username ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <AgentSettingsProvider
              tenantKey={tenantKey}
              mentorId={mentorId}
              username={username}
              enableRBAC={false}
            >
              <AgentPromptsTab />
            </AgentSettingsProvider>
          )}
        </div>
      </div>
    </div>
  );
}
