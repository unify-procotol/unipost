"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useProject } from "@/hooks/use-project";

export default function HeaderLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { project, loading, fetchProject } = useProject();

  // Extract prefix and locale from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const prefix = pathSegments[0]; // /[prefix]/...

  // State for current locale and page type
  const [currentLocale, setCurrentLocale] = useState<string>("en");
  const [pageType, setPageType] = useState<"project" | "article">("project");
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (prefix && prefix !== 'undefined') {
      fetchProject(prefix);
    }
  }, [prefix, fetchProject]);

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
    }
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
  const isMimo = project.prefix === 'mimo';

  return (
    <div className="flex items-center gap-2">
      <svg className={`w-4 h-4 ${isMimo ? 'text-white/80' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <div className="flex gap-1">
        {project.locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            title={`Switch to ${locale.toUpperCase()}`}
            className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
              locale === currentLocale
                ? isMimo
                  ? "bg-white shadow-sm font-semibold"
                  : "bg-blue-600 text-white shadow-sm"
                : isMimo
                  ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                  : "bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 hover:text-gray-900 border border-gray-300/50"
            }`}
            style={
              locale === currentLocale && isMimo
                ? { color: '#00E100' }
                : undefined
            }
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
