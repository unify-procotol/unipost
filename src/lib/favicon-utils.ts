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
      href: '/mimo_icon.svg',
      type: 'image/svg+xml',
    },
    iotex: {
      href: '/iotex_icon.svg',
      type: 'image/svg+xml',
    },
    depinscan: {
      href: '/depinscan_icon.svg',
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