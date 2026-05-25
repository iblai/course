import { redirect } from "next/navigation"

/**
 * /terms → canonical iblai terms of use.
 *
 * The footer links to `/terms` (in-app path) so it survives any
 * future domain/route changes. `redirect()` issues an HTTP 307 to the
 * canonical page on `ibl.ai`, which is the source of truth maintained
 * by the iblai legal team.
 */
export default function TermsPage(): never {
  redirect("https://ibl.ai/terms-of-use")
}
