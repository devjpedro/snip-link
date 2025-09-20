import Elysia from "elysia";
import { createLink } from "./create-link";

export const linksRoutes = new Elysia({
  prefix: "/links",
  tags: ["links"],
}).use(createLink);
