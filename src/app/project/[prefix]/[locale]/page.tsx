import { getPaginatedPosts, getProject } from "@/lib/data";
import PostsPageWrapper from "@/components/posts-page-wrapper";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import Breadcrumb from "@/components/seo/breadcrumb";
import { generateProjectPostsBreadcrumbs } from "@/lib/breadcrumb-utils";
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
            `/project/${prefix}/${loc}`
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
        redirect(`/project/${prefix}/${defaultLocale}`);
      } else {
        notFound();
      }
    }

    // Set default pageSize based on project prefix
    const defaultPageSize = prefix === "mimo" ? 15 : 10;
    
    // Parse and validate pagination parameters with project-specific defaults
    const paginationResult = PaginationQuerySchema.safeParse({
      page: resolvedSearchParams.page as string,
      pageSize: resolvedSearchParams.pageSize as string || defaultPageSize.toString(),
    });

    if (!paginationResult.success) {
      console.error("Invalid pagination parameters:", paginationResult.error);
      redirect(`/project/${prefix}/${locale}`);
    }

    // Use project-specific default if no pageSize provided
    const finalPageSize = resolvedSearchParams.pageSize ? paginationResult.data.pageSize : defaultPageSize;

    // Get paginated posts
    const paginatedResult = await getPaginatedPosts(
      prefix,
      paginationResult.data.page,
      finalPageSize
    );

    return (
      <MainLayout project={project} locale={locale}>
        <div className="min-h-screen">
          <Container className="py-8 px-6" size="xl">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <Breadcrumb 
                items={generateProjectPostsBreadcrumbs(project.name, prefix, locale)}
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
  } catch (error) {
    console.error("Error loading posts page:", error);
    notFound();
  }
}
