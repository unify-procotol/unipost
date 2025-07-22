import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; prefix: string }>;
}) {
  const { locale, prefix } = await params;

  // Server-side redirect to posts page
  redirect(`/${locale}/project/${prefix}/posts`);
}
