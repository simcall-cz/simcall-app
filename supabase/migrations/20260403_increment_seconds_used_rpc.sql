-- Migration: add atomic increment_seconds_used RPC function
-- Fixes a race condition in addSecondsUsed where concurrent reads followed by
-- writes could cause lost updates. This function performs the increment as a
-- single atomic UPDATE inside Postgres, eliminating the read-modify-write gap.

CREATE OR REPLACE FUNCTION increment_seconds_used(sub_id uuid, additional_seconds int)
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET seconds_used = COALESCE(seconds_used, 0) + additional_seconds,
      updated_at = now()
  WHERE id = sub_id;
END;
$$ LANGUAGE plpgsql;
