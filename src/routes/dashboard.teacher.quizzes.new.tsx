import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Loader2, ArrowRight, ArrowLeft, Check, Plus, Trash2, X, Image as ImageIcon,
  CheckCircle2, BookMarked, Lightbulb, Save, ClipboardList, FileText, Calendar,
  PlusCircle, MinusCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/quizzes/new")({
  head: () => ({ meta: [{ title: "إنشاء اختبار جديد — EduVerse" }] }),
  component: NewQuizWizard,
});

type QuestionType = "mcq" | "true_false" | "short_text";

interface DraftOption { option_text: string; is_correct: boolean }
interface DraftQuestion {
  question_text: string;
  question_type: QuestionType;
  image_url: string | null;
  points: number;
  correct_text: string | null;
  explanation: string;
  options: DraftOption[];
}

interface BankItem {
  id: string;
  type: string;
  question_text: string | null;
  question_image: string | null;
  options: { text: string; is_correct?: boolean }[] | unknown;
  correct_answer: number;
}

// ✅ UUID بديل لا يعتمد على crypto.randomUUID
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function NewQuizWizard() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [maxScore, setMaxScore] = useState(100);
  const [passing, setPassing] = useState(50);

  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [editing, setEditing] = useState<{ idx: number | "new" } | null>(null);
  const [bankOpen, setBankOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (data) setAcademyId(data.id);
    })();
  }, [user, role]);

  function nextStep() {
    setError(null);
    if (step === 1) {
      if (!title.trim()) { setError("اسم الاختبار مطلوب"); return; }
      if (duration < 1) { setError("مدة الاختبار يجب أن تكون 1 دقيقة على الأقل"); return; }
    }
    if (step === 2 && questions.length === 0) {
      setError("أضف سؤالاً واحداً على الأقل"); return;
    }
    setStep(step + 1);
  }

  async function submitQuiz() {
    if (!academyId) return;
    setSubmitting(true); setError(null);
    const { data: quiz, error: qErr } = await supabase.from("quizzes").insert({
      academy_id: academyId,
      title: title.trim(),
      description: description.trim(),
      duration_minutes: duration,
      passing_score: passing,
      is_published: true,
    }).select("id").single();
    if (qErr || !quiz) { setError(qErr?.message ?? "خطأ"); setSubmitting(false); return; }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const { data: insQ, error: qqErr } = await supabase.from("quiz_questions").insert({
        quiz_id: quiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        image_url: q.image_url,
        points: q.points,
        sort_order: i,
        correct_text: q.question_type === "short_text" ? q.correct_text : null,
        explanation: q.explanation,
      }).select("id").single();
      if (qqErr || !insQ) { setError(qqErr?.message ?? "خطأ في حفظ السؤال"); setSubmitting(false); return; }
      if (q.question_type !== "short_text" && q.options.length) {
        await supabase.from("question_options").insert(
          q.options.map((o, oi) => ({
            question_id: insQ.id,
            option_text: o.option_text.trim(),
            is_correct: o.is_correct,
            sort_order: oi,
          }))
        );
      }
    }

    setSubmitting(false);
    navigate({ to: "/dashboard/teacher/quizzes" });
  }

  if (authLoading) return <PageContainer><div className="grid place-items-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div></PageContainer>;
  if (!academyId) return <PageContainer><div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center"><p className="text-muted-foreground">لم يتم تعيينك لأكاديمية بعد.</p></div></PageContainer>;

  return (
    <PageContainer>
      <PageHeader
        title="إنشاء اختبار جديد"
        description="معالج 3 مراحل لإنشاء اختبار احترافي"
        actions={
          <Link to="/dashboard/teacher/quizzes" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowRight className="size-4" /> العودة للاختبارات
          </Link>
        }
      />

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        {[
          { n: 1, label: "المعلومات", icon: FileText },
          { n: 2, label: "الأسئلة", icon: ClipboardList },
          { n: 3, label: "المراجعة والتسليم", icon: Check },
        ].map((s, i, arr) => (
          <div key={s.n} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`size-12 rounded-full grid place-items-center font-bold transition ${
                step > s.n ? "bg-green-500 text-white" :
                step === s.n ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" :
                "bg-input text-muted-foreground"
              }`}>
                {step > s.n ? <Check className="size-5" /> : <s.icon className="size-5" />}
              </div>
              <span className={`text-xs font-medium ${step >= s.n ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 -mt-6 ${step > s.n ? "bg-green-500" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-card-premium border border-border/60 rounded-2xl p-6 lg:p-8">
        {step === 1 && (
          <div className="space-y-5 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
              <FileText className="size-5 text-primary" /> معلومات الاختبار
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">اسم الاختبار *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: اختبار الفصل الأول"
                className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">وصف الاختبار</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 inline-flex items-center gap-1.5"><Calendar className="size-4" /> تاريخ الانتهاء (اختياري)</label>
                <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">مدة الاختبار (دقيقة)</label>
                <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الدرجة العظمى</label>
                <input type="number" min={1} value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">علامة النجاح (%)</label>
                <input type="number" min={0} max={100} value={passing} onChange={(e) => setPassing(Number(e.target.value))}
                  className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold inline-flex items-center gap-2">
                <ClipboardList className="size-5 text-primary" /> الأسئلة ({questions.length})
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setBankOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm">
                  <BookMarked className="size-4" /> إدراج من بنك الأسئلة
                </button>
                <button onClick={() => setEditing({ idx: "new" })} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium">
                  <Plus className="size-4" /> سؤال جديد
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                لم تضف أي سؤال بعد. اضغط "سؤال جديد" أو "إدراج من بنك الأسئلة".
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="bg-input/50 border border-border/60 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="size-7 shrink-0 rounded-lg bg-primary/20 text-primary text-xs font-bold grid place-items-center">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm mb-1">{q.question_text}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                            <span>{labelForType(q.question_type)}</span>
                            <span>{q.points} نقطة</span>
                            {q.image_url && <span className="text-primary">📷 صورة</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditing({ idx: i })} className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10">تعديل</button>
                        <button onClick={() => setQuestions(questions.filter((_, k) => k !== i))} className="size-7 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
              <Check className="size-5 text-primary" /> مراجعة وتسليم
            </h2>
            <div className="space-y-3">
              <div className="bg-input/50 border border-border/60 rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-1">اسم الاختبار</div>
                <div className="font-bold">{title}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="عدد الأسئلة" value={questions.length} />
                <Stat label="المدة" value={`${duration} د`} />
                <Stat label="الدرجة العظمى" value={maxScore} />
                <Stat label="النجاح" value={`${passing}%`} />
              </div>
              {endsAt && (
                <div className="text-xs text-muted-foreground">ينتهي في: {new Date(endsAt).toLocaleString("ar-EG")}</div>
              )}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground">
              <CheckCircle2 className="inline size-4 text-primary me-1.5" />
              عند التسليم سيتم نشر الاختبار فوراً ويظهر للطلاب المسجلين في أكاديميتك.
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="size-4" /> السابق
          </button>
          {step < 3 ? (
            <button onClick={nextStep} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium">
              التالي <ArrowLeft className="size-4" />
            </button>
          ) : (
            <button onClick={submitQuiz} disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {submitting ? "جاري التسليم..." : "تسليم ونشر الاختبار"}
            </button>
          )}
        </div>
      </div>

      {editing && (
        <QuestionDraftModal
          existing={editing.idx === "new" ? undefined : questions[editing.idx as number]}
          onClose={() => setEditing(null)}
          onSave={(q) => {
            if (editing.idx === "new") setQuestions([...questions, q]);
            else { const next = [...questions]; next[editing.idx as number] = q; setQuestions(next); }
            setEditing(null);
          }}
        />
      )}

      {bankOpen && academyId && (
        <BankModal
          academyId={academyId}
          onClose={() => setBankOpen(false)}
          onImport={(items) => {
            setQuestions([...questions, ...items]);
            setBankOpen(false);
          }}
        />
      )}
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-input/50 border border-border/60 rounded-xl p-3 text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}

function labelForType(t: QuestionType) {
  return t === "mcq" ? "اختياري" : t === "true_false" ? "صح / خطأ" : "مقالي";
}

function QuestionDraftModal({ existing, onClose, onSave }: {
  existing?: DraftQuestion;
  onClose: () => void;
  onSave: (q: DraftQuestion) => void;
}) {
  const [text, setText] = useState(existing?.question_text ?? "");
  const [type, setType] = useState<QuestionType>(existing?.question_type ?? "mcq");
  const [points, setPoints] = useState(existing?.points ?? 1);
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? "");
  const [correctText, setCorrectText] = useState(existing?.correct_text ?? "");
  const [explanation, setExplanation] = useState(existing?.explanation ?? "");

  // ✅ حالة رفع الصورة منفصلة وواضحة
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [options, setOptions] = useState<DraftOption[]>(
    existing?.options && existing.options.length > 0
      ? existing.options.map((o) => ({ option_text: o.option_text, is_correct: o.is_correct }))
      : type === "true_false"
        ? [{ option_text: "صح", is_correct: false }, { option_text: "خطأ", is_correct: false }]
        : [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
          ]
  );
  const [err, setErr] = useState<string | null>(null);

  function changeType(t: QuestionType) {
    setType(t);
    if (t === "true_false") {
      setOptions([{ option_text: "صح", is_correct: false }, { option_text: "خطأ", is_correct: false }]);
    } else if (t === "mcq") {
      setOptions([
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ]);
    }
  }

  function addOption() {
    if (options.length >= 6) return;
    setOptions([...options, { option_text: "", is_correct: false }]);
  }

  function removeOption(idx: number) {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== idx);
    if (options[idx].is_correct && updated.length > 0) updated[0].is_correct = true;
    setOptions(updated);
  }

  // ✅ رفع الصورة — مُصلح بالكامل
  async function uploadImage(file: File) {
    setUploadState("uploading");
    setUploadErr(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `questions/draft/${generateUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("course-assets").upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("course-assets").getPublicUrl(path);
      setImageUrl(pub.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadState("error");
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!text.trim()) { setErr("نص السؤال مطلوب"); return; }

    if (type !== "short_text") {
      const filled = options.filter((o) => o.option_text.trim());
      if (filled.length < 2) { setErr("يجب إدخال خيارين على الأقل"); return; }
      if (!options.some((o) => o.is_correct && o.option_text.trim())) {
        setErr("يجب تحديد إجابة صحيحة واحدة على الأقل"); return;
      }
    }
    if (type === "short_text" && !correctText.trim()) { setErr("يجب إدخال الإجابة الصحيحة"); return; }
    if (uploadState === "uploading") { setErr("الرجاء انتظار اكتمال رفع الصورة"); return; }

    onSave({
      question_text: text.trim(),
      question_type: type,
      image_url: imageUrl || null,
      points,
      correct_text: type === "short_text" ? correctText.trim() : null,
      explanation: explanation.trim(),
      options: type === "short_text" ? [] : options.filter((o) => o.option_text.trim()),
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit}
        className="bg-card border border-border/60 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-elevated my-8">

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{existing ? "تعديل السؤال" : "سؤال جديد"}</h3>
          <button type="button" onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        {/* نوع السؤال */}
        <div>
          <label className="block text-sm font-medium mb-1.5">نوع السؤال</label>
          <div className="flex gap-2 flex-wrap">
            {(["mcq", "true_false", "short_text"] as QuestionType[]).map((t) => (
              <button key={t} type="button" onClick={() => changeType(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${type === t ? "bg-gradient-primary text-primary-foreground" : "glass hover:bg-white/10"}`}>
                {labelForType(t)}
              </button>
            ))}
          </div>
        </div>

        {/* نص السؤال */}
        <div>
          <label className="block text-sm font-medium mb-1.5">نص السؤال *</label>
          <textarea required rows={2} value={text} onChange={(e) => setText(e.target.value)}
            className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        {/* ✅ رفع الصورة — مُصلح */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            صورة السؤال <span className="text-muted-foreground text-xs">(للمعادلات الرياضية أو الرسوم)</span>
          </label>

          {imageUrl && uploadState === "done" ? (
            <div className="flex items-center gap-3">
              <img src={imageUrl} alt="" className="h-24 rounded-lg border border-border/60 object-contain" />
              <button type="button" onClick={() => { setImageUrl(""); setUploadState("idle"); }}
                className="text-xs text-destructive hover:underline">إزالة الصورة</button>
            </div>
          ) : uploadState === "uploading" ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60 bg-input text-sm text-muted-foreground w-fit">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>جارٍ رفع الصورة...</span>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border/60 bg-input cursor-pointer text-sm hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <ImageIcon className="size-4 text-muted-foreground" />
              <span>رفع صورة</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f); }} />
            </label>
          )}

          {uploadState === "error" && (
            <p className="text-xs text-destructive mt-1">{uploadErr ?? "فشل رفع الصورة، حاول مرة أخرى"}</p>
          )}
        </div>

        {/* النقاط */}
        <div>
          <label className="block text-sm font-medium mb-1.5">النقاط</label>
          <input type="number" min={1} value={points} onChange={(e) => setPoints(Number(e.target.value))}
            className="w-24 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        {/* الإجابة القصيرة */}
        {type === "short_text" ? (
          <div>
            <label className="block text-sm font-medium mb-1.5">الإجابة الصحيحة (تطابق نصي)</label>
            <input value={correctText} onChange={(e) => setCorrectText(e.target.value)}
              className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        ) : (
          /* الخيارات */
          <div>
            <label className="block text-sm font-medium mb-2">
              الخيارات <span className="text-muted-foreground text-xs">(حدد الإجابة الصحيحة)</span>
            </label>
            <div className="space-y-2">
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={o.is_correct}
                    onChange={() => setOptions(options.map((opt, idx) => ({ ...opt, is_correct: idx === i })))}
                    className="accent-primary cursor-pointer"
                  />
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    value={o.option_text}
                    onChange={(e) => { const n = [...options]; n[i] = { ...o, option_text: e.target.value }; setOptions(n); }}
                    placeholder={`الخيار ${String.fromCharCode(65 + i)}`}
                    readOnly={type === "true_false"}
                    className="flex-1 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 read-only:opacity-70"
                  />
                  {type === "mcq" && options.length > 2 && (
                    <button type="button" onClick={() => removeOption(i)}
                      className="text-destructive/70 hover:text-destructive transition-colors">
                      <MinusCircle className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* زر إضافة خيار — أسفل الخيارات على اليسار */}
            {type === "mcq" && (
              <div className="flex justify-start mt-2">
                <button type="button" onClick={addOption} disabled={options.length >= 6}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-primary/30">
                  <PlusCircle className="size-3.5" />
                  إضافة خيار
                </button>
              </div>
            )}
          </div>
        )}

        {/* شرح الإجابة */}
        <div>
          <label className="block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5">
            <Lightbulb className="size-4 text-primary" /> شرح الإجابة
            <span className="text-muted-foreground text-xs">(اختياري)</span>
          </label>
          <textarea rows={2} value={explanation} onChange={(e) => setExplanation(e.target.value)}
            className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        {err && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{err}</div>
        )}

        <div className="flex items-center gap-2 justify-end pt-2 border-t border-border/60">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm">إلغاء</button>
          <button type="submit" disabled={saving || uploadState === "uploading"}
            className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2">
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            {saving ? "جارٍ الحفظ..." : "حفظ السؤال"}
          </button>
        </div>
      </form>
    </div>
  );
}

function BankModal({ academyId, onClose, onImport }: {
  academyId: string;
  onClose: () => void;
  onImport: (items: DraftQuestion[]) => void;
}) {
  const [items, setItems] = useState<BankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("questions")
        .select("id, type, question_text, question_image, options, correct_answer")
        .eq("academy_id", academyId)
        .order("created_at", { ascending: false });
      setItems((data ?? []) as BankItem[]);
      setLoading(false);
    })();
  }, [academyId]);

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function importSelected() {
    const drafts: DraftQuestion[] = items
      .filter((it) => selected.has(it.id))
      .map((it) => {
        const rawOpts = Array.isArray(it.options) ? it.options : [];
        const opts: DraftOption[] = rawOpts.map((o, i) => {
          const text = typeof o === "string" ? o : ((o as { text?: string; option_text?: string }).option_text ?? (o as { text?: string }).text ?? "");
          const isCorrect = typeof o === "object" && o !== null && "is_correct" in o
            ? Boolean((o as { is_correct?: boolean }).is_correct)
            : i === it.correct_answer;
          return { option_text: String(text), is_correct: isCorrect };
        });
        const qType: QuestionType = it.type === "true_false" ? "true_false" : it.type === "short_text" || it.type === "essay" ? "short_text" : "mcq";
        return {
          question_text: it.question_text ?? "(بدون نص)",
          question_type: qType,
          image_url: it.question_image,
          points: 1,
          correct_text: null,
          explanation: "",
          options: qType === "short_text" ? [] : opts,
        };
      });
    onImport(drafts);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/60 rounded-2xl p-6 max-w-3xl w-full space-y-4 shadow-elevated my-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold inline-flex items-center gap-2">
            <BookMarked className="size-5 text-primary" /> بنك الأسئلة
          </h3>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/10"><X className="size-4" /></button>
        </div>

        {loading ? (
          <div className="grid place-items-center py-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            بنك الأسئلة فارغ. أضف أسئلة من قسم بنك الأسئلة أولاً.
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">حدد الأسئلة المراد إدراجها ({selected.size} محدد)</div>
            <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
              {items.map((it) => (
                <label key={it.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${selected.has(it.id) ? "border-primary bg-primary/5" : "border-border/60 hover:bg-white/5"}`}>
                  <input type="checkbox" checked={selected.has(it.id)} onChange={() => toggle(it.id)} className="mt-1 size-4 accent-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1 line-clamp-2">{it.question_text ?? "(بدون نص)"}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-input">{it.type}</span>
                      {it.question_image && <span className="text-primary">📷</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 justify-end pt-3 border-t border-border/60">
              <button onClick={onClose} className="px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm">إلغاء</button>
              <button onClick={importSelected} disabled={selected.size === 0}
                className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                إدراج ({selected.size})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

