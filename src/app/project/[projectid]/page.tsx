"use client";

import { usePosts } from "@/hooks/use-posts";
import { useProject } from "@/hooks/use-project";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectPage({
  params,
}: {
  params: { projectid: string };
}) {
  const { projectid: projectId } = params;
  const router = useRouter();
  const [locale, setLocale] = useState<string>("");
  const {
    loading: projectLoading,
    error: projectError,
    fetchProject,
    project,
  } = useProject();
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    fetchPosts,
  } = usePosts();

  useEffect(() => {
    fetchProject(projectId);
    fetchPosts(projectId);
  }, [projectId, fetchProject, fetchPosts]);

  // 如果locale变化且为空，强制重新渲染
  useEffect(() => {
    if (locale === "" && project?.locales && Object.keys(project.locales).length > 0) {
      // 自动选择第一个可用的语言
      setLocale(Object.keys(project.locales)[0]);
    }
  }, [locale, project?.locales]);

  if (projectLoading || postsLoading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (projectError || postsError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{projectError || postsError}</p>
      </div>
    );
  }

  // 如果没有选择语言但有可用语言，则强制用户选择
  if (!locale && project?.locales && Object.keys(project.locales).length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold">Project {projectId}</div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="mb-2">请选择一种语言查看内容：</p>
          <select
            className="bg-white p-4 rounded-md cursor-pointer border border-gray-300"
            onChange={(e) => {
              const key = e.target.value;
              if (key) {
                setLocale(key);
              }
            }}
            value={locale}
          >
            <option value="" disabled>
              选择语言
            </option>
            {Object.entries(project?.locales || {}).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">Project {projectId}</div>
      <div className="flex items-center gap-2">
        <span>当前语言：</span>
        <select
          className="bg-gray-50 p-2 rounded-md cursor-pointer"
          onChange={(e) => {
            const key = e.target.value;
            if (key) {
              setLocale(key);
            }
          }}
          value={locale}
        >
          <option value="" disabled>
            选择语言
          </option>
          {Object.entries(project?.locales || {}).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
        {posts.length === 0 ? (
          <div className="text-center p-4">没有文章</div>
        ) : (
          posts.map((post) => {
            // 获取本地化内容
            const i18nContent = post.i18n && typeof post.i18n === 'object' ? 
              (post.i18n as Record<string, { title?: string }>)[project?.locales?.[locale] || ''] : undefined;
            
            // 显示本地化标题或默认标题
            const displayTitle = (i18nContent && i18nContent.title) || post.title;
            
            return (
              <div
                key={post.id}
                className="bg-gray-100 p-4 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => {
                  if (locale) {
                    router.push(`/project/${projectId}/${project?.locales?.[locale]}/post/${post.id}`);
                  } else {
                    alert("请先选择语言");
                  }
                }}
              >
                <div className="font-medium">{displayTitle}</div>
                <div className="text-sm text-gray-500 mt-1">ID: {post.id}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
