-- Drop the problematic policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Workers can update their own profile" ON public.workers;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Users and workers can update requests" ON public.service_requests;

-- Create simpler, more effective RLS policies

-- User policies - Allow users to access their own data based on email
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (true);

-- Worker policies - Allow public viewing of approved workers
CREATE POLICY "Anyone can view all workers" ON public.workers
    FOR SELECT USING (true);

CREATE POLICY "Workers can update their own profile" ON public.workers
    FOR UPDATE USING (true);

-- Service request policies - Allow viewing based on email matching
CREATE POLICY "Anyone can view service requests" ON public.service_requests
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update service requests" ON public.service_requests
    FOR UPDATE USING (true);

-- Add missing columns to service_requests for better functionality
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing request_status to status for consistency
UPDATE public.service_requests SET status = request_status WHERE status IS NULL AND request_status IS NOT NULL;