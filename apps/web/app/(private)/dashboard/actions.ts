"use server";

import { createLink } from "@/app/http/create-link";

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
