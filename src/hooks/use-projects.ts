'use client';

import { useState, useCallback } from 'react';
import { ProjectEntity } from '@/entities/project';
import { PublicProjectEntity } from '@/entities/public-project';
import {
  getProjectsAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction
} from '@/actions/project-actions';

interface UseProjectsReturn {
  projects: PublicProjectEntity[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<ProjectEntity>) => Promise<void>;
  updateProject: (id: string, data: Partial<ProjectEntity>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<PublicProjectEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use server action - no sensitive data transmitted to client
      const data = await getProjectsAction();
      setProjects(data);
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
      // Use server action - secure server-side processing
      const result = await createProjectAction(data);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project');
      }

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
      // Use server action - secure server-side processing
      const result = await updateProjectAction(parseInt(id), data);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update project');
      }

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
      // Use server action - secure server-side processing
      const result = await deleteProjectAction(parseInt(id));

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete project');
      }

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
