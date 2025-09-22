/**
 * Detect if we're in a rewrite environment and get the correct base path
 */
function getRewriteInfo(): { isRewrite: boolean; basePath: string } {
  if (typeof window === "undefined") return { isRewrite: false, basePath: "" };
  
  const pathname = window.location.pathname;
  
  // Check if we're accessed through a rewrite (e.g., iotex.io/blog -> /iotex)
  // In rewrite environment, the actual path doesn't contain /blog
  // But we can detect this by checking if we're on external domains
  const origin = window.location.origin;
  const isExternalDomain = !origin.includes("localhost") && 
                          !origin.includes("unipost.uni-labs.org") && 
                          !origin.includes("unipost-test-only.onrender.com");
  
  return { isRewrite: isExternalDomain, basePath: "" };
}

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
  const { isRewrite } = getRewriteInfo();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (isRewrite) {
    // In rewrite environment: iotex.io/blog -> /iotex
    // Article links should be: iotex.io/blog/:slug (blog replaces project name)
    if (locale === "en") {
      return `${origin}/blog/${slug}/`;
    }
    return `${origin}/${locale}/blog/${slug}/`;
  } else {
    // Direct access to unipost domain
    if (locale === "en") {
      return `${origin}/${prefix}/${slug}/`;
    }
    return `${origin}/${locale}/${prefix}/${slug}/`;
  }
}

/**
 * Generate project posts list URL based on locale
 * @param prefix - Project prefix
 * @param locale - Current locale
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string): string {
  const { isRewrite } = getRewriteInfo();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // In rewrite environment, use /blog path instead of project name
  if (isRewrite) {
    if (locale === "en") {
      return `${origin}/blog/`;
    } else {
      return `${origin}/${locale}/blog/`;
    }
  }

  // For direct unipost domain access
  const isLocalhost = origin.includes("localhost");
  const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
  const isRenderTest = origin.includes("unipost-test-only.onrender.com");
  
  if (isLocalhost || isUniLabsOrg || isRenderTest) {
    if (locale === "en") {
      return `${origin}/${prefix}/`;
    } else {
      return `${origin}/${locale}/${prefix}/`;
    }
  }

  // Fallback to new routing structure
  if (locale === "en") {
    return `${origin}/${prefix}/`;
  } else {
    return `${origin}/${locale}/${prefix}/`;
  }
}
