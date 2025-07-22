import { z } from 'zod';

// Pagination parameters interface
export interface PaginationParams {
  page: number;
  pageSize: number;
  prefix?: string;
}

// Paginated result interface
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Zod schemas for parameter validation
export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  prefix: z.string().optional(),
});

export const PaginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => {
    const num = parseInt(val || '1', 10);
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  pageSize: z.string().optional().transform((val) => {
    const num = parseInt(val || '10', 10);
    return isNaN(num) || num < 1 ? 10 : Math.min(num, 100);
  }),
});

// Helper function to create pagination metadata
export function createPaginationMeta(
  currentPage: number,
  pageSize: number,
  totalItems: number
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}