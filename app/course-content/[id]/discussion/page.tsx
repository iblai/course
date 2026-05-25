"use client"

import { CourseContentTabPage } from "@iblai/iblai-js/web-containers/next"

import { getIframeProps } from "../_iframe-props"

// Route segment is `/discussion`; the SDK tab value is `"forum"`. The
// default `tabHrefTemplate` in `CourseContentLayout` maps
// `forum → discussion`, so this stays consistent.
export default function DiscussionPage() {
  return <CourseContentTabPage tab="forum" {...getIframeProps()} />
}
