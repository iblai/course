"use client"

import { MouseEvent, useCallback, useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

import { isLoggedIn } from "@iblai/iblai-js/web-utils"
import { redirectToAuthSpa } from "@/lib/iblai/auth-utils"

type AuthPopoverProps = {
  children: React.ReactNode
  tenantKey?: string
}

/**
 * Wraps a trigger element. If the user is logged in, clicks pass through
 * untouched. If anonymous, the popover opens with login / sign-up CTAs.
 *
 * Minimal port of mentorai's `AuthPopover` -- drops the advertising /
 * `is_advertising` branch courseai doesn't use, keeps the login redirect
 * flow.
 */
export function AuthPopover({ children, tenantKey }: AuthPopoverProps) {
  const [open, setOpen] = useState(false)
  const loggedIn = isLoggedIn()

  const handleLogin = useCallback(() => {
    void redirectToAuthSpa("/", tenantKey)
  }, [tenantKey])

  const handleTriggerClick = useCallback(
    (event: MouseEvent) => {
      if (loggedIn) return
      event.preventDefault()
      setOpen(true)
    },
    [loggedIn],
  )

  if (loggedIn) {
    // Pass-through when authed; avoids a stray Radix wrapper.
    return <>{children}</>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={handleTriggerClick}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-1.5">
          <h3 className="font-medium text-gray-900">
            Log in to use this feature
          </h3>
          <p className="text-sm text-gray-600">
            Create courses, manage projects, and chat with your agents — sign
            in to ibl.ai to continue.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleLogin}
              className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] text-white hover:opacity-90"
            >
              Log in
            </Button>
            <Button onClick={handleLogin} variant="outline">
              Sign up for free
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
