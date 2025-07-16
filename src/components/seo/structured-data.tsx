interface StructuredDataProps {
  type: 'website' | 'article' | 'organization';
  data: any;
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
          url: "https://unipost.app",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://unipost.app/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          publisher: {
            "@type": "Organization",
            name: "UniPost",
            logo: {
              "@type": "ImageObject",
              url: "https://unipost.app/logo.png"
            }
          }
        };

      case 'article':
        return {
          ...baseData,
          "@type": "Article",
          headline: data.title,
          description: data.description,
          image: data.image,
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime,
          author: {
            "@type": "Organization",
            name: data.author
          },
          publisher: {
            "@type": "Organization",
            name: "UniPost",
            logo: {
              "@type": "ImageObject",
              url: "https://unipost.app/logo.png"
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": data.url
          },
          inLanguage: data.language,
          isPartOf: {
            "@type": "WebSite",
            name: "UniPost",
            url: "https://unipost.app"
          }
        };

      case 'organization':
        return {
          ...baseData,
          "@type": "Organization",
          name: "UniPost",
          description: "Multilingual content management platform with Ghost CMS integration and AI translation",
          url: "https://unipost.app",
          logo: "https://unipost.app/logo.png",
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
