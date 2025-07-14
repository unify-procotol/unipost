import {
  BaseAdapter,
  FindManyArgs,
  FindOneArgs,
  CreationArgs,
  UpdateArgs,
  DeletionArgs,
  URPCError,
  ErrorCodes,
} from "@unilab/urpc-core";
import postgres from "postgres";

export interface PostgresAdapterConfig {
  tableName: string; 
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  max?: number;
  idle_timeout?: number;
  connect_timeout?: number;
}

export class PostgresAdapter<T extends Record<string, any>> extends BaseAdapter<T> {
  private sql: postgres.Sql;
  private tableName: string;

  constructor(config: PostgresAdapterConfig) {
    super();

    this.tableName = config.tableName;

    const connectionString = config.connectionString || process.env.DATABASE_URL;

    if (connectionString) {
      this.sql = postgres(connectionString, {
        max: config.max || parseInt(process.env.POSTGRES_MAX_CONNECTIONS || "20"),
        idle_timeout: config.idle_timeout || parseInt(process.env.POSTGRES_IDLE_TIMEOUT || "20"),
        connect_timeout: config.connect_timeout || parseInt(process.env.POSTGRES_CONNECT_TIMEOUT || "10"),
      });
    } else {
      const host = config.host || process.env.POSTGRES_HOST;
      const port = config.port || parseInt(process.env.POSTGRES_PORT || "5432");
      const database = config.database || process.env.POSTGRES_DB;
      const username = config.username || process.env.POSTGRES_USER;
      const password = config.password || process.env.POSTGRES_PASSWORD;

      if (!host || !database || !username) {
        throw new URPCError(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          "Missing required PostgreSQL configuration. Please provide either DATABASE_URL or host, database, and username."
        );
      }

      this.sql = postgres({
        host,
        port,
        database,
        username,
        password: password || "",
        ssl: config.ssl ?? (process.env.POSTGRES_SSL === "true"),
        max: config.max || parseInt(process.env.POSTGRES_MAX_CONNECTIONS || "20"),
        idle_timeout: config.idle_timeout || parseInt(process.env.POSTGRES_IDLE_TIMEOUT || "20"),
        connect_timeout: config.connect_timeout || parseInt(process.env.POSTGRES_CONNECT_TIMEOUT || "10"),
      });
    }
  }

  private buildWhereClause(where: any): { whereClause: string; values: any[] } {
    if (!where || Object.keys(where).length === 0) {
      return { whereClause: "", values: [] };
    }

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return { whereClause, values };
  }

  private buildOrderByClause(orderBy: any): string {
    if (!orderBy || Object.keys(orderBy).length === 0) {
      return "";
    }

    const orderClauses: string[] = [];
    for (const [key, direction] of Object.entries(orderBy)) {
      const dir = direction === "desc" ? "DESC" : "ASC";
      orderClauses.push(`${key} ${dir}`);
    }

    return orderClauses.length > 0 ? `ORDER BY ${orderClauses.join(", ")}` : "";
  }

  async findOne(args?: FindOneArgs<T>): Promise<T | null> {
    try {
      const { whereClause, values } = this.buildWhereClause(args?.where);
      
      let query = `SELECT * FROM ${this.tableName}`;
      
      if (whereClause) {
        query += ` ${whereClause}`;
      }
      
      query += " LIMIT 1";

      const result = await this.sql.unsafe(query, values as any[]);
      
      if (result.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result[0]);
    } catch (error) {
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to find record: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async findMany(args?: FindManyArgs<T>): Promise<T[]> {
    try {
      const { whereClause, values } = this.buildWhereClause(args?.where);
      const orderByClause = this.buildOrderByClause(args?.order_by);

      let query = `SELECT * FROM ${this.tableName}`;

      if (whereClause) {
        query += ` ${whereClause}`;
      }

      if (orderByClause) {
        query += ` ${orderByClause}`;
      }

      if (args?.limit) {
        query += ` LIMIT ${args.limit}`;
      }

      if (args?.offset) {
        query += ` OFFSET ${args.offset}`;
      }

      const result = await this.sql.unsafe(query, values as any[]);
      return result.map(row => this.mapRowToEntity(row));
    } catch (error) {
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to find records: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async create(args: CreationArgs<T>): Promise<T> {
    try {
      const data = args.data;
      const keys = Object.keys(data).filter(key => data[key] !== undefined);
      const values = keys.map(key => data[key]);
      
      const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
      const columns = keys.join(", ");
      
      const query = `
        INSERT INTO ${this.tableName} (${columns}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;

      const result = await this.sql.unsafe(query, values as any[]);
      
      if (result.length === 0) {
        throw new URPCError(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create record");
      }

      return this.mapRowToEntity(result[0]);
    } catch (error) {
      if (error instanceof URPCError) {
        throw error;
      }
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to create record: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async update(args: UpdateArgs<T>): Promise<T> {
    try {
      const { whereClause, values: whereValues } = this.buildWhereClause(args.where);
      
      if (!whereClause) {
        throw new URPCError(ErrorCodes.BAD_REQUEST, "Where clause is required for update");
      }

      const updateData = args.data;
      const updateKeys = Object.keys(updateData).filter(key => updateData[key] !== undefined);
      const updateValues = updateKeys.map(key => updateData[key]);
      
      const setClause = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(", ");
      const allValues = [...updateValues, ...whereValues];
      
      // Adjust parameter indices for WHERE clause
      const adjustedWhereClause = whereClause.replace(/\$(\d+)/g, (match, num) => {
        return `$${parseInt(num) + updateKeys.length}`;
      });
      
      const query = `
        UPDATE ${this.tableName} 
        SET ${setClause} 
        ${adjustedWhereClause} 
        RETURNING *
      `;

      const result = await this.sql.unsafe(query, allValues as any[]);
      
      if (result.length === 0) {
        throw new URPCError(ErrorCodes.NOT_FOUND, "Record not found or not updated");
      }

      return this.mapRowToEntity(result[0]);
    } catch (error) {
      if (error instanceof URPCError) {
        throw error;
      }
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to update record: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async delete(args: DeletionArgs<T>): Promise<boolean> {
    try {
      const { whereClause, values } = this.buildWhereClause(args.where);

      if (!whereClause) {
        throw new URPCError(ErrorCodes.BAD_REQUEST, "Where clause is required for delete");
      }

      const query = `DELETE FROM ${this.tableName} ${whereClause}`;
      const result = await this.sql.unsafe(query, values as any[]);

      return result.count > 0;
    } catch (error) {
      if (error instanceof URPCError) {
        throw error;
      }
      throw new URPCError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        `Failed to delete record: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private mapRowToEntity(row: any): T {
    return row as T;
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}
