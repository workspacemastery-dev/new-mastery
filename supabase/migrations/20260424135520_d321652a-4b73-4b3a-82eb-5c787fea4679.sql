-- ============= ENUMS =============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'teacher', 'student');

-- ============= PROFILES =============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  student_id TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============= USER ROLES =============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  academy_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, academy_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_academy(_user_id UUID, _academy_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'teacher' AND academy_id = _academy_id
  )
$$;

-- ============= ACADEMIES =============
CREATE TABLE public.academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  teacher_name TEXT,
  image_url TEXT,
  accent_color TEXT NOT NULL DEFAULT 'oklch(0.6 0.2 250)',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_academy_fk
  FOREIGN KEY (academy_id) REFERENCES public.academies(id) ON DELETE CASCADE;

-- ============= ENROLLMENTS =============
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, academy_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- ============= UPDATED_AT TRIGGER =============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_academies_updated_at
  BEFORE UPDATE ON public.academies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= AUTO PROFILE + ROLE ON SIGNUP =============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INT;
  assigned_role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, student_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'student_id'
  );

  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    assigned_role := 'super_admin';
  ELSE
    assigned_role := 'student';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============= RLS POLICIES: profiles =============
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============= RLS POLICIES: user_roles =============
CREATE POLICY "Users view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ============= RLS POLICIES: academies =============
CREATE POLICY "Anyone views published academies"
  ON public.academies FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'super_admin') OR auth.uid() = teacher_id);

CREATE POLICY "Super admins manage academies"
  ON public.academies FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Teachers update own academy"
  ON public.academies FOR UPDATE
  USING (auth.uid() = teacher_id);

-- ============= RLS POLICIES: enrollments =============
CREATE POLICY "Users view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers view their academy enrollments"
  ON public.enrollments FOR SELECT
  USING (public.is_teacher_of_academy(auth.uid(), academy_id));

CREATE POLICY "Super admins view all enrollments"
  ON public.enrollments FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users self-enroll"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users unenroll self"
  ON public.enrollments FOR DELETE
  USING (auth.uid() = user_id);

-- ============= SEED DATA =============
INSERT INTO public.academies (slug, name, subject, description, teacher_name, accent_color) VALUES
  ('math', 'أكاديمية الرياضيات', 'رياضيات', 'رحلة شاملة في عالم الأعداد والمعادلات والهندسة، من الأساسيات حتى التفاضل والتكامل.', 'أ. خالد المنصوري', 'oklch(0.65 0.22 250)'),
  ('physics', 'أكاديمية الفيزياء', 'فيزياء', 'استكشف قوانين الكون، من الميكانيكا الكلاسيكية إلى الفيزياء الحديثة والكمومية.', 'أ. ليلى الحسن', 'oklch(0.65 0.22 290)'),
  ('chemistry', 'أكاديمية الكيمياء', 'كيمياء', 'تعمّق في عالم العناصر والتفاعلات، من الكيمياء العامة إلى العضوية والحيوية.', 'أ. عمر الشامي', 'oklch(0.7 0.18 150)');