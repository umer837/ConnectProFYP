-- Add phone_number column to service_requests table
ALTER TABLE public.service_requests 
ADD COLUMN phone_number character varying;