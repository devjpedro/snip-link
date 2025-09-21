import Elysia from "elysia";
import { createLink } from "./create-link";
import { deleteLink } from "./delete-link";
import { getLinkDetail } from "./get-link-detail";
import { getLinks } from "./get-links";
import { updateLink } from "./update-link";

export const linksRoutes = new Elysia({
  prefix: "/links",
  tags: ["links"],
})
  .use(createLink)
  .use(getLinkDetail)
  .use(updateLink)
  .use(getLinks)
  .use(deleteLink);
