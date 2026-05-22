"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AgentSearch,
  type AgentSearchResult,
} from "@iblai/iblai-js/web-containers/next";

import { SidebarLearner } from "@/components/platform/sidebar-learner";
import { Header } from "@/components/platform/header";
import { useUrlContext } from "@/lib/iblai/use-url-context";
import { cn } from "@/lib/utils";

/**
 * Agents browser. Same shell as `/home` (`SidebarLearner` + `Header`)
 * so picking an agent doesn't drop the user into a chromeless page;
 * the navigation/topbar stay visible while they browse and select.
 *
 * Selecting an agent routes to `/platform/<tenant-key>/<agent-id>`.
 */
export default function AgentsBrowserPage() {
  const router = useRouter();
  const { tenantKey, username, ready } = useUrlContext();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!ready || !tenantKey) return null;

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={true}
      />

      {/* Main column */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={true}
          showLogo={true}
          showBackButton={false}
          showModelSelector={false}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto bg-white p-4">
          <AgentSearch
            tenantKey={tenantKey}
            username={username}
            onAgentClick={(agent: AgentSearchResult) => {
              router.push(
                `/platform/${encodeURIComponent(tenantKey)}/${agent.unique_id}`,
              );
            }}
          />
        </main>
      </div>
    </div>
  );
}
