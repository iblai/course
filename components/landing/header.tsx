"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[var(--accent-color)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-brand-primary">ibl.ai Wink</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#courses"
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              Courses
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#instructors"
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              Instructors
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-brand-primary">
              Log In
            </Button>
            <Button size="sm" className="bg-brand-gradient hover:opacity-90 text-white">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent-blue transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border-color)]">
            <nav className="flex flex-col gap-4">
              <Link
                href="#courses"
                className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
              >
                Courses
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
              >
                Benefits
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#instructors"
                className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
              >
                Instructors
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border-color)]">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[var(--border-color)] text-text-secondary"
                >
                  Log In
                </Button>
                <Button className="w-full bg-brand-gradient text-white">Sign Up</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
