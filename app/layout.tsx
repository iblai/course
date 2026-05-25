import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AuthGate } from "@/components/iblai/auth-gate"
import { BasePathImgRewriter } from "@/components/iblai/base-path-img-rewriter"
import { Toaster } from "sonner"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "courseAI - AI-Powered Learning Platform",
  description: "Master in-demand skills with personalized AI-powered learning paths. Start your journey today.",
  generator: "v0.app",
  // Favicon is served from `app/favicon.ico` (the iblai-brand icon).
  // Next.js auto-detects that file and emits the right `<link>` tag,
  // so no explicit `icons` config is needed here.
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Script src="/env.js" strategy="beforeInteractive" />
        <ScrollToTop />
        {/*
          Safety net for plain `<img src="/foo.png">` tags (and
          dynamically-added ones). Prepends `NEXT_PUBLIC_BASE_PATH`
          to absolute asset srcs so they resolve against the
          basePath mount instead of 404'ing at the root. No-op when
          basePath is empty.
        */}
        <BasePathImgRewriter />
        {/*
          Admin gating relaxed (was: `<AdminGate>` blocked every non-admin
          with a full-page "Admin Access Required" screen). Per videoai's
          pattern, students can now reach every route and the
          upgrade-subscription modal opens contextually when they hit
          something they don't have rights for (e.g. clicking "New
          Course" in the sidebar). `AdminGate` itself is kept around
          for any future route-level use.
        */}
        <AuthGate>
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </AuthGate>
        <Toaster
          position="top-center"
          richColors
          closeButton={false}
          expand={true}
          toastOptions={{
            style: {
              background: "linear-gradient(135deg, #00A3EC 0%, #6988FF 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "15px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0, 163, 236, 0.3)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            },
            duration: 3000,
            className: "sonner-toast",
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
