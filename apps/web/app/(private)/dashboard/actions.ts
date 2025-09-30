"use server";

import { createLink } from "@/app/http/create-link";
import { deleteLink } from "@/app/http/delete-link";

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

export async function removeLinkAction(linkId: string) {
  const res = await deleteLink({
    id: linkId,
  });

  return res;
}
