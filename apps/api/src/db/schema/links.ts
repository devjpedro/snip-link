import { randomUUIDv7 } from "bun";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const links = pgTable(
  "links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUIDv7()),
    shortId: text("short_id").notNull().unique(),
    originalUrl: text("original_url").notNull(),
    customAlias: text("custom_alias"),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    clickCount: integer("click_count").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("links_short_id_idx").on(table.shortId),
    index("links_user_id_idx").on(table.userId),
    uniqueIndex("links_custom_alias_user_idx").on(
      table.customAlias,
      table.userId
    ),
  ]
);
