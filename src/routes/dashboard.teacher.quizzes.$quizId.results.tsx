import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ArrowRight, Trophy, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/quizzes/$quizId/results")({
  head: () => ({ meta: [{ title: "نتائج الاختبار — EduVerse" }] }),
  component: QuizResultsPage,
});

interface AttemptRow {
  id: string;
  user_id: string | null;
  student_id: string | null;
  score: number;
  total_points: number;
  submitted_at: string | null;
  status: string;
  full_name?: string;
  display_code?: string;
}

function QuizResultsPage() {
  const { user, role, loading } = useAuth();
  const { quizId } = Route.useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [passing, setPassing] = useState(50);
  const [rows, setRows] = useState<AttemptRow[]>([]);

  useEffect(() => { if (user) void load(); /* eslint-disable-next-line */ }, [user, quizId]);

  async function load() {
    const { data: q } = await supabase.from("quizzes").select("title, passing_score").eq("id", quizId).maybeSingle();
    setQuizTitle(q?.title ?? "");
    setPassing(q?.passing_score ?? 50);

    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("id, user_id, student_id, score, total_points, submitted_at, status")
      .eq("quiz_id", quizId)
      .order("submitted_at", { ascending: false });
    if (!attempts?.length) { setRows([]); return; }

    const userIds = [...new Set(attempts.map((a) => a.user_id).filter((x): x is string => !!x))];
    const studentIds = [...new Set(attempts.map((a) => a.student_id).filter((x): x is string => !!x))];

    const profilesP = userIds.length
      ? supabase.from("profiles").select("user_id, full_name, student_id").in("user_id", userIds)
      : Promise.resolve({ data: [] as { user_id: string; full_name: string; student_id: string | null }[] });
    const studentsP = studentIds.length
      ? supabase.from("students").select("id, full_name, student_code").in("id", studentIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string; student_code: string }[] });

    const [{ data: profiles }, { data: students }] = await Promise.all([profilesP, studentsP]);

    const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
    const studentMap = new Map((students ?? []).map((s) => [s.id, s]));

    setRows(
      attempts.map((a) => {
        const p = a.user_id ? profileMap.get(a.user_id) : undefined;
        const s = a.student_id ? studentMap.get(a.student_id) : undefined;
        return {
          ...a,
          full_name: s?.full_name ?? p?.full_name,
          display_code: s?.student_code ?? p?.student_id ?? undefined,
        };
      })
    );
  }

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role !== "teacher") return <Navigate to="/dashboard" />;

  return (
    <PageContainer>
      <PageHeader title={`نتائج: ${quizTitle}`} description="جميع محاولات الطلاب" />
      <Link to="/dashboard/teacher/quizzes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowRight className="size-4" /> كل الاختبارات
      </Link>

      {rows.length === 0 ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center text-muted-foreground">
          لم يقم أي طالب بحل هذا الاختبار بعد.
        </div>
      ) : (
        <div className="bg-card-premium border border-border/60 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs text-muted-foreground">
              <tr>
                <th className="text-right p-4">الطالب</th>
                <th className="text-right p-4">رقم الطالب</th>
                <th className="text-right p-4">النتيجة</th>
                <th className="text-right p-4">النسبة</th>
                <th className="text-right p-4">الحالة</th>
                <th className="text-right p-4">تاريخ التسليم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((r) => {
                const pct = r.total_points > 0 ? Math.round((r.score / r.total_points) * 100) : 0;
                const passed = pct >= passing;
                return (
                  <tr key={r.id} className="hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-primary/20 grid place-items-center"><UserIcon className="size-3.5 text-primary" /></div>
                        {r.full_name || "—"}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{r.display_code ?? "—"}</td>
                    <td className="p-4 font-medium">{r.score} / {r.total_points}</td>
                    <td className="p-4">
                      <span className={`font-bold ${passed ? "text-chemistry" : "text-destructive"}`}>{pct}%</span>
                    </td>
                    <td className="p-4">
                      {r.status === "submitted" ? (
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${passed ? "bg-chemistry/20 text-chemistry" : "bg-destructive/20 text-destructive"}`}>
                          {passed && <Trophy className="size-3" />}
                          {passed ? "ناجح" : "راسب"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">قيد الحل</span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {r.submitted_at ? new Date(r.submitted_at).toLocaleString("ar-EG") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
