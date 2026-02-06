"use client"

import Image from "next/image"
import {
  X,
  Download,
  Award,
  Calendar,
  FileText,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Link,
  MessageCircle,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface CredentialDetailModalProps {
  credential: {
    id: number
    name: string
    issuer: string
    earnedOn: string
    image: string
  } | null
  onClose: () => void
  isOpen?: boolean
}

export function CredentialDetailModal({ credential, onClose, isOpen = true }: CredentialDetailModalProps) {
  const shareDropdownRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(event.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setShowShareOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Early return if modal is not open or credential is null
  if (!isOpen || !credential) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div 
        className="bg-white rounded-lg max-w-lg w-full flex flex-col h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh]"
        style={{ maxHeight: "-webkit-fill-available" }}
      >
        {/* Fixed Header */}
        <div
          className="p-4 border-b rounded-t-lg flex justify-between items-center flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          <h3 className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            Credential Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Credential Badge and Title Section */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-28 h-28 overflow-hidden mb-4 rounded-full shadow-lg border-2"
              style={{ borderColor: "var(--primary-color)" }}
            >
              <Image
                src={credential.image || "/images/skills-icon.webp"}
                alt={credential.name}
                width={112}
                height={112}
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-center" style={{ color: "var(--text-primary)" }}>
              Mikel Amigot
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Award className="h-4 w-4" style={{ color: "var(--primary-color)" }} />
              <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                Issued by {credential.issuer}
              </p>
            </div>
          </div>

          {/* Credential Description */}
          <div
            className="p-4 rounded-lg mb-6 border"
            style={{ backgroundColor: "var(--accent-color)", borderColor: "var(--border-color)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              A completion credential for {credential.name} was issued to Mikel Amigot on {credential.earnedOn}.
            </p>
          </div>

          {/* Course Section with Image */}
          <div className="border rounded-lg overflow-hidden mb-6" style={{ borderColor: "var(--border-color)" }}>
            <div
              className="px-4 py-3 border-b"
              style={{ backgroundColor: "var(--accent-color)", borderColor: "var(--border-color)" }}
            >
              <h3 className="text-md font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <FileText className="h-4 w-4" style={{ color: "var(--primary-color)" }} />
                Course
              </h3>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div
                className="w-24 h-16 flex-shrink-0 rounded-md overflow-hidden border"
                style={{ borderColor: "var(--border-color)" }}
              >
                <Image
                  src="/images/skills-icon.webp"
                  alt={credential.name}
                  width={96}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--primary-color)" }}>
                  {credential.name}
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Professional Development & Skills Training
                </p>
              </div>
            </div>
          </div>

          {/* Issue Date */}
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
            <div
              className="px-4 py-3 border-b"
              style={{ backgroundColor: "var(--accent-color)", borderColor: "var(--border-color)" }}
            >
              <h3 className="text-md font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <Calendar className="h-4 w-4" style={{ color: "var(--primary-color)" }} />
                Issued on
              </h3>
            </div>
            <div className="p-4">
              <p className="font-medium text-sm" style={{ color: "var(--primary-color)" }}>
                {credential.earnedOn}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Download and Share Buttons */}
        <div
          className="p-4 rounded-b-lg border-t flex justify-end gap-3 flex-shrink-0"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(to right, var(--accent-color), var(--accent-color))",
          }}
        >
          {/* Share Button and Dropdown */}
          <div className="relative">
            <button
              ref={shareButtonRef}
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-white border rounded-md text-sm font-medium hover:opacity-80 transition-colors shadow-sm"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {showShareOptions && (
              <div
                ref={shareDropdownRef}
                className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-2 w-48 z-10"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex flex-col">
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left">
                    <Linkedin className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left">
                    <Twitter className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">Twitter</span>
                  </button>
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left">
                    <MessageCircle className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">WhatsApp</span>
                  </button>
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left">
                    <Facebook className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">Facebook</span>
                  </button>
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left">
                    <Mail className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">Email</span>
                  </button>
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left">
                    <Link className="h-5 w-5" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">Copy Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            style={{ background: "var(--gradient-bg)" }}
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  )
}

export default CredentialDetailModal
