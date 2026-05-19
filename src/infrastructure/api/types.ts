/**
 * Shared API Types - Discriminated unions for async state
 */

export type AsyncData<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; cachedAt?: string }
  | { status: "error"; error: string; code?: number }
  | { status: "empty" };

export function isSuccess<T>(
  state: AsyncData<T>,
): state is { status: "success"; data: T } {
  return state.status === "success";
}

export function isError<T>(
  state: AsyncData<T>,
): state is { status: "error"; error: string } {
  return state.status === "error";
}

export function hasData<T>(
  state: AsyncData<T>,
): state is { status: "success"; data: T } {
  return state.status === "success";
}

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 503 is used both by an upstream-reported Service Unavailable response and
// by our client-side classification of connection failures (DNS, refused,
// fetch TypeError). React Query and feature code can branch on this code
// to skip retries and route through the platform-status fallback.
export const UNREACHABLE_CODE = 503;
export const UNREACHABLE_MESSAGE = "API unreachable";

export function isUnreachableError(err: unknown): err is ApiError {
  return err instanceof ApiError && err.code === UNREACHABLE_CODE;
}

// error.tsx receives serialized Error objects, so instanceof checks fail.
// Match on the sentinel message instead.
export function isUnreachableErrorMessage(err: { message?: string }): boolean {
  return err.message === UNREACHABLE_MESSAGE;
}

export interface FetchOptions {
  revalidate?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
