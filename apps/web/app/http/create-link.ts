import {
  type ApiError,
  type ApiResponse,
  isHTTPError,
} from "../types/api-error";
import { api } from "./api-client";

type CreateLinkRequest = {
  originalUrl: string;
  customAlias?: string;
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
  isPrivate = true,
}: CreateLinkRequest & {
  isPrivate?: boolean;
}) => {
  const endpointPath = isPrivate ? "links" : "links/public";

  try {
    const result = await api
      .post<CreateLinkRequest>(endpointPath, {
        json: { originalUrl, customAlias },
      })
      .json<ApiResponse<CreateLinkResponse>>();

    return result;
  } catch (error: unknown) {
    if (isHTTPError(error)) {
      const body = await error.response.json();
      return body as ApiError;
    }

    throw error;
  }
};
