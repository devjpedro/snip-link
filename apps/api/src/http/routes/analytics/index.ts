import Elysia from "elysia";
import { getLinkStats } from "./get-link-stats";
import { getUserStats } from "./get-user-stats";

export const analyticsRoutes = new Elysia({
  prefix: "/analytics",
  tags: ["analytics"],
})
  .use(getLinkStats)
  .use(getUserStats);
