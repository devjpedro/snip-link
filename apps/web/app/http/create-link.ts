"use server";

import { revalidateTag } from "next/cache";
import {
  type ApiError,
  type ApiResponse,
  isHTTPError,
} from "../types/api-error";
import { api } from "./api-client";

type CreateLinkRequest = {
  originalUrl: string;
  customAlias?: string | undefined;
  isActive?: boolean | undefined;
};

type CreateLinkResponse = {
  id: string;
  originalUrl: string;
  shortId: string;
  shortUrl: string;
};

export const createLink = async ({
  originalUrl,
  customAlias,
  isActive = true,
  isPrivate = true,
}: CreateLinkRequest & {
  isPrivate?: boolean;
}): Promise<ApiResponse<CreateLinkResponse>> => {
  const endpointPath = isPrivate ? "links" : "links/public";

  try {
    const result = await api
      .post<CreateLinkRequest>(endpointPath, {
        json: { originalUrl, customAlias, isActive },
      })
      .json<ApiResponse<CreateLinkResponse>>();

    if (result.success && isPrivate) {
      revalidateTag("user-stats");
      revalidateTag("user-links");
    }

    return result;
  } catch (error: unknown) {
    if (isHTTPError(error)) {
      const body = await error.response.json();
      return body as ApiError;
    }

    throw error;
  }
};
