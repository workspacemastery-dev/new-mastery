import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2, ArrowRight, Clock, Send, AlertTriangle,
  ChevronLeft, ChevronRight, CheckCircle2, Circle, Save,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student/quiz/$quizId")({
  head: () => ({ meta: [{ title: "اختبار — EduVerse" }] }),
  component: TakeQuizPage,
});

const QUESTIONS_PER_PAGE = 3;

type QuestionType = "mcq" | "true_false" | "short_text";

interface Quiz {
  id: string; title: string; description: string;
  duration_minutes: number; passing_score: number;
}

interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  image_url: string | null;
  points: number;
  sort_order: number;
  options: { id: string; option_text: string }[];
}

interface Attempt { id: string; started_at: string; status: string }

interface Answer { optionId?: string | null; text?: string | null }

function TakeQuizPage() {
  const { session, loading } = useStudentAuth();
  const { quizId } = Route.useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [page, setPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});
  const initialized = useRef(false);

  useEffect(() => {
    if (!session || initialized.current) return;
    initialized.current = true;
    void start();
    // eslint-disable-next-line
  }, [session]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  async function start() {
    if (!session) return;
    setPageLoading(true);
    setLoadError(null);
    try {
      const { data: quizPayload, error: e1 } = await supabase.rpc("student_get_quiz", {
        _token: session.token, _quiz_id: quizId,
      });
      if (e1) throw e1;
      const payload = quizPayload as unknown as { quiz: Quiz; questions: Question[] };
      setQuiz(payload.quiz);
      setQuestions(payload.questions ?? []);

      const { data: attemptPayload, error: e2 } = await supabase.rpc("student_start_or_resume_attempt", {
        _token: session.token, _quiz_id: quizId,
      });
      if (e2) throw e2;
      const ap = attemptPayload as unknown as {
        attempt: Attempt;
        answers: { question_id: string; selected_option_id: string | null; text_answer: string | null }[];
      };
      setAttempt(ap.attempt);
      const map: Record<string, Answer> = {};
      ap.answers.forEach((a) => {
        map[a.question_id] = { optionId: a.selected_option_id, text: a.text_answer };
      });
      setAnswers(map);
    } catch (err: any) {
      console.error("[student-quiz] start failed", err);
      setLoadError(err?.message ?? "تعذّر فتح الاختبار");
    } finally {
      setPageLoading(false);
    }
  }

  const remainingSec = useMemo(() => {
    if (!attempt || !quiz) return 0;
    const end = new Date(attempt.started_at).getTime() + quiz.duration_minutes * 60_000;
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [attempt, quiz, now]);

  useEffect(() => {
    if (attempt && quiz && remainingSec === 0 && !submitting && attempt.status === "in_progress") {
      void submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec]);

  async function saveAnswer(questionId: string, val: Answer) {
    if (!attempt || !session) return;
    setAnswers((a) => ({ ...a, [questionId]: val }));
    setSavingMap((s) => ({ ...s, [questionId]: true }));
    const { error } = await supabase.rpc("student_save_answer", {
      _token: session.token,
      _attempt_id: attempt.id,
      _question_id: questionId,
      _option_id: val.optionId ?? (null as unknown as string),
      _text: val.text ?? (null as unknown as string),
    });
    setSavingMap((s) => ({ ...s, [questionId]: false }));
    if (error) console.error("[student-quiz] save answer failed", error);
  }

  async function submit() {
    if (!attempt || !session || submitting) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("student_submit_attempt", {
      _token: session.token, _attempt_id: attempt.id,
    });
    setSubmitting(false);
    if (error) {
      console.error("[student-quiz] submit failed", error);
      return;
    }
    const result = data as unknown as { attempt_id: string };
    void navigate({ to: "/dashboard/student/results/$attemptId", params: { attemptId: result.attempt_id } });
  }

  if (loading || pageLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }
  if (!session) return <Navigate to="/" />;

  if (loadError) {
    return (
      <PageContainer>
        <div className="bg-destructive/10 border border-destructive/40 rounded-2xl p-6 text-center">
          <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium mb-3">{loadError}</p>
          <Link to="/dashboard/student" className="text-sm text-primary underline">العودة للوحة الطالب</Link>
        </div>
      </PageContainer>
    );
  }
  if (!quiz) return null;

  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const pageQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).filter((k) => {
    const a = answers[k];
    return (a.optionId && a.optionId.length > 0) || (a.text && a.text.trim().length > 0);
  }).length;

  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const lowTime = remainingSec < 60;

  return (
    <PageContainer>
      <PageHeader title={quiz.title} description={quiz.description || "—"} />

      {/* Sticky bar: Timer + Progress + Submit */}
      <div className="sticky top-2 z-10 bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-elevated">
        <div className="flex items-center gap-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${lowTime ? "bg-destructive/20 text-destructive animate-pulse" : "bg-primary/15 text-primary"}`}>
            <Clock className="size-5" />
            {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
          </div>
          <div className="text-sm text-muted-foreground">
            تمت الإجابة على <span className="text-foreground font-bold">{answeredCount}</span> من {questions.length}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/student"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass hover:bg-white/40 text-sm"
            title="العودة دون تسليم — سيتم استئناف الاختبار لاحقًا بنفس التوقيت والإجابات"
          >
            <ArrowRight className="size-4" /> العودة
          </Link>
          <button
            onClick={() => setConfirming(true)}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-50"
          >
            <Send className="size-4" /> تسليم الاختبار
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center text-muted-foreground">
          لا توجد أسئلة في هذا الاختبار.
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {pageQuestions.map((q, idx) => {
              const globalIdx = page * QUESTIONS_PER_PAGE + idx;
              const ans = answers[q.id] ?? {};
              const saving = savingMap[q.id];
              const isAnswered = (ans.optionId && ans.optionId.length > 0) || (ans.text && ans.text.trim().length > 0);
              return (
                <div key={q.id} className="bg-card-premium border border-border/60 rounded-2xl p-6 shadow-elevated">
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`size-10 shrink-0 rounded-xl text-sm font-bold grid place-items-center ${isAnswered ? "bg-chemistry/20 text-chemistry" : "bg-primary/15 text-primary"}`}>
                      {globalIdx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-relaxed">{q.question_text}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{q.points} نقطة</span>
                        {saving && <span className="inline-flex items-center gap-1 text-primary"><Save className="size-3 animate-pulse" /> يتم الحفظ...</span>}
                        {!saving && isAnswered && <span className="inline-flex items-center gap-1 text-chemistry"><CheckCircle2 className="size-3" /> تم الحفظ</span>}
                      </div>
                    </div>
                  </div>

                  {q.image_url && (
                    <img src={q.image_url} alt="" className="max-h-80 rounded-xl mb-4 border border-border/60 mx-auto" />
                  )}

                  {q.question_type === "short_text" ? (
                    <input
                      value={ans.text ?? ""}
                      onChange={(e) => saveAnswer(q.id, { text: e.target.value })}
                      placeholder="اكتب إجابتك هنا..."
                      className="w-full bg-input border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <div className="space-y-2">
                      {q.options.map((o) => {
                        const selected = ans.optionId === o.id;
                        return (
                          <label
                            key={o.id}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition cursor-pointer ${selected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border/40 hover:bg-white/5"}`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              checked={selected}
                              onChange={() => saveAnswer(q.id, { optionId: o.id })}
                              className="accent-primary size-4"
                            />
                            <span className="text-sm flex-1">{o.option_text}</span>
                            {selected && <CheckCircle2 className="size-4 text-primary" />}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 bg-card-premium border border-border/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg glass hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              <ChevronRight className="size-4" /> السابق
            </button>

            <div className="flex flex-wrap items-center gap-1.5 justify-center">
              {Array.from({ length: totalPages }, (_, i) => {
                const start = i * QUESTIONS_PER_PAGE;
                const slice = questions.slice(start, start + QUESTIONS_PER_PAGE);
                const allAnswered = slice.every((q) => {
                  const a = answers[q.id];
                  return a && ((a.optionId && a.optionId.length > 0) || (a.text && a.text.trim().length > 0));
                });
                const partiallyAnswered = !allAnswered && slice.some((q) => {
                  const a = answers[q.id];
                  return a && ((a.optionId && a.optionId.length > 0) || (a.text && a.text.trim().length > 0));
                });
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`size-9 rounded-lg text-xs font-bold transition ${
                      i === page
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                        : allAnswered
                          ? "bg-chemistry/20 text-chemistry hover:bg-chemistry/30"
                          : partiallyAnswered
                            ? "bg-gold/20 text-gold hover:bg-gold/30"
                            : "glass hover:bg-white/10"
                    }`}
                    title={`الصفحة ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg glass hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              التالي <ChevronLeft className="size-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-chemistry/40" /> صفحة مكتملة</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-gold/40" /> غير مكتملة</span>
            <span className="inline-flex items-center gap-1.5"><Circle className="size-3" /> لم تبدأ</span>
          </div>
        </>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => setConfirming(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border/60 rounded-2xl p-6 max-w-md w-full text-center shadow-elevated">
            <AlertTriangle className="size-12 text-gold mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">تأكيد التسليم</h3>
            <p className="text-sm text-muted-foreground mb-2">
              هل أنت متأكد من تسليم الاختبار؟ لن تتمكن من تعديل إجاباتك بعد ذلك.
            </p>
            <p className="text-xs text-muted-foreground mb-5">
              تمت الإجابة على <span className="text-foreground font-bold">{answeredCount}</span> من <span className="text-foreground font-bold">{questions.length}</span> سؤال
              {answeredCount < questions.length && <span className="block mt-1 text-gold">⚠ يوجد {questions.length - answeredCount} سؤال بدون إجابة</span>}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirming(false)} className="flex-1 px-4 py-2.5 rounded-lg glass">إلغاء</button>
              <button
                onClick={() => { setConfirming(false); void submit(); }}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-medium disabled:opacity-50"
              >
                {submitting ? "جاري التسليم..." : "تسليم نهائي"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
