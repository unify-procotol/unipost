import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ProjectEntity } from "@/entities/project";
import { PublicProjectEntity } from "@/entities/public-project";

interface HeaderLanguageSwitcherProps {
  project?: ProjectEntity | PublicProjectEntity | null;
  loading?: boolean;
}

export default function HeaderLanguageSwitcher({
  project,
  loading = false,
}: HeaderLanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract locale and project from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // Check different route formats
  const isOldRouteFormat = project && project.prefix === firstSegment;
  const isNewRouteFormat = project && project.locales.includes(firstSegment);
  const isBlogRouteFormat = firstSegment === "blog"; // /blog or /blog/slug
  const isLocalizedBlogFormat = pathSegments.length >= 2 && project && project.locales.includes(firstSegment) && pathSegments[1] === "blog"; // /[locale]/blog or /[locale]/blog/slug
  
  // Determine current locale
  let currentLocale = "en";
  if (isNewRouteFormat) {
    currentLocale = firstSegment;
  } else if (isLocalizedBlogFormat) {
    currentLocale = firstSegment;
  } else if (isOldRouteFormat || isBlogRouteFormat) {
    currentLocale = "en"; // These routes are always English
  }
  
  // Determine page type and slug based on path structure
  let pageType: "project" | "article" = "project";
  let slug: string | null = null;
  
  if (isNewRouteFormat) {
    // New format: /[locale]/[project] or /[locale]/[project]/[slug]
    pageType = pathSegments.length === 3 ? "article" : "project";
    slug = pathSegments.length === 3 ? pathSegments[2] : null;
  } else if (isLocalizedBlogFormat) {
    // Format: /[locale]/blog or /[locale]/blog/[slug]
    pageType = pathSegments.length === 3 ? "article" : "project";
    slug = pathSegments.length === 3 ? pathSegments[2] : null;
  } else if (isBlogRouteFormat) {
    // Format: /blog or /blog/[slug]
    pageType = pathSegments.length === 2 ? "article" : "project";
    slug = pathSegments.length === 2 ? pathSegments[1] : null;
  } else if (isOldRouteFormat) {
    // Old format: /[project] or /[project]/[slug]
    pageType = pathSegments.length === 2 ? "article" : "project";
    slug = pathSegments.length === 2 ? pathSegments[1] : null;
  }
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref for dropdown container to handle outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generateLanguageUrl = (locale: string) => {
    if (!project) return "#";
    
    // Detect if we're in a rewrite environment (actual project domain)
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const isLocalhost = origin.includes("localhost");
    const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
    const isRenderTest = origin.includes("unipost-test-only.onrender.com");
    const isDirectAccess = isLocalhost || isUniLabsOrg || isRenderTest;
    
    let url: string;
    
    if (pageType === "project") {
      // Project page
      if (isDirectAccess) {
        // Direct access: use project prefix
        if (locale === "en") {
          url = `/${project.prefix}`;
        } else {
          url = `/${locale}/${project.prefix}`;
        }
      } else {
        // Rewrite environment: use /blog
        if (locale === "en") {
          url = `/blog`;
        } else {
          url = `/${locale}/blog`;
        }
      }
    } else {
      // Article page
      if (isDirectAccess) {
        // Direct access: use project prefix
        if (locale === "en") {
          url = `/${project.prefix}/${slug}`;
        } else {
          url = `/${locale}/${project.prefix}/${slug}`;
        }
      } else {
        // Rewrite environment: use /blog
        if (locale === "en") {
          url = `/blog/${slug}`;
        } else {
          url = `/${locale}/blog/${slug}`;
        }
      }
    }
    
    // Ensure all URLs end with /
    if (!url.endsWith('/')) {
      url += '/';
    }
    
    // Preserve current query parameters
    const currentQuery = searchParams.toString();
    if (currentQuery) {
      url += `?${currentQuery}`;
    }
    
    return url;
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
      vi: "Tiếng Việt",
      pt: "Português",
      id: "Indonesia",
    };
    return languageNames[locale] || locale.toUpperCase();
  };

  // Don't show if not in a project context
  if (!project) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-600 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
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
  const isMimo = project?.prefix === "mimo";

  return (
    <div className="flex items-center gap-2">
      <svg
        className={`w-4 h-4 ${isMimo ? "text-white/80" : "text-gray-600"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>

      {/* Language Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 min-w-[80px] ${
            isMimo
              ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              : "bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 hover:text-gray-900 border border-gray-300/50"
          }`}
          title="Switch language"
        >
          <span className={isMimo ? "text-white" : "text-gray-700"}>
            {getLanguageDisplayName(currentLocale)}
          </span>
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            } ${isMimo ? "text-white/80" : "text-gray-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className={`absolute top-full left-0 mt-1 min-w-[120px] rounded-md shadow-lg z-50 ${
              isMimo
                ? "bg-white border border-gray-200"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="py-1">
              {project.locales.map((locale) => (
                <Link
                  key={locale}
                  href={generateLanguageUrl(locale)}
                  onClick={() => setIsDropdownOpen(false)}
                  className={`cursor-pointer w-full text-left px-3 py-2 text-xs font-medium transition-colors duration-150 block ${
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
                      <svg
                        className={`w-3 h-3 ${
                          isMimo ? "text-green-600" : "text-blue-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
