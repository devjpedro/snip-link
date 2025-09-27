import type { HTTPError } from "ky";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  error?: never;
};

export type ApiError = {
  success: false;
  error: string;
  data?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const isHTTPError = (error: unknown): error is HTTPError => {
  return error instanceof Error && "response" in error;
};
