'use client';

import { useState, useCallback } from 'react';
import { repo } from '@unilab/urpc';
import { PostEntity } from '@/entities/post';
import '@/lib/urpc-client'; // Initialize URPC client

interface UsePostsReturn {
  posts: PostEntity[];
  loading: boolean;
  error: string | null;
  fetchPosts: (projectId?: string) => Promise<void>;
  translatePost: (id: string) => Promise<void>;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (projectId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const where = projectId ? { project_id: parseInt(projectId) } : {};

      const data = await repo<PostEntity>({
        entity: "PostEntity",
        source: "postgres",
      }).findMany({
        where,
      });
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const translatePost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Update post status to translating
      await repo<PostEntity>({
        entity: "PostEntity",
        source: "postgres",
      }).update({
        where: { id: parseInt(id) },
        data: { status: 'translating' },
      });

      // Trigger translation process - this might need to be a custom action
      // For now, we'll use a direct fetch since it's a custom endpoint
      const response = await fetch('/api/process', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to start translation');
      }

      // Refresh posts list
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    translatePost,
  };
}
