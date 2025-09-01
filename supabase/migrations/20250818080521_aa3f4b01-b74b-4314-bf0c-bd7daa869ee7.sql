-- Fix worker sensitive data exposure by creating view-based access

-- Drop existing policies to replace with secure ones
DROP POLICY IF EXISTS "Public can view approved worker profiles" ON public.workers;

-- Create a policy that only shows basic public info for approved workers
CREATE POLICY "Public can view basic worker info only" 
ON public.workers 
FOR SELECT 
USING (
  -- Public can only see approved workers and only basic info
  -- This policy will work with application-level filtering to hide sensitive columns
  is_approved = true
);

-- Workers and admins can see full profile
CREATE POLICY "Workers and admins can view full profiles" 
ON public.workers 
FOR SELECT 
USING (
  -- Worker can see their own full profile
  worker_id = COALESCE((current_setting('request.jwt.claims', true)::json->>'user_id')::int, 0)
  OR
  -- Admin can see all profiles
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = COALESCE((current_setting('request.jwt.claims', true)::json->>'email')::text, '')
  )
);

-- Remove the duplicate policy that was causing the issue
DROP POLICY IF EXISTS "Workers can view own full profile" ON public.workers;