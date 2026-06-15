"use client";

/**
 * ibl.ai Provider wrapper.
 *
 * Wrap your root layout children with <IblaiProviders> to get:
 *  - Redux store (RTK Query for IBL APIs)
 *  - AuthProvider  (SSO redirect, JWT validation, cross-SPA sync)
 *  - TenantProvider (multi-tenant routing)
 *
 * Usage in app/layout.tsx:
 *
 *   import { IblaiProviders } from "@/providers/iblai-providers";
 *   export default function RootLayout({ children }) {
 *     return <html><body><IblaiProviders>{children}</IblaiProviders></body></html>;
 *   }
 */

import { Suspense, useMemo, type ReactNode } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { initializeDataLayer } from "@iblai/iblai-js/data-layer";
import {
    AuthProvider,
    TenantProvider,
    ServiceWorkerProvider,
    redirectToAuthSpa,
} from "@iblai/iblai-js/web-utils";

import { iblaiStore } from "@/store/iblai-store";
import { selectRequestedTenant } from "@/features/tenant";
import { LocalStorageService } from "@/lib/iblai/storage-service";
import { RadixPointerEventsGuard } from "@/components/iblai/radix-pointer-events-guard";
import { StripeCallbackHandler } from "@/components/iblai/stripe-callback-handler";
import { PageLoader } from "@/components/iblai/page-loader";
import config from "@/lib/iblai/config";
import { resolveAppTenant } from "@/lib/iblai/tenant";
import { handleTenantSwitch as runTenantSwitch } from "@/lib/iblai/tenant-switch";
import {
    authSpaOptions,
    handleLogout,
} from "@/lib/iblai/auth-utils";
import { useDefineUserTenants } from "@/hooks/iblai/use-define-user-tenants";

const storageService = LocalStorageService.getInstance();

// Initialize the data layer once at module load (client only).
//
// Previously this lived in a `useState(() => { ... })` initializer on
// `IblaiProviders`. That looked right but failed under Next.js:
// useState's initializer only runs on the first render of the
// component, and during SSR `typeof window === "undefined"` so it
// returned `false` and never called `initializeDataLayer`. React 19
// hydration preserves the SSR state, so the `false` value stuck on
// the client too, the `isInitialized` gate rendered `Loading...`
// forever, and `initializeDataLayer` was never actually called.
//
// Running it here, at module top-level under a window check, fires
// exactly once when the bundle loads on the client, before any
// component mounts. No render-time gate needed.
if (typeof window !== "undefined") {
    try {
        // data-layer v1.2+ signature:
        // (dmUrl, lmsUrl, legacyLmsUrl, storageService, httpErrorHandler)
        //
        // LMS host = the API gateway proxy `api.<domain>/lms`, NOT the
        // direct LMS host. The direct host (`learn.<domain>`) blocks CORS
        // for several endpoints used by the SDK
        // (e.g. `/api/ibl/users/manage/platform/`), so the data-layer
        // routes all LMS-bound RTK Query calls through the gateway.
        //
        // Static asset URLs (catalog thumbnails, course-content iframe)
        // still use the direct host — assets aren't subject to the CORS
        // preflight and the LMS serves `/asset-v1:...` only on the direct
        // host.
        initializeDataLayer(
            config.dmUrl(),
            config.lmsUrl(),
            config.lmsUrl(),
            storageService,
            {
                401: () => redirectToAuthSpa({ ...authSpaOptions(), logout: true }),
            },
        );
    } catch (e) {
        console.error("[ibl.ai] initializeDataLayer failed:", e);
    }
}

/** Routes that do NOT require authentication. */
const PUBLIC_ROUTES = new Map<RegExp, () => Promise<boolean>>([
    [new RegExp("^/sso-login"), async () => false],
]);

