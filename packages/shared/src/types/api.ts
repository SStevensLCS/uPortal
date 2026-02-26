// @admissions-compass/shared - API Types
// Generic types for API request/response patterns

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/** Paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> = { data: T } | { error: ApiError };

/** Type guard to check if an API response is an error */
export function isApiError<T>(response: ApiResponse<T>): response is { error: ApiError } {
  return 'error' in response;
}

/** Type guard to check if an API response is successful */
export function isApiSuccess<T>(response: ApiResponse<T>): response is { data: T } {
  return 'data' in response;
}

// ─── Filtering ───────────────────────────────────────────────────────────────

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'like'
  | 'ilike'
  | 'is_null'
  | 'is_not_null'
  | 'between';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface FilterGroup {
  logic: 'and' | 'or';
  conditions: (FilterCondition | FilterGroup)[];
}

// ─── Sorting ─────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: string;
  direction: SortDirection;
}

// ─── Query Parameters ────────────────────────────────────────────────────────

export interface ListQueryParams {
  page?: number;
  per_page?: number;
  sort?: SortOption[];
  filters?: FilterGroup;
  search?: string;
}

// ─── Batch Operations ────────────────────────────────────────────────────────

export interface BatchOperation<T> {
  action: 'create' | 'update' | 'delete';
  id?: string;
  data?: Partial<T>;
}

export interface BatchResult {
  success: boolean;
  id: string;
  error?: ApiError;
}

export interface BatchResponse {
  results: BatchResult[];
  succeeded: number;
  failed: number;
}
