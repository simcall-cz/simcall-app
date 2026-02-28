-- ============================================
-- ELITE AI - Auth & Profiles Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Profiles table (linked to Supabase Auth users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'free' check (role in ('free', 'paid')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for quick lookups
create index if not exists idx_profiles_role on profiles(role);

-- RLS policies for profiles
alter table profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Allow insert from authenticated users (for registration)
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Service role can do anything (for server-side operations)
create policy "Service role full access"
  on profiles for all
  using (true);

-- ============================================
-- Auto-create profile on user signup (trigger)
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'free')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: create profile when new user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
