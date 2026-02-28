-- ============================================
-- ELITE AI - Supabase Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Agents table
-- ============================================
create table agents (
  id text primary key,
  name text not null,
  personality text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  avatar_initials text not null,
  traits jsonb default '[]',
  elevenlabs_agent_id text,
  example_scenario text,
  created_at timestamptz default now()
);

-- ============================================
-- Scenarios table
-- ============================================
create table scenarios (
  id text primary key,
  title text not null,
  description text,
  category text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  objectives jsonb default '[]',
  agent_id text references agents(id),
  created_at timestamptz default now()
);

-- ============================================
-- Calls table
-- ============================================
create table calls (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'user-1',
  agent_id text references agents(id),
  scenario_id text references scenarios(id),
  conversation_id text,
  date timestamptz default now(),
  duration_seconds integer default 0,
  success_rate integer default 0,
  audio_url text,
  status text not null default 'pending' check (status in ('pending', 'active', 'processing', 'completed', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Transcripts table
-- ============================================
create table transcripts (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid references calls(id) on delete cascade,
  speaker text not null check (speaker in ('user', 'ai')),
  text text not null,
  timestamp_label text not null default '0:00',
  highlight text check (highlight is null or highlight in ('good', 'mistake')),
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- ============================================
-- Feedback table
-- ============================================
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid references calls(id) on delete cascade unique,
  overall_score integer not null default 0,
  strengths jsonb default '[]',
  improvements jsonb default '[]',
  filler_words jsonb default '[]',
  recommendations jsonb default '[]',
  created_at timestamptz default now()
);

-- ============================================
-- Indexes
-- ============================================
create index idx_calls_user_id on calls(user_id);
create index idx_calls_status on calls(status);
create index idx_calls_conversation_id on calls(conversation_id);
create index idx_transcripts_call_id on transcripts(call_id);
create index idx_feedback_call_id on feedback(call_id);

-- ============================================
-- Storage bucket for recordings
-- Run in Supabase Dashboard: Storage > Create bucket "call-recordings" (public)
-- ============================================

-- ============================================
-- Row Level Security (RLS)
-- ============================================
alter table agents enable row level security;
alter table scenarios enable row level security;
alter table calls enable row level security;
alter table transcripts enable row level security;
alter table feedback enable row level security;

-- Allow all access for now (before auth is implemented)
create policy "Allow all access to agents" on agents for all using (true);
create policy "Allow all access to scenarios" on scenarios for all using (true);
create policy "Allow all access to calls" on calls for all using (true);
create policy "Allow all access to transcripts" on transcripts for all using (true);
create policy "Allow all access to feedback" on feedback for all using (true);