function IblaiProvidersInner({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const username = useMemo(() => {
        if (typeof window === "undefined") return "";
        try {
            const raw = localStorage.getItem("userData");
            if (raw) return JSON.parse(raw).user_nicename ?? "";
        } catch { /* ignore */ }
        return "";
    }, []);

    // Read `currentTenant` directly from `localStorage.tenant` — the raw
    // key that `handleTenantSwitch` writes before the auth-SPA round trip
    // and that survives the redirect. Mirrors lms's `getTenant()`. Using
    // `resolveAppTenant()` here breaks tenant switching: the SDK calls
    // `saveCurrentTenant` mid-init and can overwrite `current_tenant.key`
    // before the requested switch settles, so reading from there pins
    // the UI to the SDK's resolved tenant instead of the user's choice.
    const tenantKey = useMemo(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("tenant") ?? "";
    }, []);

    // `requestedTenant` lives in the Redux tenant slice so callers can
    // dispatch a switch from anywhere; `currentTenant` is whatever the
    // localStorage already holds. The SDK's TenantProvider compares the
    // two and triggers a tenant switch when they diverge.
    const requestedTenant = useSelector(selectRequestedTenant);

    // Hand AuthProvider the already-issued axd token. When this is
    // truthy the SDK's internal `performAuthCheck` is skipped (see
    // `authRequired = (...) && !token` in @iblai/web-utils): no JWT
    // refresh, no DM-token revalidation, no chance of an `await
    // refreshJwtToken()` hang. The provider context still mounts and
    // the rest of the SDK (Tenant, RTK Query) runs normally; we just
    // trust the token that SsoLogin already deposited.
    const token = useMemo(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("axd_token") ?? "";
    }, []);

    const isSsoRoute = pathname?.startsWith("/sso-login") ?? false;
    // Skip only on the SSO callback route -- never on regular routes.
    // The SDK's full AuthProvider / TenantProvider logic must run so
    // tenant metadata, RTK Query, custom-domain detection, and the rest
    // of the SDK's auth machinery stay active.
    const skipAuth = isSsoRoute;

    const LOADING = <PageLoader />;
    const { tenantsLoading } = useDefineUserTenants();


    if (tenantsLoading && !isSsoRoute) return LOADING;

    return (
        <>
            <RadixPointerEventsGuard />
            {/* `useSearchParams` opts the subtree out of static prerendering;
          wrap in Suspense so the rest of the layout can still be SSG'd. */}
            <Suspense fallback={null}>
                <StripeCallbackHandler />
            </Suspense>
            <ServiceWorkerProvider basePath="">
                <AuthProvider
                    skip={skipAuth}
                    redirectToAuthSpa={(redirectTo, platformKey, logout, saveRedirect) =>
                        redirectToAuthSpa({
                            ...authSpaOptions(),
                            redirectTo,
                            platformKey,
                            logout,
                            saveRedirect,
                        })
                    }
                    username={username}
                    pathname={pathname ?? "/"}
                    storageService={storageService}
                    middleware={PUBLIC_ROUTES}
                    token={token}
                    /*
                     * Cross-SPA cookie sync. login.iblai.app sets its cookies on
                     * its own domain; localhost can't read them, so the sync sees
                     * "cookies empty but localStorage populated" -> needsRefresh
                     * -> redirect to the Auth SPA on every page load (the login
                     * loop). Off on localhost; in production (same parent domain
                     * as the Auth SPA) the cookies are readable and this can be
                     * flipped back on for cross-SPA logout detection.
                     */
                    enableStorageSync={
                        typeof window !== "undefined" &&
                        !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname)
                    }
                    fallback={LOADING}
                >
                    <TenantProvider
                        skip={skipAuth}
                        currentTenant={tenantKey}
                        requestedTenant={requestedTenant}
                        saveCurrentTenant={(t: any) => {
                            // Persist the SDK-resolved tenant *object* under
                            // `current_tenant` only. Do NOT overwrite
                            // `localStorage.tenant` — that's the raw key the standalone
                            // `handleTenantSwitch` wrote before the auth-SPA round trip
                            // and is the source of truth for which tenant the user
                            // asked for. Mirrors lms's `useCurrentTenant().saveCurrentTenant`,
                            // which writes only `current_tenant`. Overwriting
                            // `localStorage.tenant` here was pinning the UI to whatever
                            // the SDK first resolved (often the previous tenant) and
                            // reverting the requested switch.
                            const key = typeof t === "string" ? t : t?.key ?? String(t);
                            const tenantObj =
                                t && typeof t === "object"
                                    ? { ...t, key }
                                    : { key };
                            localStorage.setItem("current_tenant", JSON.stringify(tenantObj));
                        }}
                        saveUserTenants={(t: unknown) =>
                            localStorage.setItem("tenants", JSON.stringify(t))
                        }
                        handleTenantSwitch={async (tenant, saveRedirect) => {
                            // Only perform a real switch when the app explicitly asked
                            // for it via the Redux tenant slice (dispatch
                            // `updateRequestedTenant(key)`) and the SDK's requested key
                            // matches. Otherwise the SDK initiated the switch on its
                            // own — usually because `currentTenant` wasn't found in the
                            // user's fetched tenant list and it's falling back to
                            // `enhancedTenants[0]`. Performing that switch would call
                            // `runTenantSwitch` -> `localStorage.clear()` and wipe the
                            // user's tenants list, which hides the switcher dropdown.
                            // In that case, just bounce through the auth SPA for the
                            // user's existing tenant so localStorage is preserved.
                            const key =
                                typeof tenant === "string"
                                    ? tenant
                                    : ((tenant as { key?: string } | null | undefined)?.key ?? "");
                            if (key && requestedTenant && key === requestedTenant) {
                                await runTenantSwitch(key, {
                                    saveRedirect: Boolean(saveRedirect),
                                });
                                return;
                            }
                            redirectToAuthSpa({
                                ...authSpaOptions(),
                                platformKey: resolveAppTenant(),
                                saveRedirect: true,
                            });
                        }}
                        redirectToAuthSpa={(redirectTo, platformKey, logout, saveRedirect) =>
                            redirectToAuthSpa({
                                ...authSpaOptions(),
                                redirectTo,
                                platformKey,
                                logout,
                                saveRedirect,
                            })
                        }
                        username={username}
                        fallback={LOADING}
                    >
                        {children}
                    </TenantProvider>
                </AuthProvider>
            </ServiceWorkerProvider>
        </>
    );
}

export function IblaiProviders({ children }: { children: ReactNode }) {
    return (
        <ReduxProvider store={iblaiStore}>
            <IblaiProvidersInner>{children}</IblaiProvidersInner>
        </ReduxProvider>
    );
}
