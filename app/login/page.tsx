"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FAQSection } from "@/components/sections/faq-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { WatchSection } from "@/components/sections/watch-section (3)"
import { AudienceSection } from "@/components/sections/audience-section"
import { BuiltWithWinkSection } from "@/components/sections/built-with-wink-section"
import { GoogleIcon, AppleIcon } from "@/components/auth-icons/auth-icons"
import { DollarSign, Globe, Users } from "lucide-react"

const useAuthForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handleContinue = () => {
    if (!email) {
      setEmailError("Please enter your email")
      return
    }
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email")
      return
    }
    setShowConfirmation(true)
  }

  const handlePasswordContinue = () => {
    if (!password) {
      setEmailError("Please enter your password")
      return
    }
    setShowConfirmation(true)
  }

  const handlePasswordLogin = () => {
    setShowPasswordForm(true)
  }

  const handleBackToMain = () => {
    setShowPasswordForm(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    setEmailError,
    showPassword,
    showConfirmation,
    showPasswordForm,
    handleContinue,
    handlePasswordContinue,
    handlePasswordLogin,
    handleBackToMain,
    togglePasswordVisibility,
  }
}

const useSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  const slides = [
    {
      image: "/images/slide-1.png",
      alt: "Monetize your expertise, deliver an impactful experience",
    },
    {
      image: "/images/slide-2.png",
      alt: "Successfully ran and scale an educational business",
    },
    {
      image: "/images/slide-3.png",
      alt: "Create, sell, and manage memberships",
    },
  ]

  const changeSlide = (index: number) => {
    setFadeIn(false)
    setTimeout(() => {
      setCurrentSlide(index)
      setFadeIn(true)
    }, 100)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide((currentSlide + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  return {
    currentSlide,
    fadeIn,
    slideStyles: {},
    slides,
    changeSlide,
  }
}

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const CourseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00A3EC"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
)

const MentorIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_4320_645_agents)">
      <path
        d="M33.0667 19.7243C33.0667 28.482 25.9671 35.5815 17.2094 35.5815C8.45178 35.5815 1.35229 28.482 1.35229 19.7243C1.35229 10.9667 8.45178 3.86719 17.2094 3.86719"
        stroke="#00A3EC"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.35229 19.7246H19.649" stroke="#00A3EC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17.2096 3.86719C13.5462 8.3722 11.4103 13.9255 11.1107 19.7243C11.4103 25.5231 13.5462 31.0765 17.2096 35.5815C20.0938 32.0348 22.0312 27.8382 22.8711 23.3837"
        stroke="#00A3EC"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5684 10.4934C18.6409 10.3321 18.6409 9.00064 19.5684 8.83929C22.9284 8.25475 25.6008 5.69551 26.3301 2.3639L26.386 2.10853C26.5866 1.1919 27.8919 1.18619 28.1005 2.10103L28.1684 2.39864C28.9248 5.71451 31.5978 8.25216 34.9486 8.83509C35.8808 8.99726 35.8808 10.3354 34.9486 10.4976C31.5978 11.0805 28.9248 13.6182 28.1684 16.934L28.1005 17.2317C27.8919 18.1465 26.5866 18.1408 26.386 17.2242L26.3301 16.9688C25.6008 13.6372 22.9284 11.078 19.5684 10.4934Z"
        stroke="#00A3EC"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_4320_645_agents">
        <rect width="37" height="37" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00A3EC"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="7" x="3" y="3" rx="1" />
    <rect width="9" height="7" x="3" y="14" rx="1" />
    <rect width="5" height="7" x="16" y="14" rx="1" />
  </svg>
)

const InsightsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00A3EC"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

