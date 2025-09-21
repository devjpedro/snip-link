DROP INDEX "links_user_id_idx";--> statement-breakpoint
CREATE INDEX "links_user_id_idx" ON "links" USING btree ("user_id");