-- Add test users to the database with proper UUIDs
-- Insert user profile
INSERT INTO public.profiles (user_id, first_name, last_name, user_type, phone_number, city, date_of_birth, gender, full_address)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'John',
  'Doe',
  'user',
  '+92 300 1234567',
  'Peshawar',
  '1990-01-15',
  'male',
  'Street 5, University Town, Peshawar'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert worker profile
INSERT INTO public.profiles (user_id, first_name, last_name, user_type, phone_number, city, date_of_birth, gender, full_address)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Ahmad',
  'Khan',
  'worker',
  '+92 301 9876543',
  'Peshawar',
  '1988-05-22',
  'male',
  'Street 12, Hayatabad, Peshawar'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert worker profile details
INSERT INTO public.worker_profiles (user_id, designation, experience_years, is_verified, is_available, rating, total_jobs, skills, working_hours, cnic_number)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'plumber',
  5,
  true,
  true,
  4.8,
  127,
  ARRAY['Plumbing', 'Pipe Installation', 'Drain Cleaning', 'Water Heater Repair'],
  '9 AM - 6 PM',
  '1234567890123'
) ON CONFLICT (user_id) DO NOTHING;

-- Add another verified worker for demonstration
INSERT INTO public.profiles (user_id, first_name, last_name, user_type, phone_number, city, date_of_birth, gender, full_address)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Usman',
  'Ali',
  'worker',
  '+92 302 5555555',
  'Peshawar',
  '1985-03-10',
  'male',
  'Street 8, Board Bazaar, Peshawar'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.worker_profiles (user_id, designation, experience_years, is_verified, is_available, rating, total_jobs, skills, working_hours, cnic_number)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'electrician',
  8,
  true,
  true,
  4.9,
  203,
  ARRAY['Electrical Wiring', 'Panel Installation', 'Electrical Repairs', 'Safety Inspections'],
  '8 AM - 7 PM',
  '9876543210987'
) ON CONFLICT (user_id) DO NOTHING;

-- Add another verified worker - photographer
INSERT INTO public.profiles (user_id, first_name, last_name, user_type, phone_number, city, date_of_birth, gender, full_address)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Hassan',
  'Shah',
  'worker',
  '+92 303 7777777',
  'Peshawar',
  '1992-07-18',
  'male',
  'Street 3, Saddar, Peshawar'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.worker_profiles (user_id, designation, experience_years, is_verified, is_available, rating, total_jobs, skills, working_hours, cnic_number)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'photographer',
  4,
  true,
  true,
  4.7,
  89,
  ARRAY['Event Photography', 'Portrait Photography', 'Wedding Photography', 'Product Photography'],
  '10 AM - 8 PM',
  '5555666677778'
) ON CONFLICT (user_id) DO NOTHING;