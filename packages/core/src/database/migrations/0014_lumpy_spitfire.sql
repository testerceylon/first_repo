CREATE TABLE "service_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text NOT NULL,
	"client_company" text,
	"client_website" text,
	"project_type" text NOT NULL,
	"project_title" text NOT NULL,
	"project_description" text NOT NULL,
	"budget_range" text NOT NULL,
	"timeline" text,
	"referral_source" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"user_id" text,
	"admin_note" text,
	"rejection_reason" text,
	"approved_at" timestamp,
	"rejected_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"sender_role" text NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"content" text NOT NULL,
	"message_type" text DEFAULT 'text' NOT NULL,
	"paypal_link" text,
	"payment_amount" text,
	"payment_description" text,
	"is_read_by_client" boolean DEFAULT false,
	"is_read_by_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "service_messages" ADD CONSTRAINT "service_messages_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;