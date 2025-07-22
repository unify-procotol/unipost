// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
      const { page, pageSize, prefix } = params;
      const offset = (page - 1) * pageSize;

      // Build WHERE clause for project filtering
      let whereClause = "";
      const values: unknown[] = [];
      let paramIndex = 1;

      if (prefix) {
        // Join with projects table to filter by prefix
        whereClause = `
          WHERE posts.project_id = projects.id
          AND projects.prefix = $${paramIndex}
        `;
        values.push(prefix);
        paramIndex++;
      }

      // Get total count
      const totalItems = await this.getPostsCount(prefix);

      // Get paginated posts
      const query = `
        SELECT posts.* FROM ${this.tableName} posts
        ${prefix ? 'JOIN projects ON posts.project_id = projects.id' : ''}
        ${whereClause}
        ORDER BY posts.data ->> 'published_at' desc
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
   * Get total count of posts, optionally filtered by project prefix
   */
  async getPostsCount(prefix?: string): Promise<number> {
    try {
      let whereClause = "";
      const values: unknown[] = [];

      if (prefix) {
        whereClause = `
          WHERE posts.project_id = projects.id
          AND projects.prefix = $1
        `;
        values.push(prefix);
      }

      const query = `
        SELECT COUNT(*) as count
        FROM ${this.tableName} posts
        ${prefix ? 'JOIN projects ON posts.project_id = projects.id' : ''}
        ${whereClause}
      `;
      const result = await this.sql.unsafe(query, values);

      return parseInt(result[0]?.count || '0');
    } catch (error) {
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to count posts: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private mapRowToEntity(row: Record<string, unknown>): PostEntity {
    return row as PostEntity;
  }
}
