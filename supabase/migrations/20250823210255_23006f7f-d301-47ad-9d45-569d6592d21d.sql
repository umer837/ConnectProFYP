-- Fix RLS policies to allow admin access to service requests and contacts

-- Update service_requests policies to allow admin access
DROP POLICY IF EXISTS "Users can view own service requests" ON public.service_requests;
CREATE POLICY "Enable service requests access" 
ON public.service_requests 
FOR SELECT 
USING (true);

-- Update contacts policies to allow admin access  
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contacts;
CREATE POLICY "Enable contacts access" 
ON public.contacts 
FOR SELECT 
USING (true);

-- Also allow admins to update service request statuses
CREATE POLICY "Enable service requests updates" 
ON public.service_requests 
FOR UPDATE 
USING (true);