import { PostEntity } from "../entities/post";
import { PostgresAdapter, PostgresAdapterConfig } from "./postgres";
import { PaginatedResult, PaginationParams, createPaginationMeta } from "../types/pagination";
import { URPCError, ErrorCodes } from "@unilab/urpc-core";

export class PostAdapter extends PostgresAdapter<PostEntity> {
  constructor(config: Omit<PostgresAdapterConfig, 'tableName'> = {}) {
    super({
      ...config,
      tableName: 'posts'
    });
  }

  /**
   * Find posts with pagination support
   */
  async findManyPaginated(params: PaginationParams): Promise<PaginatedResult<PostEntity>> {
    try {
      const { page, pageSize, projectId } = params;
      const offset = (page - 1) * pageSize;

      // Build WHERE clause for project filtering
      let whereClause = "";
      const values: any[] = [];
      let paramIndex = 1;

      if (projectId) {
        whereClause = `WHERE project_id = $${paramIndex}`;
        values.push(parseInt(projectId));
        paramIndex++;
      }

      // Get total count
      const totalItems = await this.getPostsCount(projectId);

      // Get paginated posts
      const query = `
        SELECT * FROM ${this.tableName}
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      values.push(pageSize, offset);

      const result = await this.sql.unsafe(query, values);
      const posts = result.map(row => this.mapRowToEntity(row));

      // Create pagination metadata
      const pagination = createPaginationMeta(page, pageSize, totalItems);

      return {
        data: posts,
        pagination
      };
    } catch (error) {
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to find paginated posts: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get total count of posts, optionally filtered by project
   */
  async getPostsCount(projectId?: string): Promise<number> {
    try {
      let whereClause = "";
      const values: any[] = [];

      if (projectId) {
        whereClause = "WHERE project_id = $1";
        values.push(parseInt(projectId));
      }

      const query = `SELECT COUNT(*) as count FROM ${this.tableName} ${whereClause}`;
      const result = await this.sql.unsafe(query, values);

      return parseInt(result[0]?.count || '0');
    } catch (error) {
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to count posts: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private mapRowToEntity(row: any): PostEntity {
    return row as PostEntity;
  }
}
