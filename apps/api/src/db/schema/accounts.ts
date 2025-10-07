import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users";

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .$onUpdate(() => new Date())
    .notNull(),
});
