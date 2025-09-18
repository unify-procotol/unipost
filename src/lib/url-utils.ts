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
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Special handling for different environments and prefixes
  const isLocalhost = origin.includes("localhost");
  const isUniLabsOrg = origin.includes("https://unipost.uni-labs.org");
  const isRenderTest = origin.includes("https://unipost-test-only.onrender.com");
  
  // For localhost and internal domains, use normal prefix routing
  if (isLocalhost || isUniLabsOrg || isRenderTest) {
    const basePath = `/${prefix}`;
    if (locale === "en") {
      return `${origin}${basePath}`;
    } else {
      return `${origin}${basePath}/${locale}`;
    }
  }

  // For external domains, map to specific external URLs
  if (prefix === "iotex") {
    if (locale === "en") {
      return "https://iotex.io/blog/";
    } else {
      return `https://iotex.io/blog/${locale}/`;
    }
  }
  
  if (prefix === "mimo") {
    if (locale === "en") {
      return "https://mimo.exchange/blog/";
    } else {
      return `https://mimo.exchange/blog/${locale}/`;
    }
  }

  // Fallback to prefix routing for other cases
  const basePath = `/${prefix}`;
  if (locale === "en") {
    return `${origin}${basePath}`;
  } else {
    return `${origin}${basePath}/${locale}`;
  }
}
