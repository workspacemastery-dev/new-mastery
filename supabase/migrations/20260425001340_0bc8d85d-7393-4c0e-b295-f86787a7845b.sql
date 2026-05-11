
-- =========================================================
-- 1. STUDENTS TABLE (ID-based login, scoped per academy)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  student_code TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (academy_id, student_code)
);

CREATE INDEX IF NOT EXISTS idx_students_academy ON public.students(academy_id);
CREATE INDEX IF NOT EXISTS idx_students_code ON public.students(student_code);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- timestamp trigger
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 2. STUDENT SESSIONS (token issued by student_login RPC)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.student_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_student_sessions_token ON public.student_sessions(token);
ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 3. RLS for students
-- =========================================================
DROP POLICY IF EXISTS "Super admins manage students" ON public.students;
CREATE POLICY "Super admins manage students" ON public.students
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Teachers manage own academy students" ON public.students;
CREATE POLICY "Teachers manage own academy students" ON public.students
  FOR ALL USING (public.is_teacher_of_academy(auth.uid(), academy_id))
  WITH CHECK (public.is_teacher_of_academy(auth.uid(), academy_id));

-- =========================================================
-- 4. RLS for student_sessions (only service-role / RPC writes)
-- =========================================================
DROP POLICY IF EXISTS "No public access to student_sessions" ON public.student_sessions;
CREATE POLICY "No public access to student_sessions" ON public.student_sessions
  FOR SELECT USING (false);

-- =========================================================
-- 5. Auto-generate Student ID per academy (STU-1001 ...)
-- =========================================================
CREATE OR REPLACE FUNCTION public.generate_student_code(_academy_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INT;
  code TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(student_code FROM 'STU-(\d+)') AS INT)), 1000) + 1
    INTO next_num
  FROM public.students
  WHERE academy_id = _academy_id AND student_code ~ '^STU-\d+$';

  code := 'STU-' || next_num::TEXT;
  RETURN code;
END;
$$;

-- =========================================================
-- 6. RPC: student_login (verify name + code for given academy)
-- =========================================================
CREATE OR REPLACE FUNCTION public.student_login(
  _academy_slug TEXT,
  _student_code TEXT,
  _full_name TEXT
)
RETURNS TABLE (
  student_id UUID,
  academy_id UUID,
  full_name TEXT,
  student_code TEXT,
  token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_academy_id UUID;
  v_student RECORD;
  v_token TEXT;
BEGIN
  SELECT id INTO v_academy_id
  FROM public.academies
  WHERE slug = _academy_slug AND is_published = true;

  IF v_academy_id IS NULL THEN
    RAISE EXCEPTION 'الأكاديمية غير موجودة';
  END IF;

  SELECT s.* INTO v_student
  FROM public.students s
  WHERE s.academy_id = v_academy_id
    AND UPPER(TRIM(s.student_code)) = UPPER(TRIM(_student_code))
    AND LOWER(TRIM(s.full_name)) = LOWER(TRIM(_full_name))
    AND s.is_active = true;

  IF v_student IS NULL THEN
    RAISE EXCEPTION 'بيانات الدخول غير صحيحة';
  END IF;

  v_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO public.student_sessions (student_id, academy_id, token)
  VALUES (v_student.id, v_academy_id, v_token);

  RETURN QUERY SELECT v_student.id, v_academy_id, v_student.full_name, v_student.student_code, v_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_login(TEXT, TEXT, TEXT) TO anon, authenticated;

-- =========================================================
-- 7. RPC: validate_student_session (used to protect student dashboard)
-- =========================================================
CREATE OR REPLACE FUNCTION public.validate_student_session(_token TEXT)
RETURNS TABLE (
  student_id UUID,
  academy_id UUID,
  full_name TEXT,
  student_code TEXT,
  academy_slug TEXT,
  academy_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.academy_id, s.full_name, s.student_code, a.slug, a.name
  FROM public.student_sessions ss
  JOIN public.students s ON s.id = ss.student_id
  JOIN public.academies a ON a.id = ss.academy_id
  WHERE ss.token = _token
    AND ss.expires_at > now()
    AND s.is_active = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_student_session(TEXT) TO anon, authenticated;

-- =========================================================
-- 8. RPC: list_students_for_academy (teacher view)
-- =========================================================
CREATE OR REPLACE FUNCTION public.create_student(
  _academy_id UUID,
  _full_name TEXT
)
RETURNS public.students
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_row public.students;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin')
          OR public.is_teacher_of_academy(auth.uid(), _academy_id)) THEN
    RAISE EXCEPTION 'غير مصرح';
  END IF;

  v_code := public.generate_student_code(_academy_id);

  INSERT INTO public.students (academy_id, student_code, full_name)
  VALUES (_academy_id, v_code, TRIM(_full_name))
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_student(UUID, TEXT) TO authenticated;

-- =========================================================
-- 9. Update handle_new_user: NO auto-super-admin promotion
--    Only create profile + assign 'student' role.
--    Super admin must be inserted manually (via SQL or admin UI).
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, student_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'student_id'
  );
  -- No automatic role assignment. Roles are assigned by super_admin only.
  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- 10. Update can_view_quiz / can_access_course to also accept students via session
--     For now: students authenticated via supabase.auth are ignored.
--     Student access goes through dedicated RPCs that bypass RLS via SECURITY DEFINER.
-- =========================================================

-- Helper for students (token-scoped queries used by student dashboard)
CREATE OR REPLACE FUNCTION public.student_get_courses(_token TEXT)
RETURNS SETOF public.courses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_academy UUID;
BEGIN
  SELECT academy_id INTO v_academy
  FROM public.student_sessions
  WHERE token = _token AND expires_at > now();

  IF v_academy IS NULL THEN
    RAISE EXCEPTION 'جلسة غير صالحة';
  END IF;

  RETURN QUERY
  SELECT * FROM public.courses
  WHERE academy_id = v_academy AND is_published = true
  ORDER BY sort_order;
END;
$$;
GRANT EXECUTE ON FUNCTION public.student_get_courses(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.student_get_quizzes(_token TEXT)
RETURNS SETOF public.quizzes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_academy UUID;
BEGIN
  SELECT academy_id INTO v_academy
  FROM public.student_sessions
  WHERE token = _token AND expires_at > now();

  IF v_academy IS NULL THEN
    RAISE EXCEPTION 'جلسة غير صالحة';
  END IF;

  RETURN QUERY
  SELECT * FROM public.quizzes
  WHERE academy_id = v_academy AND is_published = true
  ORDER BY created_at DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.student_get_quizzes(TEXT) TO anon, authenticated;

-- =========================================================
-- 11. Allow super_admin to UPDATE academies fully (already covered),
--     and ensure teacher_id can be set on update by admin.
-- =========================================================
