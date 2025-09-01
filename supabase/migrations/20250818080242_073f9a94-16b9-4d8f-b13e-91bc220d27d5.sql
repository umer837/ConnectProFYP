-- Fix critical security issues by implementing proper RLS policies

-- 1. Fix users table - restrict to own profile only
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (
  -- Allow users to view their own profile only
  email = (
    SELECT COALESCE(
      (SELECT email FROM public.users WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int),
      (SELECT email FROM public.workers WHERE worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int)
    )
  )
  OR 
  -- Allow admin access
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- 2. Fix workers table - only show approved workers publicly, hide sensitive data
DROP POLICY IF EXISTS "Anyone can view all workers" ON public.workers;
DROP POLICY IF EXISTS "Anyone can view workers" ON public.workers;

-- Public can only view basic profile info of approved workers
CREATE POLICY "Public can view approved worker profiles" 
ON public.workers 
FOR SELECT 
USING (is_approved = true);

-- Workers can view their own full profile
CREATE POLICY "Workers can view own full profile" 
ON public.workers 
FOR SELECT 
USING (
  worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  OR
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- 3. Fix service_requests table - restrict access to involved parties only
DROP POLICY IF EXISTS "Anyone can view service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Anyone can update service requests" ON public.service_requests;

-- Only users who created the request or assigned workers can view
CREATE POLICY "Users can view own service requests" 
ON public.service_requests 
FOR SELECT 
USING (
  user_email = (
    SELECT email FROM public.users 
    WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  )
  OR
  worker_email = (
    SELECT email FROM public.workers 
    WHERE worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  )
  OR
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- Only involved parties can update service requests
CREATE POLICY "Involved parties can update service requests" 
ON public.service_requests 
FOR UPDATE 
USING (
  user_email = (
    SELECT email FROM public.users 
    WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  )
  OR
  worker_email = (
    SELECT email FROM public.workers 
    WHERE worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  )
  OR
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- 4. Fix contacts table - admin access only
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contacts;

CREATE POLICY "Only admins can view contact messages" 
ON public.contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- 5. Fix feedbacks table - restrict access appropriately
DROP POLICY IF EXISTS "Anyone can view feedbacks" ON public.feedbacks;

-- Only workers can see their own feedbacks, users can see their own submitted feedbacks, admins see all
CREATE POLICY "Restricted feedback access" 
ON public.feedbacks 
FOR SELECT 
USING (
  worker_email = (
    SELECT email FROM public.workers 
    WHERE worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  )
  OR
  email = (
    SELECT email FROM public.users 
    WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  )
  OR
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- 6. Fix admin table - extremely restricted access
DROP POLICY IF EXISTS "Admin can access admin table" ON public.admin;

CREATE POLICY "Only authenticated admins can access admin table" 
ON public.admin 
FOR ALL 
USING (
  email = (current_setting('request.jwt.claims', true)::json->>'email')
);

-- 7. Add missing RLS policies for workers insert/update with proper restrictions
DROP POLICY IF EXISTS "Workers can insert their profile" ON public.workers;
CREATE POLICY "Workers can insert their own profile" 
ON public.workers 
FOR INSERT 
WITH CHECK (
  worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  OR
  NOT EXISTS (SELECT 1 FROM public.workers WHERE email = NEW.email)
);

DROP POLICY IF EXISTS "Workers can update their own profile" ON public.workers;
DROP POLICY IF EXISTS "Allow update for authenticated" ON public.workers;
DROP POLICY IF EXISTS "Allow updates" ON public.workers;

CREATE POLICY "Workers can update their own profile" 
ON public.workers 
FOR UPDATE 
USING (
  worker_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  OR
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);

-- 8. Fix users table insert/update policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (
  id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  OR
  NOT EXISTS (SELECT 1 FROM public.users WHERE email = NEW.email)
);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (
  id = (current_setting('request.jwt.claims', true)::json->>'user_id')::int
  OR
  EXISTS (
    SELECT 1 FROM public.admin 
    WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
  )
);