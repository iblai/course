"use client";

import { useState } from "react";

import { NotificationDisplay } from "@iblai/iblai-js/web-containers";

import { SidebarLearner } from "@/components/platform/sidebar-learner";
import { Header } from "@/components/platform/header";
import { PageLoader } from "@/components/iblai/page-loader";
import { useUrlContext } from "@/lib/iblai/use-url-context";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { cn } from "@/lib/utils";

/**
 * Notification center body — shared by `/notifications` and
 * `/notifications/<id>`. Renders the SDK `<NotificationDisplay>` (Inbox
 * + mark-as-read for everyone; Alerts tab + Send for admins) inside the
 * standard learner shell. See the `/iblai-notification` skill.
 *
 * `isAdmin` is derived from the `tenants` list (`useIsAdmin`), which is
 * what gates the admin-only Alerts/Send surfaces inside the SDK
 * component. `org` + `userId` come from `useUrlContext` — the same
 * source the header bell (`<NotificationDropdown>`) uses.
 */
export function NotificationsCenter({
  selectedNotificationId,
}: {
  selectedNotificationId?: string;
}) {
  const { tenantKey, username, ready } = useUrlContext();
  const isAdmin = useIsAdmin();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
          {!ready || !tenantKey || !username ? (
            <PageLoader />
          ) : (
            <NotificationDisplay
              org={tenantKey}
              userId={username}
              isAdmin={isAdmin}
              selectedNotificationId={selectedNotificationId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
