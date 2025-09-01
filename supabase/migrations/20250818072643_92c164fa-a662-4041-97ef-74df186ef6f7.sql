-- Add profile_url column to users table
ALTER TABLE public.users 
ADD COLUMN profile_url TEXT;

-- Add profile_url column to workers table  
ALTER TABLE public.workers 
ADD COLUMN profile_url TEXT;