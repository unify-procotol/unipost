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
  params: Promise<{ prefix: string; locale: string }>;
}): Promise<Metadata> {
  const { prefix, locale } = await params;

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

    const languageName = languageNames[locale] || locale.toUpperCase();

    return {
      title: `${project.name} - ${languageName} Posts`,
      description: `Browse ${languageName} posts from ${project.name}. Multilingual content management and translation.`,
      openGraph: {
        title: `${project.name} - ${languageName} Posts`,
        description: `Browse ${languageName} posts from ${project.name}`,
        type: "website",
        locale: locale,
        alternateLocale: project.locales.filter(loc => loc !== locale),
      },
      alternates: {
        languages: Object.fromEntries(
          project.locales.map(loc => [
            loc,
            `/project/${prefix}/${loc}/posts`
          ])
        ),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the project.",
    };
  }
}

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ prefix: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { prefix, locale } = await params;
  const resolvedSearchParams = await searchParams;

  try {
    // Get project information
    const project = await getProject(prefix);

    if (!project) {
      notFound();
    }

    // Validate locale
    if (!project.locales.includes(locale)) {
      // Redirect to the first available locale for this project
      const defaultLocale = project.locales[0];
      if (defaultLocale) {
        redirect(`/project/${prefix}/${defaultLocale}/posts`);
      } else {
        notFound();
      }
    }

    // Parse and validate pagination parameters
    const paginationResult = PaginationQuerySchema.safeParse({
      page: resolvedSearchParams.page as string,
      pageSize: resolvedSearchParams.pageSize as string,
    });

    if (!paginationResult.success) {
      console.error("Invalid pagination parameters:", paginationResult.error);
      redirect(`/project/${prefix}/${locale}/posts`);
    }

    // Get paginated posts
    const paginatedResult = await getPaginatedPosts(
      prefix,
      paginationResult.data.page,
      paginationResult.data.pageSize
    );

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
  } catch (error) {
    console.error("Error loading posts page:", error);
    notFound();
  }
}
