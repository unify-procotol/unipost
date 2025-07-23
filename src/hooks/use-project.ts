'use client';

import { useState, useCallback } from 'react';
import { PublicProjectEntity } from '@/entities/public-project';
import { getProjectAction } from '@/actions/project-actions';

interface UseProjectReturn {
  project: PublicProjectEntity | null;
  loading: boolean;
  error: string | null;
  fetchProject: (prefix: string) => Promise<void>;
}

export function useProject(): UseProjectReturn {
  const [project, setProject] = useState<PublicProjectEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async (prefix: string) => {
    setLoading(true);
    setError(null);

    try {
      // Use server action - no sensitive data transmitted to client
      const data = await getProjectAction(prefix);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    project,
    loading,
    error,
    fetchProject,
  };
}
