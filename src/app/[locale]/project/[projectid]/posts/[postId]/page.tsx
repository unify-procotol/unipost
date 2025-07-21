import { getPost, getProject } from "@/lib/data";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import BackButton from "@/components/ui/back-button";
import SafeImage from "@/components/ui/safe-image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; projectid: string; postId: string }>;
}): Promise<Metadata> {
  const { locale, projectid: projectId, postId } = await params;

  try {
    const [post, project] = await Promise.all([
      getPost(postId),
      getProject(projectId)
    ]);

    if (!post || !project) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found.",
      };
    }

    const displayTitle = post?.i18n?.[locale]?.title || post?.title;
    const excerpt = post?.i18n?.[locale]?.desc || post.data?.excerpt || "";
    const cover = post.data?.feature_image || "";
    const publishedAt = post.data?.published_at || post.created_at;

    const languageNames: Record<string, string> = {
      en: "English",
      zh: "Chinese",
      es: "Spanish",
      fr: "French",
      de: "German",
      ja: "Japanese",
      ko: "Korean",
    };

    const currentLanguage = languageNames[locale] || locale.toUpperCase();

    return {
      title: displayTitle,
      description: excerpt || `Read this article from ${project.name} in ${currentLanguage}. Multilingual content powered by UniPost.`,
      keywords: [
        displayTitle,
        project.name,
        currentLanguage,
        "multilingual article",
        "blog post",
        ...project.locales
      ],
      authors: [{ name: project.name }],
      openGraph: {
        title: displayTitle,
        description: excerpt || `Read this article from ${project.name} in ${currentLanguage}.`,
        type: "article",
        locale: locale === "zh" ? "zh_CN" : `${locale}_${locale.toUpperCase()}`,
        alternateLocale: project.locales
          .filter(loc => loc !== locale)
          .map(loc => loc === "zh" ? "zh_CN" : `${loc}_${loc.toUpperCase()}`),
        publishedTime: publishedAt,
        siteName: project.name,
        images: cover ? [
          {
            url: cover,
            width: 1200,
            height: 630,
            alt: displayTitle,
          }
        ] : undefined,
      },
      twitter: {
        title: displayTitle,
        description: excerpt || `Read this article from ${project.name} in ${currentLanguage}.`,
        images: cover ? [cover] : undefined,
        card: cover ? "summary_large_image" : "summary",
      },
      alternates: {
        languages: Object.fromEntries(
          project.locales.map(loc => [
            loc,
            `/${loc}/project/${projectId}/posts/${postId}`
          ])
        ),
      },
    };
  } catch {
    return {
      title: "Article - UniPost",
      description: "Multilingual content management platform",
    };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; projectid: string; postId: string }>;
}) {
  const { locale, projectid: projectId, postId } = await params;

  try {
    const [post, project] = await Promise.all([
      getPost(postId),
      getProject(projectId)
    ]);

    if (!post || !project) {
      notFound();
    }

    const displayTitle = post?.i18n?.[locale]?.title || post?.title;
    const displayContent = post?.i18n?.[locale]?.content || post?.content || "";
    const cover = post.data?.feature_image || "";
    const publishedAt = post.data?.published_at || post.created_at;
    const excerpt = post?.i18n?.[locale]?.desc || post.data?.excerpt || "";

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <MainLayout>
        {/* Fixed Header */}
        <div className="bg-gray-900 border-b border-gray-700">
          <Container className="py-6">
            <BackButton className="inline-flex items-center gap-2 p-2 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to posts
            </BackButton>
          </Container>
        </div>

        {/* Article Content */}
        <div className="min-h-screen">
          <Container size="md" className="py-12">
            <article className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              {/* Featured Image */}
              {cover && (
                <div className="aspect-video w-full">
                  <SafeImage
                    src={cover}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8 lg:p-12">
                {/* Header */}
                <header className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                    {displayTitle}
                  </h1>

                  {excerpt && (
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                      {excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-b border-gray-700/50 pb-6">
                    {publishedAt && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Published {formatDate(publishedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>ID: {post.id}</span>
                    </div>
                    {post.slug && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>Slug: {post.slug}</span>
                      </div>
                    )}
                  </div>
                </header>

                {/* Article Content */}
                <div
                  className="article-content max-w-none text-lg text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: displayContent
                  }}
                />
              </div>
            </article>
          </Container>
        </div>
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Failed to load post</h3>
            <p className="text-gray-400">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
}
