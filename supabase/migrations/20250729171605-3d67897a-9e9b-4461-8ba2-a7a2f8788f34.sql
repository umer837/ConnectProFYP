-- Insert test users into the profiles table with proper authentication
-- Note: These will be demo users that can be created through the auth system

-- First, let's ensure we have the test user profiles ready
INSERT INTO public.profiles (user_id, first_name, last_name, user_type, phone_number, city)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'John', 'Doe', 'user', '+92 301 1234567', 'Peshawar'),
  ('22222222-2222-2222-2222-222222222222', 'Ahmad', 'Khan', 'worker', '+92 301 9876543', 'Peshawar'),
  ('33333333-3333-3333-3333-333333333333', 'Usman', 'Ali', 'worker', '+92 302 5555555', 'Peshawar'),
  ('44444444-4444-4444-4444-444444444444', 'Hassan', 'Shah', 'worker', '+92 303 7777777', 'Peshawar')
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  user_type = EXCLUDED.user_type,
  phone_number = EXCLUDED.phone_number,
  city = EXCLUDED.city;

-- Create a table to store demo login credentials
CREATE TABLE IF NOT EXISTS public.demo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hint TEXT NOT NULL, -- We'll store password hints, not actual passwords
  user_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on demo_users
ALTER TABLE public.demo_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read demo users (for authentication purposes)
CREATE POLICY "Anyone can view demo users for auth" 
ON public.demo_users 
FOR SELECT 
USING (true);

-- Insert demo user credentials
INSERT INTO public.demo_users (email, password_hint, user_id)
VALUES 
  ('user1@gmail.com', 'user1', '11111111-1111-1111-1111-111111111111'),
  ('worker1@gmail.com', 'worker1', '22222222-2222-2222-2222-222222222222'),
  ('admin@connectpro.com', 'admin', NULL)
ON CONFLICT (email) DO UPDATE SET
  password_hint = EXCLUDED.password_hint,
  user_id = EXCLUDED.user_id;