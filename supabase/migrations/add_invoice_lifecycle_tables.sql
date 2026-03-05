-- Run this in Supabase SQL Editor

-- 1. Add billing_method to subscriptions to differentiate Stripe vs Invoice users
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS billing_method text DEFAULT 'stripe' CHECK (billing_method IN ('stripe', 'invoice'));

-- 2. Create invoice_requests table for handling upgrade/downgrade requests
CREATE TABLE IF NOT EXISTS public.invoice_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) NOT NULL,
    current_plan text NOT NULL,
    current_tier integer NOT NULL,
    requested_plan text NOT NULL,
    requested_tier integer NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read their own invoice requests"
    ON public.invoice_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoice requests"
    ON public.invoice_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can do everything (handled by service_role in API)

-- 3. Retroactively update existing users who paid by invoice
UPDATE public.subscriptions s
SET billing_method = 'invoice'
FROM public.payments p
WHERE s.user_id = p.user_id
  AND p.method = 'invoice'
  AND p.status = 'completed';
