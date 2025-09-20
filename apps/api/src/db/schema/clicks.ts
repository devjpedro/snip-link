import { randomUUIDv7 } from "bun";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { links } from "./links";

export const clicks = pgTable(
  "clicks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUIDv7()),
    linkId: text("link_id")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("clicks_link_id_idx").on(table.linkId),
    index("clicks_created_at_idx").on(table.createdAt),
    index("clicks_link_date_idx").on(table.linkId, table.createdAt),
  ]
);
