CREATE TABLE "tiktok_downloads" (
	"id" text PRIMARY KEY NOT NULL,
	"video_url" text NOT NULL,
	"author_name" text,
	"title" text,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tiktok_downloads" ADD CONSTRAINT "tiktok_downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;