-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE public.question_type AS ENUM ('mcq', 'true_false', 'short_text');
CREATE TYPE public.attempt_status AS ENUM ('in_progress', 'submitted', 'graded');

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_academy ON public.courses(academy_id);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage all courses" ON public.courses
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Teachers manage own academy courses" ON public.courses
  FOR ALL USING (public.is_teacher_of_academy(auth.uid(), academy_id))
  WITH CHECK (public.is_teacher_of_academy(auth.uid(), academy_id));

CREATE POLICY "Enrolled students view published courses" ON public.courses
  FOR SELECT USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.academy_id = courses.academy_id AND e.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- MODULES
-- ============================================
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_modules_course ON public.modules(course_id);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user can access course
CREATE OR REPLACE FUNCTION public.can_access_course(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = _course_id AND (
      public.has_role(_user_id, 'super_admin')
      OR public.is_teacher_of_academy(_user_id, c.academy_id)
      OR (c.is_published AND EXISTS (
        SELECT 1 FROM public.enrollments e
        WHERE e.academy_id = c.academy_id AND e.user_id = _user_id
      ))
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.can_manage_course(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = _course_id AND (
      public.has_role(_user_id, 'super_admin')
      OR public.is_teacher_of_academy(_user_id, c.academy_id)
    )
  )
$$;

CREATE POLICY "View modules of accessible courses" ON public.modules
  FOR SELECT USING (public.can_access_course(auth.uid(), course_id));

CREATE POLICY "Manage modules of own courses" ON public.modules
  FOR ALL USING (public.can_manage_course(auth.uid(), course_id))
  WITH CHECK (public.can_manage_course(auth.uid(), course_id));

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- LESSONS
-- ============================================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  duration_minutes INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_lesson(_user_id UUID, _lesson_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE l.id = _lesson_id AND public.can_access_course(_user_id, m.course_id)
  )
$$;

CREATE OR REPLACE FUNCTION public.can_manage_lesson(_user_id UUID, _lesson_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE l.id = _lesson_id AND public.can_manage_course(_user_id, m.course_id)
  )
$$;

CREATE POLICY "View lessons of accessible modules" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      WHERE m.id = lessons.module_id AND public.can_access_course(auth.uid(), m.course_id)
    )
  );

CREATE POLICY "Manage lessons of own modules" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      WHERE m.id = lessons.module_id AND public.can_manage_course(auth.uid(), m.course_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modules m
      WHERE m.id = lessons.module_id AND public.can_manage_course(auth.uid(), m.course_id)
    )
  );

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- LESSON FILES
-- ============================================
CREATE TABLE public.lesson_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_files_lesson ON public.lesson_files(lesson_id);
ALTER TABLE public.lesson_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View files of accessible lessons" ON public.lesson_files
  FOR SELECT USING (public.can_access_lesson(auth.uid(), lesson_id));

CREATE POLICY "Manage files of own lessons" ON public.lesson_files
  FOR ALL USING (public.can_manage_lesson(auth.uid(), lesson_id))
  WITH CHECK (public.can_manage_lesson(auth.uid(), lesson_id));

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration_minutes INT NOT NULL DEFAULT 30,
  passing_score INT NOT NULL DEFAULT 50,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_quizzes_academy ON public.quizzes(academy_id);
CREATE INDEX idx_quizzes_course ON public.quizzes(course_id);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage all quizzes" ON public.quizzes
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Teachers manage own academy quizzes" ON public.quizzes
  FOR ALL USING (public.is_teacher_of_academy(auth.uid(), academy_id))
  WITH CHECK (public.is_teacher_of_academy(auth.uid(), academy_id));

CREATE POLICY "Enrolled students view published quizzes" ON public.quizzes
  FOR SELECT USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.academy_id = quizzes.academy_id AND e.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- QUIZ QUESTIONS
