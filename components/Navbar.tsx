"use client";

import Link from "next/link";
import { ChevronLeft, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { t } from "@/lib/translations";

interface NavbarProps {
  langCode: string;
  translations: any;
  showBack?: boolean;
  backUrl?: string;
  title?: string;
  className?: string;
}

export default function Navbar({
  langCode,
  translations,
  showBack = true,
  backUrl = "/",
  title,
  className = "",
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    {
      href: `/${langCode}/about`,
      icon: "👋",
      label: t(translations, "site.about.title", "About Us"),
      variant: "ghost" as const,
      className: "bg-white/10 hover:bg-white/20",
    },
    {
      href: "/",
      icon: Globe,
      label: t(translations, "common.changeLanguage", "Change Language"),
      variant: "ghost" as const,
    },
    {
      href: "/admin/dashboard",
      icon: null,
      label: t(translations, "site.admin.access", "Admin"),
      variant: "primary" as const,
    },
  ];

  return (
    <header
      className={`bg-[#304674] text-white shadow-md sticky top-0 z-50 ${className}`}
      role="banner"
    >
      <div className="mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left - Back Button */}
          <div className="flex items-center flex-1 min-w-0">
            {showBack ? (
              <Link
                href={backUrl}
                className="inline-flex items-center gap-2 text-white hover:text-[#c6d3e3] focus:outline-none focus:ring-2 focus:ring-white/50 px-2 py-1 rounded-md transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">
                  {t(translations, "common.back", "Back")}
                </span>
              </Link>
            ) : (
              <div className="w-[40px]" aria-hidden="true" />
            )}
          </div>

          {/* Center - Title */}
          {title && (
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white truncate">
                {title}
              </h1>
            </div>
          )}

          {/* Right - Desktop Nav */}
          <div className="hidden md:flex items-center justify-end space-x-4 flex-1">
            {navLinks.map(({ href, icon: Icon, label, variant, className: linkClassName }, idx) =>
              variant === "primary" ? (
                <Link
                  key={idx}
                  href={href}
                  className="bg-white text-[#304674] font-semibold px-4 py-2 rounded-md hover:bg-[#c6d3e3] transition"
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={idx}
                  href={href}
                  className={`inline-flex items-center text-white hover:text-[#c6d3e3] px-3 py-2 rounded-md transition-all ${linkClassName || ''}`}
                >
                  {typeof Icon === 'string' ? (
                    <span className="text-xl mr-1.5">{Icon}</span>
                  ) : (
                    Icon && <Icon className="w-5 h-5 mr-1.5" />
                  )}
                  <span className="font-medium">{label}</span>
                </Link>
              )
            )}
          </div>

          {/* Mobile - Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              className="text-white hover:text-[#c6d3e3] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-[#304674] pt-2 pb-3 space-y-1 border-t border-white/20">
            {navLinks.map(({ href, icon: Icon, label, variant, className: linkClassName }, idx) =>
              variant === "primary" ? (
                <Link
                  key={idx}
                  href={href}
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-4 py-2 bg-white text-[#304674] rounded-md font-semibold hover:bg-[#c6d3e3] transition"
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={idx}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-2 text-white hover:text-[#c6d3e3] hover:bg-white/10 rounded-md transition ${linkClassName || ''}`}
                >
                  {typeof Icon === 'string' ? (
                    <span className="text-xl mr-2">{Icon}</span>
                  ) : (
                    Icon && <Icon className="w-5 h-5 mr-2" />
                  )}
                  {label}
                </Link>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
