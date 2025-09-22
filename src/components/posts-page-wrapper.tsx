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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    const queryString = params.toString();
    
    // Detect environment and generate correct path
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    
    const isLocalhost = origin.includes("localhost");
    const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
    const isRenderTest = origin.includes("unipost-test-only.onrender.com");
    
    // If we're on any of the direct access domains AND the path starts with project prefix, it's direct access
    // If we're on other domains OR the path starts with /blog, it's rewrite environment
    const isDirectAccess = (isLocalhost || isUniLabsOrg || isRenderTest) && 
                           (pathname.startsWith(`/${prefix}`) || pathname.startsWith(`/${locale}/${prefix}`));
    
    let basePath: string;
    
    if (isDirectAccess) {
      console.log(11, origin, pathname)
      // Direct access: use project prefix format
      if (locale === "en") {
        basePath = `/${prefix}/`;
      } else {
        basePath = `/${locale}/${prefix}/`;
      }
    } else {
      console.log(22, origin, pathname)
      // Rewrite environment: use /blog format
      if (locale === "en") {
        basePath = '/blog/';
      } else {
        basePath = `/${locale}/blog/`;
      }
    }
    
    const targetUrl = `${basePath}?${queryString}`;
    router.push(targetUrl);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', pageSize.toString());
    // Reset to page 1 when changing page size
    params.set('page', '1');
    const queryString = params.toString();
    
    // Detect environment and generate correct path
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    
    const isLocalhost = origin.includes("localhost");
    const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
    const isRenderTest = origin.includes("unipost-test-only.onrender.com");
    
    // If we're on any of the direct access domains AND the path starts with project prefix, it's direct access
    // If we're on other domains OR the path starts with /blog, it's rewrite environment
    const isDirectAccess = (isLocalhost || isUniLabsOrg || isRenderTest) && 
                           (pathname.startsWith(`/${prefix}`) || pathname.startsWith(`/${locale}/${prefix}`));
    
    let basePath: string;
    
    if (isDirectAccess) {
      console.log(1, origin, pathname)
      // Direct access: use project prefix format
      if (locale === "en") {
        basePath = `/${prefix}/`;
      } else {
        basePath = `/${locale}/${prefix}/`;
      }
    } else {
      console.log(2, origin, pathname)
      // Rewrite environment: use /blog format
      if (locale === "en") {
        basePath = '/blog/';
      } else {
        basePath = `/${locale}/blog/`;
      }
    }
    
    const targetUrl = `${basePath}?${queryString}`;
    router.push(targetUrl);
  };

  return (
    <PostsList
      posts={posts}
      locale={locale}
      prefix={prefix}
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}