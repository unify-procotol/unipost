"use client";

import { generatePostDetailBreadcrumbs } from "@/lib/breadcrumb-utils";
import Link from "next/link";
import { useState, useEffect } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const ClientBreadcrumb = ({
  className = "",
  name,
  title,
  slug,
}: {
  name: string;
  title: string;
  slug: string;
  className?: string;
}) => {
  const [referer, setReferer] = useState('');
  
  useEffect(() => {
    // Update referer when component mounts or when URL changes
    const updateReferer = () => {
      if (typeof window !== 'undefined') {
        setReferer(window.location.href);
      }
    };
    
    updateReferer();
    
    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', updateReferer);
    
    
    // Monitor for URL changes by checking periodically
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && window.location.href !== referer) {
        updateReferer();
      }
    }, 100);
    
    return () => {
      window.removeEventListener('popstate', updateReferer);
      clearInterval(intervalId);
    };
  }, [referer]);
  
  return (
    <Breadcrumb
      items={generatePostDetailBreadcrumbs(name, title, slug, referer)}
      className={className}
    />
  );
};

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const generateStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: item.href ? `https://unipost.uni-labs.org${item.href}` : undefined,
      })),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    );
  };

  return (
    <>
      {generateStructuredData()}
      <nav className={`flex ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 md:space-x-2 min-w-0">
          {items.map((item, index) => (
            <li
              key={index}
              className={`inline-flex items-center ${
                index >= 2 ? "min-w-0 flex-shrink" : "flex-shrink-0"
              }`}
            >
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}

              {item.current ? (
                <span
                  className={`text-gray-600 text-sm font-medium inline-flex items-center ${
                    index >= 2 ? "min-w-0" : "whitespace-nowrap"
                  }`}
                  aria-current="page"
                  title={index >= 2 ? item.label : undefined}
                >
                  {index === 0 && (
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  )}
                  <span
                    className={index >= 2 ? "truncate" : "whitespace-nowrap"}
                  >
                    {item.label}
                  </span>
                </span>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors ${
                    index >= 2 ? "min-w-0" : "whitespace-nowrap"
                  }`}
                  title={index >= 2 ? item.label : undefined}
                >
                  {index === 0 && (
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  )}
                  <span
                    className={index >= 2 ? "truncate" : "whitespace-nowrap"}
                  >
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
