import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, ArrowRight, Trash2, X, Image as ImageIcon, CheckCircle2, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/quizzes/$quizId")({
  head: () => ({ meta: [{ title: "أسئلة الاختبار — EduVerse" }] }),
  component: QuizAuthorPage,
});

type QuestionType = "mcq" | "true_false" | "short_text";

interface Quiz { id: string; title: string }
interface Option { id: string; option_text: string; is_correct: boolean; sort_order: number }
interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  image_url: string | null;
  points: number;
  sort_order: number;
  correct_text: string | null;
  explanation: string;
  options: Option[];
}

function QuizAuthorPage() {
  const { user, role, loading } = useAuth();
  const { quizId } = Route.useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editing, setEditing] = useState<Question | "new" | null>(null);

  useEffect(() => { if (user) void load(); /* eslint-disable-next-line */ }, [user, quizId]);

  async function load() {
    const { data: q } = await supabase.from("quizzes").select("id, title").eq("id", quizId).maybeSingle();
    setQuiz(q);
    const { data: qs } = await supabase
      .from("quiz_questions")
      .select("id, question_text, question_type, image_url, points, sort_order, correct_text, explanation")
      .eq("quiz_id", quizId)
      .order("sort_order", { ascending: true });
    if (!qs) { setQuestions([]); return; }
    const ids = qs.map((x) => x.id);
    const { data: opts } = ids.length
      ? await supabase
          .from("question_options")
          .select("id, question_id, option_text, is_correct, sort_order")
          .in("question_id", ids)
          .order("sort_order", { ascending: true })
      : { data: [] as (Option & { question_id: string })[] };
    setQuestions(
      qs.map((x) => ({
        ...x,
        options: (opts ?? []).filter((o) => o.question_id === x.id).map(({ id, option_text, is_correct, sort_order }) => ({
          id, option_text, is_correct, sort_order,
        })),
      }))
    );
  }

  async function deleteQuestion(id: string) {
    if (!confirm("حذف هذا السؤال؟")) return;
    await supabase.from("quiz_questions").delete().eq("id", id);
    await load();
  }

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role !== "teacher") return <Navigate to="/dashboard" />;

  return (
    <PageContainer>
      <PageHeader title={quiz?.title ?? "أسئلة الاختبار"} description="إنشاء وتعديل أسئلة الاختبار" />
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard/teacher/quizzes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-4" /> كل الاختبارات
        </Link>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow-primary"
        >
          <Plus className="size-4" /> سؤال جديد
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center text-muted-foreground">
          لا أسئلة بعد. أضف أول سؤال.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-card-premium border border-border/60 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="size-8 shrink-0 rounded-lg bg-primary/20 text-primary text-sm font-bold grid place-items-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">{q.question_text}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span>{labelForType(q.question_type)}</span>
                      <span>{q.points} نقطة</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditing(q)}
                    className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              {q.image_url && (
                <img src={q.image_url} alt="" className="max-h-48 rounded-lg mb-3 border border-border/60" />
              )}
              {q.question_type !== "short_text" && (
                <ul className="space-y-1.5 pr-11">
                  {q.options.map((o) => (
                    <li key={o.id} className={`text-sm flex items-center gap-2 px-3 py-2 rounded-lg ${o.is_correct ? "bg-chemistry/10 text-chemistry" : "bg-white/5 text-muted-foreground"}`}>
                      {o.is_correct && <CheckCircle2 className="size-4" />}
                      {o.option_text}
                    </li>
                  ))}
                </ul>
              )}
              {q.question_type === "short_text" && q.correct_text && (
                <div className="text-xs text-muted-foreground pr-11">الإجابة الصحيحة: <span className="text-chemistry">{q.correct_text}</span></div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <QuestionModal
          quizId={quizId}
          question={editing === "new" ? undefined : editing}
          existingCount={questions.length}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); }}
        />
      )}
    </PageContainer>
  );
}

function labelForType(t: QuestionType) {
  return t === "mcq" ? "اختيار من متعدد" : t === "true_false" ? "صح / خطأ" : "إجابة نصية";
}

interface DraftOption { id?: string; option_text: string; is_correct: boolean }

