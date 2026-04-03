-- ============================================
-- SimCall — Call Disputes (reklamace hovorů)
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS call_disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note TEXT,
  refunded_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT
);

ALTER TABLE call_disputes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_call_disputes_call_id ON call_disputes(call_id);
CREATE INDEX IF NOT EXISTS idx_call_disputes_user_id ON call_disputes(user_id);
CREATE INDEX IF NOT EXISTS idx_call_disputes_status ON call_disputes(status);

-- Users can read their own disputes
CREATE POLICY "Users can read own disputes"
  ON call_disputes FOR SELECT
  USING (user_id = auth.uid()::text);

-- Users can create disputes for their own calls
CREATE POLICY "Users can create disputes"
  ON call_disputes FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- Service role (admin API) can do everything
CREATE POLICY "Service role manages disputes"
  ON call_disputes FOR ALL
  USING (true);
