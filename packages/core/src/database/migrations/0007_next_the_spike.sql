CREATE TABLE "blog_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"author_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"featured_image" text,
	"meta_title" text,
	"meta_description" text,
	"tags" text,
	"reading_time" text,
	"views" text DEFAULT '0',
	"rejection_reason" text,
	"approved_at" timestamp,
	"approved_by" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;