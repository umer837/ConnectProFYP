-- Fix critical security issues - remove overly permissive policies first

-- Clean up existing problematic policies
DROP POLICY IF EXISTS "Public can view approved worker profiles" ON public.workers;
DROP POLICY IF EXISTS "Workers can view own full profile" ON public.workers;
DROP POLICY IF EXISTS "Users can view own service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Involved parties can update service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contacts;
DROP POLICY IF EXISTS "Restricted feedback access" ON public.feedbacks;
DROP POLICY IF EXISTS "Only authenticated admins can access admin table" ON public.admin;

-- 1. Secure workers table - restrict sensitive data access
CREATE POLICY "Public can view approved worker profiles" 
ON public.workers 
FOR SELECT 
USING (is_approved = true);

-- 2. Secure service requests - only involved parties
CREATE POLICY "Users can view own service requests" 
ON public.service_requests 
FOR SELECT 
USING (false); -- Temporarily block all access until proper auth is implemented

-- 3. Secure contacts - admin only
CREATE POLICY "Only admins can view contact messages" 
ON public.contacts 
FOR SELECT 
USING (false); -- Block access until proper admin auth is implemented

-- 4. Secure feedbacks - restricted access
CREATE POLICY "Restricted feedback access" 
ON public.feedbacks 
FOR SELECT 
USING (false); -- Block access until proper auth is implemented

-- 5. Secure admin table - no public access
CREATE POLICY "Block all public admin access" 
ON public.admin 
FOR ALL 
USING (false);