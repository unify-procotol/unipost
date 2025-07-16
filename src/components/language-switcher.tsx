"use client";

import { useRouter } from "next/navigation";

interface LanguageSwitcherProps {
  locales: string[];
  currentLocale: string;
  projectId: string;
  basePath?: string; // Optional base path, defaults to posts
}

export default function LanguageSwitcher({ 
  locales, 
  currentLocale, 
  projectId, 
  basePath = "posts" 
}: LanguageSwitcherProps) {
  const router = useRouter();

  const handleLanguageChange = (locale: string) => {
    if (locale !== currentLocale) {
      router.push(`/${locale}/project/${projectId}/${basePath}`);
    }
  };

  if (locales.length <= 1) {
    return null; // Don't show switcher if only one language
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="text-sm font-medium text-gray-300">Language:</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              locale === currentLocale
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/50"
            }`}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
