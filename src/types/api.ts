/**
 * Response envelopes for the future Spring Boot REST API. Page field names mirror
 * Spring Data's `Page` so the backend can serialise it without a mapping layer.
 */

export interface Page<T> {
  content: T[];
  /** Zero-based page index. */
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Error body returned by the backend for non-2xx responses. */
export interface ApiErrorBody {
  status: number;
  message: string;
}

export interface PageQuery {
  page?: number;
  size?: number;
}
