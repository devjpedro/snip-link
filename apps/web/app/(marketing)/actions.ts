import { createLink } from "../http/create-link";

export const createLinkAction = async (
  url: string,
  userId: string | undefined
) => {
  const result = await createLink({ originalUrl: url, isPrivate: !!userId });

  return result;
};
