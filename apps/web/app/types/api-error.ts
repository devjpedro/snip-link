import type { HTTPError } from "ky";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  error?: never;
};

export type ApiError = {
  success: false;
  error: string;
  // biome-ignore lint/suspicious/noExplicitAny: <Any necessary>
  data?: any;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const isHTTPError = (error: unknown): error is HTTPError => {
  return error instanceof Error && "response" in error;
};
