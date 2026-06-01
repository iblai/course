"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ErrorPage } from "@iblai/iblai-js/web-containers/next";

import config from "@/lib/iblai/config";
import { customErrorMessages, type CustomErrorKey } from "@/lib/error";

/**
 * Dynamic error page. URL: `/error/<code>?errorType=<key>` — mirrors
 * agentai's `app/error/[code]/page.tsx`. `<code>` is the big status number
 * shown to the user; `errorType` looks up a friendly header/message from
 * `customErrorMessages`. Course-creation failures redirect here:
 *
 *   - `useMentorRedirect`            -> /error/500?errorType=agentLoadFailed
 *   - the per-mentor chat page (tool) -> /error/500?errorType=courseCreationUnavailable
 *
 * Uses the SDK `<ErrorPage>` (the same component `<ClientErrorPage>` renders
 * internally) so we can set `homeButtonHref`: `<ClientErrorPage>` hardcodes
 * the SDK default `/`, which bounced through agent resolution. The
 * "Back to Home" button points at `/course-catalog` instead. `<ErrorPage>`
 * falls back to its built-in title/description for an unknown `errorType`.
 *
 * `useSearchParams()` needs a Suspense boundary in the App Router (same as
 * the chat page), so the hook-reading part lives in an inner component.
 */
export default function CourseaiErrorPage() {
  return (
    <Suspense fallback={<div className="h-dvh w-full bg-white" />}>
      <ErrorPageInner />
    </Suspense>
  );
}

function ErrorPageInner() {
  const params = useParams<{ code?: string }>();
  const searchParams = useSearchParams();
  const [errorData, setErrorData] = useState<
    (typeof customErrorMessages)[CustomErrorKey] | null
  >(null);

  const code = params.code ?? "500";
  const errorType = searchParams.get("errorType");
  // `?embed=true` (SDK chat embeds) — hide the "Back to Home" button so the
  // error stays inside the host frame.
  const isEmbedMode = searchParams.get("embed") === "true";

  useEffect(() => {
    if (errorType && errorType in customErrorMessages) {
      setErrorData(customErrorMessages[errorType as CustomErrorKey]);
    } else {
      setErrorData(null);
    }
  }, [errorType]);

  return (
    <ErrorPage
      errorCode={code}
      customTitle={errorData?.header}
      customDescription={errorData?.message}
      supportEmail={config.supportEmail()}
      showHomeButton={!isEmbedMode}
      // Send "Back to Home" to the course catalog rather than the SDK
      // default `/` (which bounced through agent resolution).
      homeButtonHref="/course-catalog"
    />
  );
}
