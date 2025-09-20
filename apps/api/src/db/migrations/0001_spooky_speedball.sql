CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"short_id" text NOT NULL,
	"original_url" text NOT NULL,
	"custom_alias" text,
	"user_id" text,
	"click_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "links_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
CREATE TABLE "clicks" (
	"id" text PRIMARY KEY NOT NULL,
	"link_id" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"referrer" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "links_short_id_idx" ON "links" USING btree ("short_id");--> statement-breakpoint
CREATE UNIQUE INDEX "links_user_id_idx" ON "links" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "links_custom_alias_user_idx" ON "links" USING btree ("custom_alias","user_id");--> statement-breakpoint
CREATE INDEX "clicks_link_id_idx" ON "clicks" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX "clicks_created_at_idx" ON "clicks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "clicks_link_date_idx" ON "clicks" USING btree ("link_id","created_at");