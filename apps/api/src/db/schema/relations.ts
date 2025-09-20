import { relations } from "drizzle-orm";
import { clicks } from "./clicks";
import { links } from "./links";
import { users } from "./users";

export const usersRelations = relations(users, ({ many }) => {
  return {
    links: many(links, {
      relationName: "user_links",
    }),
  };
});

export const linksRelations = relations(links, ({ one, many }) => {
  return {
    user: one(users, {
      fields: [links.userId],
      references: [users.id],
      relationName: "user_links",
    }),
    clicks: many(clicks, {
      relationName: "link_clicks",
    }),
  };
});

export const clicksRelations = relations(clicks, ({ one }) => {
  return {
    link: one(links, {
      fields: [clicks.linkId],
      references: [links.id],
      relationName: "link_clicks",
    }),
  };
});
