import Elysia from "elysia";
import { changeStatusLink } from "./change-status-link";
import { createPrivateLink } from "./create-link";
import { createPublicLink } from "./create-public-link";
import { deleteLink } from "./delete-link";
import { getLinkDetail } from "./get-link-detail";
import { getLinks } from "./get-links";
import { updateLink } from "./update-link";

export const linksRoutes = new Elysia({
  prefix: "/links",
  tags: ["links"],
})
  .use(createPublicLink)
  .use(createPrivateLink)
  .use(getLinkDetail)
  .use(updateLink)
  .use(getLinks)
  .use(deleteLink)
  .use(changeStatusLink);
