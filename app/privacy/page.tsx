import { redirect } from "next/navigation"

/**
 * /privacy → canonical iblai privacy policy.
 *
 * The footer links to `/privacy` (in-app path) so it survives any
 * future domain/route changes. `redirect()` issues an HTTP 307 to the
 * canonical page on `ibl.ai`, which is the source of truth maintained
 * by the iblai legal team.
 */
export default function PrivacyPage(): never {
  redirect("https://ibl.ai/privacy-policy")
}
