/**
 * Generate article URL based on locale
 * @param prefix - Project prefix
 * @param locale - Current locale
 * @param slug - Article slug
 * @returns Proper URL path
 */
export function generateArticleUrl(prefix: string, locale: string, slug: string): string {
  if (locale === "en") {
    return `/${prefix}/${slug}`;
  }
  return `/${prefix}/${locale}/${slug}`;
}

/**
 * Generate project posts list URL based on locale
 * @param prefix - Project prefix  
 * @param locale - Current locale
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string): string {
  if (locale === "en") {
    return `/${prefix}`;
  }
  return `/${prefix}/${locale}`;
}