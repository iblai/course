"use client"

import type { SVGProps } from "react"

export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

export function OneDriveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M10.5 18H6.5C4.01 18 2 15.99 2 13.5C2 11.26 3.63 9.4 5.78 9.06C6.32 6.73 8.43 5 11 5C13.21 5 15.1 6.36 15.84 8.26C18.73 8.62 21 11.04 21 14C21 17.31 18.31 20 15 20H10.5V18Z"
        fill="#0078D4"
      />
      <path
        d="M6.5 18C4.01 18 2 15.99 2 13.5C2 11.26 3.63 9.4 5.78 9.06C5.86 8.71 5.98 8.38 6.13 8.06C4.31 8.43 2.96 10.07 2.96 12C2.96 14.21 4.75 16 6.96 16H10.5V18H6.5Z"
        fill="#0364B8"
      />
      <path
        d="M15.84 8.26C15.1 6.36 13.21 5 11 5C9.62 5 8.37 5.53 7.43 6.38C8.21 6.14 9.04 6 9.91 6C12.07 6 13.98 7.1 15.12 8.76C15.36 8.56 15.59 8.4 15.84 8.26Z"
        fill="#0078D4"
      />
    </svg>
  )
}

export function GoogleDriveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path d="M8.5 2L15.5 2L22 14H15L8.5 2Z" fill="#0066DA" />
      <path d="M2 14L5.5 21H18.5L15 14H2Z" fill="#00AC47" />
      <path d="M8.5 2L2 14L5.5 21L12 9L8.5 2Z" fill="#FFBA00" />
    </svg>
  )
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </svg>
  )
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
