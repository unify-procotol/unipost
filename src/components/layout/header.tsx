"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderLanguageSwitcher from "../header-language-switcher";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UP</span>
              </div>
              <span className="text-xl font-bold text-white">UniPost</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Projects
              </Link>
            </nav>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center space-x-4">
            <HeaderLanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
