"use client"

import { CourseContentTabPage } from "@iblai/iblai-js/web-containers/next"

import { getIframeProps } from "../_iframe-props"

export default function CoursePage() {
  return <CourseContentTabPage tab="course" {...getIframeProps()} />
}
