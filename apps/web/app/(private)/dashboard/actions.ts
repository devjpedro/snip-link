"use server";

import { createLink } from "@/app/http/create-link";
import { deleteLink } from "@/app/http/delete-link";
import { updateStatusLink } from "@/app/http/update-status-link";

type CreatePrivateLinkActionType = {
  originalUrl: string;
  customAlias?: string | undefined;
  isActive?: boolean | undefined;
};

export const createPrivateLinkAction = async ({
  originalUrl,
  customAlias,
  isActive,
}: CreatePrivateLinkActionType) => {
  const result = await createLink({
    originalUrl,
    customAlias,
    isActive,
    isPrivate: true,
  });

  return result;
};

export const removeLinkAction = async (linkId: string) => {
  const res = await deleteLink({
    id: linkId,
  });

  return res;
};

export const updateLinkStatusAction = async (
  linkId: string,
  isActive: boolean
) => {
  const res = await updateStatusLink({
    id: linkId,
    isActive,
  });

  return res;
};
