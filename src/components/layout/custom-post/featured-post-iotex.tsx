"use client";

import { useRouter } from "next/navigation";
import { PostEntity } from "@/entities/post";
import SafeImage from "../../ui/safe-image";
import { generateArticleUrl } from "@/lib/url-utils";

interface FeaturedPostIotexProps {
  post: PostEntity;
  locale: string;
  prefix: string;
}

export default function FeaturedPostIotex({
  post,
  locale,
  prefix
}: FeaturedPostIotexProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const i18nContent = post.i18n?.[locale];
  const displayTitle = i18nContent?.title || post.title;
  const description = i18nContent?.desc || "";
  const cover = post.data?.feature_image || "";
  const publishedAt = post.data?.published_at || post.created_at || new Date().toISOString();

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-3xl mb-10 border border-gray-200/60 shadow-xl cursor-pointer group hover:shadow-2xl transition-all duration-300"
      onClick={() => router.push(generateArticleUrl(prefix, locale, post.slug))}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 via-gray-100/20 to-zinc-100/20 rounded-3xl"></div>

      <div className="relative grid lg:grid-cols-3 gap-0 min-h-[400px]">
        {/* Left side - Image (takes 2 columns) */}
        <div className="relative overflow-hidden rounded-l-3xl lg:rounded-r-none lg:col-span-2">
          {cover ? (
            <div className="h-full min-h-[300px] lg:min-h-[400px]">
              <SafeImage
                src={cover}
                alt={displayTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ) : (
            <div className="h-full min-h-[300px] lg:min-h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Right side - Content (takes 1 column) */}
        <div className="flex flex-col justify-center px-5 lg:px-6 py-6 lg:py-8">
          <div className="space-y-4">
            {/* Meta information */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Featured
              </span>
              <span className="text-gray-600 text-sm font-medium">
                {formatDate(publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
              {displayTitle}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed line-clamp-3">
                {description}
              </p>
            )}

            {/* Read more button */}
            <div className="pt-3">
              <div className="inline-flex items-center px-5 py-2.5 bg-white border-2 font-semibold rounded-xl">
                Read Full Article
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 