
-- Add lesson type and course price for the new course builder
DO $$ BEGIN
  CREATE TYPE public.lesson_type AS ENUM ('video','pdf','assignment','text');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS lesson_type public.lesson_type NOT NULL DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS attachment_url text;

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0;
