"use server";

import { revalidateTag } from "next/cache";
import { api } from "./api-client";

type UpdateStatusLinkRequest = {
  id: string;
  isActive: boolean;
};

type UpdateStatusLinkResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export const updateStatusLink = async ({
  id,
  isActive,
}: UpdateStatusLinkRequest) => {
  const result = await api
    .patch<UpdateStatusLinkRequest>(`links/${id}/status`, {
      json: { isActive },
    })
    .json<UpdateStatusLinkResponse>();

  if (result.success) {
    revalidateTag("user-stats");
    revalidateTag("user-links");
  }

  return result;
};
