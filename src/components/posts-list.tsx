"use client";

import { useRouter } from "next/navigation";
import { PostEntity } from "@/entities/post";
import SafeImage from "./ui/safe-image";

interface PostsListProps {
  posts: PostEntity[];
  locale: string;
  projectId: string;
}

export default function PostsList({ posts, locale, projectId }: PostsListProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", text: "Pending" },
      translated: { color: "bg-green-500/20 text-green-300 border-green-500/30", text: "Translated" },
      translating: { color: "bg-blue-500/20 text-blue-300 border-blue-500/30", text: "Translating" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { color: "bg-gray-500/20 text-gray-300 border-gray-500/30", text: status };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No posts available</h3>
        <p className="text-gray-400 text-lg">Posts will appear here once they are imported from Ghost CMS.</p>
      </div>
    );
  }

  // Get featured post (first post) and regular posts
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section with Featured Post */}
      {featuredPost && (
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-yellow-500/20"></div>

          {/* Featured post content */}
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-4xl">
              {(() => {
                const i18nContent = featuredPost.i18n?.[locale];
                const displayTitle = i18nContent?.title || featuredPost.title;
                const description = featuredPost.data?.excerpt || "";
                const publishedAt = featuredPost.data?.published_at || featuredPost.created_at;

                return (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      {getStatusBadge(featuredPost.status)}
                      <span className="text-gray-400 text-sm">
                        {formatDate(publishedAt)}
                      </span>
                    </div>

                    <h1
                      className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => router.push(`/${locale}/project/${projectId}/posts/${featuredPost.id}`)}
                    >
                      {displayTitle}
                    </h1>

                    {description && (
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                        {description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Featured Article</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>ID: {featuredPost.id}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {regularPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => {
              const i18nContent = post.i18n?.[locale];
              const displayTitle = i18nContent?.title || post.title;
              const cover = post.data?.feature_image || "";
              const description = post.data?.excerpt || "";
              const publishedAt = post.data?.published_at || post.created_at;

              return (
                <article
                  key={post.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-105"
                  onClick={() => router.push(`/${locale}/project/${projectId}/posts/${post.id}`)}
                >
                  {cover && (
                    <div className="aspect-video overflow-hidden">
                      <SafeImage
                        src={cover}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {getStatusBadge(post.status)}
                      <span className="text-gray-500 text-sm">
                        {formatDate(publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {displayTitle}
                    </h3>

                    {description && (
                      <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                        {description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Read</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>{post.id}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
