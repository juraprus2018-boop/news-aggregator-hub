-- Create a function to check if any admin exists (for first-time setup)
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
$$;

-- Allow first admin registration when no admins exist
CREATE POLICY "Allow first admin registration"
ON public.admin_users
FOR INSERT
WITH CHECK (
  NOT public.admin_exists() AND auth.uid() = user_id
);