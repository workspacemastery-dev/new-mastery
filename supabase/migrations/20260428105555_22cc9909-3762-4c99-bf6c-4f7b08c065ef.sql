-- Fix student_login: gen_random_bytes lives in extensions schema (pgcrypto)
CREATE OR REPLACE FUNCTION public.student_login(_academy_slug text, _student_code text, _full_name text)
 RETURNS TABLE(student_id uuid, academy_id uuid, full_name text, student_code text, token text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
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
    RAISE EXCEPTION 'بيانات الدخول غير صحيحة (تأكد من الاسم ومعرف الطالب والأكاديمية)';
  END IF;

  -- Use gen_random_uuid as a portable token source if pgcrypto isn't available
  BEGIN
    v_token := encode(extensions.gen_random_bytes(32), 'hex');
  EXCEPTION WHEN OTHERS THEN
    v_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  END;

  INSERT INTO public.student_sessions (student_id, academy_id, token)
  VALUES (v_student.id, v_academy_id, v_token);

  RETURN QUERY SELECT v_student.id, v_academy_id, v_student.full_name, v_student.student_code, v_token;
END;
$function$;