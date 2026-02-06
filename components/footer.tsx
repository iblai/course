"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ibl.ai. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  )
}
