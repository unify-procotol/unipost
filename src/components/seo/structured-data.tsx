interface ArticleData {
  title: string;
  description: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author: string;
  url: string;
  language: string;
}

interface StructuredDataProps {
  type: 'website' | 'article' | 'organization';
  data: ArticleData | Record<string, unknown>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          "@type": "WebSite",
          name: "UniPost",
          description: "Multilingual content management platform with Ghost CMS integration and AI translation",
          url: "https://unipost.uni-labs.org",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://unipost.uni-labs.org/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          publisher: {
            "@type": "Organization",
            name: "UniPost",
            logo: {
              "@type": "ImageObject",
              url: "https://unipost.uni-labs.org/logo.png"
            }
          }
        };

      case 'article':
        const articleData = data as ArticleData;
        return {
          ...baseData,
          "@type": "Article",
          headline: articleData.title,
          description: articleData.description,
          image: articleData.image,
          datePublished: articleData.publishedTime,
          dateModified: articleData.modifiedTime,
          author: {
            "@type": "Organization",
            name: articleData.author
          },
          publisher: {
            "@type": "Organization",
            name: "UniPost",
            logo: {
              "@type": "ImageObject",
              url: "https://unipost.uni-labs.org/logo.png"
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleData.url
          },
          inLanguage: articleData.language,
          isPartOf: {
            "@type": "WebSite",
            name: "UniPost",
            url: "https://unipost.uni-labs.org"
          }
        };

      case 'organization':
        return {
          ...baseData,
          "@type": "Organization",
          name: "UniPost",
          description: "Multilingual content management platform with Ghost CMS integration and AI translation",
          url: "https://unipost.uni-labs.org",
          logo: "https://unipost.uni-labs.org/logo.png",
          sameAs: [
            "https://twitter.com/unipost",
            "https://github.com/unipost"
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Chinese", "Spanish", "French", "German", "Japanese", "Korean"]
          }
        };

      default:
        return baseData;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
