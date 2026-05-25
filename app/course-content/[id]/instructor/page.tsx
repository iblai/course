"use client"

import { CourseContentTabPage } from "@iblai/iblai-js/web-containers/next"

import { getIframeProps } from "../_iframe-props"

// `CourseContentLayout` only HIDES the Instructor tab BUTTON for
// non-admin viewers — a direct URL visit still renders. The route is
// reachable, but the LMS itself will refuse non-instructor accounts
// in the iframe. If a hard gate is needed, wrap with the project's
// `AdminGate`.
export default function InstructorPage() {
  return <CourseContentTabPage tab="instructor" {...getIframeProps()} />
}
