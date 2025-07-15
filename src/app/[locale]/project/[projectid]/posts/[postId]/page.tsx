import { getPost } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; projectid: string; postId: string }>;
}) {
  const { locale, postId } = await params;

  try {
    const post = await getPost(postId);

    if (!post) {
      notFound();
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        <div>
          <div className="text-2xl font-bold text-center bg-gray-50 p-4 rounded-md">
            <div className="text-lg font-bold">
              {post?.i18n?.[locale]?.title || post?.title}
            </div>
          </div>
          <div className="mt-4 text-sm leading-relaxed">
            <span
              dangerouslySetInnerHTML={{
                __html:
                  post?.i18n?.[locale]?.content ||
                  post?.content ||
                  "",
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load post</p>
      </div>
    );
  }
}
