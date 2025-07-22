'use client';

import { useState, useCallback } from 'react';
import { repo } from '@unilab/urpc';
import { ProjectEntity } from '@/entities/project';
import '@/lib/urpc-client'; // Initialize URPC client

interface UseProjectReturn {
  project: ProjectEntity | null;
  loading: boolean;
  error: string | null;
  fetchProject: (prefix: string) => Promise<void>;
}

export function useProject(): UseProjectReturn {
  const [project, setProject] = useState<ProjectEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async (prefix: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await repo<ProjectEntity>({
        entity: "ProjectEntity",
        source: "postgres",
      }).findOne({
        where: { prefix: prefix },
      });
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
