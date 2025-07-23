import { ProjectEntity } from '@/entities/project';
import { PublicProjectEntity } from '@/entities/public-project';
import { PostEntity } from '@/entities/post';
import { ProjectAdapter } from '@/adapters/project';
import { PostAdapter } from '@/adapters/post';
import { PaginatedResult, PaginationParams, PaginationParamsSchema } from '@/types/pagination';
import { sanitizeProjects, sanitizeProject } from '@/lib/data-sanitizer';

export async function getProjects(): Promise<PublicProjectEntity[]> {
  try {
    const projectAdapter = new ProjectAdapter();
    const data = await projectAdapter.findMany({});
    return sanitizeProjects(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProject(prefix: string): Promise<PublicProjectEntity | null> {
  try {
    const projectAdapter = new ProjectAdapter();
    const data = await projectAdapter.findOne({
      where: { prefix: prefix},
    });
    return data ? sanitizeProject(data) : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function getPosts(projectId?: string): Promise<PostEntity[]> {
  try {
    const postAdapter = new PostAdapter();
    const where = projectId ? { project_id: parseInt(projectId) } : {};

    const data = await postAdapter.findMany({
      where,
    });
    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPost(id: string): Promise<PostEntity | null> {
  try {
    const postAdapter = new PostAdapter();
    const data = await postAdapter.findOne({
      where: { id: parseInt(id) },
    });
    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPaginatedPosts(
  prefix?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResult<PostEntity>> {
  try {
    const postAdapter = new PostAdapter();
    
    // Validate and sanitize parameters
    const validatedParams = PaginationParamsSchema.parse({
      page,
      pageSize,
      prefix,
    });

    const paginationParams: PaginationParams = {
      page: validatedParams.page,
      pageSize: validatedParams.pageSize,
      prefix: validatedParams.prefix,
    };

    const result = await postAdapter.findManyPaginated(paginationParams);
    return result;
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    
    // Return empty result with default pagination on error
    return {
      data: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        pageSize,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

/**
 * Server-side only functions that return full project data with secrets
 * These should NEVER be used in client-side code or exposed to the frontend
 */

export async function getProjectWithSecrets(prefix: string): Promise<ProjectEntity | null> {
  // Ensure this is only called server-side
  if (typeof window !== 'undefined') {
    throw new Error('getProjectWithSecrets should only be called server-side');
  }

  try {
    const projectAdapter = new ProjectAdapter();
    const data = await projectAdapter.findOne({
      where: { prefix: prefix},
    });
    return data;
  } catch (error) {
    console.error('Error fetching project with secrets:', error);
    return null;
  }
}

export async function getProjectsWithSecrets(): Promise<ProjectEntity[]> {
  // Ensure this is only called server-side
  if (typeof window !== 'undefined') {
    throw new Error('getProjectsWithSecrets should only be called server-side');
  }

  try {
    const projectAdapter = new ProjectAdapter();
    const data = await projectAdapter.findMany({});
    return data || [];
  } catch (error) {
    console.error('Error fetching projects with secrets:', error);
    return [];
  }
}
