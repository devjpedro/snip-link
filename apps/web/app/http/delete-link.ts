"use server";

import { revalidateTag } from "next/cache";
import { api } from "./api-client";

type DeleteLinkRequest = {
  id: string;
};

type DeleteLinkResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export const deleteLink = async ({ id }: DeleteLinkRequest) => {
  const result = await api
    .delete<DeleteLinkRequest>(`links/${id}`)
    .json<DeleteLinkResponse>();

  if (result.success) {
    revalidateTag("user-stats");
    revalidateTag("user-links");
  }

  return result;
};
