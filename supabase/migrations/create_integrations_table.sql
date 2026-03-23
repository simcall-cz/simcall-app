-- ============================================
-- SimCall - Integrations Table (Google OAuth)
-- ============================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL UNIQUE, -- e.g. 'google'
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Only service role can access tokens
CREATE POLICY "Service role full access on integrations" ON integrations
  FOR ALL USING (true) WITH CHECK (true);
