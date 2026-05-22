"use client";

import { useEffect, useState } from "react";
import { Building2, Check } from "lucide-react";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { handleTenantSwitch } from "@/lib/iblai/tenant-switch";

interface TenantEntry {
  key: string;
  org?: string;
  platform_name?: string;
  name?: string;
}

const label = (t: TenantEntry) =>
  t.platform_name || t.name || t.org || t.key;

/**
 * Tenant-switch submenu for the profile dropdown. Renders a nested
 * "Switch tenant" submenu listing the user's tenants from localStorage
 * (the SDK populates `tenants` after login). Selecting a different
 * tenant routes through the Auth SPA so it can mint a fresh session
 * for the new tenant. Renders nothing when the user has fewer than
 * two tenants -- nothing to switch between.
 *
 * Drop into any `<DropdownMenuContent>`; surrounding separator lines
 * are caller's responsibility so adjacent items can be styled
 * consistently.
 */
export function TenantSwitchSubMenu() {
  const [tenants, setTenants] = useState<TenantEntry[]>([]);
  const [currentKey, setCurrentKey] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenants");
      if (raw) {
        const parsed = JSON.parse(raw);
        const list: TenantEntry[] = Array.isArray(parsed) ? parsed : [parsed];
        setTenants(list.filter(Boolean));
      }
    } catch {
      // ignore
    }
    try {
      const ct = JSON.parse(localStorage.getItem("current_tenant") ?? "{}");
      setCurrentKey(ct?.key ?? localStorage.getItem("tenant") ?? "");
    } catch {
      setCurrentKey(localStorage.getItem("tenant") ?? "");
    }
  }, []);

  if (tenants.length < 2) return null;

  const current =
    tenants.find((t) => t.key === currentKey) ?? tenants[0];

  const handleSwitch = (key: string) => {
    if (!key || key === currentKey) return;
    // hq-style cross-SPA tenant switch: re-issues tokens scoped to the
    // new tenant via `${authUrl}/login/complete?tenant=...` instead of
    // the SPA bouncing the user back to the old tenant via
    // `<TenantProvider>` re-validation.
    void handleTenantSwitch(key, { saveRedirect: true });
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
        Tenant
      </DropdownMenuLabel>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          <Building2 className="mr-2 h-4 w-4" />
          <span className="truncate">{label(current)}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-64" sideOffset={4}>
          {tenants.map((t) => {
            const isCurrent = t.key === currentKey;
            return (
              <DropdownMenuItem
                key={t.key}
                className={
                  isCurrent
                    ? "cursor-default bg-accent font-medium"
                    : "cursor-pointer"
                }
                onSelect={() => handleSwitch(t.key)}
              >
                <Building2 className="mr-2 h-4 w-4 opacity-70" />
                <span className="flex-1 truncate">{label(t)}</span>
                {isCurrent && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}
