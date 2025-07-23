import { ProjectEntity } from '@/entities/project';
import { PublicProjectEntity, PublicProjectUtils } from '@/entities/public-project';

/**
 * Sanitize project data for frontend consumption
 * Removes sensitive fields like API keys
 */
export function sanitizeProject(project: ProjectEntity): PublicProjectEntity {
  return PublicProjectUtils.fromProjectEntity(project);
}

/**
 * Sanitize an array of projects for frontend consumption
 */
export function sanitizeProjects(projects: ProjectEntity[]): PublicProjectEntity[] {
  return PublicProjectUtils.fromProjectEntityArray(projects);
}

/**
 * Get project with sensitive data for server-side operations
 * This should only be used in server-side code (API routes, server components)
 */
export function getProjectWithSecrets(project: ProjectEntity): ProjectEntity {
  return project;
}

/**
 * Check if a project has subscription capability without exposing the key
 */
export function hasSubscriptionCapability(project: ProjectEntity): boolean {
  return !!(project.ghost_admin_key && project.ghost_admin_key.trim() !== '');
}

/**
 * Get Ghost admin key for server-side operations only
 * This should never be called from client-side code
 */
export function getGhostAdminKey(project: ProjectEntity): string | null {
  if (typeof window !== 'undefined') {
    console.error('getGhostAdminKey should not be called from client-side code!');
    return null;
  }
  return project.ghost_admin_key || null;
}

/**
 * Get Ghost content API key for server-side operations only
 */
export function getGhostContentKey(project: ProjectEntity): string | null {
  if (typeof window !== 'undefined') {
    console.error('getGhostContentKey should not be called from client-side code!');
    return null;
  }
  return project.ghost_api_key || null;
}
