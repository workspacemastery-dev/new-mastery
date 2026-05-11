import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, ArrowRight, Trophy, CheckCircle2, XCircle,
  AlertCircle, BarChart3, ClipboardList, BookOpen,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student/results/$attemptId")({
  head: () => ({ meta: [{ title: "نتيجة الاختبار — EduVerse" }] }),
  component: ResultsPage,
});

interface Attempt {
  id: string; quiz_id: string;
  score: number; total_points: number;
  submitted_at: string | null; status: string;
}
interface Quiz { title: string; passing_score: number; description: string }

interface ResultItem {
  id: string;
  my_option_id: string | null;
  my_text: string | null;
  is_correct: boolean;
}

function ResultsPage() {
  const { session, loading } = useStudentAuth();
  const { attemptId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [items, setItems] = useState<ResultItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[ResultsPage] mounted", { attemptId, hasSession: !!session });
  }, [attemptId, session]);

  if (pathname.endsWith("/review")) {
    return <Outlet />;
  }

  useEffect(() => {
    if (!session) return;
    void load();
    // eslint-disable-next-line
  }, [session, attemptId]);

  async function load() {
    if (!session) return;
    setLoadingData(true);
    const { data, error: err } = await supabase.rpc("student_get_results", {
      _token: session.token, _attempt_id: attemptId,
    });
    setLoadingData(false);
    if (err) { setError(err.message); return; }
    const payload = data as unknown as { attempt: Attempt; quiz: Quiz; items: ResultItem[] };
    setAttempt(payload.attempt);
    setQuiz(payload.quiz);
    setItems(payload.items ?? []);
  }

  if (loading || loadingData) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }
  if (!session) return <Navigate to="/" />;
  if (error) {
    return (
      <PageContainer>
        <div className="bg-destructive/10 border border-destructive/40 rounded-2xl p-6 text-center">
          <AlertCircle className="size-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium mb-3">{error}</p>
          <Link to="/dashboard/student" className="text-sm text-primary underline">العودة للوحة الطالب</Link>
        </div>
      </PageContainer>
    );
  }
  if (!attempt || !quiz) return null;

  const pct = attempt.total_points > 0 ? Math.round((attempt.score / attempt.total_points) * 100) : 0;
  const passed = pct >= quiz.passing_score;
  const correctCount = items.filter((i) => i.is_correct).length;
  const wrongCount = items.filter((i) => !i.is_correct && (i.my_option_id || (i.my_text && i.my_text.trim()))).length;
  const blankCount = items.filter((i) => !i.my_option_id && !(i.my_text && i.my_text.trim())).length;

  return (
    <PageContainer>
      <PageHeader title={`نتيجة: ${quiz.title}`} description={quiz.description || "—"} />

      {/* النسبة من الأعلى */}
      <div className={`relative overflow-hidden rounded-3xl p-10 mb-6 text-center border ${passed ? "border-chemistry/40 bg-chemistry/5" : "border-destructive/40 bg-destructive/5"}`}>
        <Trophy className={`size-16 mx-auto mb-3 ${passed ? "text-gold" : "text-muted-foreground"}`} />
        <div className={`text-7xl font-extrabold mb-2 ${passed ? "text-chemistry" : "text-destructive"}`}>{pct}%</div>
        <div className="text-base text-muted-foreground">{attempt.score} من {attempt.total_points} نقطة</div>
        <div className={`inline-block mt-4 text-sm font-semibold px-5 py-2 rounded-full ${passed ? "bg-chemistry/15 text-chemistry" : "bg-destructive/15 text-destructive"}`}>
          {passed ? "🎉 ناجح" : "للأسف، راسب — حاول مرة أخرى"}
        </div>
      </div>

      {/* نتائج الإجابات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatTile icon={CheckCircle2} label="إجابات صحيحة" value={correctCount} accent="chemistry" />
        <StatTile icon={XCircle} label="إجابات خاطئة" value={wrongCount} accent="destructive" />
        <StatTile icon={AlertCircle} label="بدون إجابة" value={blankCount} accent="gold" />
        <StatTile icon={BarChart3} label="إجمالي الأسئلة" value={items.length} accent="primary" />
      </div>

      {/* الأزرار */}
      <div className="grid sm:grid-cols-2 gap-3">
        {attemptId ? (
          <Link
            to="/dashboard/student/results/$attemptId/review"
            params={{ attemptId }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary"
          >
            <BookOpen className="size-4" /> مراجعة الاختبار
          </Link>
        ) : null}
        <Link
          to="/dashboard/student"
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass hover:bg-white/40 font-semibold"
        >
          <ClipboardList className="size-4" /> العودة لصفحة الاختبارات
        </Link>
      </div>

      <Link to="/dashboard/student" className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-3.5" /> لوحة الطالب
      </Link>
    </PageContainer>
  );
}

function StatTile({ icon: Icon, label, value, accent }: {
  icon: typeof CheckCircle2; label: string; value: number;
  accent: "chemistry" | "destructive" | "gold" | "primary";
}) {
  const cls = {
    chemistry: "bg-chemistry/10 text-chemistry border-chemistry/30",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    gold: "bg-gold/10 text-gold border-gold/30",
    primary: "bg-primary/10 text-primary border-primary/30",
  }[accent];
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <Icon className="size-5 mb-2 opacity-80" />
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}
