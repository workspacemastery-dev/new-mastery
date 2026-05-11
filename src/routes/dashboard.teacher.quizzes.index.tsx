import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, ClipboardList, Eye, EyeOff, Trash2, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/quizzes/")({
  head: () => ({ meta: [{ title: "إدارة الاختبارات — EduVerse" }] }),
  component: TeacherQuizzesPage,
});

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  is_published: boolean;
  attempt_count?: number;
}

function TeacherQuizzesPage() {
  const { user, role } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    (async () => {
      const { data: aca } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (!aca) return;
      setAcademyId(aca.id);
      await loadQuizzes(aca.id);
    })();
  }, [user, role]);

  async function loadQuizzes(aId: string) {
    const { data } = await supabase
      .from("quizzes")
      .select("id, title, description, duration_minutes, passing_score, is_published")
      .eq("academy_id", aId)
      .order("created_at", { ascending: false });
    const list = data ?? [];
    const ids = list.map((q) => q.id);
    if (ids.length) {
      const { data: attempts } = await supabase
        .from("quiz_attempts").select("quiz_id").in("quiz_id", ids).eq("status", "submitted");
      const counts: Record<string, number> = {};
      (attempts ?? []).forEach((a) => { counts[a.quiz_id] = (counts[a.quiz_id] ?? 0) + 1; });
      setQuizzes(list.map((q) => ({ ...q, attempt_count: counts[q.id] ?? 0 })));
    } else setQuizzes([]);
  }

  async function togglePublish(q: Quiz) {
    if (!academyId) return;
    await supabase.from("quizzes").update({ is_published: !q.is_published }).eq("id", q.id);
    await loadQuizzes(academyId);
  }
  async function deleteQuiz(id: string) {
    if (!academyId) return;
    if (!confirm("حذف هذا الاختبار وجميع أسئلته؟")) return;
    await supabase.from("quizzes").delete().eq("id", id);
    await loadQuizzes(academyId);
  }

  return (
    <PageContainer>
      <PageHeader
        title="إدارة الاختبارات"
        description="أنشئ اختبارات وتابع نتائج الطلاب"
        actions={academyId ? (
          <Link to="/dashboard/teacher/quizzes/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow-primary">
            <Plus className="size-4" /> اختبار جديد
          </Link>
        ) : undefined}
      />
      {!academyId ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">يجب تعيينك لأكاديمية أولاً.</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center">
          <ClipboardList className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">لا اختبارات بعد. ابدأ بإنشاء أول اختبار.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {quizzes.map((q) => (
            <div key={q.id} className="bg-card-premium border border-border/60 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center">
                  <ClipboardList className="size-5 text-primary-foreground" />
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full ${q.is_published ? "bg-chemistry/20 text-chemistry" : "bg-muted text-muted-foreground"}`}>
                  {q.is_published ? "منشور" : "مسودة"}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{q.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{q.description || "—"}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span>⏱ {q.duration_minutes} د</span>
                <span>✓ {q.passing_score}%</span>
                <span className="inline-flex items-center gap-1"><Users className="size-3" /> {q.attempt_count ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard/teacher/quizzes/$quizId" params={{ quizId: q.id }}
                  className="flex-1 text-center text-sm py-2 rounded-lg glass hover:bg-white/10 transition">الأسئلة</Link>
                <Link to="/dashboard/teacher/quizzes/$quizId/results" params={{ quizId: q.id }}
                  className="flex-1 text-center text-sm py-2 rounded-lg glass hover:bg-white/10 transition">النتائج</Link>
                <button onClick={() => togglePublish(q)} className="size-9 grid place-items-center rounded-lg glass hover:bg-white/10 transition">
                  {q.is_published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
                <button onClick={() => deleteQuiz(q.id)} className="size-9 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
