import { getPaginatedPosts, getProject } from "@/lib/data";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/main-layout";
import Container from "@/components/ui/container";
import Breadcrumb from "@/components/seo/breadcrumb";

const PostsPageWrapper = dynamic(() => import("@/components/posts-page-wrapper"), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
});
import { generateProjectPostsBreadcrumbs } from "@/lib/breadcrumb-utils";
import { notFound, redirect } from "next/navigation";
import { PaginationQuerySchema } from "@/types/pagination";
import type { Metadata } from "next";
import { generateFaviconIcons } from "@/lib/favicon-utils";
import { generateCanonicalURL, generateProjectDescription, generateAlternatesLanguagesURL } from "@/lib/seo-utils";

export const revalidate = 15;

export async function generateMetadata(): Promise<Metadata> {
  const prefix = "iotex";
  const locale = "en";

  try {
    const project = await getProject(prefix);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
        icons: generateFaviconIcons(prefix),
      };
    }

    return {
      title: `${project.name} - Posts`,
      description: generateProjectDescription(prefix, project.name),
      icons: generateFaviconIcons(prefix),
      openGraph: {
        title: `${project.name} - Posts`,
        description: generateProjectDescription(prefix, project.name),
        type: "website",
        locale: locale,
        alternateLocale: project.locales.filter(loc => loc !== locale),
        siteName: project.name,
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.name} - Posts`,
        description: generateProjectDescription(prefix, project.name),
        images: ["/og-image.png"],
      },
      alternates: {
        canonical: generateCanonicalURL(prefix),
        languages: generateAlternatesLanguagesURL(prefix, project.locales),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the project.",
      icons: generateFaviconIcons(prefix),
    };
  }
}

export default async function IoTexProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const prefix = "iotex";
  const locale = "en";
  const resolvedSearchParams = await searchParams;

  try {
    const project = await getProject(prefix);

    if (!project) {
      notFound();
    }

    // Set default pageSize for iotex: first page 16, others 15
    const isFirstPage = !resolvedSearchParams.page || resolvedSearchParams.page === "1";
    const defaultPageSize = isFirstPage ? 16 : 15;

    // Parse and validate pagination parameters
    const paginationResult = PaginationQuerySchema.safeParse({
      page: resolvedSearchParams.page as string,
      pageSize: resolvedSearchParams.pageSize as string || defaultPageSize.toString(),
    });

    if (!paginationResult.success) {
      console.error("Invalid pagination parameters:", paginationResult.error);
      redirect(`/${prefix}`);
    }

    const finalPageSize = paginationResult.data.pageSize;
    
    // IoTeX special logic: if user sets pageSize=15 on first page, fetch 16 for better layout
    const actualFetchSize = prefix === "iotex" && 
                           paginationResult.data.page === 1 && 
                           finalPageSize === 15
                           ? 16 
                           : finalPageSize;

    // Get paginated posts
    const paginatedResult = await getPaginatedPosts(
      prefix,
      paginationResult.data.page,
      actualFetchSize
    );
    
    // Adjust pagination metadata for IoTeX first page with pageSize=15
    if (prefix === "iotex" && paginationResult.data.page === 1 && finalPageSize === 15 && actualFetchSize === 16) {
      paginatedResult.pagination.pageSize = 15; // Display as 15 in pagination UI
    }

    return (
      <MainLayout project={project} locale={locale}>
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
  } catch (error) {
    console.error("Error loading posts page:", error);
    notFound();
  }
}