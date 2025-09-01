-- Enable RLS on ALL tables in public schema (some may have been missed)
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_record.tablename);
    END LOOP;
END
$$;

-- Verify all tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN 'RLS ENABLED'
        ELSE 'RLS DISABLED - NEEDS FIX'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;