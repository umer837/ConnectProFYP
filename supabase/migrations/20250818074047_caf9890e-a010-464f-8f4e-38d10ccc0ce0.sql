-- Create storage policies for user-profiles bucket
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'user-profiles');

CREATE POLICY "Users can view their own profile pictures"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user-profiles');

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'user-profiles');

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects
FOR DELETE
USING (bucket_id = 'user-profiles');

-- Create storage policies for worker-profiles bucket
CREATE POLICY "Workers can upload their own profile pictures"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'worker-profiles');

CREATE POLICY "Workers can view their own profile pictures"
ON storage.objects
FOR SELECT
USING (bucket_id = 'worker-profiles');

CREATE POLICY "Workers can update their own profile pictures"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'worker-profiles');

CREATE POLICY "Workers can delete their own profile pictures"
ON storage.objects
FOR DELETE
USING (bucket_id = 'worker-profiles');