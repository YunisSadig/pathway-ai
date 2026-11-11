/** Response envelopes of the Spring Boot REST API (`pathway-ai-backend`). */

export interface Page<T> {
  content: T[];
  /** Zero-based page index. */
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface FieldViolation {
  field: string;
  message: string;
}

/** Body of every non-2xx API response. `violations` is omitted when empty. */
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  violations?: FieldViolation[];
}

export interface PageQuery {
  /** Zero-based. */
  page?: number;
  size?: number;
}