-- ============================================
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type public.question_type NOT NULL DEFAULT 'mcq',
  image_url TEXT,
  points INT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  correct_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_manage_quiz(_user_id UUID, _quiz_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.quizzes q
    WHERE q.id = _quiz_id AND (
      public.has_role(_user_id, 'super_admin')
      OR public.is_teacher_of_academy(_user_id, q.academy_id)
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.can_view_quiz(_user_id UUID, _quiz_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.quizzes q
    WHERE q.id = _quiz_id AND (
      public.has_role(_user_id, 'super_admin')
      OR public.is_teacher_of_academy(_user_id, q.academy_id)
      OR (q.is_published AND EXISTS (
        SELECT 1 FROM public.enrollments e
        WHERE e.academy_id = q.academy_id AND e.user_id = _user_id
      ))
    )
  )
$$;

CREATE POLICY "View questions of viewable quizzes" ON public.quiz_questions
  FOR SELECT USING (public.can_view_quiz(auth.uid(), quiz_id));

CREATE POLICY "Manage questions of own quizzes" ON public.quiz_questions
  FOR ALL USING (public.can_manage_quiz(auth.uid(), quiz_id))
  WITH CHECK (public.can_manage_quiz(auth.uid(), quiz_id));

CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- QUESTION OPTIONS (for MCQ / True-False)
-- ============================================
CREATE TABLE public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_question_options_question ON public.question_options(question_id);
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View options of viewable questions" ON public.question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_questions q
      WHERE q.id = question_options.question_id AND public.can_view_quiz(auth.uid(), q.quiz_id)
    )
  );

CREATE POLICY "Manage options of own questions" ON public.question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quiz_questions q
      WHERE q.id = question_options.question_id AND public.can_manage_quiz(auth.uid(), q.quiz_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_questions q
      WHERE q.id = question_options.question_id AND public.can_manage_quiz(auth.uid(), q.quiz_id)
    )
  );

-- ============================================
-- QUIZ ATTEMPTS
-- ============================================
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  score INT NOT NULL DEFAULT 0,
  total_points INT NOT NULL DEFAULT 0,
  status public.attempt_status NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id AND public.can_view_quiz(auth.uid(), quiz_id));

CREATE POLICY "Users update own in-progress attempts" ON public.quiz_attempts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers view attempts of own quizzes" ON public.quiz_attempts
  FOR SELECT USING (public.can_manage_quiz(auth.uid(), quiz_id));

CREATE POLICY "Super admins view all attempts" ON public.quiz_attempts
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- QUIZ ANSWERS
-- ============================================
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.question_options(id) ON DELETE SET NULL,
  text_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points_earned INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);
CREATE INDEX idx_quiz_answers_attempt ON public.quiz_answers(attempt_id);
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own answers" ON public.quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = quiz_answers.attempt_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own answers" ON public.quiz_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = quiz_answers.attempt_id AND a.user_id = auth.uid() AND a.status = 'in_progress'
    )
  );

CREATE POLICY "Users update own answers in-progress" ON public.quiz_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = quiz_answers.attempt_id AND a.user_id = auth.uid() AND a.status = 'in_progress'
    )
  );

CREATE POLICY "Teachers view answers of own quiz attempts" ON public.quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = quiz_answers.attempt_id AND public.can_manage_quiz(auth.uid(), a.quiz_id)
    )
  );

CREATE POLICY "Super admins view all answers" ON public.quiz_answers
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('course-assets', 'course-assets', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-files', 'lesson-files', false)
  ON CONFLICT (id) DO NOTHING;

-- course-assets: public read, teachers/admins write
CREATE POLICY "Public read course-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-assets');

CREATE POLICY "Authenticated upload course-assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'course-assets' AND (
      public.has_role(auth.uid(), 'super_admin')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
    )
  );

CREATE POLICY "Authenticated update course-assets" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'course-assets' AND (
      public.has_role(auth.uid(), 'super_admin')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
    )
  );

CREATE POLICY "Authenticated delete course-assets" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'course-assets' AND (
      public.has_role(auth.uid(), 'super_admin')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
    )
  );

-- lesson-files: only authenticated; finer access checked via signed URLs from app
CREATE POLICY "Authenticated read lesson-files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'lesson-files');

CREATE POLICY "Teachers upload lesson-files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'lesson-files' AND (
      public.has_role(auth.uid(), 'super_admin')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
    )
  );

CREATE POLICY "Teachers update lesson-files" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'lesson-files' AND (
      public.has_role(auth.uid(), 'super_admin')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
    )
  );

CREATE POLICY "Teachers delete lesson-files" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'lesson-files' AND (
      public.has_role(auth.uid(), 'super_admin')
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
    )
  );