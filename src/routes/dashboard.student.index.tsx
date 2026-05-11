import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, ArrowLeft } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/dashboard/DashboardShell";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";
import { getAcademyStyle } from "@/lib/academy-styles";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";

export const Route = createFileRoute("/dashboard/student/")({
  head: () => ({ meta: [{ title: "لوحة الطالب — EduVerse" }] }),
  component: StudentDashboardIndex,
});

interface CourseRow { id: string; title: string; description: string }
interface QuizRow { id: string; title: string; duration_minutes: number }

function StudentDashboardIndex() {
  const { session } = useStudentAuth();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);

  useEffect(() => {
    if (!session) return;
    void (async () => {
      const [{ data: c }, { data: q }] = await Promise.all([
        supabase.rpc("student_get_courses", { _token: session.token }),
        supabase.rpc("student_get_quizzes", { _token: session.token }),
      ]);
      setCourses(((c ?? []) as unknown) as CourseRow[]);
      setQuizzes(((q ?? []) as unknown) as QuizRow[]);
    })();
  }, [session]);

  if (!session) return null;

  const s = getAcademyStyle(session.academy_slug);

  return (
    <PageContainer>
      <PageHeader title={`أهلاً، ${session.full_name} 👋`} description={session.academy_name} />

      {/* ✅ بانر الإعلانات — يظهر تلقائياً لو في إعلانات نشطة */}
      <AnnouncementBanner />

      <div className={`mb-8 rounded-2xl p-5 ${s.bgGradientClass} text-white shadow-elevated`}>
        <div className="text-xs opacity-90 mb-1">أكاديميتك</div>
        <div className="text-2xl font-bold">{session.academy_name}</div>
        <div className="text-xs opacity-80 mt-2">
          Student ID: <code className="bg-white/20 px-2 py-0.5 rounded">{session.student_code}</code>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="الكورسات" value={courses.length} accent="primary" />
        <StatCard label="الاختبارات المتاحة" value={quizzes.length} accent="math" />
        <StatCard label="الإشعارات" value={0} accent="gold" hint="لا جديد" />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
          <BookOpen className="size-5 text-primary" /> كورساتك
        </h2>
        {courses.length === 0 ? (
          <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            لا توجد كورسات منشورة بعد.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <Link
                key={c.id}
                to="/dashboard/student/courses/$courseId"
                params={{ courseId: c.id }}
                className="block bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] hover:border-primary/40 transition"
              >
                <div className={`h-1 rounded-full ${s.bgGradientClass} mb-4`} />
                <h3 className="font-semibold mb-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-primary">
                  ابدأ <ArrowLeft className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" /> الاختبارات
        </h2>
        {quizzes.length === 0 ? (
          <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            لا توجد اختبارات متاحة الآن.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((q) => (
              <Link
                key={q.id}
                to="/dashboard/student/quiz/$quizId"
                params={{ quizId: q.id }}
                className="block bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] hover:border-primary/40 transition"
              >
                <h3 className="font-semibold mb-2">{q.title}</h3>
                <p className="text-xs text-muted-foreground">المدة: {q.duration_minutes} دقيقة</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}

