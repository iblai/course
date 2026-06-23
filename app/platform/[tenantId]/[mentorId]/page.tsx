"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

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
import { PageLoader } from "@/components/iblai/page-loader";
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
    <Suspense fallback={<PageLoader />}>
      <MentorChatPageInner />
    </Suspense>
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

  // Gate the chat behind the tool check so a chat that's about to refresh
  // never renders. `readyForMentor` is the agent id we've confirmed the
  // course-creation tool on — the chat shows only once it matches the
  // current `mentorId` (so switching agents re-shows the loader and
  // re-checks). `reloading` keeps the spinner up while a refresh (after a
  // re-enable) is in flight.
  const [readyForMentor, setReadyForMentor] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);

  // courseai requirement: every agent landed on must expose the
  // `course-creation` tool. Direct navigation to /platform/<t>/<id>
  // (bookmarks, copy-pasted URLs) skips both `startNewChat` and
  // `useMentorRedirect`, so the check has to run on mount here too. This
  // is also the universal chokepoint — every course-creation entry point
  // (New Chat, redirect, direct nav) lands here — so it's where a failed
  // enable is surfaced: if the tool genuinely can't be enabled the chat
  // can't create courses, so show the error page instead. The helper GETs
  // first and only PUTs when something's missing, and reports back whether
  // it failed (-> error page) and whether it *just* wrote the settings
  // (-> hard refresh so the change takes effect).
  useEffect(() => {
    if (!tenantKey || !mentorId || !username) return;
    let cancelled = false;
    let reloadTimer: ReturnType<typeof setTimeout> | undefined;
    void (async () => {
      const { ok, justEnabled } = await enableCourseCreationToolIfMissing(
        tenantKey,
        username,
        mentorId,
      );
      if (cancelled) return;
      if (!ok) {
        router.replace(
          `/error/500?errorType=${customErrorMessages.courseCreationUnavailable.key}`,
        );
        return;
      }
      // We re-check on EVERY entry — this effect runs on mount and whenever
      // `mentorId` changes — because another admin can disable the
      // course-creation tool on the agent at any time. `enableCourse…` GETs
      // the live settings on each call and re-PUTs the tool when it's gone,
      // returning `justEnabled: true` only when it had to write something.
      if (justEnabled) {
        // The tool was off (disabled by someone, or never set up) and we
        // just re-enabled it. Bumping the <Chat> key only remounts the
        // React subtree — the SDK keeps its Redux store + open websocket,
        // so the re-enabled tool never takes effect. A real refresh
        // reconnects everything against the updated agent. We hold the
        // loader and refresh *before* the chat ever renders, so there's no
        // "chat finishes loading, then refreshes" jump.
        //
        // Loop guard: if a backend hiccup makes the PUT return 2xx but the
        // next GET still read "disabled" (e.g. read-replica lag), we'd
        // reload forever. Suppress only reloads <10s apart — a genuine
        // "disabled again later" re-entry is always far enough apart that
        // this never blocks a real refresh.
        const tsKey = `cc-reload-ts:${mentorId}`;
        const last = Number(sessionStorage.getItem(tsKey)) || 0;
        const now = Date.now();
        if (now - last >= 10_000) {
          sessionStorage.setItem(tsKey, String(now));
          setReloading(true);
          reloadTimer = setTimeout(() => window.location.reload(), 0);
          return; // keep the loader up through the refresh
        }
      }
      // Tool confirmed enabled (already enabled, or just re-enabled but a
      // too-soon reload was loop-guarded) — now it's safe to reveal the chat.
      setReadyForMentor(mentorId);
    })();
    return () => {
      cancelled = true;
      if (reloadTimer) clearTimeout(reloadTimer);
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

  // Chat is gated until the course-creation tool check for THIS agent has
  // passed (or kicked off a refresh) — so the spinner shows the whole time
  // we're checking, never a chat that's about to reload.
  const toolReady = readyForMentor === mentorId;

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
          ) : reloading || !sessionReady || !toolReady ? (
            <PageLoader />
          ) : (
            <>
              <ChatWelcomeOverride />
            <Chat
            // Mentor + session + new nonce as the only legitimate remount
            // triggers (see skill: "Mounting discipline"). A fresh
            // course-creation enable hard-refreshes the page instead (see
            // the effect above), so it needs no key nonce here.
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
