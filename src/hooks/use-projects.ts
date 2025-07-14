'use client';

import { useState, useCallback } from 'react';
import { repo } from '@unilab/urpc';
import { ProjectEntity } from '@/entities/project';
import '@/lib/urpc-client'; // Initialize URPC client

interface UseProjectsReturn {
  projects: ProjectEntity[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<ProjectEntity>) => Promise<void>;
  updateProject: (id: string, data: Partial<ProjectEntity>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await repo<ProjectEntity>({
        entity: "ProjectEntity",
        source: "postgres",
      }).findMany({});
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: Partial<ProjectEntity>) => {
    setLoading(true);
    setError(null);

    try {
      await repo<ProjectEntity>({
        entity: "ProjectEntity",
        source: "postgres",
      }).create({
        data,
      });

      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: string, data: Partial<ProjectEntity>) => {
    setLoading(true);
    setError(null);

    try {
      await repo<ProjectEntity>({
        entity: "ProjectEntity",
        source: "postgres",
      }).update({
        where: { id: parseInt(id) },
        data,
      });

      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await repo<ProjectEntity>({
        entity: "ProjectEntity",
        source: "postgres",
      }).delete({
        where: { id: parseInt(id) },
      });

      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
