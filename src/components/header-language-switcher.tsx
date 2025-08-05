import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ProjectEntity } from "@/entities/project";
import { PublicProjectEntity } from "@/entities/public-project";

interface HeaderLanguageSwitcherProps {
  project?: ProjectEntity | PublicProjectEntity | null;
  loading?: boolean;
}

export default function HeaderLanguageSwitcher({ project, loading = false }: HeaderLanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract prefix and locale from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const prefix = pathSegments[0]; // /[prefix]/...

  // State for current locale and page type
  const [currentLocale, setCurrentLocale] = useState<string>("en");
  const [pageType, setPageType] = useState<"project" | "article">("project");
  const [slug, setSlug] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ref for dropdown container to handle outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);



  // Determine locale and page type based on pathname and project data
  useEffect(() => {
    if (pathSegments.length === 1) {
      // /[prefix] - English project page
      setCurrentLocale("en");
      setPageType("project");
      setSlug(null);
    } else if (pathSegments.length === 2) {
      const secondSegment = pathSegments[1];
      if (project && project.locales.includes(secondSegment)) {
        // It's a locale - /[prefix]/[locale]
        setCurrentLocale(secondSegment);
        setPageType("project");
        setSlug(null);
      } else if (project) {
        // It's a slug - /[prefix]/[slug] (only if project is loaded)
        setCurrentLocale("en");
        setPageType("article");
        setSlug(secondSegment);
      }
    } else if (pathSegments.length === 3) {
      // /[prefix]/[locale]/[slug] - Non-English article page
      setCurrentLocale(pathSegments[1]);
      setPageType("article");
      setSlug(pathSegments[2]);
    }
  }, [pathSegments, project]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (locale: string) => {
    if (locale !== currentLocale && project) {
      let newPath: string;
      
      if (pageType === "project") {
        // Project page
        if (locale === "en") {
          newPath = `/${prefix}`;
        } else {
          newPath = `/${prefix}/${locale}`;
        }
      } else {
        // Article page
        if (locale === "en") {
          newPath = `/${prefix}/${slug}`;
        } else {
          newPath = `/${prefix}/${locale}/${slug}`;
        }
      }
      
      router.push(newPath);
      setIsDropdownOpen(false); // Close dropdown after selection
    }
  };

  // Get language display name
  const getLanguageDisplayName = (locale: string) => {
    const languageNames: Record<string, string> = {
      en: "English",
      zh: "中文",
      es: "Español", 
      fr: "Français",
      de: "Deutsch",
      ja: "日本語",
      ko: "한국어",
    };
    return languageNames[locale] || locale.toUpperCase();
  };

  // Don't show if not in a project context
  if (!prefix) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <div className="w-12 h-6 bg-gray-300/50 rounded animate-pulse"></div>
      </div>
    );
  }

  // Don't show if no project data or only one language
  if (!project || project.locales.length <= 1) {
    return null;
  }

  // Check if this is mimo project for different styling
  const isMimo = project?.prefix === 'mimo';

  return (
    <div className="flex items-center gap-2">
      <svg className={`w-4 h-4 ${isMimo ? 'text-white/80' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      
      {/* Language Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 min-w-[80px] ${
            isMimo
              ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              : "bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 hover:text-gray-900 border border-gray-300/50"
          }`}
          title="Switch language"
        >
          <span className={isMimo ? 'text-white' : 'text-gray-700'}>
            {getLanguageDisplayName(currentLocale)}
          </span>
          <svg 
            className={`w-3 h-3 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            } ${isMimo ? 'text-white/80' : 'text-gray-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className={`absolute top-full left-0 mt-1 min-w-[120px] rounded-md shadow-lg z-50 ${
            isMimo 
              ? 'bg-white border border-gray-200' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="py-1">
              {project.locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                    locale === currentLocale
                      ? isMimo
                        ? "bg-green-50 text-green-600 font-semibold"
                        : "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{getLanguageDisplayName(locale)}</span>
                    {locale === currentLocale && (
                      <svg className={`w-3 h-3 ${isMimo ? 'text-green-600' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
