import { getPostBySlug, getProject } from "@/lib/data";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import { ClientBreadcrumb } from "@/components/seo/breadcrumb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
  generateAlternatesLanguagesURL,
} from "@/lib/seo-utils";
import { generateFaviconIcons } from "@/lib/favicon-utils";
import { getGhostPost } from "@/lib/ghost";
import { PostEntity } from "@/entities/post";

interface ArticlePageProps {
  prefix: string;
  slug: string;
  locale?: string;
}

export async function generateArticleMetadata({
  prefix,
  slug,
  locale = "en"
}: ArticlePageProps): Promise<Metadata> {
  try {
    const project = await getProject(prefix);
    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
        icons: generateFaviconIcons(prefix),
      };
    }

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
    const title = localizedContent?.title || originalData?.title || "Untitled Post";
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
        canonical: generateArticleCanonicalURL(prefix, slug, locale !== "en" ? locale : undefined),
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the page.",
      icons: generateFaviconIcons(prefix),
    };
  }
}

export default async function ArticlePage({
  prefix,
  slug,
  locale = "en"
}: ArticlePageProps) {
  try {
    const project = await getProject(prefix);
    if (!project) {
      notFound();
    }

    let post = await getPostBySlug(slug);
    if (!post) {
      const ghostPost = await getGhostPost(prefix, slug);
      if (!ghostPost) {
        notFound();
      }
      post = {
        data: ghostPost,
        i18n: { en: ghostPost.html },
        project_id: project.id,
        slug: slug,
        created_at: ghostPost.published_at,
        updated_at: ghostPost.updated_at,
        feature_image: ghostPost.feature_image,
        tags: ghostPost.tags,
        published_at: ghostPost.published_at,
      } as unknown as PostEntity;
    }

    const localizedContent = post.i18n?.[locale];
    const originalData = post.data;
    const title = localizedContent?.title || originalData?.title || "Untitled Post";
    const publishedAt = originalData?.published_at;
    const featureImage = originalData?.feature_image;
    const excerpt = localizedContent?.desc || originalData?.excerpt || "";
    const html = localizedContent?.content || originalData?.html || "";

    const formattedDate = publishedAt
      ? new Date(publishedAt).toLocaleDateString('en-US', {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    const displayContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/<a\b([^>]*)>/gi, (match, attrs) => {
        if (!attrs.includes('target=')) {
          const relMatch = attrs.match(/rel=["']([^"']*)["']/);
          if (relMatch) {
            const existingRel = relMatch[1];
            const newRel = existingRel.includes('noopener') && existingRel.includes('noreferrer')
              ? existingRel
              : `${existingRel} noopener noreferrer`.trim();
            attrs = attrs.replace(/rel=["'][^"']*["']/, `rel="${newRel}"`);
          } else {
            attrs += ' rel="noopener noreferrer"';
          }
          return `<a${attrs} target="_blank">`;
        }
        return match;
      });

    const articleStructuredData = {
      title,
      description: excerpt,
      image: featureImage,
      publishedTime: publishedAt,
      modifiedTime: originalData?.updated_at,
      author: project.name,
      url: locale !== "en" 
        ? `https://unipost.uni-labs.org/${locale}/${prefix}/${slug}`
        : `https://unipost.uni-labs.org/${prefix}/${slug}`,
      language: locale,
    };

    return (
      <MainLayout project={project} locale={locale} isPostDetail={true}>
        <StructuredData type="article" data={articleStructuredData} />
        <JsonLd
          data={generateArticleJsonLd({
            title,
            description: excerpt,
            author: project.name,
            publishedDate: publishedAt,
            modifiedDate: originalData?.updated_at,
            url: locale !== "en"
              ? `https://unipost.uni-labs.org/${locale}/${prefix}/${slug}`
              : `https://unipost.uni-labs.org/${prefix}/${slug}`,
            imageUrl: featureImage,
            siteName: "UniPost",
            tags: post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
          })}
        />
        <Container className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <ClientBreadcrumb name={project.name} title={title} slug={slug} className="mb-4" />
            </div>

            <article className="prose prose-lg max-w-none">
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
                <div
                  className="article-content max-w-none text-lg text-gray-700 leading-relaxed mb-12"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />

                <div className="border-t border-gray-300/50 pt-8">
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-300/30">
                    <div className="text-center space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Stay Updated
                        </h3>
                        <p className="text-gray-600 text-sm max-w-md mx-auto">
                          Subscribe to get the latest posts from {project.name} delivered to your inbox.
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
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}