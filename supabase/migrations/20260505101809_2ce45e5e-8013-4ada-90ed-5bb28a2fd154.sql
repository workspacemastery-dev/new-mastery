
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL,
  student_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher','student')),
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_thread ON public.messages(academy_id, student_id, created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage own academy messages"
ON public.messages FOR ALL
USING (public.is_teacher_of_academy(auth.uid(), academy_id) OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.is_teacher_of_academy(auth.uid(), academy_id) OR public.has_role(auth.uid(), 'super_admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Student RPCs
CREATE OR REPLACE FUNCTION public.student_list_messages(_token text)
RETURNS SETOF public.messages
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_student uuid; v_academy uuid;
BEGIN
  SELECT student_id, academy_id INTO v_student, v_academy FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;
  RETURN QUERY SELECT * FROM public.messages
   WHERE academy_id = v_academy AND student_id = v_student
   ORDER BY created_at ASC;
END $$;

CREATE OR REPLACE FUNCTION public.student_send_message(_token text, _body text)
RETURNS public.messages
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_student uuid; v_academy uuid; v_row public.messages;
BEGIN
  SELECT student_id, academy_id INTO v_student, v_academy FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;
  IF COALESCE(TRIM(_body),'') = '' THEN RAISE EXCEPTION 'الرسالة فارغة'; END IF;
  INSERT INTO public.messages(academy_id, student_id, sender_role, body)
  VALUES (v_academy, v_student, 'student', _body)
  RETURNING * INTO v_row;
  RETURN v_row;
END $$;

CREATE OR REPLACE FUNCTION public.student_mark_read(_token text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_student uuid; v_academy uuid;
BEGIN
  SELECT student_id, academy_id INTO v_student, v_academy FROM public._student_from_token(_token);
  IF v_student IS NULL THEN RAISE EXCEPTION 'جلسة غير صالحة'; END IF;
  UPDATE public.messages SET is_read = true
   WHERE academy_id = v_academy AND student_id = v_student
     AND sender_role = 'teacher' AND is_read = false;
END $$;

-- Teacher: list threads (one row per student with last message + unread count)
CREATE OR REPLACE FUNCTION public.teacher_list_threads(_academy_id uuid)
RETURNS TABLE(student_id uuid, full_name text, student_code text,
              last_body text, last_at timestamptz, unread_count int)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_teacher_of_academy(auth.uid(), _academy_id) OR public.has_role(auth.uid(),'super_admin')) THEN
    RAISE EXCEPTION 'غير مصرح';
  END IF;
  RETURN QUERY
  SELECT s.id, s.full_name, s.student_code,
    (SELECT body FROM public.messages m WHERE m.student_id = s.id AND m.academy_id = _academy_id ORDER BY created_at DESC LIMIT 1),
    (SELECT created_at FROM public.messages m WHERE m.student_id = s.id AND m.academy_id = _academy_id ORDER BY created_at DESC LIMIT 1),
    (SELECT COUNT(*)::int FROM public.messages m WHERE m.student_id = s.id AND m.academy_id = _academy_id AND m.sender_role='student' AND m.is_read=false)
  FROM public.students s
  WHERE s.academy_id = _academy_id AND s.is_active = true
  ORDER BY (SELECT MAX(created_at) FROM public.messages m WHERE m.student_id = s.id AND m.academy_id = _academy_id) DESC NULLS LAST,
           s.full_name ASC;
END $$;
