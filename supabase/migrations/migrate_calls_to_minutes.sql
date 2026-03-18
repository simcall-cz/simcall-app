-- ============================================================
-- Migration: calls-based → minutes-based usage tracking
-- ============================================================
-- Changes:
--   calls_used (count of calls)  → seconds_used (total seconds consumed)
--   calls_limit (max calls)      → minutes_limit (max minutes)
--   scheduled_calls_limit        → scheduled_minutes_limit
-- ============================================================

-- 1. Rename columns
ALTER TABLE subscriptions RENAME COLUMN calls_used TO seconds_used;
ALTER TABLE subscriptions RENAME COLUMN calls_limit TO minutes_limit;
ALTER TABLE subscriptions RENAME COLUMN scheduled_calls_limit TO scheduled_minutes_limit;

-- 2. Reset seconds_used to 0 for all active subscriptions
--    (old values were call counts, not seconds — meaningless in new model)
UPDATE subscriptions SET seconds_used = 0 WHERE status = 'active';

-- 3. Set sensible defaults
ALTER TABLE subscriptions ALTER COLUMN seconds_used SET DEFAULT 0;
ALTER TABLE subscriptions ALTER COLUMN minutes_limit SET DEFAULT 100;
