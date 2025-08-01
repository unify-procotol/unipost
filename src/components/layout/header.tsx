"use client";

import Link from "next/link";
import { useState } from "react";
import HeaderLanguageSwitcher from "../header-language-switcher";
import SubscribeButton from "../subscribe-button";
import { PublicProjectEntity } from "@/entities/public-project";
import MimoHeader from "./custom-header/mimo-header";
import Image from "next/image";

interface HeaderProps {
  project?: PublicProjectEntity | null;
  locale?: string;
  isPostDetail?: boolean;
}

export default function Header({ project, locale = 'en', isPostDetail = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Switch to different header styles based on project prefix
  if (project?.prefix === 'mimo') {
    return <MimoHeader project={project} locale={locale} isPostDetail={isPostDetail} />;
  }

  // Navigation items for reuse in both desktop and mobile
  const navigationItems = (
    <>
      {/* Only show Projects link when not in a project */}
      {!project && (
        <Link
          href="/"
          className="block px-3 py-3 text-base font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 md:inline-block md:px-3 md:py-2 md:text-sm md:rounded-md"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Projects
        </Link>
      )}
      
      {/* Custom Project Navigation */}
      {project?.config?.nav && project.config.nav.length > 0 && (
        <>
          {project.config.nav.map((navItem, index) => (
            navItem.name && navItem.link ? (
              <a
                key={index}
                href={navItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-3 text-base font-medium transition-colors text-blue-600 hover:text-blue-700 hover:bg-gray-100/50 md:inline-block md:px-3 md:py-2 md:text-sm md:rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navItem.name}
              </a>
            ) : null
          ))}
        </>
      )}
    </>
  );
  
  // Default header style
  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-16">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Logo and Brand */}
              <Link href="/" className="flex items-center space-x-2">
                {project?.prefix === 'depinscan' ? (
                  <Image 
                    src="/images/depinscan_logo.svg" 
                    alt="DePINScan Logo" 
                    width={32}
                    height={32}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                ) : project?.prefix === 'iotex' ? (
                  <Image 
                    src="/images/iotex_logo.svg" 
                    alt="IoTeX Logo" 
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                ) : (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs md:text-sm">UP</span>
                  </div>
                )}
                <span className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  {project ? project.name : "UniPost"}
                </span>
              </Link>

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
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[48px] left-0 right-0 z-50 md:hidden">
          <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-3 space-y-1">
                {navigationItems}
                
                {/* Mobile Language Switcher */}
                <div className="px-3 py-3 border-t border-gray-200/50 mt-3">
                  <div className="text-gray-600 text-sm font-medium mb-2">Language</div>
                  <HeaderLanguageSwitcher />
                </div>
                
                {/* Mobile Subscribe Button */}
                {project?.has_subscription && (
                  <div className="px-3 py-3 border-t border-gray-200/50">
                    <SubscribeButton 
                      project={project} 
                      locale={locale} 
                      variant="outline"
                      size="sm"
                      className="w-full"
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
    </>
  );
}
