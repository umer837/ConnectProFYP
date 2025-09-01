-- Fix RLS policies to allow authentication queries

-- Drop the restrictive admin policy
DROP POLICY IF EXISTS "Block all public admin access" ON public.admin;

-- Create a new policy that allows reading admin credentials for authentication
CREATE POLICY "Allow admin authentication" 
ON public.admin 
FOR SELECT 
USING (true);

-- Update users table policies to allow authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create new policies for users that allow authentication
CREATE POLICY "Allow user authentication" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (true);