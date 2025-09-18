/**
 * Detect if the request is coming through a rewrite (server-side only)
 * @param request - The request object or headers
 * @returns Whether the request is through rewrite
 */
export function detectRewrite(request?: any): boolean {
  // Server-side detection using headers
  if (typeof window === "undefined" && request) {
    try {
      // Check for common rewrite indicators
      const host = request.headers?.get?.("host") || request.headers?.host;
      const referer = request.headers?.get?.("referer") || request.headers?.referer;
      const userAgent = request.headers?.get?.("user-agent") || request.headers?.["user-agent"];

      // If host is not our main domain, likely a rewrite
      if (host && !host.includes("unipost.uni-labs.org") && !host.includes("localhost")) {
        return true;
      }

      // Check referer for external domains
      if (referer && !referer.includes("unipost.uni-labs.org") && !referer.includes("localhost")) {
        return true;
      }
    } catch (error) {
      // Fallback to false if detection fails
      return false;
    }
  }

  return false;
}

/**
 * Generate article URL based on locale
 * @param prefix - Project prefix
 * @param locale - Current locale
 * @param slug - Article slug
 * @param isRewrite - Whether accessed through rewrite
 * @returns Proper URL path
 */
export function generateArticleUrl(
  prefix: string,
  locale: string,
  slug: string,
  isRewrite?: boolean
): string {
  // Check if we're in production with rewrite (has /blog in path) or accessed through rewrite
  let basePath = `/${prefix}`;

  // If server-side detected rewrite, use /blog
  if (isRewrite) {
    basePath = "/blog";
  } else if (typeof window !== "undefined") {
    // Client-side detection for backward compatibility
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
 * @param isRewrite - Whether accessed through rewrite (server-side detection)
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string, isRewrite?: boolean): string {

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Check if we're in production with rewrite (has /blog in path) or accessed through rewrite
  let basePath = `/${prefix}`;

  // If server-side detected rewrite, use /blog
  if (isRewrite) {
    basePath = "/blog";
  } else if (typeof window !== "undefined") {
    // Client-side detection for backward compatibility
    if (window.location.pathname.includes("/blog1")) {
      basePath = "/blog1";
    } else if (window.location.pathname.includes("/blog")) {
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
