import type { ApiResponse, ApiSuccess } from "@/app/types/api-error";

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.success;
}
