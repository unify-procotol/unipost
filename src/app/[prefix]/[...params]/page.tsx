import { getPaginatedPosts, getProject, getPostBySlug } from "@/lib/data";
import PostsPageWrapper from "@/components/posts-page-wrapper";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import Breadcrumb, { ClientBreadcrumb } from "@/components/seo/breadcrumb";
import {
  generateProjectPostsBreadcrumbs
} from "@/lib/breadcrumb-utils";
import { notFound, redirect } from "next/navigation";
import { PaginationQuerySchema } from "@/types/pagination";
import type { Metadata } from "next";
import { detectRewrite } from "@/lib/url-utils";
import { headers } from "next/headers";

// Post detail page components
import SubscribeButton from "@/components/subscribe-button";
import StructuredData from "@/components/seo/structured-data";
import JsonLd, { generateArticleJsonLd } from "@/components/seo/json-ld";
import OptimizedImage from "@/components/seo/optimized-image";
import {
  generateMetaDescription,
  generateSEOTitle,
  extractKeywords,
  generateOGImageURL,
  generateArticleCanonicalURL,
  generateProjectDescription,
  generateAlternatesLanguagesURL,
} from "@/lib/seo-utils";
import { generateFaviconIcons } from "@/lib/favicon-utils";

// ISR Cache: 1 day for article pages and localized project pages
// This covers both article content (changes rarely) and project pages (acceptable delay)
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefix: string; params: string[] }>;
}): Promise<Metadata> {
  const { prefix, params: routeParams } = await params;

  try {
    const project = await getProject(prefix);
    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
        icons: generateFaviconIcons(prefix),
      };
    }

    // Case 1: Single parameter - could be locale or slug
    if (routeParams.length === 1) {
      const param = routeParams[0];
      // Check if it's a valid locale
      if (project.locales.includes(param)) {
        const locale = param;

        // It's a locale - generate project page metadata
        const languageNames: Record<string, string> = {
          en: "English",
          zh: "Chinese",
          es: "Spanish",
          fr: "French",
          de: "German",
          ja: "Japanese",
          ko: "Korean",
        };

        const languageName = languageNames[locale] || locale.toUpperCase();

        return {
          title: `${project.name} - ${languageName} Posts`,
          description: generateProjectDescription(prefix, project.name),
          icons: generateFaviconIcons(prefix),
          openGraph: {
            title: `${project.name} - ${languageName} Posts`,
            description: generateProjectDescription(prefix, project.name),
            type: "website",
            locale: locale,
            alternateLocale: project.locales.filter((loc) => loc !== locale),
            siteName: project.name,
          },
          twitter: {
            card: "summary_large_image",
            title: `${project.name} - ${languageName} Posts`,
            description: generateProjectDescription(prefix, project.name),
            images: ["/og-image.png"],
          },
          alternates: {
            languages: generateAlternatesLanguagesURL(prefix, project.locales),
          },
        };
      } else {
        // It's a slug - generate article page metadata with default locale (en)
        const slug = param;
        const locale = "en";
        const post = await getPostBySlug(slug);
        if (!post) {
          return {
            title: "Post Not Found",
            description: "The requested post could not be found.",
            icons: generateFaviconIcons(prefix),
          };
        }

        const localizedContent = post.i18n?.[locale];
        const originalData = post.data;
        const title =
          localizedContent?.title || originalData?.title || "Untitled Post";
        const excerpt = localizedContent?.desc || originalData?.excerpt || "";
        const content = localizedContent?.content || originalData?.html || "";
        const featureImage = originalData?.feature_image;

        const optimizedDescription = generateMetaDescription(
          content,
          excerpt || `Read ${title} on ${project.name}`,
          160
        );

        const optimizedTitle = generateSEOTitle(title, project.name);

        const keywords = extractKeywords(
          content,
          post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
          10
        );

        return {
          title: optimizedTitle,
          description: optimizedDescription,
          keywords: keywords.join(", "),
          icons: generateFaviconIcons(prefix),
          openGraph: {
            title: optimizedTitle,
            description: optimizedDescription,
            type: "article",
            locale: locale,
            alternateLocale: project.locales.filter((loc) => loc !== locale),
            images: [
              {
                url: featureImage || generateOGImageURL(title, project.name),
                width: 1200,
                height: 630,
                alt: `Featured image for article "${title}" from ${project.name}`,
              },
            ],
            publishedTime: post.data?.published_at,
            modifiedTime: post.data?.updated_at,
            tags:
              post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
            siteName: "UniPost",
          },
          twitter: {
            card: "summary_large_image",
            title: title,
            description: excerpt,
            images: featureImage ? [featureImage] : undefined,
          },
          alternates: {
            canonical: generateArticleCanonicalURL(prefix, slug),
            languages: generateAlternatesLanguagesURL(prefix, project.locales, slug),
          },
          robots: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
            noimageindex: true,
            nocache: true,
          },
        };
      }
    }

    // Case 2: Two parameters - locale and slug
    if (routeParams.length === 2) {
      const [locale, slug] = routeParams;

      const post = await getPostBySlug(slug);
      if (!post) {
        return {
          title: "Post Not Found",
          description: "The requested post could not be found.",
          icons: generateFaviconIcons(prefix),
        };
      }

      const localizedContent = post.i18n?.[locale];
      const originalData = post.data;
      const title =
        localizedContent?.title || originalData?.title || "Untitled Post";
      const excerpt = localizedContent?.desc || originalData?.excerpt || "";
      const content = localizedContent?.content || originalData?.html || "";
      const featureImage = originalData?.feature_image;

      const optimizedDescription = generateMetaDescription(
        content,
        excerpt || `Read ${title} on ${project.name}`,
        160
      );

      const optimizedTitle = generateSEOTitle(title, project.name);

      const keywords = extractKeywords(
        content,
        post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
        10
      );

      return {
        title: optimizedTitle,
        description: optimizedDescription,
        keywords: keywords.join(", "),
        icons: generateFaviconIcons(prefix),
        openGraph: {
          title: optimizedTitle,
          description: optimizedDescription,
          type: "article",
          locale: locale,
          alternateLocale: project.locales.filter((loc) => loc !== locale),
          images: [
            {
              url: featureImage || generateOGImageURL(title, project.name),
              width: 1200,
              height: 630,
              alt: `Featured image for article "${title}" from ${project.name}`,
            },
          ],
          publishedTime: post.data?.published_at,
          modifiedTime: post.data?.updated_at,
          tags: post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
          siteName: "UniPost",
        },
        twitter: {
          card: "summary_large_image",
          title: title,
          description: excerpt,
          images: featureImage ? [featureImage] : undefined,
        },
        alternates: {
          canonical: generateArticleCanonicalURL(prefix, slug, locale),
          languages: generateAlternatesLanguagesURL(prefix, project.locales, slug),
        },
        robots: {
          index: false,
          follow: false,
          noarchive: true,
          nosnippet: true,
          noimageindex: true,
          nocache: true,
        },
      };
    }

    // Invalid number of parameters
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
      icons: generateFaviconIcons(prefix),
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the page.",
      icons: generateFaviconIcons(prefix),
    };
  }
}

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ prefix: string; params: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { prefix, params: routeParams } = await params;
  const resolvedSearchParams = await searchParams;

  // Detect if this request is through rewrite
  const headersList = await headers();
  const isRewrite = detectRewrite({ headers: headersList });

  try {
    const project = await getProject(prefix);
    if (!project) {
      notFound();
    }

    // Case 1: Single parameter - could be locale or slug
    if (routeParams.length === 1) {
      const param = routeParams[0];

      // Check if it's a valid locale
      if (project.locales.includes(param)) {
        const locale = param;

        // It's a locale - render project posts page

        // Set default pageSize based on project prefix
        const defaultPageSize = prefix === "mimo" ? 15 : prefix === "iotex" ? 15 : 10;

        // Parse and validate pagination parameters with project-specific defaults
        const paginationResult = PaginationQuerySchema.safeParse({
          page: resolvedSearchParams.page as string,
          pageSize:
            (resolvedSearchParams.pageSize as string) ||
            defaultPageSize.toString(),
        });

        if (!paginationResult.success) {
          console.error(
            "Invalid pagination parameters:",
            paginationResult.error
          );
          redirect(`/${prefix}/${locale}`);
        }

        // Use project-specific default if no pageSize provided
        const finalPageSize = resolvedSearchParams.pageSize
          ? paginationResult.data.pageSize
          : defaultPageSize;

        // Get paginated posts
        const paginatedResult = await getPaginatedPosts(
          prefix,
          paginationResult.data.page,
          finalPageSize
        );

        return (
          <MainLayout project={project} locale={locale} isRewrite={isRewrite}>
            <div className="min-h-screen">
              <Container className="py-8 px-4">
                {/* Breadcrumb Navigation */}
                <div className="mb-8">
                  <Breadcrumb
                    items={generateProjectPostsBreadcrumbs(project.name)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  />
                </div>

                {/* Posts List */}
                <PostsPageWrapper
                  posts={paginatedResult.data}
                  locale={locale}
                  prefix={prefix}
                  pagination={paginatedResult.pagination}
                />
              </Container>
            </div>
          </MainLayout>
        );
      } else {
        // It's a slug - render article page with default locale (en)
        const slug = param;
        const locale = "en";

        const post = await getPostBySlug(slug);
        if (!post) {
          notFound();
        }

        // Get the content for the current locale, fallback to original
        const localizedContent = post.i18n?.[locale];
        const originalData = post.data;

        const title =
          localizedContent?.title || originalData?.title || "Untitled Post";
        const publishedAt = originalData?.published_at;
        const featureImage = originalData?.feature_image;
        const excerpt = localizedContent?.desc || originalData?.excerpt || "";
        const html = localizedContent?.content || originalData?.html || "";

        // Format date
        const formattedDate = publishedAt
          ? new Date(publishedAt).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";

        // Clean and prepare content for display
        const displayContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
          .replace(/javascript:/gi, "");

        // Prepare structured data for the article
        const articleStructuredData = {
          title,
          description: excerpt,
          image: featureImage,
          publishedTime: publishedAt,
          modifiedTime: originalData?.updated_at,
          author: project.name,
          url: `https://unipost.uni-labs.org/${prefix}/${slug}`,
          language: locale,
        };

        return (
          <MainLayout project={project} locale={locale} isPostDetail={true} isRewrite={isRewrite}>
            <StructuredData type="article" data={articleStructuredData} />

            <JsonLd
              data={generateArticleJsonLd({
                title,
                description: excerpt,
                author: project.name,
                publishedDate: publishedAt,
                modifiedDate: originalData?.updated_at,
                url: `https://unipost.uni-labs.org/${prefix}/${slug}`,
                imageUrl: featureImage,
                siteName: "UniPost",
                tags:
                  post.data?.tags?.map((tag: { name: string }) => tag.name) ||
                  [],
              })}
            />
            <Container className="py-8 px-4">
              <div className="max-w-4xl mx-auto">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                  <ClientBreadcrumb name={project.name} title={title} slug={slug} className="mb-4" />
                </div>

                <article className="prose prose-lg max-w-none">
                  {/* Article Header */}
                  <header className="mb-12">
                    {featureImage && (
                      <div className="mb-8 rounded-2xl overflow-hidden bg-gray-100">
                        <OptimizedImage
                          src={featureImage}
                          alt={`Featured image for article "${title}" from ${project.name}`}
                          width={1200}
                          height={630}
                          className="w-full h-auto max-h-96 object-contain"
                          priority
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                      </div>
                    )}

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        {title}
                      </h1>

                      {excerpt && (
                        <p className="text-xl text-gray-700 leading-relaxed">
                          {excerpt}
                        </p>
                      )}

                      {formattedDate && (
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                          <time dateTime={publishedAt}>{formattedDate}</time>
                          <span>•</span>
                          <span>{project.name}</span>
                        </div>
                      )}
                    </div>
                  </header>

                  <div className="space-y-8">
                    {/* Article Content */}
                    <div
                      className="article-content max-w-none text-lg text-gray-700 leading-relaxed mb-12"
                      dangerouslySetInnerHTML={{
                        __html: displayContent,
                      }}
                    />

                    {/* Newsletter Subscription */}
                    <div className="border-t border-gray-300/50 pt-8">
                      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-300/30">
                        <div className="text-center space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Stay Updated
                            </h3>
                            <p className="text-gray-600 text-sm max-w-md mx-auto">
                              Subscribe to get the latest posts from{" "}
                              {project.name} delivered to your inbox.
                            </p>
                          </div>
                          <div className="flex justify-center">
                            <SubscribeButton
                              project={project}
                              locale={locale}
                              variant="primary"
                              size="lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </Container>
          </MainLayout>
        );
      }
    }

    // Case 2: Two parameters - locale and slug
    if (routeParams.length === 2) {
      const [locale, slug] = routeParams;

      // Validate locale
      if (!project.locales.includes(locale)) {
        notFound();
      }

      const post = await getPostBySlug(slug);
      if (!post) {
        notFound();
      }

      // Get the content for the current locale, fallback to original
      const localizedContent = post.i18n?.[locale];
      const originalData = post.data;

      const title =
        localizedContent?.title || originalData?.title || "Untitled Post";
      const publishedAt = originalData?.published_at;
      const featureImage = originalData?.feature_image;
      const excerpt = localizedContent?.desc || originalData?.excerpt || "";
      const html = localizedContent?.content || originalData?.html || "";

      // Format date
      const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

      // Clean and prepare content for display
      const displayContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        .replace(/javascript:/gi, "");

      // Prepare structured data for the article
      const articleStructuredData = {
        title,
        description: excerpt,
        image: featureImage,
        publishedTime: publishedAt,
        modifiedTime: originalData?.updated_at,
        author: project.name,
        url:
          locale === "en"
            ? `https://unipost.uni-labs.org/${prefix}/${slug}`
            : `https://unipost.uni-labs.org/${prefix}/${locale}/${slug}`,
        language: locale,
      };

      return (
        <MainLayout project={project} locale={locale} isPostDetail={true} isRewrite={isRewrite}>
          <StructuredData type="article" data={articleStructuredData} />

          <JsonLd
            data={generateArticleJsonLd({
              title,
              description: excerpt,
              author: project.name,
              publishedDate: publishedAt,
              modifiedDate: originalData?.updated_at,
              url:
                locale === "en"
                  ? `https://unipost.uni-labs.org/${prefix}/${slug}`
                  : `https://unipost.uni-labs.org/${prefix}/${locale}/${slug}`,
              imageUrl: featureImage,
              siteName: "UniPost",
              tags:
                post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
            })}
          />
          <Container className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb Navigation */}
              <div className="mb-6">
                <ClientBreadcrumb name={project.name} title={title} slug={slug} className="mb-4" />
              </div>

              <article className="prose prose-lg max-w-none">
                {/* Article Header */}
                <header className="mb-12">
                  {featureImage && (
                    <div className="mb-8 rounded-2xl overflow-hidden bg-gray-100">
                      <OptimizedImage
                        src={featureImage}
                        alt={`Featured image for article "${title}" from ${project.name}`}
                        width={1200}
                        height={630}
                        className="w-full h-auto max-h-96 object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                      {title}
                    </h1>

                    {excerpt && (
                      <p className="text-xl text-gray-700 leading-relaxed">
                        {excerpt}
                      </p>
                    )}

                    {formattedDate && (
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <time dateTime={publishedAt}>{formattedDate}</time>
                        <span>•</span>
                        <span>{project.name}</span>
                      </div>
                    )}
                  </div>
                </header>

                <div className="space-y-8">
                  {/* Article Content */}
                  <div
                    className="article-content max-w-none text-lg text-gray-700 leading-relaxed mb-12"
                    dangerouslySetInnerHTML={{
                      __html: displayContent,
                    }}
                  />

                  {/* Newsletter Subscription */}
                  <div className="border-t border-gray-300/50 pt-8">
                    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-300/30">
                      <div className="text-center space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Stay Updated
                          </h3>
                          <p className="text-gray-600 text-sm max-w-md mx-auto">
                            Subscribe to get the latest posts from{" "}
                            {project.name} delivered to your inbox.
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <SubscribeButton
                            project={project}
                            locale={locale}
                            variant="primary"
                            size="lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </Container>
        </MainLayout>
      );
    }

    // Invalid number of parameters
    notFound();
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}
