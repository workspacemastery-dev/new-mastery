-- 1) Add explanation column to questions
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS explanation text NOT NULL DEFAULT '';

-- 2) Add student_id to quiz_attempts (nullable; existing rows use user_id)
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES public.students(id) ON DELETE CASCADE;
ALTER TABLE public.quiz_attempts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.quiz_attempts
  DROP CONSTRAINT IF EXISTS quiz_attempts_actor_chk;
ALTER TABLE public.quiz_attempts
  ADD CONSTRAINT quiz_attempts_actor_chk CHECK (user_id IS NOT NULL OR student_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON public.quiz_attempts(student_id);

-- 3) Helper: validate student token, return student row
CREATE OR REPLACE FUNCTION public._student_from_token(_token text)
RETURNS TABLE(student_id uuid, academy_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, s.academy_id
  FROM public.student_sessions ss
  JOIN public.students s ON s.id = ss.student_id
  WHERE ss.token = _token AND ss.expires_at > now() AND s.is_active = true
$$;

-- 4) Get quiz + questions + options for student (no is_correct leaked)
CREATE OR REPLACE FUNCTION public.student_get_quiz(_token text, _quiz_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_student uuid; v_academy uuid; v_quiz jsonb; v_questions jsonb;
BEGIN
  SELECT student_id, academy_id INTO v_student, v_academy FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;

  SELECT to_jsonb(q.*) INTO v_quiz
  FROM public.quizzes q
  WHERE q.id = _quiz_id AND q.academy_id = v_academy AND q.is_published = true;
  IF v_quiz IS NULL THEN RAISE EXCEPTION 'الاختبار غير متاح'; END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', qq.id,
    'question_text', qq.question_text,
    'question_type', qq.question_type,
    'image_url', qq.image_url,
    'points', qq.points,
    'sort_order', qq.sort_order,
    'options', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', o.id, 'option_text', o.option_text) ORDER BY o.sort_order)
      FROM public.question_options o WHERE o.question_id = qq.id
    ), '[]'::jsonb)
  ) ORDER BY qq.sort_order), '[]'::jsonb) INTO v_questions
  FROM public.quiz_questions qq WHERE qq.quiz_id = _quiz_id;

  RETURN jsonb_build_object('quiz', v_quiz, 'questions', v_questions);
END $$;

-- 5) Start or resume attempt
CREATE OR REPLACE FUNCTION public.student_start_or_resume_attempt(_token text, _quiz_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_student uuid; v_academy uuid; v_attempt public.quiz_attempts; v_answers jsonb;
BEGIN
  SELECT student_id, academy_id INTO v_student, v_academy FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = _quiz_id AND academy_id = v_academy AND is_published = true) THEN
    RAISE EXCEPTION 'الاختبار غير متاح';
  END IF;

  SELECT * INTO v_attempt FROM public.quiz_attempts
  WHERE quiz_id = _quiz_id AND student_id = v_student AND status = 'in_progress'
  ORDER BY started_at DESC LIMIT 1;

  IF v_attempt.id IS NULL THEN
    INSERT INTO public.quiz_attempts (quiz_id, student_id, status)
    VALUES (_quiz_id, v_student, 'in_progress')
    RETURNING * INTO v_attempt;
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'question_id', a.question_id,
    'selected_option_id', a.selected_option_id,
    'text_answer', a.text_answer
  )), '[]'::jsonb) INTO v_answers
  FROM public.quiz_answers a WHERE a.attempt_id = v_attempt.id;

  RETURN jsonb_build_object('attempt', to_jsonb(v_attempt), 'answers', v_answers);
END $$;

-- 6) Save (upsert) an answer
CREATE OR REPLACE FUNCTION public.student_save_answer(
  _token text, _attempt_id uuid, _question_id uuid,
  _option_id uuid, _text text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_student uuid;
BEGIN
  SELECT student_id INTO v_student FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = _attempt_id AND student_id = v_student AND status = 'in_progress'
  ) THEN
    RAISE EXCEPTION 'محاولة غير صالحة';
  END IF;

  -- Delete then insert (no unique constraint required)
  DELETE FROM public.quiz_answers WHERE attempt_id = _attempt_id AND question_id = _question_id;
  INSERT INTO public.quiz_answers (attempt_id, question_id, selected_option_id, text_answer)
  VALUES (_attempt_id, _question_id, _option_id, _text);
END $$;

