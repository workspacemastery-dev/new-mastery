-- Confirm existing email/password users where confirmation is missing
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- Ensure existing auth users have public profiles
INSERT INTO public.profiles (user_id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', '')
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

-- Prevent duplicate global super_admin role rows caused by NULL academy_id
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_unique_global_role
ON public.user_roles (user_id, role)
WHERE academy_id IS NULL;

-- Prevent duplicate academy-scoped role rows
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_unique_academy_role
ON public.user_roles (user_id, role, academy_id)
WHERE academy_id IS NOT NULL;

-- Public-safe status check: exposes only whether a bootstrap is needed
CREATE OR REPLACE FUNCTION public.needs_super_admin_bootstrap()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'super_admin'
  );
$$;

-- Emergency role recovery for a logged-in account only when there is no super admin
CREATE OR REPLACE FUNCTION public.claim_first_super_admin(_full_name text DEFAULT '')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'غير مصرح';
  END IF;

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin') THEN
    RAISE EXCEPTION 'يوجد سوبر أدمن بالفعل';
  END IF;

  INSERT INTO public.profiles (user_id, full_name)
  VALUES (auth.uid(), COALESCE(TRIM(_full_name), ''))
  ON CONFLICT (user_id) DO UPDATE
  SET full_name = CASE
    WHEN COALESCE(TRIM(EXCLUDED.full_name), '') = '' THEN public.profiles.full_name
    ELSE EXCLUDED.full_name
  END,
  updated_at = now();

  INSERT INTO public.user_roles (user_id, role, academy_id)
  VALUES (auth.uid(), 'super_admin', NULL)
  ON CONFLICT DO NOTHING;
END;
$$;

-- Recreate teacher listing with expanded return shape
DROP FUNCTION IF EXISTS public.admin_list_teachers();
CREATE FUNCTION public.admin_list_teachers()
RETURNS TABLE(
  user_id uuid,
  email text,
  full_name text,
  academy_id uuid,
  academy_name text,
  status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'غير مصرح';
  END IF;

  RETURN QUERY
  SELECT
    ur.user_id,
    u.email::text,
    COALESCE(p.full_name, u.raw_user_meta_data->>'full_name', '')::text AS full_name,
    ur.academy_id,
    a.name::text AS academy_name,
    CASE WHEN u.banned_until IS NOT NULL AND u.banned_until > now() THEN 'disabled' ELSE 'active' END::text AS status,
    u.created_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  LEFT JOIN public.profiles p ON p.user_id = ur.user_id
  LEFT JOIN public.academies a ON a.id = ur.academy_id
  WHERE ur.role = 'teacher'
  ORDER BY u.created_at DESC;
END;
$$;