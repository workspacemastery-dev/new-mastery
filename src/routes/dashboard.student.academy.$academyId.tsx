import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ArrowRight, ClipboardList, BookOpen, PlayCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/student/academy/$academyId")({
  head: () => ({ meta: [{ title: "أكاديميتي — EduVerse" }] }),
  component: StudentAcademyPage,
});

interface Course { id: string; title: string; description: string; cover_image_url: string | null }
interface Quiz { id: string; title: string; description: string; duration_minutes: number; passing_score: number }
interface MyAttempt { quiz_id: string; status: string; score: number; total_points: number; id: string }

function StudentAcademyPage() {
  const { user, role, loading } = useAuth();
  const { academyId } = Route.useParams();
  const [academyName, setAcademyName] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Record<string, MyAttempt>>({});

  useEffect(() => { if (user) void load(); /* eslint-disable-next-line */ }, [user, academyId]);

  async function load() {
    const { data: a } = await supabase.from("academies").select("name").eq("id", academyId).maybeSingle();
    setAcademyName(a?.name ?? "");
    const { data: c } = await supabase
      .from("courses")
      .select("id, title, description, cover_image_url")
      .eq("academy_id", academyId)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    setCourses(c ?? []);
    const { data: q } = await supabase
      .from("quizzes")
      .select("id, title, description, duration_minutes, passing_score")
      .eq("academy_id", academyId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    setQuizzes(q ?? []);
    if (q?.length && user) {
      const { data: att } = await supabase
        .from("quiz_attempts")
        .select("id, quiz_id, status, score, total_points")
        .in("quiz_id", q.map((x) => x.id))
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false });
      const map: Record<string, MyAttempt> = {};
      (att ?? []).forEach((x) => { if (!map[x.quiz_id]) map[x.quiz_id] = x as MyAttempt; });
      setAttempts(map);
    }
  }

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role !== "student") return <Navigate to="/dashboard" />;

  return (
    <DashboardShell title={academyName} roleLabel="Student">
      <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowRight className="size-4" /> لوحة الطالب
      </Link>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="size-5 text-primary" /> الكورسات</h2>
        {courses.length === 0 ? (
          <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            لا توجد كورسات منشورة بعد.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                to="/dashboard/student/courses/$courseId"
                params={{ courseId: c.id }}
                className="bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] transition group"
              >
                <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center mb-3 group-hover:shadow-glow-primary transition">
                  <BookOpen className="size-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ClipboardList className="size-5 text-accent" /> الاختبارات</h2>
        {quizzes.length === 0 ? (
          <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            لا توجد اختبارات منشورة بعد.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {quizzes.map((q) => {
              const att = attempts[q.id];
              const submitted = att?.status === "submitted";
              const pct = submitted && att.total_points > 0 ? Math.round((att.score / att.total_points) * 100) : null;
              return (
                <div key={q.id} className="bg-card-premium border border-border/60 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="size-10 rounded-lg bg-accent/20 grid place-items-center">
                      <ClipboardList className="size-5 text-accent" />
                    </div>
                    {submitted && (
                      <span className={`text-xs px-2 py-1 rounded-full ${pct! >= q.passing_score ? "bg-chemistry/20 text-chemistry" : "bg-destructive/20 text-destructive"}`}>
                        {pct}% — {pct! >= q.passing_score ? "ناجح" : "راسب"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{q.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{q.description || "—"}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span>⏱ {q.duration_minutes} دقيقة</span>
                    <span>✓ نجاح {q.passing_score}%</span>
                  </div>
                  {submitted ? (
                    <Link
                      to="/dashboard/student/results/$attemptId"
                      params={{ attemptId: att.id }}
                      className="block text-center w-full py-2 rounded-lg glass hover:bg-white/10 transition text-sm"
                    >
                      مراجعة الإجابات
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard/student/quiz/$quizId"
                      params={{ quizId: q.id }}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow-primary"
                    >
                      <PlayCircle className="size-4" />
                      {att?.status === "in_progress" ? "متابعة الحل" : "بدء الاختبار"}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
