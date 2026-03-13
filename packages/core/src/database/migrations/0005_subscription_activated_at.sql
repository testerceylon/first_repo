-- Add subscription_activated_at to track the exact date each user upgraded to a paid plan
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_activated_at" timestamp;
