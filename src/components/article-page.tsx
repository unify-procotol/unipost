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
import { getTranslation } from "@/lib/i18n/server";

// Markdown rendering
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface ArticlePageProps {
  prefix: string;
  slug: string;
  locale?: string;
}

export async function generateArticleMetadata({
  prefix,
  slug,
  locale = "en",
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
        canonical: generateArticleCanonicalURL(
          prefix,
          slug,
          locale !== "en" ? locale : undefined
        ),
        languages: generateAlternatesLanguagesURL(
          prefix,
          project.locales,
          slug
        ),
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
  locale = "en",
}: ArticlePageProps) {
  const { t } = getTranslation(locale);
  
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
    const title =
      localizedContent?.title || originalData?.title || "Untitled Post";
    const publishedAt = originalData?.published_at;
    const featureImage = originalData?.feature_image;
    const excerpt = localizedContent?.desc || originalData?.excerpt || "";
    const html = localizedContent?.content || originalData?.html || "";

    const dataAny = originalData as Record<string, unknown> | undefined;
    const primaryAuthor = dataAny?.primary_author as { name?: string; profile_image?: string } | undefined;
    const authors = dataAny?.authors as { name?: string; profile_image?: string }[] | undefined;
    const authorName = primaryAuthor?.name
      || authors?.[0]?.name
      || project.name;
    const authorImage = primaryAuthor?.profile_image
      || authors?.[0]?.profile_image;
    const readingTime = (dataAny?.reading_time as number)
      || Math.ceil((html.replace(/<[^>]*>/g, '').split(/\s+/).length) / 275);

    const formattedDate = publishedAt
      ? new Date(publishedAt).toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "";

    const displayContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/<a\b([^>]*)>/gi, (match, attrs) => {
        if (!attrs.includes("target=")) {
          const relMatch = attrs.match(/rel=["']([^"']*)["']/);
          if (relMatch) {
            const existingRel = relMatch[1];
            const newRel =
              existingRel.includes("noopener") &&
              existingRel.includes("noreferrer")
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
      author: authorName,
      url:
        locale !== "en"
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
            author: authorName,
            publishedDate: publishedAt,
            modifiedDate: originalData?.updated_at,
            url:
              locale !== "en"
                ? `https://unipost.uni-labs.org/${locale}/${prefix}/${slug}`
                : `https://unipost.uni-labs.org/${prefix}/${slug}`,
            imageUrl: featureImage,
            siteName: "UniPost",
            tags:
              post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
          })}
        />
        <Container className="py-8 px-4">
          <div className="max-w-[720px] mx-auto mb-6">
            <ClientBreadcrumb
              name={project.name}
              title={title}
              slug={slug}
              locale={locale}
              projectPrefix={project.prefix}
              className="mb-4"
            />
          </div>

          <article>
            <header className="max-w-[720px] mx-auto mb-8">
              <h1 className="text-[2.8rem] md:text-[3.2rem] font-bold leading-[1.15] tracking-tight mb-4" style={{ color: 'rgb(21, 23, 26)' }}>
                {title}
              </h1>

              <div className="flex items-center gap-4 mt-6">
                {authorImage && (
                  <img
                    src={authorImage}
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-medium" style={{ color: 'rgb(21, 23, 26)', fontSize: '0.95rem' }}>
                    {authorName}
                  </div>
                  {formattedDate && (
                    <div className="text-sm" style={{ color: 'rgb(128, 128, 128)' }}>
                      <time dateTime={publishedAt}>{formattedDate}</time>
                      {readingTime > 0 && <span> — {readingTime} min read</span>}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {featureImage && (
              <div className="max-w-[720px] mx-auto mb-10">
                <OptimizedImage
                  src={featureImage}
                  alt={`Featured image for article "${title}" from ${project.name}`}
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 1120px) 100vw, 1120px"
                />
              </div>
            )}

            <div className="max-w-[720px] mx-auto">
              <div
                className="ghost-content"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />

              <div className="border-t pt-16 mt-16 text-center" style={{ borderColor: 'rgb(228, 228, 228)' }}>
                <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'rgb(21, 23, 26)' }}>
                  {project.name}
                </h2>
                <p className="text-base mb-8" style={{ color: 'rgb(128, 128, 128)' }}>
                  {t('subscription.subscribeToGetLatest')} {project.name} {t('subscription.deliveredToInbox')}.
                </p>
                <div className="flex justify-center">
                  <SubscribeButton
                    project={project}
                    locale={locale}
                    variant="dark"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </article>
        </Container>
      </MainLayout>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}
