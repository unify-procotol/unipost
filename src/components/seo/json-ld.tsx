import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Component to inject JSON-LD structured data into the page
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

/**
 * Generate Article structured data
 */
export function generateArticleJsonLd({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  url,
  imageUrl,
  siteName,
  tags = [],
}: {
  title: string;
  description: string;
  author: string;
  publishedDate?: string;
  modifiedDate?: string;
  url: string;
  imageUrl?: string;
  siteName: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
    url: url,
    ...(publishedDate && { datePublished: publishedDate }),
    ...(modifiedDate && { dateModified: modifiedDate }),
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(tags.length > 0 && { keywords: tags }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate Blog structured data
 */
export function generateBlogJsonLd({
  name,
  description,
  url,
  posts = [],
}: {
  name: string;
  description: string;
  url: string;
  posts?: Array<{
    title: string;
    url: string;
    publishedDate?: string;
    author: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: name,
    description: description,
    url: url,
    ...(posts.length > 0 && {
      blogPost: posts.map(post => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: post.url,
        ...(post.publishedDate && { datePublished: post.publishedDate }),
        author: {
          '@type': 'Organization',
          name: post.author,
        },
      })),
    }),
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationJsonLd({
  name,
  description,
  url,
  logo,
  socialProfiles = [],
}: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  socialProfiles?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    description: description,
    url: url,
    ...(logo && {
      logo: {
        '@type': 'ImageObject',
        url: logo,
      },
    }),
    ...(socialProfiles.length > 0 && { sameAs: socialProfiles }),
  };
}

/**
 * Generate Website structured data
 */
export function generateWebsiteJsonLd({
  name,
  description,
  url,
  searchUrl,
}: {
  name: string;
  description: string;
  url: string;
  searchUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    description: description,
    url: url,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQJsonLd({
  questions,
}: {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbJsonLd({
  items,
}: {
  items: Array<{
    name: string;
    url?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}