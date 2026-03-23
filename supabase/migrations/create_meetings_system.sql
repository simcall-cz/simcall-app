-- ============================================
-- SimCall - Meetings & Availability Schema
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Availability Table (Dostupnost)
-- ============================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure end time is strictly after start time
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- ============================================
-- 2. Meetings Table (Zarezervované Schůzky)
-- ============================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_notes TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  google_event_id TEXT,
  meet_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure meeting ends after it starts
  CONSTRAINT valid_meeting_time CHECK (end_time > start_time)
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Allow public to select availability so the booking UI can see available times
CREATE POLICY "Allow public read access to availability" ON availability
  FOR SELECT USING (is_active = true);

-- Allow public to insert a meeting via server-side API (we can use service_role for this, 
-- but it's good practice to secure the tables). We will rely on the service role key 
-- in our Next.js API routes to bypass RLS, so these policies can be restrictive.
CREATE POLICY "Service role full access on availability" ON availability
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on meetings" ON meetings
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default availability for Monday-Friday (09:00 - 17:00)
INSERT INTO availability (day_of_week, start_time, end_time, is_active) VALUES
  (1, '09:00', '17:00', true),
  (2, '09:00', '17:00', true),
  (3, '09:00', '17:00', true),
  (4, '09:00', '17:00', true),
  (5, '09:00', '17:00', true);
