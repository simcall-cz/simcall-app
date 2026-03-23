-- Migration: Create Admin Notifications Table

CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'meeting', 'form', 'user', 'payment'
    link TEXT, -- Optional URL to redirect to
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins/service role can access this table
-- Since the frontend API uses service_role for admin tasks, we might not strictly need full RLS policies for public users,
-- but it's good practice to block anon/authenticated
CREATE POLICY "Block public access to admin_notifications"
    ON public.admin_notifications
    FOR ALL
    TO public
    USING (false);

-- The service_role key will bypass RLS.
