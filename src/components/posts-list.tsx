"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { PostEntity } from "@/entities/post";
import SafeImage from "./ui/safe-image";
import Pagination from "./ui/pagination";
import { generateArticleUrl } from "@/lib/url-utils";

const MimoPostsList = dynamic(() => import("./layout/custom-post/mimo-posts-list"), {
  loading: () => <div className="animate-pulse">Loading posts...</div>,
});

const FeaturedPostIotex = dynamic(() => import("./layout/custom-post/featured-post-iotex"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg"></div>,
});

const DepinscanPostsList = dynamic(() => import("./layout/custom-post/depinscan-posts-list"), {
  loading: () => <div className="animate-pulse">Loading posts...</div>,
});

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PostsListProps {
  posts: PostEntity[];
  locale: string;
  prefix: string;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function PostsList({
  posts,
  locale,
  prefix,
  pagination,
  onPageChange,
  onPageSizeChange
}: PostsListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts available</h3>
        <p className="text-gray-600 text-lg">Posts will appear here once they are imported from Ghost CMS.</p>
      </div>
    );
  }

  // Use different layout for specific projects
  if (prefix === "mimo") {
    return (
      <MimoPostsList
        posts={posts}
        locale={locale}
        prefix={prefix}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }

  if (prefix === "depinscan") {
    return (
      <DepinscanPostsList
        posts={posts}
        locale={locale}
        prefix={prefix}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }
  // Default layout for other projects
  const isFirstPage = !pagination || pagination.currentPage === 1;
  const featuredPost = isFirstPage ? posts[0] : null;
  const regularPosts = isFirstPage ? posts.slice(1) : posts;

  return (
    <div className="w-full">
      {/* Hero Section with Featured Post */}
      {featuredPost && (
        <>
          {prefix === "iotex" ? (
            <FeaturedPostIotex
              post={featuredPost}
              locale={locale}
              prefix={prefix}
            />
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 rounded-2xl mb-12 border border-gray-200">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-yellow-100/30 rounded-2xl"></div>

              {/* Featured post content */}
              <div className="relative px-8 py-16">
                <div className="max-w-4xl">
                  {(() => {
                    const i18nContent = featuredPost.i18n?.[locale];
                    const displayTitle = i18nContent?.title || featuredPost.title;
                    const description = i18nContent?.desc || "";
                    const publishedAt = featuredPost.data?.published_at || featuredPost.created_at || new Date().toISOString();

                    return (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          {/* {getStatusBadge(featuredPost.status)} */}
                          <span className="text-gray-600 text-sm">
                            {formatDate(publishedAt)}
                          </span>
                        </div>

                        <Link 
                          href={generateArticleUrl(prefix, locale, featuredPost.slug)}
                          prefetch={true}
                          className="block"
                        >
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight cursor-pointer hover:text-blue-700 transition-colors">
                            {displayTitle}
                          </h1>
                        </Link>

                        {description && (
                          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl">
                            {description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 text-gray-600">
                          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full border border-blue-300">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="font-medium text-blue-700">Featured Article</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Posts Grid */}
      {regularPosts.length > 0 && (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => {
              const i18nContent = post.i18n?.[locale];
              const displayTitle = i18nContent?.title || post.title;
              const cover = post.data?.feature_image || "";
              const description = i18nContent?.desc || post.data?.excerpt || "";
              const publishedAt = post.data?.published_at || post.created_at || new Date().toISOString();

              return (
                <Link
                  key={post.id}
                  href={generateArticleUrl(prefix, locale, post.slug)}
                  prefetch={true}
                  className="block"
                >
                  <article className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-300/50 hover:border-blue-400/60 hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-200/30">
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
                      {/* {getStatusBadge(post.status)} */}
                      <span className="text-gray-600 text-sm font-medium">
                        {formatDate(publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                      {displayTitle}
                    </h3>

                    {description && (
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                        {description}
                      </p>
                    )}
                  </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="w-full mt-12">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={prefix === "iotex" && pagination.currentPage === 1 ? 15 : pagination.pageSize}
            onPageChange={onPageChange || (() => {})}
            onPageSizeChange={onPageSizeChange}
            className="flex justify-center"
          />
        </div>
      )}
    </div>
  );
}
