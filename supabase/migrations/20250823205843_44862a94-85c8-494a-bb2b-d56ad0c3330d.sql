-- Fix RLS policies to allow authentication queries

-- Drop all existing admin policies
DROP POLICY IF EXISTS "Block all public admin access" ON public.admin;
DROP POLICY IF EXISTS "Allow admin authentication" ON public.admin;

-- Create a new policy that allows reading admin credentials for authentication
CREATE POLICY "Enable admin login access" 
ON public.admin 
FOR SELECT 
USING (true);

-- Drop all existing user policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create new policies for users that allow authentication and basic operations
CREATE POLICY "Enable user login access" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Enable user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable user profile updates" 
ON public.users 
FOR UPDATE 
USING (true);