-- Migration: Add user_read column to support_tickets
-- Run this in Supabase SQL Editor

-- Add user_read column (default true = user has seen the ticket, no pending response)
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS user_read BOOLEAN DEFAULT true;

-- Set all existing tickets with admin_note as unread (user hasn't seen the response yet)
-- You can skip this if you want all existing tickets to start as "read"
-- UPDATE support_tickets SET user_read = false WHERE admin_note IS NOT NULL;
