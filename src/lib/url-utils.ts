/**
 * Generate article URL based on locale
 * @param prefix - Project prefix
 * @param locale - Current locale
 * @param slug - Article slug
 * @returns Proper URL path
 */
export function generateArticleUrl(
  prefix: string,
  locale: string,
  slug: string
): string {
  // Check if we're in production with rewrite (has /blog in path) or accessed through rewrite
  let basePath = `/${prefix}`;
  if (typeof window !== "undefined") {
    if (window.location.pathname.includes("/blog1")) {
      basePath = "/blog1";
    } else if (window.location.pathname.includes("/blog")) {
      basePath = "/blog";
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (locale === "en") {
    return `${origin}${basePath}/${slug}/`;
  }
  return `${origin}${basePath}/${locale}/${slug}/`;
}

/**
 * Generate project posts list URL based on locale
 * @param prefix - Project prefix
 * @param locale - Current locale
 * @param currentUrl - Optional current URL to extract base path from
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string, currentUrl?: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Check if we're in production with rewrite (has /blog in path) or accessed through rewrite
  let basePath = `/${prefix}`;
  
  // Use provided currentUrl or window location to detect rewrite
  const urlToCheck = currentUrl || (typeof window !== "undefined" ? window.location.href : "");
  if (urlToCheck) {
    if (urlToCheck.includes("/blog1")) {
      basePath = "/blog1";
    } else if (urlToCheck.includes("/blog")) {
      basePath = "/blog";
    }
  }

  let url: string;
  if (locale === "en") {
    url = `${origin}${basePath}`;
  } else {
    url = `${origin}${basePath}/${locale}`;
  }

  return url;
}
