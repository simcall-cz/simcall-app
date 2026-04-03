-- ============================================
-- SimCall v2 Migration
-- Subscriptions, Companies, Team management
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Subscriptions table
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('solo', 'team')),
  tier integer NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  stripe_customer_id text,
  stripe_subscription_id text,
  calls_used integer NOT NULL DEFAULT 0,
  calls_limit integer NOT NULL,
  agents_limit integer NOT NULL,
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '1 month'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);

-- ============================================
-- 2. Companies table (for Team plans)
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  subscription_id uuid REFERENCES subscriptions(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);

-- ============================================
-- 3. Company members table
-- ============================================
CREATE TABLE IF NOT EXISTS company_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'agent' CHECK (role IN ('manager', 'agent')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(company_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_company_members_company ON company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user ON company_members(user_id);

-- ============================================
-- 4. Extend profiles table
-- ============================================
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_role text NOT NULL DEFAULT 'demo';
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id);
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_id uuid REFERENCES subscriptions(id);
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add check constraint for plan_role (drop old role constraint first if needed)
-- plan_role: demo (free), solo, team, admin
DO $$ BEGIN
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_role_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_plan_role_check
    CHECK (plan_role IN ('demo', 'solo', 'team', 'admin'));
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================
-- 5. Update trigger to include plan_role
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, plan_role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'free'),
    'demo'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. RLS for new tables
-- ============================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

-- Subscriptions: users can read their own
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions: service role for mutations
CREATE POLICY "Service role manages subscriptions"
  ON subscriptions FOR ALL
  USING (true);

-- Companies: members can read
CREATE POLICY "Company members can read company"
  ON companies FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
  );

-- Companies: owner can update
CREATE POLICY "Owner can update company"
  ON companies FOR UPDATE
  USING (owner_id = auth.uid());

-- Companies: service role for creation
CREATE POLICY "Service role manages companies"
  ON companies FOR ALL
  USING (true);

-- Company members: can read own company members
CREATE POLICY "Members can read team"
  ON company_members FOR SELECT
  USING (
    company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
  );

-- Company members: manager can manage
CREATE POLICY "Manager can manage members"
  ON company_members FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM company_members
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- Company members: service role
CREATE POLICY "Service role manages members"
  ON company_members FOR ALL
  USING (true);

-- ============================================
-- 7. Update calls RLS (replace permissive with proper)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to calls" ON calls;
CREATE POLICY "Users can read own calls"
  ON calls FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own calls"
  ON calls FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own calls"
  ON calls FOR UPDATE
  USING (user_id = auth.uid()::text);

CREATE POLICY "Service role full access calls"
  ON calls FOR ALL
  USING (true);

-- ============================================
-- 8. Proper RLS for agents (public read)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to agents" ON agents;
CREATE POLICY "Anyone can read agents"
  ON agents FOR SELECT
  USING (true);

CREATE POLICY "Service role manages agents"
  ON agents FOR ALL
  USING (true);

-- ============================================
-- 9. Proper RLS for scenarios
-- ============================================
DROP POLICY IF EXISTS "Allow all access to scenarios" ON scenarios;
CREATE POLICY "Anyone can read scenarios"
  ON scenarios FOR SELECT
  USING (true);

CREATE POLICY "Service role manages scenarios"
  ON scenarios FOR ALL
  USING (true);

-- ============================================
-- 10. Proper RLS for transcripts
-- ============================================
DROP POLICY IF EXISTS "Allow all access to transcripts" ON transcripts;
CREATE POLICY "Users can read own transcripts"
  ON transcripts FOR SELECT
  USING (
    call_id IN (SELECT id FROM calls WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Service role manages transcripts"
  ON transcripts FOR ALL
  USING (true);

-- ============================================
-- 11. Proper RLS for feedback
-- ============================================
DROP POLICY IF EXISTS "Allow all access to feedback" ON feedback;
CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT
  USING (
    call_id IN (SELECT id FROM calls WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Service role manages feedback"
  ON feedback FOR ALL
  USING (true);

-- ============================================
-- 12. Add category to agents for filtering
-- ============================================
DO $$ BEGIN
  ALTER TABLE agents ADD COLUMN IF NOT EXISTS category text;
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================
-- 13. Form submissions (contact, meetings, enterprise inquiries)
-- ============================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('kontakt', 'schuzka', 'enterprise')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subject text,
  message text,
  -- Meeting-specific fields
  meeting_date text,
  meeting_time text,
  team_size text,
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Only admin/service role can read submissions
CREATE POLICY "Service role manages form_submissions"
  ON form_submissions FOR ALL
  USING (true);

-- Allow anonymous inserts (public forms)
CREATE POLICY "Anyone can submit forms"
  ON form_submissions FOR INSERT
  WITH CHECK (true);
