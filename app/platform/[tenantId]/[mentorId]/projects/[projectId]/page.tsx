"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Chat, type ChatConfig } from "@iblai/iblai-js/web-containers/next";
import {
  useUsername,
  useAxdToken,
  useUserTenants,
  useVisitingTenant,
  useIsAdmin,
  useCachedSessionId,
} from "@iblai/iblai-js/web-utils";

import { Header } from "@/components/platform/header";
import { SidebarLearner } from "@/components/platform/sidebar-learner";
import { ProjectGridInterceptor } from "@/components/iblai/project-grid-interceptor";
import { PageLoader } from "@/components/iblai/page-loader";
import { cn } from "@/lib/utils";
import config from "@/lib/iblai/config";
import { redirectToAuthSpa } from "@iblai/iblai-js/web-utils";
import { authSpaOptions } from "@/lib/iblai/auth-utils";

/**
 * Project landing — URL:
 *   /platform/<tenantId>/<mentorId>/projects/<projectId>
 *
 * Per `/iblai-project`: the SDK `<Chat>` component switches its welcome
 * surface to `ProjectLandingPage` when `projectId` is set. The chat
 * session is still mentor-scoped (the WebSocket connects on
 * `mentorId`), so all three IDs come from the URL.
 */
export default function MentorProjectPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MentorProjectPageInner />
    </Suspense>
  );
}

function MentorProjectPageInner() {
  const { tenantId, mentorId, projectId } = useParams<{
    tenantId?: string;
    mentorId?: string;
    projectId?: string;
  }>();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Force a fresh session every time the project route mounts. Without
  // this, `useAdvancedChat` restores the cached chat for `mentorId`
  // after ~a second, `messages.length > 0`, and the SDK swaps the
  // ProjectLandingPage (project files + agents grid) out for the
  // standard scroll-view -- so the user sees the grid for a second then
  // it disappears. Mentorai's `navigateToProject` does the same purge
  // before navigating; we do it on mount instead.
  const [cachedSessionId, saveCachedSessionId] = useCachedSessionId();
  const [sessionPurged, setSessionPurged] = useState(false);
  useEffect(() => {
    if (!mentorId) return;
    const map = { ...((cachedSessionId ?? {}) as Record<string, string>) };
    if (map[mentorId]) {
      delete map[mentorId];
      saveCachedSessionId(map);
    }
    setSessionPurged(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId, projectId]);

  const username = useUsername();
  const axdToken = useAxdToken();
  const { userTenants } = useUserTenants();
  const { visitingTenant } = useVisitingTenant();
  const isAdmin = useIsAdmin();

  const tenantKey = tenantId || config.mainTenantKey();

  const chatConfig: ChatConfig = {
    baseWsUrl: () => config.baseWsUrl(),
    supportEmail: () =>
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@ibl.ai",
    authUrl: () => config.authUrl(),
    mainTenantKey: config.mainTenantKey(),
    navigateToAdminBilling: () => router.push("/agents"),
    navigateToExplore: () => router.push("/agents"),
    // The SDK's `ProjectLandingPage` Project Agents grid calls
    // `navigateToMentor(id)` when the user clicks an agent card. On the
    // project route, keep them in the same project -- swap only the
    // mentor segment.
    navigateToMentor: (id) =>
      router.push(
        projectId
          ? `/platform/${tenantKey}/${id}/projects/${projectId}`
          : `/platform/${tenantKey}/${id}`,
      ),
  };

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
        <div className="flex min-h-0 flex-1 flex-col">
          {!mentorId || !projectId ? (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              Missing project or agent context.
            </div>
          ) : !sessionPurged ? (
            <PageLoader />
          ) : (
            <>
              <ProjectGridInterceptor
                tenantKey={tenantKey}
                projectId={projectId}
              />
              <Chat
              // Key on mentor+project so swapping projects remounts
              // <Chat> cleanly (skill: "Mounting discipline").
              key={`${mentorId}:project:${projectId}`}
              isPreviewMode={false}
              mentorId={mentorId}
              tenantKey={tenantKey}
              // `/iblai-project`: setting `projectId` swaps the SDK
              // Chat's welcome surface for `ProjectLandingPage` (chat
              // input + Project files + Project instructions + Project
              // Agents grid).
              projectId={projectId}
              config={chatConfig}
              redirectToAuthSpa={(redirectTo, platformKey, logout) =>
                void redirectToAuthSpa({
                  ...authSpaOptions(),
                  redirectTo,
                  platformKey,
                  logout,
                })
              }
              username={username ?? null}
              userTenants={userTenants ?? []}
              visitingTenant={visitingTenant}
              axdToken={axdToken ?? ""}
              userIsStudent={!isAdmin}
              // ProjectLandingPage gates its Project Agents grid on
              // `showExploreMentors` (see
              // `web-containers/dist/next/index.esm.js:217724`). Keep
              // it on for the project route so the SDK renders the
              // grid + Add Agent button.
              showExploreMentors
              showConversationStarters={false}
            />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
