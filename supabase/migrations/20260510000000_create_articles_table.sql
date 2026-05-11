-- =============================================
-- Migration: Create articles table
-- =============================================

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid references public.academies(id) on delete cascade not null,
  title text not null,
  content text not null,
  cover_image_url text,
  category text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.articles enable row level security;

-- المعلم: كامل الصلاحيات على مقالات أكاديميته
create policy "teacher_manage_articles"
on public.articles
for all
to authenticated
using (
  academy_id in (
    select id from public.academies where teacher_id = auth.uid()
  )
)
with check (
  academy_id in (
    select id from public.academies where teacher_id = auth.uid()
  )
);

-- الطلاب والزوار: قراءة المقالات المنشورة فقط
create policy "public_read_published_articles"
on public.articles
for select
to anon, authenticated
using (is_published = true);
