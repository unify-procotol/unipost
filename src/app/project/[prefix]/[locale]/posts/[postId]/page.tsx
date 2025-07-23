import { getPost, getProject } from "@/lib/data";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import BackButton from "@/components/ui/back-button";
import SafeImage from "@/components/ui/safe-image";
import SubscribeButton from "@/components/subscribe-button";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefix: string; locale: string; postId: string }>;
}): Promise<Metadata> {
  const { prefix, locale, postId } = await params;

  try {
    const [post, project] = await Promise.all([
      getPost(postId),
      getProject(prefix)
    ]);

    if (!post || !project) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found.",
      };
    }

    // Get the content for the current locale from i18n field
    const localizedContent = post.i18n?.[locale];
    const originalData = post.data;

    if (!localizedContent && !originalData) {
      return {
        title: "Content Not Available",
        description: "This post is not available in the requested language.",
      };
    }

    const title = localizedContent?.title || originalData?.title || "Untitled Post";
    const excerpt = localizedContent?.desc || originalData?.excerpt || "";
    const featureImage = originalData?.feature_image;

    return {
      title: `${title} - ${project.name}`,
      description: excerpt,
      openGraph: {
        title: title,
        description: excerpt,
        type: "article",
        locale: locale,
        alternateLocale: project.locales.filter(loc => loc !== locale),
        images: featureImage ? [
          {
            url: featureImage,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : undefined,
        publishedTime: post.data?.published_at,
        modifiedTime: post.data?.updated_at,
        tags: post.data?.tags?.map((tag: { name: string }) => tag.name) || [],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: excerpt,
        images: featureImage ? [featureImage] : undefined,
      },
      alternates: {
        languages: Object.fromEntries(
          project.locales.map(loc => [
            loc,
            `/project/${prefix}/${loc}/posts/${postId}`
          ])
        ),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the post.",
    };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ prefix: string; locale: string; postId: string }>;
}) {
  const { prefix, locale, postId } = await params;

  try {
    const [post, project] = await Promise.all([
      getPost(postId),
      getProject(prefix)
    ]);

    if (!post || !project) {
      notFound();
    }

    // Validate locale
    if (!project.locales.includes(locale)) {
      notFound();
    }

    // Get the content for the current locale, fallback to original
    const localizedContent = post.i18n?.[locale];
    const originalData = post.data;

    const title = localizedContent?.title || originalData?.title || "Untitled Post";
    const publishedAt = originalData?.published_at;
    const featureImage = originalData?.feature_image;
    const excerpt = localizedContent?.desc || originalData?.excerpt || "";
    const html = localizedContent?.content || originalData?.html || "";

    // Format date
    const formattedDate = publishedAt 
      ? new Date(publishedAt).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : "";

    // Clean and prepare content for display
    const displayContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '');

    return (
      <MainLayout>
        <Container className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <BackButton 
                href={`/project/${prefix}/${locale}/posts`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Posts
              </BackButton>
            </div>

            <article className="prose prose-lg prose-invert max-w-none">
              {/* Article Header */}
              <header className="mb-12">
                {featureImage && (
                  <div className="mb-8 rounded-2xl overflow-hidden">
                    <SafeImage
                      src={featureImage}
                      alt={title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    {title}
                  </h1>

                  {excerpt && (
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {excerpt}
                    </p>
                  )}

                  {formattedDate && (
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <time dateTime={publishedAt}>
                        {formattedDate}
                      </time>
                      <span>•</span>
                      <span>{project.name}</span>
                    </div>
                  )}
                </div>
              </header>

              <div className="space-y-8">
                {/* Article Content */}
                <div
                  className="article-content max-w-none text-lg text-gray-300 leading-relaxed mb-12"
                  dangerouslySetInnerHTML={{
                    __html: displayContent
                  }}
                />

                {/* Newsletter Subscription */}
                <div className="border-t border-gray-700/50 pt-8">
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Stay Updated
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Subscribe to get the latest posts from {project.name} delivered to your inbox.
                        </p>
                      </div>
                      <SubscribeButton 
                        project={project} 
                        locale={locale} 
                        variant="primary"
                        size="md"
                      />
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
    console.error("Error loading post:", error);
    notFound();
  }
}
