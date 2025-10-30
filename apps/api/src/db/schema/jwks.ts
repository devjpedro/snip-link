import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const jwkss = pgTable("jwkss", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  publicKey: text("publicKey").notNull(),
  privateKey: text("privateKey").notNull(),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
});
