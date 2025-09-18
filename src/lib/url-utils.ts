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
  // if (typeof window !== "undefined") {
  if (window.location.pathname.includes("/blog1")) {
    basePath = "/blog1";
  } else if (window.location.pathname.includes("/blog")) {
    basePath = "/blog";
  }
  // }

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
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string): string {

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Check if we're in development environment
  const isDevelopment = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.includes("localhost") ||
     window.location.port === "3000");

  // Check if we're in production environment (unipost.uni-labs.org)
  const isProduction = typeof window !== "undefined" &&
    window.location.origin === "https://unipost.uni-labs.org";

  let basePath: string;

  if (isDevelopment || isProduction) {
    // For development or production, use the prefix path directly
    basePath = `/${prefix}`;
  } else {
    // For other environments, use /blog
    basePath = "/blog";
  }

  let url: string;
  if (locale === "en") {
    url = `${origin}${basePath}`;
  } else {
    url = `${origin}${basePath}/${locale}`;
  }

  return url;
}
