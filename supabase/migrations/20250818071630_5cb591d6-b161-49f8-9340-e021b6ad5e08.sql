-- Create admin table
CREATE TABLE public.admin (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Create policy for admin table (admins can access admin data)
CREATE POLICY "Admin can access admin table" ON public.admin
FOR ALL USING (true);

-- Insert default admin user
INSERT INTO public.admin (email, password) VALUES 
('admin@connectpro.com', 'admin123');