function QuestionModal({
  quizId,
  question,
  existingCount,
  onClose,
  onSaved,
}: {
  quizId: string;
  question?: Question;
  existingCount: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState(question?.question_text ?? "");
  const [type, setType] = useState<QuestionType>(question?.question_type ?? "mcq");
  const [points, setPoints] = useState(question?.points ?? 1);
  const [imageUrl, setImageUrl] = useState(question?.image_url ?? "");
  const [correctText, setCorrectText] = useState(question?.correct_text ?? "");
  const [explanation, setExplanation] = useState(question?.explanation ?? "");
  const [options, setOptions] = useState<DraftOption[]>(
    question?.options.length
      ? question.options.map((o) => ({ id: o.id, option_text: o.option_text, is_correct: o.is_correct }))
      : type === "true_false"
        ? [{ option_text: "صح", is_correct: false }, { option_text: "خطأ", is_correct: false }]
        : [{ option_text: "", is_correct: false }, { option_text: "", is_correct: false }]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeType(t: QuestionType) {
    setType(t);
    if (t === "true_false") {
      setOptions([{ option_text: "صح", is_correct: false }, { option_text: "خطأ", is_correct: false }]);
    } else if (t === "mcq" && options.length < 2) {
      setOptions([{ option_text: "", is_correct: false }, { option_text: "", is_correct: false }]);
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `questions/${quizId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("course-assets").upload(path, file);
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("course-assets").getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setUploading(false);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);

    if (type !== "short_text") {
      const hasCorrect = options.some((o) => o.is_correct && o.option_text.trim());
      if (!hasCorrect) { setError("يجب تحديد إجابة صحيحة واحدة على الأقل"); setSaving(false); return; }
    } else if (!correctText.trim()) {
      setError("يجب إدخال الإجابة الصحيحة"); setSaving(false); return;
    }

    let questionId = question?.id;
    if (question) {
      const { error: err } = await supabase.from("quiz_questions").update({
        question_text: text,
        question_type: type,
        image_url: imageUrl || null,
        points,
        correct_text: type === "short_text" ? correctText.trim() : null,
        explanation: explanation.trim(),
      }).eq("id", question.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { data: ins, error: err } = await supabase.from("quiz_questions").insert({
        quiz_id: quizId,
        question_text: text,
        question_type: type,
        image_url: imageUrl || null,
        points,
        sort_order: existingCount,
        correct_text: type === "short_text" ? correctText.trim() : null,
        explanation: explanation.trim(),
      }).select("id").single();
      if (err || !ins) { setError(err?.message ?? "خطأ"); setSaving(false); return; }
      questionId = ins.id;
    }

    if (type !== "short_text" && questionId) {
      await supabase.from("question_options").delete().eq("question_id", questionId);
      const validOptions = options.filter((o) => o.option_text.trim());
      if (validOptions.length) {
        await supabase.from("question_options").insert(
          validOptions.map((o, i) => ({
            question_id: questionId!,
            option_text: o.option_text.trim(),
            is_correct: o.is_correct,
            sort_order: i,
          }))
        );
      }
    } else if (type === "short_text" && questionId) {
      await supabase.from("question_options").delete().eq("question_id", questionId);
    }

    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={save}
        className="bg-card border border-border/60 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-elevated my-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{question ? "تعديل السؤال" : "سؤال جديد"}</h3>
          <button type="button" onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">نوع السؤال</label>
          <div className="flex gap-2">
            {(["mcq", "true_false", "short_text"] as QuestionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeType(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${type === t ? "bg-gradient-primary text-primary-foreground" : "glass hover:bg-white/10"}`}
              >
                {labelForType(t)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">نص السؤال</label>
          <textarea
            required
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">صورة السؤال (اختياري)</label>
          {imageUrl ? (
            <div className="flex items-center gap-3">
              <img src={imageUrl} alt="" className="h-20 rounded-lg border border-border/60" />
              <button type="button" onClick={() => setImageUrl("")} className="text-xs text-destructive hover:underline">إزالة</button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition cursor-pointer text-sm">
              <ImageIcon className="size-4" />
              {uploading ? "جاري الرفع..." : "رفع صورة"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f); }}
              />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">النقاط</label>
          <input
            type="number"
            min={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-24 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {type === "short_text" ? (
          <div>
            <label className="block text-sm font-medium mb-1.5">الإجابة الصحيحة (تطابق نصي تام، غير حساس لحالة الأحرف)</label>
            <input
              value={correctText}
              onChange={(e) => setCorrectText(e.target.value)}
              className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">الخيارات (حدد الصحيحة)</label>
            <div className="space-y-2">
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={o.is_correct}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = { ...o, is_correct: e.target.checked };
                      setOptions(next);
                    }}
                    className="size-4 accent-primary"
                  />
                  <input
                    value={o.option_text}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = { ...o, option_text: e.target.value };
                      setOptions(next);
                    }}
                    placeholder={`خيار ${i + 1}`}
                    disabled={type === "true_false"}
                    className="flex-1 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70"
                  />
                  {type === "mcq" && options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setOptions(options.filter((_, k) => k !== i))}
                      className="size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {type === "mcq" && (
                <button
                  type="button"
                  onClick={() => setOptions([...options, { option_text: "", is_correct: false }])}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="size-3" /> إضافة خيار
                </button>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5">
            <Lightbulb className="size-4 text-primary" /> شرح الإجابة (اختياري — يظهر للطالب في صفحة المراجعة)
          </label>
          <textarea
            rows={2}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="مثال: الإجابة الصحيحة هي ٤ لأن ٢×٢=٤"
            className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg glass text-sm">إلغاء</button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ السؤال"}
          </button>
        </div>
      </form>
    </div>
  );
}
