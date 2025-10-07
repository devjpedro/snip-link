import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users";

export const links = pgTable(
  "links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    shortId: text("short_id").notNull().unique(),
    originalUrl: text("original_url").notNull(),
    customAlias: text("custom_alias"),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    clickCount: integer("click_count").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("links_short_id_idx").on(table.shortId),
    index("links_user_id_idx").on(table.userId),
    index("links_user_active_idx").on(table.userId, table.isActive),
    uniqueIndex("links_custom_alias_user_idx").on(
      table.customAlias,
      table.userId
    ),
  ]
);
