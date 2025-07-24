/**
 * SEO utility functions for generating optimized meta content
 */

/**
 * Generate an optimized meta description from content
 * @param content - The main content (HTML or plain text)
 * @param fallback - Fallback description if content is empty
 * @param maxLength - Maximum length of the description (default: 160)
 * @returns Optimized meta description
 */
export function generateMetaDescription(
  content: string,
  fallback: string = '',
  maxLength: number = 160
): string {
  if (!content && !fallback) return '';
  
  // Use fallback if content is empty
  if (!content) {
    return truncateText(fallback, maxLength);
  }

  // Strip HTML tags and clean up the content
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[\r\n]+/g, ' ') // Replace line breaks with spaces
    .trim();

  if (!cleanContent) {
    return truncateText(fallback, maxLength);
  }

  return truncateText(cleanContent, maxLength);
}

/**
 * Truncate text to specified length while preserving word boundaries
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If we can find a space to break on, use it
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  // Otherwise, just truncate at the limit
  return truncated + '...';
}

/**
 * Generate optimized title for SEO
 * @param title - Main title
 * @param siteName - Site name to append
 * @param separator - Separator between title and site name
 * @param maxLength - Maximum length of the title
 * @returns Optimized title
 */
export function generateSEOTitle(
  title: string,
  siteName: string = 'UniPost',
  separator: string = ' | ',
  maxLength: number = 60
): string {
  if (!title) return siteName;
  
  const fullTitle = `${title}${separator}${siteName}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  // If full title is too long, try without site name
  if (title.length <= maxLength) {
    return title;
  }
  
  // If even the title alone is too long, truncate it
  return truncateText(title, maxLength - separator.length - siteName.length) + separator + siteName;
}

/**
 * Extract keywords from content
 * @param content - Content to extract keywords from
 * @param tags - Existing tags to include
 * @param maxKeywords - Maximum number of keywords to return
 * @returns Array of keywords
 */
export function extractKeywords(
  content: string,
  tags: string[] = [],
  maxKeywords: number = 10
): string[] {
  const keywords = new Set(tags);
  
  if (!content) return Array.from(keywords).slice(0, maxKeywords);
  
  // Clean content and extract potential keywords
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split into words and filter
  const words = cleanContent.split(' ')
    .filter(word => 
      word.length > 3 && // Minimum length
      word.length < 20 && // Maximum length
      !isStopWord(word) // Not a stop word
    );
  
  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Sort by frequency and add to keywords
  const sortedWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, maxKeywords - keywords.size);
  
  sortedWords.forEach(word => keywords.add(word));
  
  return Array.from(keywords).slice(0, maxKeywords);
}

/**
 * Check if a word is a stop word (common words to exclude from keywords)
 * @param word - Word to check
 * @returns True if it's a stop word
 */
function isStopWord(word: string): boolean {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'this', 'that', 'these', 'those', 'i',
    'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is',
    'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'will', 'would', 'should', 'could', 'can', 'may',
    'might', 'must', 'shall', 'should', 'ought'
  ]);
  
  return stopWords.has(word);
}

/**
 * Generate Open Graph image URL for dynamic content
 * @param title - Title for the image
 * @param subtitle - Subtitle for the image
 * @returns URL for dynamically generated OG image
 */
export function generateOGImageURL(
  title: string,
  subtitle?: string
): string {
  const params = new URLSearchParams({
    title: title,
    ...(subtitle && { subtitle }),
  });
  
  return `/api/og?${params.toString()}`;
}

/**
 * Calculate reading time for content
 * @param content - Content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  if (!content) return 0;
  
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate structured data for breadcrumbs
 * @param items - Breadcrumb items
 * @returns Structured data object
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": item.url })
    }))
  };
}