-- 7) Submit attempt: grade and finalize
CREATE OR REPLACE FUNCTION public.student_submit_attempt(_token text, _attempt_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_student uuid; v_attempt public.quiz_attempts;
  v_score int := 0; v_total int := 0;
  r RECORD;
BEGIN
  SELECT student_id INTO v_student FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;

  SELECT * INTO v_attempt FROM public.quiz_attempts
  WHERE id = _attempt_id AND student_id = v_student;
  IF v_attempt.id IS NULL THEN RAISE EXCEPTION 'محاولة غير موجودة'; END IF;
  IF v_attempt.status <> 'in_progress' THEN
    RETURN jsonb_build_object('attempt_id', v_attempt.id, 'already_submitted', true);
  END IF;

  -- Grade each question
  FOR r IN
    SELECT qq.id, qq.points, qq.question_type, qq.correct_text,
           a.id AS answer_id, a.selected_option_id, a.text_answer
    FROM public.quiz_questions qq
    LEFT JOIN public.quiz_answers a ON a.question_id = qq.id AND a.attempt_id = _attempt_id
    WHERE qq.quiz_id = v_attempt.quiz_id
  LOOP
    v_total := v_total + r.points;
    DECLARE v_correct boolean := false; v_earned int := 0;
    BEGIN
      IF r.question_type = 'short_text' THEN
        IF r.correct_text IS NOT NULL AND r.text_answer IS NOT NULL
           AND lower(trim(r.correct_text)) = lower(trim(r.text_answer)) THEN
          v_correct := true;
        END IF;
      ELSIF r.selected_option_id IS NOT NULL THEN
        SELECT is_correct INTO v_correct FROM public.question_options WHERE id = r.selected_option_id;
        v_correct := COALESCE(v_correct, false);
      END IF;
      IF v_correct THEN v_earned := r.points; v_score := v_score + r.points; END IF;

      IF r.answer_id IS NOT NULL THEN
        UPDATE public.quiz_answers SET is_correct = v_correct, points_earned = v_earned WHERE id = r.answer_id;
      END IF;
    END;
  END LOOP;

  UPDATE public.quiz_attempts
  SET score = v_score, total_points = v_total, status = 'submitted', submitted_at = now()
  WHERE id = _attempt_id;

  RETURN jsonb_build_object('attempt_id', _attempt_id, 'score', v_score, 'total', v_total);
END $$;

-- 8) Full results (with correct answers + explanation) — only for owner
CREATE OR REPLACE FUNCTION public.student_get_results(_token text, _attempt_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_student uuid; v_attempt public.quiz_attempts; v_quiz jsonb; v_items jsonb;
BEGIN
  SELECT student_id INTO v_student FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;

  SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = _attempt_id AND student_id = v_student;
  IF v_attempt.id IS NULL THEN RAISE EXCEPTION 'محاولة غير موجودة'; END IF;

  SELECT to_jsonb(q.*) INTO v_quiz FROM public.quizzes q WHERE q.id = v_attempt.quiz_id;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', qq.id,
    'question_text', qq.question_text,
    'question_type', qq.question_type,
    'image_url', qq.image_url,
    'points', qq.points,
    'explanation', qq.explanation,
    'correct_text', qq.correct_text,
    'sort_order', qq.sort_order,
    'options', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct
      ) ORDER BY o.sort_order)
      FROM public.question_options o WHERE o.question_id = qq.id
    ), '[]'::jsonb),
    'my_option_id', a.selected_option_id,
    'my_text', a.text_answer,
    'is_correct', COALESCE(a.is_correct, false),
    'points_earned', COALESCE(a.points_earned, 0)
  ) ORDER BY qq.sort_order), '[]'::jsonb) INTO v_items
  FROM public.quiz_questions qq
  LEFT JOIN public.quiz_answers a ON a.question_id = qq.id AND a.attempt_id = _attempt_id
  WHERE qq.quiz_id = v_attempt.quiz_id;

  RETURN jsonb_build_object('attempt', to_jsonb(v_attempt), 'quiz', v_quiz, 'items', v_items);
END $$;

-- 9) Allow teachers to view attempts of their students (already covered by can_manage_quiz on quiz_attempts)
-- Existing policy "Teachers view attempts of own quizzes" already handles this for both user_id and student_id paths.

-- 10) Grant execute to anon for student RPC functions (they auth via token in body)
REVOKE EXECUTE ON FUNCTION public.student_get_quiz(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.student_start_or_resume_attempt(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.student_save_answer(text, uuid, uuid, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.student_submit_attempt(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.student_get_results(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.student_get_quiz(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.student_start_or_resume_attempt(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.student_save_answer(text, uuid, uuid, uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.student_submit_attempt(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.student_get_results(text, uuid) TO anon, authenticated;