import { getPaginatedPosts, getProject } from "@/lib/data";
import PostsPageWrapper from "@/components/posts-page-wrapper";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import BackButton from "@/components/ui/back-button";
import SubscribeButton from "@/components/subscribe-button";
import { notFound, redirect } from "next/navigation";
import { PaginationQuerySchema } from "@/types/pagination";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; prefix: string }>;
}): Promise<Metadata> {
  const { locale, prefix } = await params;

  try {
    const project = await getProject(prefix);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

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
    const supportedLanguages = project.locales.map(loc => languageNames[loc] || loc.toUpperCase()).join(", ");

    return {
      title: `${project.name} - ${currentLanguage} Posts`,
      description: `Browse multilingual posts from ${project.name}. Available in ${supportedLanguages}. Powered by UniPost multilingual content management platform.`,
      keywords: [
        project.name,
        "multilingual posts",
        "blog",
        currentLanguage,
        "content management",
        ...project.locales
      ],
      openGraph: {
        title: `${project.name} - ${currentLanguage} Posts`,
        description: `Browse multilingual posts from ${project.name}. Available in ${supportedLanguages}.`,
        type: "website",
        locale: locale === "zh" ? "zh_CN" : `${locale}_${locale.toUpperCase()}`,
        alternateLocale: project.locales
          .filter(loc => loc !== locale)
          .map(loc => loc === "zh" ? "zh_CN" : `${loc}_${loc.toUpperCase()}`),
      },
      twitter: {
        title: `${project.name} - ${currentLanguage} Posts`,
        description: `Browse multilingual posts from ${project.name}. Available in ${supportedLanguages}.`,
      },
      alternates: {
        languages: Object.fromEntries(
          project.locales.map(loc => [
            loc,
            `/${loc}/project/${prefix}/posts`
          ])
        ),
      },
    };
  } catch {
    return {
      title: "Posts - UniPost",
      description: "Multilingual content management platform",
    };
  }
}

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; prefix: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, prefix } = await params;
  const rawSearchParams = await searchParams;

  try {
    // Parse and validate pagination parameters
    const paginationParams = PaginationQuerySchema.parse({
      page: typeof rawSearchParams.page === 'string' ? rawSearchParams.page : undefined,
      pageSize: typeof rawSearchParams.pageSize === 'string' ? rawSearchParams.pageSize : undefined,
    });

    const [paginatedResult, project] = await Promise.all([
      getPaginatedPosts(prefix, paginationParams.page, paginationParams.pageSize),
      getProject(prefix)
    ]);

    if (!project) {
      notFound();
    }

    // Handle invalid page numbers - redirect to last available page
    if (paginatedResult.pagination.totalPages > 0 && 
        paginationParams.page > paginatedResult.pagination.totalPages) {
      const lastPageUrl = `/${locale}/project/${prefix}/posts?page=${paginatedResult.pagination.totalPages}${
        paginationParams.pageSize !== 10 ? `&pageSize=${paginationParams.pageSize}` : ''
      }`;
      redirect(lastPageUrl);
    }

    return (
      <MainLayout>
        {/* Fixed Header */}
        <div className="bg-gray-900 border-b border-gray-700">
          <Container className="py-6 px-4">
            <div className="flex items-center gap-4">
              <BackButton className="p-2 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </BackButton>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <p className="text-gray-400 text-sm">Manage your multilingual posts</p>
              </div>
              <SubscribeButton
                project={project}
                locale={locale}
                variant="outline"
                size="md"
              />
            </div>
          </Container>
        </div>

        {/* Posts List - Full Width */}
        <PostsPageWrapper
          posts={paginatedResult.data}
          locale={locale}
          prefix={prefix}
          pagination={paginatedResult.pagination}
        />
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Failed to load posts</h3>
            <p className="text-gray-400">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
}
