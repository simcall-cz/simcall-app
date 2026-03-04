-- Payments table for tracking all payments (Stripe + Invoice)
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_name TEXT,
  plan TEXT NOT NULL,
  tier INTEGER NOT NULL,
  amount INTEGER NOT NULL,           -- in CZK
  method TEXT CHECK (method IN ('stripe', 'invoice')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_session_id TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: only service role can insert/update
CREATE POLICY "Service role full access" ON payments
  FOR ALL USING (true) WITH CHECK (true);
