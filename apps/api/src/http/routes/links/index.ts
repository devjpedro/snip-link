import Elysia from "elysia";
import { createLink } from "./create-link";
import { getLinkDetail } from "./get-link-detail";
import { updateLink } from "./update-link";

export const linksRoutes = new Elysia({
  prefix: "/links",
  tags: ["links"],
})
  .use(createLink)
  .use(getLinkDetail)
  .use(updateLink);
