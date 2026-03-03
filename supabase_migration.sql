-- ===========================================
-- SimCall — Fix ALL missing schema
-- Run this in Supabase SQL Editor
-- ===========================================

-- 1. Drop old CHECK constraint and add updated one
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('free', 'solo', 'team', 'team_manager', 'admin'));

-- 2. Create subscriptions table (if not exists)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  plan TEXT NOT NULL DEFAULT 'solo',
  tier INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  calls_used INTEGER NOT NULL DEFAULT 0,
  calls_limit INTEGER NOT NULL DEFAULT 50,
  agents_limit INTEGER NOT NULL DEFAULT 3,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create form_submissions table (if not exists)
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'kontakt',
  status TEXT NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT,
  message TEXT,
  meeting_date TEXT,
  meeting_time TEXT,
  team_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS (safe to run multiple times)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
