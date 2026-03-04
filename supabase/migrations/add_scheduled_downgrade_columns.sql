-- Add scheduled downgrade columns to subscriptions table
-- Run this in Supabase SQL Editor

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS scheduled_plan text DEFAULT NULL;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS scheduled_tier integer DEFAULT NULL;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS scheduled_calls_limit integer DEFAULT NULL;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS scheduled_agents_limit integer DEFAULT NULL;
