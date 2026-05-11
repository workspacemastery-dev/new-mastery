import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, FormEvent } from "react";
import { BrainCircuit, Loader2, Plus, Trash2, Sparkles, X, ImageIcon, PlusCircle, MinusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/question-bank")({
  head: () => ({ meta: [{ title: "بنك الأسئلة — EduVerse" }] }),
  component: QuestionBankPage,
});

interface BankQ {
  id: string;
  question_text: string | null;
  type: string;
  options: unknown;
  correct_answer: number;
  created_at: string;
}

type QuestionType = "mcq" | "true_false" | "short_text";

interface DraftOption {
  option_text: string;
  is_correct: boolean;
}

interface DraftQuestion {
  question_text: string;
  question_type: QuestionType;
  image_url: string | null;
  points: number;
  correct_text: string | null;
  explanation: string;
  options: DraftOption[];
}

function QuestionBankPage() {
  const { user, role } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [items, setItems] = useState<BankQ[]>([]);
  const [generating, setGenerating] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ idx: number | "new" } | null>(null);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data } = await supabase
        .from("academies")
        .select("id, subject")
        .eq("teacher_id", user.id)
        .maybeSingle();
      if (data) {
        setAcademyId(data.id);
        setSubject(data.subject);
        await load(data.id);
      }
    })();
  }, [user, role]);

  async function load(aId: string) {
    const { data } = await supabase
      .from("questions")
      .select("id, question_text, type, options, correct_answer, created_at")
      .eq("academy_id", aId)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as BankQ[]);
  }

  async function generateOne() {
    if (!academyId) return;
    setErr(null);
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-question", {
        body: { subject, topic: topic.trim() || subject, existing_count: items.length },
      });
      if (error) throw error;
      const q = data as { question_text: string; options: string[]; correct_answer: number };
      const { error: insErr } = await supabase.from("questions").insert({
        academy_id: academyId,
        type: "mcq",
        question_text: q.question_text,
        options: q.options.map((t) => ({ text: t })),
        correct_answer: q.correct_answer,
      });
      if (insErr) throw insErr;
      await load(academyId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "فشل التوليد");
    } finally {
      setGenerating(false);
    }
  }

  async function remove(id: string) {
    if (!academyId) return;
    if (!confirm("حذف السؤال؟")) return;
    await supabase.from("questions").delete().eq("id", id);
    await load(academyId);
  }

  return (
    <PageContainer>
      <PageHeader
        title="بنك الأسئلة"
        description="ولّد أسئلة بالذكاء الاصطناعي حسب وحدة من مادة الأكاديمية"
      />

      {!academyId ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">يجب تعيينك لأكاديمية أولاً.</p>
        </div>
      ) : (
        <>
          <div className="bg-card-premium border border-border/60 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="size-5 text-primary" />
              <h2 className="font-bold">توليد سؤال بالذكاء الاصطناعي</h2>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              المادة: <span className="font-semibold text-foreground">{subject}</span>
            </p>

            {/* الأزرار فوق بعضهم على اليمين بنفس الحجم واللون */}
            <div className="flex gap-3 mb-4">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="اختر وحدة أو موضوع (مثال: المعادلات الخطية)"
                className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditing({ idx: "new" })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary whitespace-nowrap"
                >
                  <Plus className="size-4" />
                  إضافة سؤال يدوياً
                </button>
                <button
                  onClick={generateOne}
                  disabled={generating}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold disabled:opacity-60 shadow-glow-primary whitespace-nowrap"
                >
                  {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  {generating ? "جارٍ التوليد..." : "توليد سؤال بالذكاء الاصطناعي"}
                </button>
              </div>
            </div>

            {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
            <p className="mt-3 text-[11px] text-muted-foreground">كل ضغطة تضيف سؤال جديد إلى البنك.</p>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="bg-card-premium border border-border/60 rounded-2xl p-10 text-center text-sm text-muted-foreground">
                <Plus className="size-10 mx-auto mb-2 opacity-40" />
                البنك فارغ. ابدأ بتوليد أول سؤال أو أضف سؤالاً يدوياً.
              </div>
            ) : (
              items.map((q, i) => {
                const opts = Array.isArray(q.options)
                  ? (q.options as { text?: string }[])
                  : [];
                return (
                  <div key={q.id} className="bg-card-premium border border-border/60 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="size-7 shrink-0 rounded-lg bg-primary/20 text-primary text-xs font-bold grid place-items-center">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-2">{q.question_text}</div>
                        <ul className="grid sm:grid-cols-2 gap-1.5">
                          {opts.map((o, oi) => (
                            <li
                              key={oi}
                              className={`text-xs px-2 py-1.5 rounded border ${
                                oi === q.correct_answer
                                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : "border-border/60"
                              }`}
                            >
                              {String.fromCharCode(65 + oi)}. {typeof o === "string" ? o : (o as { text?: string; option_text?: string }).option_text ?? (o as { text?: string }).text}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => remove(q.id)}
                        className="size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {editing?.idx !== undefined && (
        <QuestionDraftModal
          existing={editing.idx === "new" ? undefined : items[editing.idx as number]}
          onClose={() => setEditing(null)}
          onSave={async (q) => {
            if (!academyId) return;
            await supabase.from("questions").insert({
              academy_id: academyId,
              type: q.question_type,
              question_text: q.question_text,
              question_image: q.image_url,
              options: q.options.map((o) => ({ option_text: o.option_text, is_correct: o.is_correct })),
              correct_answer:
                q.question_type === "short_text"
                  ? q.correct_text
                  : q.options.findIndex((o) => o.is_correct),
            });
            await load(academyId);
            setEditing(null);
          }}
        />
      )}
    </PageContainer>
  );
}

function labelForType(t: QuestionType) {
  return t === "mcq" ? "اختياري" : t === "true_false" ? "صح / خطأ" : "مقالي";
}

function QuestionDraftModal({
  existing,
  onClose,
  onSave,
}: {
  existing?: DraftQuestion;
  onClose: () => void;
  onSave: (q: DraftQuestion) => Promise<void>;
}) {
  const [text, setText] = useState(existing?.question_text ?? "");
  const [type, setType] = useState<QuestionType>(existing?.question_type ?? "mcq");
  const [points, setPoints] = useState(existing?.points ?? 1);
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? "");
  const [correctText, setCorrectText] = useState(existing?.correct_text ?? "");
  const [explanation, setExplanation] = useState(existing?.explanation ?? "");
  const [saving, setSaving] = useState(false);

  // ✅ حالة رفع الصورة منفصلة وواضحة
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const [options, setOptions] = useState<DraftOption[]>(
    existing?.options?.length
      ? existing.options.map((o) => ({ option_text: o.option_text, is_correct: o.is_correct }))
      : type === "true_false"
      ? [
          { option_text: "صح", is_correct: false },
          { option_text: "خطأ", is_correct: false },
        ]
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
      setOptions([
        { option_text: "صح", is_correct: false },
        { option_text: "خطأ", is_correct: false },
      ]);
    } else if (t === "mcq") {
      setOptions([
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ]);
    }
  }

  // ✅ إضافة خيار جديد
  function addOption() {
    if (options.length >= 6) return; // حد أقصى 6 خيارات
    setOptions([...options, { option_text: "", is_correct: false }]);
  }

  // ✅ حذف خيار
  function removeOption(idx: number) {
    if (options.length <= 2) return; // حد أدنى خيارين
    const updated = options.filter((_, i) => i !== idx);
    // إذا كان الخيار المحذوف هو الصحيح، نعيد تعيين الأول كصحيح
    if (options[idx].is_correct && updated.length > 0) {
      updated[0].is_correct = true;
    }
    setOptions(updated);
  }

  // توليد UUID بديل لا يعتمد على crypto.randomUUID
  function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // ✅ رفع الصورة مع معالجة صحيحة للحالات
  async function uploadImage(file: File) {
    setUploadState("uploading");
    setUploadErr(null);

    try {
      const ext = file.name.split(".").pop();
      const path = `questions/draft/${generateUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("course-assets")
        .upload(path, file);

      if (error) throw error;

      const { data } = supabase.storage.from("course-assets").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadState("error");
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!text.trim()) {
      setErr("نص السؤال مطلوب");
      return;
    }

    // ✅ السؤال الاختياري: يكفي أن يكون هناك خيار واحد صحيح على الأقل
    // ولا نشترط أن تكون جميع الخانات ممتلئة
    if (type !== "short_text") {
      const filledOptions = options.filter((o) => o.option_text.trim());
      if (filledOptions.length < 2) {
        setErr("يجب إدخال خيارين على الأقل");
        return;
      }
      if (!options.some((o) => o.is_correct && o.option_text.trim())) {
        setErr("يجب تحديد إجابة صحيحة واحدة على الأقل");
        return;
      }
    }

    if (type === "short_text" && !correctText.trim()) {
      setErr("يجب إدخال الإجابة الصحيحة");
      return;
    }

    // ✅ منع الحفظ أثناء رفع الصورة
    if (uploadState === "uploading") {
      setErr("الرجاء انتظار اكتمال رفع الصورة");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        question_text: text.trim(),
        question_type: type,
        image_url: imageUrl || null,
        points,
        correct_text: type === "short_text" ? correctText.trim() : null,
        explanation: explanation.trim(),
        // ✅ نحفظ فقط الخيارات المملوءة
        options:
          type === "short_text"
            ? []
            : options.filter((o) => o.option_text.trim()),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-card border border-border/60 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-elevated my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {existing ? "تعديل السؤال" : "سؤال جديد"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="size-8 grid place-items-center rounded-lg hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* نوع السؤال */}
        <div>
          <label className="block text-sm font-medium mb-1.5">نوع السؤال</label>
          <div className="flex gap-2 flex-wrap">
            {(["mcq", "true_false", "short_text"] as QuestionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeType(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                  type === t
                    ? "bg-gradient-primary text-primary-foreground"
                    : "glass hover:bg-white/10"
                }`}
              >
                {labelForType(t)}
              </button>
            ))}
          </div>
        </div>

        {/* نص السؤال */}
        <div>
          <label className="block text-sm font-medium mb-1.5">نص السؤال *</label>
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* ✅ رفع الصورة مع حالات واضحة */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            صورة السؤال <span className="text-muted-foreground text-xs">(للمعادلات الرياضية أو الرسوم)</span>
          </label>

          {imageUrl && uploadState === "done" ? (
            <div className="flex items-center gap-3">
              <img src={imageUrl} className="h-24 rounded-lg border border-border/60 object-contain" alt="صورة السؤال" />
              <button
                type="button"
                onClick={() => { setImageUrl(""); setUploadState("idle"); }}
                className="text-xs text-destructive hover:underline"
              >
                إزالة الصورة
              </button>
            </div>
          ) : uploadState === "uploading" ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60 bg-input text-sm text-muted-foreground w-fit">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>جارٍ رفع الصورة...</span>
            </div>
          ) : (
            <label className="px-4 py-2.5 rounded-lg border border-dashed border-border/60 bg-input cursor-pointer text-sm inline-flex items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <ImageIcon className="size-4 text-muted-foreground" />
              <span>رفع صورة</span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
            </label>
          )}

          {uploadState === "error" && (
            <p className="text-xs text-destructive mt-1">{uploadErr ?? "فشل رفع الصورة، حاول مرة أخرى"}</p>
          )}
        </div>

        {/* النقاط */}
        <div>
          <label className="block text-sm font-medium mb-1.5">النقاط</label>
          <input
            type="number"
            min={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-24 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* الإجابة القصيرة */}
        {type === "short_text" ? (
          <div>
            <label className="block text-sm font-medium mb-1.5">الإجابة الصحيحة</label>
            <input
              value={correctText}
              onChange={(e) => setCorrectText(e.target.value)}
              className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        ) : (
          /* ✅ الخيارات مع إضافة/حذف */
          <div>
            <label className="block text-sm font-medium mb-2">
              الخيارات <span className="text-muted-foreground text-xs">(حدد الإجابة الصحيحة)</span>
            </label>

            <div className="space-y-2">
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* Radio لتحديد الإجابة الصحيحة */}
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={o.is_correct}
                    onChange={() => {
                      const n = options.map((opt, idx) => ({
                        ...opt,
                        is_correct: idx === i,
                      }));
                      setOptions(n);
                    }}
                    className="accent-primary cursor-pointer"
                  />

                  {/* حرف الخيار */}
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                    {String.fromCharCode(65 + i)}
                  </span>

                  <input
                    value={o.option_text}
                    onChange={(e) => {
                      const n = [...options];
                      n[i] = { ...n[i], option_text: e.target.value };
                      setOptions(n);
                    }}
                    placeholder={`الخيار ${String.fromCharCode(65 + i)}`}
                    readOnly={type === "true_false"}
                    className="flex-1 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 read-only:opacity-70"
                  />

                  {/* ✅ زر حذف الخيار (فقط للـ MCQ وعندما يكون أكثر من خيارين) */}
                  {type === "mcq" && options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-destructive/70 hover:text-destructive transition-colors"
                      title="حذف الخيار"
                    >
                      <MinusCircle className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {type === "mcq" && (
              <div className="flex justify-start mt-2">
                <button
                  type="button"
                  onClick={addOption}
                  disabled={options.length >= 6}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-primary/30"
                >
                  <PlusCircle className="size-3.5" />
                  إضافة خيار
                </button>
              </div>
            )}

            {type === "mcq" && (
              <p className="text-[11px] text-muted-foreground mt-2">
                انقر على الدائرة بجانب الخيار لتحديده كإجابة صحيحة • يمكن إضافة حتى 6 خيارات
              </p>
            )}
          </div>
        )}

        {/* شرح الإجابة */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            شرح الإجابة <span className="text-muted-foreground text-xs">(اختياري)</span>
          </label>
          <textarea
            rows={2}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {err && <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{err}</div>}

        <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg glass text-sm"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={saving || uploadState === "uploading"}
            className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold disabled:opacity-60 inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            {saving ? "جارٍ الحفظ..." : "حفظ السؤال"}
          </button>
        </div>
      </form>
    </div>
  );
}

