import Link from "next/link"
import Image from "next/image"
import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border-color)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-brand-primary">courseAI</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI-powered learning platform for mastering in-demand skills.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#courses"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link
                  href="#instructors"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Instructors
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">© 2025 courseAI. All rights reserved.</p>
          <p className="text-sm text-text-secondary flex items-center gap-2">
            <Link href="#" className="inline-flex items-center text-brand-primary font-medium hover:underline">
              <Image
                src="/images/iblai-logo.png"
                alt="ibl.ai"
                width={80}
                height={24}
                className="w-auto h-[18px]"
              />
            </Link>
            OS
          </p>
        </div>
      </div>
    </footer>
  )
}
