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
    // Check if we're in production with rewrite (has /blog in path)
    let basePath = `/${prefix}`;
    if (window.location.pathname.includes('/blog1')) {
      basePath = '/blog1';
    } else if (window.location.pathname.includes('/blog')) {
      basePath = '/blog';
    }
    if (locale !== "en") {
      basePath += `/${locale}`;
    }
    router.push(`${window.location.origin}${basePath}?${queryString}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', pageSize.toString());
    // Reset to page 1 when changing page size
    params.set('page', '1');
    const queryString = params.toString();
    // Check if we're in production with rewrite (has /blog in path)
    let basePath = `/${prefix}`;
    if (window.location.pathname.includes('/blog1')) {
      basePath = '/blog1';
    } else if (window.location.pathname.includes('/blog')) {
      basePath = '/blog';
    }
    if (locale !== "en") {
      basePath += `/${locale}`;
    }
    router.push(`${window.location.origin}${basePath}?${queryString}`);
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