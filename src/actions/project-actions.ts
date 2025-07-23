'use server';

import { ProjectAdapter } from '@/adapters/project';
import { PublicProjectEntity, PublicProjectUtils } from '@/entities/public-project';
import { ProjectEntity } from '@/entities/project';

/**
 * Server action to get all projects (safe for frontend)
 */
export async function getProjectsAction(): Promise<PublicProjectEntity[]> {
  try {
    const projectAdapter = new ProjectAdapter();
    const projects = await projectAdapter.findMany({});
    
    // Convert to safe public entities
    return PublicProjectUtils.fromProjectEntityArray(projects || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Server action to get a single project by prefix (safe for frontend)
 */
export async function getProjectAction(prefix: string): Promise<PublicProjectEntity | null> {
  try {
    const projectAdapter = new ProjectAdapter();
    const project = await projectAdapter.findOne({
      where: { prefix: prefix },
    });
    
    return project ? PublicProjectUtils.fromProjectEntity(project) : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

/**
 * Server action to create a new project
 */
export async function createProjectAction(data: Partial<ProjectEntity>): Promise<{ success: boolean; error?: string; project?: PublicProjectEntity }> {
  try {
    const projectAdapter = new ProjectAdapter();
    const project = await projectAdapter.create({ data });
    
    return {
      success: true,
      project: PublicProjectUtils.fromProjectEntity(project),
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Server action to update a project
 */
export async function updateProjectAction(
  id: number, 
  data: Partial<ProjectEntity>
): Promise<{ success: boolean; error?: string; project?: PublicProjectEntity }> {
  try {
    const projectAdapter = new ProjectAdapter();
    const project = await projectAdapter.update({
      where: { id },
      data,
    });
    
    return {
      success: true,
      project: project ? PublicProjectUtils.fromProjectEntity(project) : undefined,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Server action to delete a project
 */
export async function deleteProjectAction(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const projectAdapter = new ProjectAdapter();
    await projectAdapter.delete({
      where: { id },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
