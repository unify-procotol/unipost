'use client';

import { useState, useCallback } from 'react';
import { repo } from '@unilab/urpc';
import '@/lib/urpc-client'; // Initialize URPC client
import { PostEntity } from '@/entities/post';

interface UsePostReturn {
  post: PostEntity | null;
  loading: boolean;
  error: string | null;
  fetchPost: (id: string) => Promise<void>;
}

export function usePost(): UsePostReturn {
  const [post, setPost] = useState<PostEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await repo<PostEntity>({
        entity: "PostEntity",
        source: "postgres",
      }).findOne({
        where: { id: parseInt(id) },
      });
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    post,
    loading,
    error,
    fetchPost,
  };
}
