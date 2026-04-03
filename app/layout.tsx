import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { ScrollToTop } from "@/components/scroll-to-top"
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
  title: "wink.school - AI-Powered Learning Platform",
  description: "Master in-demand skills with personalized AI-powered learning paths. Start your journey today.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ScrollToTop />
        <AccessibilityProvider>{children}</AccessibilityProvider>
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
