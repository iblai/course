/**
 * Platform-level "public metadata" persistence for courseai.
 *
 * Endpoint (DM service, same path for GET / PUT / PATCH — wraps
 * `CoreService.coreOrgsMetadata*` in the SDK data-layer):
 *
 *   {dmUrl}/api/core/orgs/<tenant>/metadata/
 *
 * Auth: `Authorization: Token <dm_token>` (the SDK reads `dm_token` from
 * localStorage for any DM-scoped call; OpenAPI spec lists
 * `PlatformApiKeyAuthentication` with `Api-Token <token>` but the SDK's
 * `getHeaders(SERVICES.DM)` resolves to `Token` and the backend accepts
 * both — staying consistent with the rest of `agent-tools.ts`).
 *
 * Schema (`PlatformPublicMetadata`):
 *
 *   {
 *     "platform_key":  string  // readOnly
 *     "platform_name": string  // readOnly
 *     "metadata":      object  // free-form
 *   }
 *
 * `PATCH` body shape (`PatchedPlatformPublicMetadata`) is the same with
 * every field optional — we only ever send `{ metadata: { ... } }`.
 *
 * We stash the courseai default agent under
 * `metadata.courseai_default_agent_id` so the New Course flow can short-
 * circuit the recently_accessed → featured mentor-list lookup and land
 * straight on the sticky agent.
 */

import { toast } from "sonner";

import config from "@/lib/iblai/config";

export const COURSEAI_DEFAULT_AGENT_KEY = "courseai_default_agent_id";

interface PlatformMetadataResponse {
  metadata?: Record<string, unknown> | null;
}

function readDmToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("dm_token") ?? "";
}

function metadataUrl(tenantKey: string): string {
  return `${config.dmUrl()}/api/core/orgs/${encodeURIComponent(tenantKey)}/metadata/`;
}

/**
 * GET platform metadata and return the stored courseai default agent id
 * (or `null` when missing / unreachable). Never throws — callers can
 * always fall through to the mentor-list resolver.
 */
export async function getPlatformDefaultAgentId(
  tenantKey: string,
): Promise<string | null> {
  if (!tenantKey) return null;
  const token = readDmToken();
  if (!token) return null;

  try {
    const resp = await fetch(metadataUrl(tenantKey), {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    });
    if (!resp.ok) {
      console.warn("[platform-metadata] GET failed", resp.status, tenantKey);
      return null;
    }
    const data = (await resp.json()) as PlatformMetadataResponse;
    const value = data?.metadata?.[COURSEAI_DEFAULT_AGENT_KEY];
    return typeof value === "string" && value.length > 0 ? value : null;
  } catch (err) {
    console.error("[platform-metadata] getPlatformDefaultAgentId", err);
    return null;
  }
}

/**
 * PATCH platform metadata to set `courseai_default_agent_id`. Reads
 * existing metadata first so we merge with whatever other consumers
 * (mentorai, hq, etc.) have stored — sending just our key would clobber
 * their fields on backends that treat metadata as a full replace.
 *
 * Skips the PATCH when the stored value already matches. Safe to fire-
 * and-forget — never throws.
 */
export async function setPlatformDefaultAgentId(
  tenantKey: string,
  agentId: string,
): Promise<void> {
  if (!tenantKey || !agentId) return;
  const token = readDmToken();
  if (!token) return;

  const url = metadataUrl(tenantKey);

  try {
    const getResp = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    });
    if (!getResp.ok) {
      console.warn(
        "[platform-metadata] GET (pre-PATCH) failed",
        getResp.status,
        tenantKey,
      );
      return;
    }
    const data = (await getResp.json()) as PlatformMetadataResponse;
    const current = (data?.metadata ?? {}) as Record<string, unknown>;
    if (current[COURSEAI_DEFAULT_AGENT_KEY] === agentId) return;

    const merged = { ...current, [COURSEAI_DEFAULT_AGENT_KEY]: agentId };

    const patchResp = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata: merged }),
    });
    if (!patchResp.ok) {
      const errText = await patchResp.text().catch(() => "");
      console.warn(
        "[platform-metadata] PATCH failed",
        patchResp.status,
        errText,
        tenantKey,
      );
      return;
    }
    toast.success("Agent settings saved");
  } catch (err) {
    console.error("[platform-metadata] setPlatformDefaultAgentId", err);
  }
}
