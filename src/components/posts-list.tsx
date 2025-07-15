"use client";

import { useRouter } from "next/navigation";
import { PostEntity } from "@/entities/post";

interface PostsListProps {
  posts: PostEntity[];
  locale: string;
  projectId: string;
}

export default function PostsList({ posts, locale, projectId }: PostsListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
      {posts.length === 0 ? (
        <div className="text-center p-4">没有文章</div>
      ) : (
        posts.map((post) => {
          // 获取本地化内容
          const i18nContent = post.i18n?.[locale];

          // 显示本地化标题或默认标题
          const displayTitle = i18nContent?.title || post.title;
          
          return (
            <div
              key={post.id}
              className="bg-gray-100 p-4 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => {
                router.push(`/${locale}/project/${projectId}/posts/${post.id}`);
              }}
            >
              <div className="font-medium">{displayTitle}</div>
              <div className="text-sm text-gray-500 mt-1">ID: {post.id}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
