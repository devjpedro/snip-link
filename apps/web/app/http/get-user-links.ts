import { headers } from "next/headers";
import { api } from "./api-client";

type UserLinksRequest = {
  linkId?: string;
  from?: string;
  to?: string;
  status?: "active" | "inactive";
  pageIndex?: number;
};

export type UserLinks = {
  id: string;
  shortId: string;
  originalUrl: string;
  customAlias: string | null;
  userId: string | null;
  clickCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Meta = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
};

type UserLinksResponse = {
  links: UserLinks[];
  meta: Meta;
};

export const getUserLinks = async ({
  linkId,
  from,
  to,
  status,
  pageIndex = 0,
}: UserLinksRequest = {}) => {
  const result = await api
    .get("links", {
      headers: await headers(),
      searchParams: {
        linkId,
        from,
        to,
        status,
        pageIndex,
      },
    })
    .json<UserLinksResponse>();

  return result;
};
