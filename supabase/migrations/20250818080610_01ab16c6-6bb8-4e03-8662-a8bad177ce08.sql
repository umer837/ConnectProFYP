-- Fix worker sensitive data exposure by creating a view for public data only

-- Create a view that only exposes safe worker information to the public
CREATE OR REPLACE VIEW public.workers_public AS
SELECT 
  worker_id,
  first_name,
  last_name,
  designation,
  skills,
  experience,
  city,
  is_approved,
  is_available,
  preferred_working_hours,
  profile_url
FROM public.workers
WHERE is_approved = true;

-- Grant select permissions on the view to public
GRANT SELECT ON public.workers_public TO anon;
GRANT SELECT ON public.workers_public TO authenticated;

-- Update the workers table policy to be more restrictive
DROP POLICY IF EXISTS "Public can view approved worker profiles" ON public.workers;

-- Only show basic info for approved workers, hide sensitive data like CNIC, password, email, phone, etc.
CREATE POLICY "Restricted worker profile view" 
ON public.workers 
FOR SELECT 
USING (
  -- Workers can see their own full profile
  worker_id = COALESCE((current_setting('request.jwt.claims', true)::json->>'user_id')::int, 0)
  OR
  -- Admins can see all worker profiles
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = COALESCE((current_setting('request.jwt.claims', true)::json->>'email')::text, '')
  )
  OR
  -- Public can only see if worker is approved (but this won't expose sensitive columns due to RLS)
  (is_approved = true AND false) -- Disabled for now to ensure no sensitive data leaks
);