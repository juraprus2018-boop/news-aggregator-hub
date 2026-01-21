-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Create a new policy that doesn't cause recursion by using auth.uid() directly
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage their own record"
ON public.admin_users
FOR ALL
USING (auth.uid() = user_id);