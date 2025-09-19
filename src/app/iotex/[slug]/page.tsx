import ArticlePage, { generateArticleMetadata } from "@/components/article-page";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prefix = "iotex";

  return generateArticleMetadata({ prefix, slug, locale: "en" });
}

export default async function IoTexArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prefix = "iotex";

  return <ArticlePage prefix={prefix} slug={slug} locale="en" />;
}