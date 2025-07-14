import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectid: string }>;
}) {
  const { locale, projectid: projectId } = await params;

  // 服务端重定向到 posts 页面
  redirect(`/${locale}/project/${projectId}/posts`);
}
