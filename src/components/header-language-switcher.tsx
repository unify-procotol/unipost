"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useProject } from "@/hooks/use-project";

export default function HeaderLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { project, loading, fetchProject } = useProject();

  // Extract prefix and locale from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const prefix = pathSegments[1]; // /project/[prefix]/[locale]/...
  const currentLocale = pathSegments[2];

  useEffect(() => {
    if (prefix && prefix !== 'undefined') {
      fetchProject(prefix);
    }
  }, [prefix, fetchProject]);

  const handleLanguageChange = (locale: string) => {
    if (locale !== currentLocale && project) {
      // Reconstruct the current path with new locale
      const newPathSegments = [...pathSegments];
      newPathSegments[2] = locale; // Replace locale (now at index 2)
      const newPath = '/' + newPathSegments.join('/');
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

  return (
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 hover:text-gray-900 border border-gray-300/50"
            }`}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
