'use client';

import { Header } from "./Header"
import { SkipLink } from "./SkipLink"
import { Footer } from "./Footer"
import { WhatsAppButton } from "./WhatsAppButton"
import { CookieConsent } from "./CookieConsent"
import { ReactNode } from "react"

import { usePathname } from "next/navigation"

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin') || pathname === '/login'

  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-[#060B12] flex flex-col relative">
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <CookieConsent position="bottom" theme="dark" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col relative">
      <SkipLink />
      <Header />
      {/* Spacer to push content below fixed header */}
      <div className="h-20 w-full shrink-0" aria-hidden="true" />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating WhatsApp Button - visible on all pages */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <WhatsAppButton
          message="Hello! I'm interested in heavy equipment spare parts."
          phoneNumber="966570196677"
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        />
      </div>

      {/* Cookie Consent Banner */}
      <CookieConsent position="bottom" theme="dark" />
    </div>
  )
}
