import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, ArrowRight, CheckCircle2, XCircle, AlertCircle, Lightbulb, ClipboardList,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student/results/$attemptId/review")({
  head: () => ({ meta: [{ title: "مراجعة الاختبار — EduVerse" }] }),
  component: ReviewPage,
});

interface Quiz { title: string; description: string }
interface ResultItem {
  id: string;
  question_text: string;
  question_type: "mcq" | "true_false" | "short_text";
  image_url: string | null;
  points: number;
  explanation: string;
  correct_text: string | null;
  options: { id: string; option_text: string; is_correct: boolean }[];
  my_option_id: string | null;
  my_text: string | null;
  is_correct: boolean;
  points_earned: number;
}

const styles = {
  correct: { border: "border-chemistry/40", badge: "bg-chemistry/20 text-chemistry", text: "text-chemistry", label: "✓ صحيحة" },
  wrong: { border: "border-destructive/40", badge: "bg-destructive/20 text-destructive", text: "text-destructive", label: "✗ خاطئة" },
  blank: { border: "border-gold/40", badge: "bg-gold/20 text-gold", text: "text-gold", label: "⊘ لم تجب" },
} as const;

function hasAnswer(q: ResultItem) {
  return !!(q.my_option_id || (q.my_text && q.my_text.trim().length > 0));
}

function ReviewPage() {
  const { session, loading } = useStudentAuth();
  const { attemptId } = Route.useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [items, setItems] = useState<ResultItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[ReviewPage] mounted", { attemptId, hasSession: !!session });
  }, [attemptId, session]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      setLoadingData(true);
      const { data, error: err } = await supabase.rpc("student_get_results", {
        _token: session.token, _attempt_id: attemptId,
      });
      console.log("[ReviewPage] student_get_results", {
        attemptId,
        hasError: !!err,
        data,
      });
      setLoadingData(false);
      if (err) { setError(err.message); return; }
      const payload = data as unknown as { quiz: Quiz; items: ResultItem[] };
      setQuiz(payload.quiz);
      setItems(payload.items ?? []);
    })();
  }, [session, attemptId]);

  if (loading || loadingData) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }
  if (!session) return <Navigate to="/" />;
  if (error) {
    return (
      <PageContainer>
        <div className="bg-destructive/10 border border-destructive/40 rounded-2xl p-6 text-center">
          <AlertCircle className="size-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </PageContainer>
    );
  }
  if (!quiz) return null;

  return (
    <PageContainer>
      <PageHeader title={`مراجعة: ${quiz.title}`} description="عرض تفصيلي لكل سؤال وإجابتك" />
      <div className="flex flex-wrap gap-2 mb-6">
        <Link to="/dashboard/student/results/$attemptId" params={{ attemptId }} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg glass hover:bg-white/40">
          <ArrowRight className="size-4" /> صفحة النتيجة
        </Link>
        <Link to="/dashboard/student" className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg glass hover:bg-white/40">
          <ClipboardList className="size-4" /> صفحة الاختبارات
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((q, i) => {
          const blank = !hasAnswer(q);
          const status: "correct" | "wrong" | "blank" = q.is_correct ? "correct" : blank ? "blank" : "wrong";
          const s = styles[status];
          return (
            <div key={q.id} className={`bg-card border rounded-2xl p-5 ${s.border}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className={`size-10 shrink-0 rounded-xl text-sm font-bold grid place-items-center ${s.badge}`}>
                  {status === "correct" ? <CheckCircle2 className="size-5" /> : status === "wrong" ? <XCircle className="size-5" /> : <AlertCircle className="size-5" />}
                </span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">{i + 1}. {q.question_text}</p>
                  <span className={`text-xs font-bold ${s.text}`}>{q.points_earned} / {q.points} نقطة · {s.label}</span>
                </div>
              </div>

              {q.image_url && <img src={q.image_url} alt="" className="max-h-64 rounded-xl mb-3 border border-border/60 mx-auto" />}

              {q.question_type === "short_text" ? (
                <div className="space-y-2 text-sm">
                  <div className={`p-3 rounded-lg border ${q.is_correct ? "bg-chemistry/10 border-chemistry/30" : "bg-destructive/10 border-destructive/30"}`}>
                    <span className="text-xs text-muted-foreground block mb-1">إجابتك:</span>
                    <span className={`font-medium ${q.is_correct ? "text-chemistry" : "text-destructive"}`}>{q.my_text || "— لم تجب —"}</span>
                  </div>
                  {!q.is_correct && q.correct_text && (
                    <div className="p-3 rounded-lg bg-chemistry/10 border border-chemistry/30">
                      <span className="text-xs text-muted-foreground block mb-1">الإجابة الصحيحة:</span>
                      <span className="text-chemistry font-medium">{q.correct_text}</span>
                    </div>
                  )}
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {q.options.map((o) => {
                    const isMine = q.my_option_id === o.id;
                    const isRight = o.is_correct;
                    let cls = "bg-muted/40 text-muted-foreground border-border/30";
                    let icon = null;
                    if (isRight) { cls = "bg-chemistry/15 text-chemistry border-chemistry/40"; icon = <CheckCircle2 className="size-4 shrink-0" />; }
                    else if (isMine) { cls = "bg-destructive/15 text-destructive border-destructive/40"; icon = <XCircle className="size-4 shrink-0" />; }
                    return (
                      <li key={o.id} className={`text-sm flex items-center gap-2 px-3 py-2.5 rounded-lg border ${cls}`}>
                        {icon}
                        <span className="flex-1">{o.option_text}</span>
                        {isMine && <span className="text-[10px] opacity-80 font-bold uppercase">إجابتك</span>}
                      </li>
                    );
                  })}
                </ul>
              )}

              {q.explanation && q.explanation.trim() && (
                <div className="mt-4 p-4 rounded-xl bg-primary/8 border border-primary/30">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="size-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-primary block mb-1">شرح الإجابة</span>
                      <p className="text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
