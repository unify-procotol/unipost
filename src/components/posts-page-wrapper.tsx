'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const queryString = createQueryString('page', page.toString());
      router.push(`/project/${prefix}/${locale}/posts?${queryString}`);
    },
    [router, locale, prefix, createQueryString]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', pageSize.toString());
      // Reset to page 1 when changing page size
      params.set('page', '1');
      const queryString = params.toString();
      router.push(`/project/${prefix}/${locale}/posts?${queryString}`);
    },
    [router, locale, prefix, searchParams]
  );

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