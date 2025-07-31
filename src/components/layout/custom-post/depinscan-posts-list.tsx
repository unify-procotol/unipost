"use client";

import { useRouter } from "next/navigation";
import { PostEntity } from "@/entities/post";
import SafeImage from "../../ui/safe-image";
import Pagination from "../../ui/pagination";

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DepinscanPostsListProps {
  posts: PostEntity[];
  locale: string;
  prefix: string;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function DepinscanPostsList({
  posts,
  locale,
  prefix,
  pagination,
  onPageChange,
  onPageSizeChange
}: DepinscanPostsListProps) {
  const router = useRouter();

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

  return (
    <div className="w-full mx-auto">
      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => {
          const i18nContent = post.i18n?.[locale];
          const displayTitle = i18nContent?.title || post.title;
          const cover = post.data?.feature_image || "";
          const description = i18nContent?.desc || post.data?.excerpt || "";
          const publishedAt = post.data?.published_at || post.created_at || new Date().toISOString();

          return (
            <article
              key={post.id}
              className="group flex gap-6 p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => router.push(`/${prefix}/${locale}/${post.slug}`)}
            >
              {/* Left side - Image */}
              <div className="flex-shrink-0">
                {cover ? (
                  <div className="w-28 h-28 rounded-lg overflow-hidden">
                    <SafeImage
                      src={cover}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Right side - Content */}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <span className="text-sm text-gray-500 font-medium">
                    By admin — {formatDate(publishedAt)}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {displayTitle}
                </h2>

                {description && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {description}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="w-full mt-12">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={onPageChange || (() => {})}
            onPageSizeChange={onPageSizeChange}
            className="flex justify-center"
          />
        </div>
      )}
    </div>
  );
} 