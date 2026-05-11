-- Fix student_get_course_content RPC to return nested modules/lessons.
-- This RPC is token-scoped (student_sessions) and bypasses RLS via SECURITY DEFINER.

CREATE OR REPLACE FUNCTION public.student_get_course_content(_token TEXT, _course_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_academy UUID;
  v_course public.courses%ROWTYPE;
  v_modules JSONB;
BEGIN
  SELECT academy_id INTO v_academy
  FROM public.student_sessions
  WHERE token = _token AND expires_at > now();

  IF v_academy IS NULL THEN
    RAISE EXCEPTION 'جلسة غير صالحة';
  END IF;

  SELECT * INTO v_course
  FROM public.courses c
  WHERE c.id = _course_id
    AND c.academy_id = v_academy
    AND c.is_published = true;

  IF NOT FOUND THEN
    RETURN json_build_object('course', NULL, 'modules', json_build_array());
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'title', m.title,
        'sort_order', m.sort_order,
        'lessons', COALESCE((
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', l.id,
              'module_id', l.module_id,
              'title', l.title,
              'content', l.content,
              'video_url', l.video_url,
              'attachment_url', l.attachment_url,
              'duration_minutes', l.duration_minutes,
              'lesson_type', l.lesson_type,
              'sort_order', l.sort_order
            )
            ORDER BY l.sort_order
          )
          FROM public.lessons l
          WHERE l.module_id = m.id
        ), '[]'::jsonb)
      )
      ORDER BY m.sort_order
    ),
    '[]'::jsonb
  )
  INTO v_modules
  FROM public.modules m
  WHERE m.course_id = v_course.id;

  RETURN json_build_object(
    'course',
    json_build_object(
      'id', v_course.id,
      'title', v_course.title,
      'description', v_course.description
    ),
    'modules', v_modules
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_get_course_content(TEXT, UUID) TO anon, authenticated;

