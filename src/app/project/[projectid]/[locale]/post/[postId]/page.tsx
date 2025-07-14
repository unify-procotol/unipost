"use client";

import { usePost } from "@/hooks/use-post";
import { useEffect } from "react";

export default function PostPage({
  params,
}: {
  params: { projectid: string; locale: string; postId: string };
}) {
  const { projectid: projectId, locale, postId } = params;
  const { post, loading: postLoading, error: postError, fetchPost } = usePost();
  useEffect(() => {
    fetchPost(postId);
  }, [postId, fetchPost]);

  if (postLoading) {
    return <div>Loading...</div>;
  }
  if (postError) {
    return <div>Error: {postError}</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-2xl font-bold text-center bg-gray-50 p-4 rounded-md">
          <div className="text-lg font-bold">
            {post?.i18n?.[locale as keyof typeof post.i18n]?.title ||
              post?.title}
          </div>
        </div>
        <div className="mt-4 text-sm leading-relaxed">
          <span
            dangerouslySetInnerHTML={{
              __html:
                post?.i18n?.[locale as keyof typeof post.i18n]?.content ||
                post?.content ||
                "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
