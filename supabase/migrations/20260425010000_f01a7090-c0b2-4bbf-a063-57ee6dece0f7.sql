CREATE OR REPLACE FUNCTION public.admin_list_teachers()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  academy_id uuid,
  academy_name text
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
    COALESCE(p.full_name, '')::text AS full_name,
    ur.academy_id,
    a.name::text AS academy_name
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  LEFT JOIN public.profiles p ON p.user_id = ur.user_id
  LEFT JOIN public.academies a ON a.id = ur.academy_id
  WHERE ur.role = 'teacher'
  ORDER BY u.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_teachers() TO authenticated;