-- =============================================
-- Migration: Create announcements table
-- =============================================

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid references public.academies(id) on delete cascade not null,
  title text not null,
  body text not null,
  type text not null default 'info',
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.announcements enable row level security;

-- المعلم: كامل الصلاحيات على إعلانات أكاديميته
create policy "teacher_manage_announcements"
on public.announcements
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

-- الطلاب والزوار: قراءة الإعلانات النشطة فقط
create policy "public_read_active_announcements"
on public.announcements
for select
to anon, authenticated
using (is_active = true);
