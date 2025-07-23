import { ProjectEntity } from './project';

/**
 * Public project interface - safe for frontend consumption
 * Excludes sensitive fields like API keys
 */
export interface PublicProjectEntity {
  id: number;
  uid: number;
  prefix: string;
  name: string;
  ghost_domain: string;
  created_at: string;
  updated_at: string;
  locales: string[];
  rule: string;

  // Computed fields
  has_subscription: boolean; // Indicates if ghost_admin_key is configured
}

/**
 * Utility functions for converting ProjectEntity to PublicProjectEntity
 */
export const PublicProjectUtils = {
  /**
   * Convert a ProjectEntity to PublicProjectEntity (plain object)
   */
  fromProjectEntity(project: ProjectEntity): PublicProjectEntity {
    // Return a plain object, not a class instance
    return {
      id: project.id || 0,
      uid: project.uid || 0,
      prefix: project.prefix || '',
      name: project.name || '',
      ghost_domain: project.ghost_domain || '',
      created_at: project.created_at || '',
      updated_at: project.updated_at || '',
      locales: project.locales || [],
      rule: project.rule || '',

      // Set subscription availability without exposing the key
      has_subscription: !!(project.ghost_admin_key && project.ghost_admin_key.trim() !== ''),
    } as PublicProjectEntity;
  },

  /**
   * Convert an array of ProjectEntity to PublicProjectEntity array
   */
  fromProjectEntityArray(projects: ProjectEntity[]): PublicProjectEntity[] {
    return projects.map(project => PublicProjectUtils.fromProjectEntity(project));
  },
};
