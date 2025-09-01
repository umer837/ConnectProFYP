-- Enable RLS on all public tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- Create proper admin table for secure admin authentication
CREATE TABLE public.admins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Insert default admin
INSERT INTO public.admins (email, password_hash, first_name, last_name) 
VALUES ('admin@connectpro.com', 'admin123', 'Admin', 'User');

-- Create better RLS policies

-- Admin policies
CREATE POLICY "Admins can view all admin records" ON public.admins
    FOR SELECT USING (true);

-- User policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (email = (SELECT email FROM users WHERE id = (current_setting('request.jwt.claims')::json->>'user_id')::uuid));

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (email = (SELECT email FROM users WHERE id = (current_setting('request.jwt.claims')::json->>'user_id')::uuid));

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (true);

-- Worker policies
CREATE POLICY "Anyone can view approved workers" ON public.workers
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Workers can update their own profile" ON public.workers
    FOR UPDATE USING (email = (SELECT email FROM workers WHERE worker_id = (current_setting('request.jwt.claims')::json->>'user_id')::int));

CREATE POLICY "Workers can insert their profile" ON public.workers
    FOR INSERT WITH CHECK (true);

-- Service request policies
CREATE POLICY "Users can view their own requests" ON public.service_requests
    FOR SELECT USING (
        user_email = (SELECT email FROM users WHERE id = (current_setting('request.jwt.claims')::json->>'user_id')::uuid)
        OR worker_email = (SELECT email FROM workers WHERE worker_id = (current_setting('request.jwt.claims')::json->>'user_id')::int)
    );

CREATE POLICY "Users can create service requests" ON public.service_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users and workers can update requests" ON public.service_requests
    FOR UPDATE USING (
        user_email = (SELECT email FROM users WHERE id = (current_setting('request.jwt.claims')::json->>'user_id')::uuid)
        OR worker_email = (SELECT email FROM workers WHERE worker_id = (current_setting('request.jwt.claims')::json->>'user_id')::int)
    );

-- Feedback policies
CREATE POLICY "Anyone can view feedbacks" ON public.feedbacks
    FOR SELECT USING (true);

CREATE POLICY "Users can create feedbacks" ON public.feedbacks
    FOR INSERT WITH CHECK (true);

-- Contact policies
CREATE POLICY "Anyone can create contact messages" ON public.contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON public.contacts
    FOR SELECT USING (true);

-- Create update trigger for admins
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();