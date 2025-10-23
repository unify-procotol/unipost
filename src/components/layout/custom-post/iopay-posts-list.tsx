"use client";

import Link from "next/link";
import { PostEntity } from "@/entities/post";
import SafeImage from "../../ui/safe-image";
import Pagination from "../../ui/pagination";
import FeaturedPostIopay from "./featured-post-iopay";
import { generateArticleUrl } from "@/lib/url-utils";

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface IopayPostsListProps {
  posts: PostEntity[];
  locale: string;
  prefix: string;
  pagination?: PaginationMeta;
  generatePaginationLink?: (page: number, pageSize?: number) => string;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function IopayPostsList({
  posts,
  locale,
  prefix,
  pagination,
  generatePaginationLink,
  onPageSizeChange
}: IopayPostsListProps) {

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(locale, {
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

  // Show featured post only on first page
  const isFirstPage = !pagination || pagination.currentPage === 1;
  const featuredPost = isFirstPage ? posts[0] : null;
  const remainingPosts = isFirstPage ? posts.slice(1) : posts;

  // Split remaining posts for iopay layout - only on first page
  const secondAndThirdPosts = isFirstPage ? remainingPosts.slice(0, 2) : [];
  const otherPosts = isFirstPage ? remainingPosts.slice(2) : remainingPosts;

  const renderPostCard = (post: PostEntity, size: "medium" | "small" = "small") => {
    const i18nContent = post.i18n?.[locale];
    const displayTitle = i18nContent?.title || post.title;
    const cover = post.data?.feature_image || "";
    const description = i18nContent?.desc || post.data?.excerpt || "";
    const publishedAt = post.data?.published_at || post.created_at || new Date().toISOString();

    const cardClasses = size === "medium" 
      ? "group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-300/50 hover:border-green-400/60 hover:bg-white transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-200/30"
      : "group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-300/50 hover:border-green-400/60 hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-200/30";

    const imageAspect = size === "medium" ? "aspect-[5/3]" : "aspect-video";
    const titleSize = size === "medium" ? "text-lg font-bold" : "text-base font-bold";
    const padding = size === "medium" ? "p-5" : "p-4";

    return (
      <Link
        key={post.id}
        href={generateArticleUrl(prefix, locale, post.slug)}
        prefetch={true}
        className={cardClasses}
      >
        {cover && (
          <div className={`${imageAspect} overflow-hidden`}>
            <SafeImage
              src={cover}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        <div className={padding}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-600 text-sm font-medium">
              {formatDate(publishedAt)}
            </span>
          </div>

          <h3 className={`${titleSize} text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight`}>
            {displayTitle}
          </h3>

          {description && (
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
              {description}
            </p>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full">
      {/* Featured Post - First Article */}
      {featuredPost && (
        <FeaturedPostIopay
          post={featuredPost}
          locale={locale}
          prefix={prefix}
        />
      )}

      {/* Second and Third Posts - Two Column Layout */}
      {secondAndThirdPosts.length > 0 && (
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondAndThirdPosts.map((post) => renderPostCard(post, "medium"))}
          </div>
        </div>
      )}

      {/* Remaining Posts - Three Column Layout */}
      {otherPosts.length > 0 && (
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => renderPostCard(post, "small"))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="w-full mt-10">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            generatePaginationLink={generatePaginationLink}
            onPageSizeChange={onPageSizeChange}
            className="flex justify-center"
          />
        </div>
      )}
    </div>
  );
} 