import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const verifications = pgTable("verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),
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
});
