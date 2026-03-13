ALTER TABLE "users" ADD COLUMN "plan" text DEFAULT 'basic' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_current_period_end" timestamp;