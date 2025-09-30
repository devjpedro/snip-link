"use server";

import {
  type ApiError,
  type ApiResponse,
  isHTTPError,
} from "../types/api-error";
import type { UserStatsData } from "../types/user-stats";
import { api } from "./api-client";

export const getUserStats = async (): Promise<ApiResponse<UserStatsData>> => {
  try {
    const result = await api
      .get("analytics", {
        next: {
          tags: ["user-stats"],
        },
      })
      .json<ApiResponse<UserStatsData>>();

    return result;
  } catch (error) {
    if (isHTTPError(error)) {
      const body = await error.response.json();
      return body as ApiError;
    }

    throw error;
  }
};
