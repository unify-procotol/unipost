/**
 * Generate article URL based on locale
 * @param prefix - Project prefix
 * @param locale - Current locale
 * @param slug - Article slug
 * @returns Proper URL path
 */
export function generateArticleUrl(prefix: string, locale: string, slug: string): string {
  // Check if we're in production with rewrite (has /blog in path) or accessed through rewrite
  let basePath = `/${prefix}`;
  if (typeof window !== 'undefined') {
    // Direct access with /blog in path
    if (window.location.pathname.includes('/blog1')) {
      basePath = '/blog1';
    } else if (window.location.pathname.includes('/blog')) {
      basePath = '/blog';
    }
    // Check if we're on a different domain (rewrite scenario)
    else if (window.location.hostname !== 'unipost.uni-labs.org' && 
             window.location.hostname !== 'unipost-test-only.onrender.com' &&
             window.location.hostname !== 'localhost') {
      // This is a rewrite scenario, use /blog as base path
      basePath = '/blog';
    }
  }
  // const basePath = hasBlogPath ? '/blog' : `/${prefix}`;
  
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  if (locale === "en") {
    return `${origin}${basePath}/${slug}`;
  }
  return `${origin}${basePath}/${locale}/${slug}`;
}

/**
 * Generate project posts list URL based on locale
 * @param prefix - Project prefix  
 * @param locale - Current locale
 * @returns Proper URL path
 */
export function generateProjectUrl(prefix: string, locale: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Check if we're on a different domain (rewrite scenario)
  let basePath = `/${prefix}`;
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'unipost.uni-labs.org' && 
        window.location.hostname !== 'unipost-test-only.onrender.com' &&
        window.location.hostname !== 'localhost') {
      // This is a rewrite scenario, use /blog as base path
      basePath = '/blog';
    }
  }
  
  let url: string;
  if (locale === "en") {
    url = `${origin}${basePath}`;
  } else {
    url = `${origin}${basePath}/${locale}`;
  }
  
  // Ensure trailing slash for SEO
  if (!url.endsWith('/')) {
    url += '/';
  }
  
  return url;
}