import ArticlePage, { generateArticleMetadata } from "@/components/article-page";
import type { Metadata } from "next";

export const revalidate = 86400;
export const config = { amp: 'hybrid' };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prefix = "depinscan";

  return generateArticleMetadata({ prefix, slug, locale: "en" });
}

export default async function DePinScanArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prefix = "depinscan";

  return <ArticlePage prefix={prefix} slug={slug} locale="en" />;
}