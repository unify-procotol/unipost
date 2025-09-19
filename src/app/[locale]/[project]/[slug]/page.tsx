import ArticlePage, { generateArticleMetadata } from "@/components/article-page";
import { getProject } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; project: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, project: prefix, slug } = await params;

  try {
    const project = await getProject(prefix);
    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    // Validate locale
    if (!project.locales.includes(locale)) {
      return {
        title: "Locale Not Found",
        description: "The requested locale is not supported for this project.",
      };
    }

    return generateArticleMetadata({ prefix, slug, locale });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the page.",
    };
  }
}

export default async function LocalizedArticlePage({
  params,
}: {
  params: Promise<{ locale: string; project: string; slug: string }>;
}) {
  const { locale, project: prefix, slug } = await params;

  try {
    const project = await getProject(prefix);
    if (!project) {
      notFound();
    }

    // Validate locale
    if (!project.locales.includes(locale)) {
      notFound();
    }

    return <ArticlePage prefix={prefix} slug={slug} locale={locale} />;
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}