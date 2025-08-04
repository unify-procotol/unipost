"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PublicProjectEntity } from "@/entities/public-project";
import HeaderLanguageSwitcher from "../../header-language-switcher";
import SubscribeButton from "../../subscribe-button";

interface MimoHeaderProps {
  project?: PublicProjectEntity | null;
  locale?: string;
  isPostDetail?: boolean;
}

export default function MimoHeader({
  project,
  locale = "en",
  isPostDetail = false,
}: MimoHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items for reuse in both desktop and mobile
  const navigationItems = (
    <>
      {/* Only show Projects link when not in a project */}
      {!project && (
        <Link
          href="/"
          className="block px-3 py-3 text-base font-medium transition-colors text-white hover:bg-white/10 md:inline-block md:px-3 md:py-2 md:rounded-md"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Projects
        </Link>
      )}

      {/* Custom Project Navigation */}
      {project?.config?.nav && project.config.nav.length > 0 && (
        <>
          {project.config.nav.map((navItem, index) =>
            navItem.name && navItem.link ? (
              <a
                key={index}
                href={navItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-3 text-base font-medium transition-colors text-white hover:bg-white/10 md:inline-block md:px-3 md:py-2 md:rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navItem.name}
              </a>
            ) : null
          )}
        </>
      )}
    </>
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: "#00E100" }}
    >
      {/* Background Image - Only show if not in post detail */}
      {!isPostDetail && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/mimo_header.png)" }}
        ></div>
      )}

      <div
        className={`relative z-10 flex flex-col h-full ${
          isPostDetail ? "min-h-[64px]" : "min-h-[500px] md:min-h-[670px]"
        }`}
      >
        {/* Top Navigation */}
        <header className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-12 md:h-16">
              {/* Left: Logo and Navigation */}
              <div className="flex items-center space-x-4 md:space-x-8">
                {/* Logo and Brand - Only show in post detail with mimo logo */}
                {isPostDetail && (
                  <Link href="/mimo" className="flex items-center space-x-2">
                    <Image
                      src="/images/mimo_logo.png"
                      alt="Mimo Logo"
                      width={120}
                      height={36}
                      className="max-h-[28px] md:max-h-[36px] w-auto"
                    />
                  </Link>
                )}

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-4">
                  {navigationItems}
                </nav>
              </div>

              {/* Right: User Actions */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Desktop Subscribe Button */}
                <div className="hidden sm:block">
                  {project?.has_subscription && (
                    <SubscribeButton
                      project={project}
                      locale={locale}
                      variant="outline"
                      size="sm"
                      className="bg-white text-green-500 hover:bg-gray-100 border-white"
                    />
                  )}
                </div>
                
                {/* Desktop Language Switcher */}
                <div className="hidden md:block">
                  <HeaderLanguageSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                  aria-label="Toggle mobile menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>


          </div>
        </header>

        {/* Main Hero Section - Only show if not in post detail */}
        {!isPostDetail && (
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto">
              {/* Main Logo */}
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <Image
                  src="/images/mimo_logo.png"
                  alt="Mimo Logo"
                  width={400}
                  height={120}
                  className="max-h-[80px] md:max-h-[120px] w-auto"
                  priority
                />
              </div>

              {/* Tagline */}
              <p className="text-white/90 text-lg md:text-xl lg:text-[24px] px-4">
                Thoughts, stories and ideas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[80px] left-0 right-0 z-50 md:hidden">
          <div className="bg-green-500/95 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-3 space-y-1">
                {navigationItems}
                
                {/* Mobile Language Switcher */}
                <div className="px-3 py-3 border-t border-white/10 mt-3">
                  <div className="text-white text-sm font-medium mb-2">Language</div>
                  <div className="[&>*]:text-white [&_button]:text-white [&_select]:text-white">
                    <HeaderLanguageSwitcher />
                  </div>
                </div>
                
                {/* Mobile Subscribe Button */}
                {project?.has_subscription && (
                  <div className="px-3 py-3 border-t border-white/10">
                    <SubscribeButton
                      project={project}
                      locale={locale}
                      variant="outline"
                      size="sm"
                      className="w-full bg-white text-green-500 hover:bg-gray-100 border-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
