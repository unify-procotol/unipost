import { getPosts, getProject } from "@/lib/data";
import PostsList from "@/components/posts-list";
import { notFound } from "next/navigation";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string; projectid: string }>;
}) {
  const { locale, projectid: projectId } = await params;

  try {
    const [posts, project] = await Promise.all([
      getPosts(projectId),
      getProject(projectId)
    ]);

    if (!project) {
      notFound();
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold">Project {projectId} - Posts ({locale})</div>
        <PostsList posts={posts} locale={locale} projectId={projectId} />
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load posts</p>
      </div>
    );
  }
}
