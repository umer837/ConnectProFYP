-- Create a table to store demo login credentials without foreign key to profiles
CREATE TABLE IF NOT EXISTS public.demo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hint TEXT NOT NULL,
  user_type TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  city TEXT,
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
INSERT INTO public.demo_users (email, password_hint, user_type, first_name, last_name, phone_number, city)
VALUES 
  ('user1@gmail.com', 'user1', 'user', 'John', 'Doe', '+92 301 1234567', 'Peshawar'),
  ('worker1@gmail.com', 'worker1', 'worker', 'Ahmad', 'Khan', '+92 301 9876543', 'Peshawar'),
  ('admin@connectpro.com', 'admin', 'admin', 'Admin', 'User', '+92 300 0000000', 'Peshawar')
ON CONFLICT (email) DO UPDATE SET
  password_hint = EXCLUDED.password_hint,
  user_type = EXCLUDED.user_type,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone_number = EXCLUDED.phone_number,
  city = EXCLUDED.city;

-- Create demo worker profiles table for display
CREATE TABLE IF NOT EXISTS public.demo_worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  designation TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 0.00,
  total_jobs INTEGER DEFAULT 0,
  skills TEXT[],
  working_hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on demo_worker_profiles
ALTER TABLE public.demo_worker_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read demo worker profiles
CREATE POLICY "Anyone can view demo worker profiles" 
ON public.demo_worker_profiles 
FOR SELECT 
USING (true);

-- Insert demo worker profiles
INSERT INTO public.demo_worker_profiles (email, designation, experience_years, is_verified, is_available, rating, total_jobs, skills, working_hours)
VALUES 
  ('worker1@gmail.com', 'plumber', 5, true, true, 4.8, 127, ARRAY['Plumbing', 'Pipe Installation', 'Drain Cleaning', 'Water Heater Repair'], '9 AM - 6 PM'),
  ('worker2@demo.com', 'electrician', 8, true, true, 4.9, 203, ARRAY['Electrical Wiring', 'Panel Installation', 'Electrical Repairs', 'Safety Inspections'], '8 AM - 7 PM'),
  ('worker3@demo.com', 'photographer', 4, true, true, 4.7, 89, ARRAY['Event Photography', 'Portrait Photography', 'Wedding Photography', 'Product Photography'], '10 AM - 8 PM')
ON CONFLICT (email) DO UPDATE SET
  designation = EXCLUDED.designation,
  experience_years = EXCLUDED.experience_years,
  is_verified = EXCLUDED.is_verified,
  is_available = EXCLUDED.is_available,
  rating = EXCLUDED.rating,
  total_jobs = EXCLUDED.total_jobs,
  skills = EXCLUDED.skills,
  working_hours = EXCLUDED.working_hours;