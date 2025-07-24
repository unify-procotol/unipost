import Link from "next/link";
import HeaderLanguageSwitcher from "../header-language-switcher";
import { PublicProjectEntity } from "@/entities/public-project";

interface HeaderProps {
  project?: PublicProjectEntity | null;
}

export default function Header({ project }: HeaderProps) {

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
              <span className="text-xl font-bold text-white">
                {project ? project.name : "UniPost"}
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Only show Projects link when not in a project */}
              {!project && (
                <Link
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-gray-800/50"
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
                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-blue-400 hover:text-blue-300 hover:bg-gray-800/50"
                      >
                        {navItem.name}
                      </a>
                    ) : null
                  ))}
                </>
              )}
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
