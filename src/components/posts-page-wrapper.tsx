'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import PostsList from './posts-list';
import { PostEntity } from '@/entities/post';

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PostsPageWrapperProps {
  posts: PostEntity[];
  locale: string;
  prefix: string;
  pagination: PaginationMeta;
}

export default function PostsPageWrapper({
  posts,
  locale,
  prefix,
  pagination,
}: PostsPageWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate the base path for pagination links
  const getBasePath = () => {
    if (typeof window === 'undefined') return '/';
    
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    
    const isLocalhost = origin.includes("localhost");
    const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
    const isRenderTest = origin.includes("unipost-test-only.onrender.com");
    
    // If we're on any of the direct access domains AND the path starts with project prefix, it's direct access
    const isDirectAccess = (isLocalhost || isUniLabsOrg || isRenderTest) && 
                           (pathname.startsWith(`/${prefix}`) || pathname.startsWith(`/${locale}/${prefix}`));
    
    if (isDirectAccess) {
      // Direct access: use project prefix format
      if (locale === "en") {
        return `/${prefix}/`;
      } else {
        return `/${locale}/${prefix}/`;
      }
    } else {
      // Rewrite environment: use /blog format
      if (locale === "en") {
        return '/blog/';
      } else {
        return `/${locale}/blog/`;
      }
    }
  };

  // Generate pagination link
  const generatePaginationLink = (page: number, pageSize?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    if (pageSize) {
      params.set('pageSize', pageSize.toString());
    }
    const queryString = params.toString();
    const basePath = getBasePath();
    return `${basePath}?${queryString}`;
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', pageSize.toString());
    // Reset to page 1 when changing page size
    params.set('page', '1');
    const queryString = params.toString();
    const basePath = getBasePath();
    const targetUrl = `${basePath}?${queryString}`;
    router.push(targetUrl);
  };

  return (
    <PostsList
      posts={posts}
      locale={locale}
      prefix={prefix}
      pagination={pagination}
      generatePaginationLink={generatePaginationLink}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}