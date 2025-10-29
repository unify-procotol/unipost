/**
 * Utility functions for managing project-specific favicons
 */

export interface FaviconConfig {
  href: string;
  type?: string;
  sizes?: string;
}

/**
 * Get favicon configuration for a specific project
 * @param prefix - Project prefix (mimo, iotex, depinscan)
 * @returns Favicon configuration
 */
export function getProjectFavicon(prefix: string): FaviconConfig {
  const faviconMap: Record<string, FaviconConfig> = {
    mimo: {
      href: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : ''}/images/mimo_icon.svg`,
      type: 'image/svg+xml',
    },
    iotex: {
      href: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : ''}/images/iotex_icon.svg`,
      type: 'image/svg+xml',
    },
    depinscan: {
      href: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : ''}/images/depinscan_icon.svg`,
      type: 'image/svg+xml'
    },
    iopay: {
      href: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : ''}/images/iopay_icon.svg`,
      type: 'image/svg+xml'
    }
  };
  // Return project-specific favicon or default to iotex
  return faviconMap[prefix] || faviconMap.iotex;
}

/**
 * Generate favicon icons array for Next.js metadata
 * @param prefix - Project prefix
 * @returns Array of favicon configurations for metadata
 */
export function generateFaviconIcons(prefix: string) {
  const favicon = getProjectFavicon(prefix);
  
  return [
    {
      url: favicon.href,
      type: favicon.type,
      sizes: favicon.sizes
    }
  ];
}