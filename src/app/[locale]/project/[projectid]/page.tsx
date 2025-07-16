import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectid: string }>;
}) {
  const { locale, projectid: projectId } = await params;

  // Server-side redirect to posts page
  redirect(`/${locale}/project/${projectId}/posts`);
}