export default function AuthPage() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  /** Match reference auth: avoid first-paint squeeze before layout measurement. */
  const [viewportHeight, setViewportHeight] = useState(720)
  const focusEmail = () => {
    const el = document.getElementById("auth-email") as HTMLInputElement | null
    el?.focus()
  }

  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    setEmailError,
    showPassword,
    showConfirmation,
    showPasswordForm,
    handleContinue,
    handlePasswordContinue,
    handlePasswordLogin,
    handleBackToMain,
    togglePasswordVisibility,
  } = useAuthForm()

  const { currentSlide, fadeIn, slides, changeSlide } = useSlides()

  useLayoutEffect(() => {
    const updateViewport = () => {
      const isMobile = window.innerWidth <= 768
      const newViewportHeight = isMobile
        ? Math.min(window.screen.height * 0.85, 650)
        : window.innerHeight
      setViewportHeight(newViewportHeight)
    }

    updateViewport()

    const handleResize = () => {
      if (window.innerWidth > 768) {
        updateViewport()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getResponsiveSizes = () => {
    const maxHeight = Math.min(viewportHeight, 730)
    const isSmallScreen = maxHeight < 600
    const isMediumScreen = maxHeight >= 600 && maxHeight < 700

    return {
      containerHeight: maxHeight,
      logoHeight: isSmallScreen ? "h-6" : isMediumScreen ? "h-8" : "h-10",
      titleSize: isSmallScreen ? "text-2xl" : isMediumScreen ? "text-2xl" : "text-2xl",
      subtitleSize: isSmallScreen ? "text-base" : isMediumScreen ? "text-base" : "text-base",
      controlTextSize: isSmallScreen ? "text-sm" : isMediumScreen ? "text-base" : "text-base",
      buttonHeight: isSmallScreen ? "h-9" : isMediumScreen ? "h-10" : "h-12",
      inputHeight: isSmallScreen ? "h-9" : isMediumScreen ? "h-10" : "h-12",
      spacing: isSmallScreen ? "space-y-3" : isMediumScreen ? "space-y-4" : "space-y-5",
      padding: isSmallScreen ? "p-3" : isMediumScreen ? "p-4" : "p-6",
      iconSize: isSmallScreen ? "w-4 h-4" : isMediumScreen ? "w-5 h-5" : "w-6 h-6",
      maxFormWidth: "max-w-[31rem]",
      maxPasswordFormWidth: "max-w-[28rem]",
    }
  }

  const sizes = getResponsiveSizes()

  const scrollToWatch = () => {
    const isMobile = window.innerWidth < 1280
    const targetSection = isMobile
      ? document.getElementById("mobile-slides-section")
      : document.getElementById("faq-section")

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing-section")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToFAQ = () => {
    const faqSection = document.getElementById("faq-section")
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (showConfirmation) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            localStorage.setItem("isAuthenticated", "true")
            router.push("/home")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [showConfirmation, router])

  return (
    <div className="w-full">
      <div className="flex w-full flex-col xl:flex-row xl:min-h-[100dvh] xl:h-[100dvh] overflow-hidden">
        {/* Left Column - Auth Form */}
        <div
          className={cn(
            "flex w-full flex-col xl:w-1/2 xl:h-full xl:min-h-0",
            showConfirmation && "xl:min-h-[100dvh]",
            showConfirmation && "max-xl:min-h-[100dvh]"
          )}
        >
          <div
            className={cn(
              "flex flex-col min-h-0 px-4 pt-[calc(1.75rem+env(safe-area-inset-top,0px))] pb-0 sm:px-6 sm:pt-[calc(2rem+env(safe-area-inset-top,0px))] md:px-4 lg:px-6 xl:overflow-hidden overflow-y-auto scrollbar-hide xl:min-h-0 xl:pt-[calc(2.25rem+env(safe-area-inset-top,0px))]",
              showConfirmation ? "xl:flex-1 xl:min-h-0" : "xl:flex-1",
              showConfirmation && "max-xl:flex-1"
            )}
          >
            {/* Logo Section — reference auth column spacing */}
            <div className="flex justify-center flex-shrink-0 mt-6 md:mt-3 xl:mt-0 xl:mb-7">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/skillsAI-logo.webp"
                  alt="ibl.ai Wink"
                  width={50}
                  height={50}
                  className={`${sizes.logoHeight} w-auto`}
                />
                <span
                  className={`${sizes.titleSize} font-bold bg-gradient-to-r from-[#38A1E5] to-[#0078FF] bg-clip-text text-transparent`}
                >
                  ibl.ai Wink
                </span>
              </div>
            </div>

            <div
              className={cn(
                "flex flex-col items-center mt-[2px] min-h-0 pt-0 xl:pt-0",
                showConfirmation && "xl:flex-1 xl:min-h-0 xl:justify-center",
                showConfirmation && "max-xl:flex-1 max-xl:justify-center"
              )}
            >
              {!showConfirmation && (
                <div className="text-center -mt-1 w-full">
                  <div className="space-y-2 mt-[50px] mb-[50px] xl:mt-[10px]">
                    <h1 className="text-2xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl text-[#4E5460] leading-tight font-normal max-w-lg mx-auto">
                      Turn what you know
                      <br />
                      into a school that pays you
                    </h1>
                    <p
                      className={cn(
                        "mx-auto mt-1 max-w-lg px-1 leading-snug text-gray-600",
                        "text-sm xl:text-base",
                      )}
                    >
                      <span className="xl:hidden">
                        <span className="block">Wink builds your courses,</span>
                        <span className="block">your brand, and your platform —</span>
                        <span className="block">powered by AI that actually understands teaching.</span>
                      </span>
                      <span className="hidden xl:block">
                        Wink builds your courses, your brand, and your platform —{" "}
                        <br />
                        powered by AI that actually understands teaching.
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {!showConfirmation ? (
                <>
                  {!showPasswordForm ? (
                    <div
                      className={`rounded-[0.70rem] border-[0.25px] border-[rgba(115,185,255,0.3)] bg-[#F5F8FF] ${sizes.padding} shadow-[0_0.125rem_1.25rem_0.3125rem_rgba(115,185,255,0.23)] w-full ${sizes.maxFormWidth}`}
                    >
                      <div className={`flex flex-col justify-between ${sizes.spacing}`}>
                        <div className="w-full">
                          <Input
                            id="auth-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              if (emailError) setEmailError("")
                            }}
                            className={`${sizes.inputHeight} rounded-md ${sizes.controlTextSize} ${emailError ? "border-2 border-blue-500" : "border-gray-200"}`}
                          />
                          {emailError && (
                            <p style={{ color: "#0078FF", fontSize: "0.7rem", marginTop: "0.25rem" }}>{emailError}</p>
                          )}
                        </div>

                        <Button
                          className={`w-full ${sizes.buttonHeight} bg-gradient-to-r from-[#BACEFF] to-[#0078FF] hover:from-[#A9BDFF] hover:to-[#0069E0] text-white rounded-md ${sizes.controlTextSize}`}
                          onClick={handleContinue}
                        >
                          Continue
                        </Button>

                        <div className={`text-center text-gray-500 ${sizes.controlTextSize} py-1`}>OR</div>

                        <Button
                          variant="outline"
                          className={`w-full ${sizes.buttonHeight} flex items-center justify-center gap-1 border border-gray-200 rounded-md ${sizes.controlTextSize}`}
                        >
                          <GoogleIcon />
                          Continue with Google
                        </Button>

                        <Button
                          variant="outline"
                          className={`w-full ${sizes.buttonHeight} flex items-center justify-center gap-1 border border-gray-200 rounded-md ${sizes.controlTextSize}`}
                        >
                          <AppleIcon />
                          Continue with Apple
                        </Button>

                        <Button
                          variant="outline"
                          className={`w-full ${sizes.buttonHeight} flex items-center justify-center gap-1 border border-gray-200 rounded-md ${sizes.controlTextSize}`}
                          onClick={handlePasswordLogin}
                        >
                          <svg width="1.25rem" height="1.25rem" viewBox="0 -960 960 960" fill="#383838">
                            <path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-58-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-58-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-58-34 60Z"></path>
                          </svg>
                          Continue with Password
                        </Button>

                        <div className="w-full text-center">
                          <div className="text-xs text-gray-500">
                            <Link href="/terms" className="hover:underline">
                              Terms of Use
                            </Link>
                            <span className="mx-2">|</span>
                            <Link href="/privacy" className="hover:underline">
                              Privacy Policy
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-[0.70rem] border-[0.25px] border-[rgba(115,185,255,0.3)] bg-[#F5F8FF] ${sizes.padding} shadow-[0_0.125rem_1.25rem_0.3125rem_rgba(115,185,255,0.23)] w-full ${sizes.maxPasswordFormWidth}`}
                    >
                      <div className={`flex flex-col justify-between ${sizes.spacing}`}>
                        <div className="w-full">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              if (emailError) setEmailError("")
                            }}
                            className={`${sizes.inputHeight} rounded-md text-base ${emailError ? "border-2 border-blue-500" : "border-gray-200"}`}
                          />
                        </div>

                        <div className="w-full relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              if (emailError) setEmailError("")
                            }}
                            className={`${sizes.inputHeight} rounded-md ${sizes.controlTextSize} ${emailError ? "border-2 border-blue-500" : "border-gray-200"}`}
                          />
                          {password.length > 0 && (
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                          )}
                        </div>
                        {emailError && (
                          <p style={{ color: "#0078FF", fontSize: "0.7rem", marginTop: "0.25rem" }}>{emailError}</p>
                        )}

                        <Button
                          className={`w-full ${sizes.buttonHeight} bg-gradient-to-r from-[#BACEFF] to-[#0078FF] hover:from-[#A9BDFF] hover:to-[#0069E0] text-white rounded-md ${sizes.controlTextSize}`}
                          onClick={handlePasswordContinue}
                        >
                          Continue
                        </Button>

                        <div className="flex justify-center w-full">
                          <button
                            onClick={handleBackToMain}
                            className="flex items-center text-blue-400 hover:text-blue-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`${sizes.iconSize} mr-1`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className={`text-blue-400 ${sizes.controlTextSize}`}>Back</span>
                          </button>
                        </div>

                        <div className="w-full text-center">
                          <div className="text-xs text-gray-500">
                            <Link href="/terms" className="hover:underline">
                              Terms of Use
                            </Link>
                            <span className="mx-2">|</span>
                            <Link href="/privacy" className="hover:underline">
                              Privacy Policy
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center shrink-0 min-h-0 py-4 px-4 sm:px-6">
                  <div className="mb-4">
                    <Image
                      src="/images/email-verify-icon.png"
                      alt="Email Sent"
                      width={viewportHeight < 600 ? 60 : 80}
                      height={viewportHeight < 600 ? 60 : 80}
                      className="mx-auto block"
                    />
                  </div>
                  <h2 className={`${sizes.titleSize} font-medium text-gray-800 mb-3`}>
                    We sent you a magic link to log in!
                  </h2>
                  <p className="text-gray-600 mb-1 text-base">
                    We sent an email to you at <span className="font-medium text-[#0078FF] break-all">{email}</span>.
                  </p>
                  <p className="text-gray-600 text-base">Click the link in the email to log in to your account.</p>
                  <p className="text-gray-500 mt-3 mb-[40px] text-base">
                    Redirecting to onboarding in <span className="font-medium text-[#0078FF]">{countdown}</span>{" "}
                    seconds...
                  </p>
                </div>
              )}
            </div>

            {!showConfirmation && (
              <div className="w-full pt-[5vh] pb-[5vh]">
                <div className="mx-auto flex w-full max-w-md min-w-0 flex-row items-stretch justify-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("watch-section")?.scrollIntoView({ behavior: "smooth" })}
                    className={`min-w-0 flex-1 border-[#0078FF] text-[#0078FF] hover:bg-[#0078FF]/10 sm:flex-none sm:w-auto ${sizes.controlTextSize}`}
                  >
                    See it in action
                  </Button>
                  <Button
                    type="button"
                    onClick={focusEmail}
                    className={`min-w-0 flex-1 bg-gradient-to-r from-[#BACEFF] to-[#0078FF] hover:from-[#A9BDFF] hover:to-[#0069E0] text-white sm:flex-none sm:w-auto ${sizes.controlTextSize}`}
                  >
                    Start free
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — structure/styles from reference AuthPage; copy & 3 slides unchanged */}
        <div className="m-4 hidden w-full flex-col rounded-lg bg-blue-50 xl:flex xl:h-[calc(100vh-2rem)] xl:min-h-0 xl:w-1/2">
          <div className="flex h-full flex-col p-6">
            <div className="mb-7 flex w-full flex-shrink-0 justify-center">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/images/skillsAI-logo.webp"
                  alt="ibl.ai Wink"
                  width={50}
                  height={50}
                  className={`${sizes.logoHeight} w-auto`}
                />
              </div>
            </div>

            <div className="mt-4 flex w-full flex-shrink-0 justify-center">
              <div className="flex w-[30rem] items-center gap-3 rounded-[0.70rem] rounded-lg border-[0.25px] border-[rgba(115,185,255,0.3)] bg-[#F5F8FF] p-4 shadow-[0_0.125rem_1.25rem_0.3125rem_rgba(115,185,255,0.23)]">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {currentSlide === 0 && <DollarSign className="h-5 w-5" strokeWidth={2} />}
                    {currentSlide === 1 && <Globe className="h-5 w-5" strokeWidth={2} />}
                    {currentSlide === 2 && <Users className="h-5 w-5" strokeWidth={2} />}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium leading-relaxed text-gray-600">
                    {currentSlide === 0 && "Monetize your expertise, deliver an impactful experience"}
                    {currentSlide === 1 && "Successfully ran and scale an educational business"}
                    {currentSlide === 2 && "Create, sell, and manage memberships"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
              <div
                className={`flex h-full w-full max-w-4xl items-center justify-center px-3 transition-opacity duration-200 ease-in-out ${
                  fadeIn ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex h-full w-full items-center justify-center p-4">
                  <div
                    className="flex h-full max-h-full w-full max-w-full cursor-pointer items-center justify-center px-1"
                    role="button"
                    tabIndex={0}
                    onClick={() => changeSlide((currentSlide + 1) % slides.length)}
                    onKeyDown={(e) => e.key === "Enter" && changeSlide((currentSlide + 1) % slides.length)}
                  >
                    {currentSlide === 0 ? (
                      <Image
                        src="/images/slide-1.png"
                        alt="Monetize your expertise, deliver an impactful experience"
                        width={680}
                        height={400}
                        className="h-full max-h-full w-full rounded-lg object-contain"
                        priority
                        unoptimized
                      />
                    ) : currentSlide === 1 ? (
                      <Image
                        src="/images/slide-2.png"
                        alt="Successfully ran and scale an educational business"
                        width={680}
                        height={400}
                        className="h-full max-h-full w-full rounded-lg object-contain"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/images/slide-3.png"
                        alt="Create, sell, and manage memberships"
                        width={680}
                        height={400}
                        className="h-full max-h-full w-full rounded-lg object-contain"
                        unoptimized
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-shrink-0 justify-center gap-1 pb-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-blue-500" : "bg-gray-300"}`}
                  onClick={() => changeSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Mobile/Tablet Slides Section */}
      {!showConfirmation && (
      <div id="mobile-slides-section" className="w-full bg-blue-50 px-4 py-12 xl:hidden">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex w-full justify-center">
            <Image
              src="/images/skillsAI-logo.webp"
              alt="ibl.ai Wink"
              width={50}
              height={50}
              className="h-12 w-auto"
            />
          </div>

          <div className="mb-6 flex w-full justify-center">
            <div className="flex w-full max-w-md items-center gap-3 rounded-[0.70rem] rounded-lg border-[0.25px] border-[rgba(115,185,255,0.3)] bg-[#F5F8FF] p-4 shadow-[0_0.125rem_1.25rem_0.3125rem_rgba(115,185,255,0.23)]">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {currentSlide === 0 && <DollarSign className="h-5 w-5" strokeWidth={2} />}
                  {currentSlide === 1 && <Globe className="h-5 w-5" strokeWidth={2} />}
                  {currentSlide === 2 && <Users className="h-5 w-5" strokeWidth={2} />}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-relaxed text-gray-600 sm:text-base">
                  {currentSlide === 0 && "Monetize your expertise, deliver an impactful experience"}
                  {currentSlide === 1 && "Successfully ran and scale an educational business"}
                  {currentSlide === 2 && "Create, sell, and manage memberships"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full mb-8">
            <div
              className={`w-full max-w-3xl transition-opacity duration-200 ease-in-out ${fadeIn ? "opacity-100" : "opacity-0"}`}
            >
              <div className="w-full flex items-center justify-center">
                <div
                  className="relative w-fit max-w-full cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => changeSlide((currentSlide + 1) % slides.length)}
                  onKeyDown={(e) => e.key === "Enter" && changeSlide((currentSlide + 1) % slides.length)}
                >
                  {currentSlide === 0 ? (
                    <Image
                      src="/images/slide-1.png"
                      alt="Monetize your expertise, deliver an impactful experience"
                      width={680}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto max-h-[500px] block"
                      priority
                      unoptimized
                    />
                  ) : currentSlide === 1 ? (
                    <Image
                      src="/images/slide-2.png"
                      alt="Successfully ran and scale an educational business"
                      width={680}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto max-h-[500px] block"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src="/images/slide-3.png"
                      alt="Create, sell, and manage memberships"
                      width={680}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto max-h-[500px] block"
                      unoptimized
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${index === currentSlide ? "bg-blue-500" : "bg-gray-300"}`}
                onClick={() => changeSlide(index)}
              />
            ))}
          </div>
          </div>
        </div>
      </div>
      )}

      {!showConfirmation && (
        <>
          <WatchSection />
          <AudienceSection />
          <PricingSection />
          <BuiltWithWinkSection />
          <FAQSection />
        </>
      )}
    </div>
  )
}