"use client"

import { useCallback } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

import { isLoggedIn, redirectToAuthSpa } from "@iblai/iblai-js/web-utils"
import { authSpaOptions } from "@/lib/iblai/auth-utils"

/**
 * Minimal mentorai-style free-trial gate. Wraps an action and:
 *   - redirects to the auth SPA when the user is anonymous,
 *   - toasts an upgrade prompt when the tenant's credit is exhausted
 *     (Redux `subscription.subscriptionStatus.creditExhausted`,
 *     populated by the SDK subscription handler when wired),
 *   - otherwise runs the action.
 *
 * Returns the same shape mentorai's hook does so call-sites are
 * source-compatible. The full mentorai variant ports
 * `MentorSubscriptionFlowV2` + `useSubscriptionHandlerV2`; we keep
 * just the wrapper since courseai doesn't yet ship the subscription
 * flow plumbing.
 */
type SubscriptionStatus = {
  creditExhausted?: boolean
  callToAction?: string | null
}

export function useShowFreeTrialDialog() {
  const subscriptionStatus = useSelector(
    (state: { subscription?: { subscriptionStatus?: SubscriptionStatus } }) =>
      state.subscription?.subscriptionStatus ?? {},
  ) as SubscriptionStatus

  const executeWithTrialCheck = useCallback(
    (actionFn: () => unknown | Promise<unknown>, _enforceTrialCheck = true) => {
      void _enforceTrialCheck
      if (!isLoggedIn()) {
        void redirectToAuthSpa({ ...authSpaOptions(), redirectTo: "/" })
        return null
      }
      if (subscriptionStatus.creditExhausted) {
        toast.message("Your credits are exhausted — upgrade to continue.")
        return null
      }
      return actionFn()
    },
    [subscriptionStatus.creditExhausted],
  )

  return {
    executeWithTrialCheck,
    isModalOpen: false,
    closeModal: () => {},
    FreeTrialDialog: null,
  }
}
