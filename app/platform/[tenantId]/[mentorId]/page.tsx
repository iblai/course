"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import { ChatWelcomeOverride } from "@/components/iblai/welcome-override";
import { cn } from "@/lib/utils";
import config from "@/lib/iblai/config";
import { redirectToAuthSpa } from "@iblai/iblai-js/web-utils";
import { authSpaOptions } from "@/lib/iblai/auth-utils";
import { enableCourseCreationToolIfMissing } from "@/lib/iblai/agent-tools";
import { customErrorMessages } from "@/lib/error";

/**
 * Per-agent route. URL: `/platform/<tenantId>/<mentorId>` where
 * `<mentorId>` is the agent's UUID (`unique_id`).
 *
 * Wires the SDK in-process `<Chat>` component per the `iblai-agent-chat`
 * skill: handles session resume (`?session=<id>`) and new-chat
 * (`?new=<nonce>`) by pre-seeding `useCachedSessionId()` before mount,
 * gates the render until the cached map is in the right shape, and
 * keys `<Chat>` on `mentor:session:new` so an intentional switch is the
 * only thing that remounts it (avoids the `useVoiceChat` "Processing…"
 * wedge described in the skill's Known issues).
 */

export default function MentorChatPage() {
  // `useSearchParams()` requires a Suspense boundary in App Router; the
  // SDK `<Chat>` tree uses it too.
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <MentorChatPageInner />
    </Suspense>
  );
}

function ChatPageFallback() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white">
      <Loader2 className="size-5 animate-spin text-[#5f5f61]" aria-hidden />
    </div>
  );
}

function MentorChatPageInner() {
  const { tenantId, mentorId } = useParams<{
    tenantId?: string;
    mentorId?: string;
  }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Sidebar collapse state. Owned here so the SidebarLearner +
  // Header (which uses the collapsed flag to set the fixed-header
  // left offset) stay in sync without per-page state.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const restoreSessionId = searchParams.get("session") ?? undefined;
  // `?new=<nonce>` (e.g. from a "New Chat" trigger) — clear the cached
  // session for this mentor so the SDK starts a fresh conversation.
  const newParam = searchParams.get("new") ?? undefined;

  const [cachedSessionId, saveCachedSessionId] = useCachedSessionId();
  const [seededFor, setSeededFor] = useState<string | undefined>(
    restoreSessionId || newParam ? undefined : "none",
  );
  useEffect(() => {
    if (!mentorId) {
      setSeededFor("none");
      return;
    }
    const map = { ...((cachedSessionId ?? {}) as Record<string, string>) };
    if (restoreSessionId) {
      if (map[mentorId] !== restoreSessionId) {
        saveCachedSessionId({ ...map, [mentorId]: restoreSessionId });
      }
      setSeededFor(restoreSessionId);
    } else if (newParam) {
      if (map[mentorId]) {
        delete map[mentorId];
        saveCachedSessionId(map);
      }
      setSeededFor(`new:${newParam}`);
    } else {
      setSeededFor("none");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoreSessionId, newParam, mentorId]);

  const sessionReady = restoreSessionId
    ? seededFor === restoreSessionId
    : newParam
      ? seededFor === `new:${newParam}`
      : true;

  const username = useUsername();
  const axdToken = useAxdToken();
  const { userTenants } = useUserTenants();
  const { visitingTenant } = useVisitingTenant();
  const isAdmin = useIsAdmin();

  const tenantKey = tenantId || config.mainTenantKey();

  // courseai requirement: every agent landed on must expose the
  // `course-creation` tool. Direct navigation to /platform/<t>/<id>
  // (bookmarks, copy-pasted URLs) skips both `startNewChat` and
  // `useMentorRedirect`, so the check has to run on mount here too. This
  // is also the universal chokepoint — every course-creation entry point
  // (New Chat, redirect, direct nav) lands here — so it's where a failed
  // enable is surfaced: if the tool genuinely can't be enabled the chat
  // can't create courses, so show the error page instead. The helper GETs
  // first and only PUTs when the tool is missing, and returns `false` only
  // when an enable attempt was actually made and failed.
  useEffect(() => {
    if (!tenantKey || !mentorId || !username) return;
    let cancelled = false;
    void (async () => {
      const enabled = await enableCourseCreationToolIfMissing(
        tenantKey,
        username,
        mentorId,
      );
      if (!cancelled && !enabled) {
        router.replace(
          `/error/500?errorType=${customErrorMessages.courseCreationUnavailable.key}`,
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantKey, mentorId, username, router]);

  const chatConfig: ChatConfig = {
    baseWsUrl: () => config.baseWsUrl(),
    supportEmail: () =>
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@ibl.ai",
    authUrl: () => config.authUrl(),
    mainTenantKey: config.mainTenantKey(),
    // courseai has no /analytics/financial yet -- route to the agents
    // page until billing lands.
    navigateToAdminBilling: () => router.push("/agents"),
    navigateToExplore: () => router.push("/agents"),
    navigateToMentor: (id) => router.push(`/platform/${tenantKey}/${id}`),
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
          {!mentorId ? (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              No agent selected.
            </div>
          ) : !sessionReady ? (
            <ChatPageFallback />
          ) : (
            <>
              <ChatWelcomeOverride />
            <Chat
            // Mentor + session + new nonce as the only legitimate
            // remount trigger (see skill: "Mounting discipline").
            key={`${mentorId}:${restoreSessionId ?? ""}:${newParam ?? ""}`}
            isPreviewMode={false}
            mentorId={mentorId}
            tenantKey={tenantKey}
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
            showExploreMentors={false}
            showConversationStarters={false}
          />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
