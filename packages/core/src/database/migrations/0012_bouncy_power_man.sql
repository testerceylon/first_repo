CREATE TABLE "thumbnail_downloads" (
	"id" text PRIMARY KEY NOT NULL,
	"video_id" text NOT NULL,
	"resolution" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "thumbnail_downloads" ADD CONSTRAINT "thumbnail_downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;