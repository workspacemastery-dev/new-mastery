import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { B as BrainCircuit } from "./brain-circuit-DWCc308q.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { S as Sparkles } from "./sparkles-vouD53p5.js";
import { X } from "./x-yy412flO.js";
import { I as Image } from "./image-DntQ77e3.js";
import { C as CircleMinus, a as CirclePlus } from "./circle-plus-B654U3bs.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
function QuestionBankPage() {
  const {
    user,
    role
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [subject, setSubject] = reactExports.useState("");
  const [topic, setTopic] = reactExports.useState("");
  const [items, setItems] = reactExports.useState([]);
  const [generating, setGenerating] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const {
        data
      } = await supabase.from("academies").select("id, subject").eq("teacher_id", user.id).maybeSingle();
      if (data) {
        setAcademyId(data.id);
        setSubject(data.subject);
        await load(data.id);
      }
    })();
  }, [user, role]);
  async function load(aId) {
    const {
      data
    } = await supabase.from("questions").select("id, question_text, type, options, correct_answer, created_at").eq("academy_id", aId).order("created_at", {
      ascending: false
    });
    setItems(data ?? []);
  }
  async function generateOne() {
    if (!academyId) return;
    setErr(null);
    setGenerating(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("generate-question", {
        body: {
          subject,
          topic: topic.trim() || subject,
          existing_count: items.length
        }
      });
      if (error) throw error;
      const q = data;
      const {
        error: insErr
      } = await supabase.from("questions").insert({
        academy_id: academyId,
        type: "mcq",
        question_text: q.question_text,
        options: q.options.map((t) => ({
          text: t
        })),
        correct_answer: q.correct_answer
      });
      if (insErr) throw insErr;
      await load(academyId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "فشل التوليد");
    } finally {
      setGenerating(false);
    }
  }
  async function remove(id) {
    if (!academyId) return;
    if (!confirm("حذف السؤال؟")) return;
    await supabase.from("questions").delete().eq("id", id);
    await load(academyId);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "بنك الأسئلة", description: "ولّد أسئلة بالذكاء الاصطناعي حسب وحدة من مادة الأكاديمية" }),
    !academyId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "يجب تعيينك لأكاديمية أولاً." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrainCircuit, { className: "size-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold", children: "توليد سؤال بالذكاء الاصطناعي" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-4", children: [
          "المادة: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: subject })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: topic, onChange: (e) => setTopic(e.target.value), placeholder: "اختر وحدة أو موضوع (مثال: المعادلات الخطية)", className: "flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
              idx: "new"
            }), className: "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              "إضافة سؤال يدوياً"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: generateOne, disabled: generating, className: "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold disabled:opacity-60 shadow-glow-primary whitespace-nowrap", children: [
              generating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
              generating ? "جارٍ التوليد..." : "توليد سؤال بالذكاء الاصطناعي"
            ] })
          ] })
        ] }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-destructive", children: err }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[11px] text-muted-foreground", children: "كل ضغطة تضيف سؤال جديد إلى البنك." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-10 text-center text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-10 mx-auto mb-2 opacity-40" }),
        "البنك فارغ. ابدأ بتوليد أول سؤال أو أضف سؤالاً يدوياً."
      ] }) : items.map((q, i) => {
        const opts = Array.isArray(q.options) ? q.options : [];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-7 shrink-0 rounded-lg bg-primary/20 text-primary text-xs font-bold grid place-items-center", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm mb-2", children: q.question_text }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid sm:grid-cols-2 gap-1.5", children: opts.map((o, oi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `text-xs px-2 py-1.5 rounded border ${oi === q.correct_answer ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border/60"}`, children: [
              String.fromCharCode(65 + oi),
              ". ",
              typeof o === "string" ? o : o.option_text ?? o.text
            ] }, oi)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(q.id), className: "size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] }) }, q.id);
      }) })
    ] }),
    editing?.idx !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionDraftModal, { existing: editing.idx === "new" ? void 0 : items[editing.idx], onClose: () => setEditing(null), onSave: async (q) => {
      if (!academyId) return;
      await supabase.from("questions").insert({
        academy_id: academyId,
        type: q.question_type,
        question_text: q.question_text,
        question_image: q.image_url,
        options: q.options.map((o) => ({
          option_text: o.option_text,
          is_correct: o.is_correct
        })),
        correct_answer: q.question_type === "short_text" ? q.correct_text : q.options.findIndex((o) => o.is_correct)
      });
      await load(academyId);
      setEditing(null);
    } })
  ] });
}
function labelForType(t) {
  return t === "mcq" ? "اختياري" : t === "true_false" ? "صح / خطأ" : "مقالي";
}
function QuestionDraftModal({
  existing,
  onClose,
  onSave
}) {
  const [text, setText] = reactExports.useState(existing?.question_text ?? "");
  const [type, setType] = reactExports.useState(existing?.question_type ?? "mcq");
  const [points, setPoints] = reactExports.useState(existing?.points ?? 1);
  const [imageUrl, setImageUrl] = reactExports.useState(existing?.image_url ?? "");
  const [correctText, setCorrectText] = reactExports.useState(existing?.correct_text ?? "");
  const [explanation, setExplanation] = reactExports.useState(existing?.explanation ?? "");
  const [saving, setSaving] = reactExports.useState(false);
  const [uploadState, setUploadState] = reactExports.useState("idle");
  const [uploadErr, setUploadErr] = reactExports.useState(null);
  const [options, setOptions] = reactExports.useState(existing?.options?.length ? existing.options.map((o) => ({
    option_text: o.option_text,
    is_correct: o.is_correct
  })) : type === "true_false" ? [{
    option_text: "صح",
    is_correct: false
  }, {
    option_text: "خطأ",
    is_correct: false
  }] : [{
    option_text: "",
    is_correct: false
  }, {
    option_text: "",
    is_correct: false
  }, {
    option_text: "",
    is_correct: false
  }, {
    option_text: "",
    is_correct: false
  }]);
  const [err, setErr] = reactExports.useState(null);
  function changeType(t) {
    setType(t);
    if (t === "true_false") {
      setOptions([{
        option_text: "صح",
        is_correct: false
      }, {
        option_text: "خطأ",
        is_correct: false
      }]);
    } else if (t === "mcq") {
      setOptions([{
        option_text: "",
        is_correct: false
      }, {
        option_text: "",
        is_correct: false
      }, {
        option_text: "",
        is_correct: false
      }, {
        option_text: "",
        is_correct: false
      }]);
    }
  }
  function addOption() {
    if (options.length >= 6) return;
    setOptions([...options, {
      option_text: "",
      is_correct: false
    }]);
  }
  function removeOption(idx) {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== idx);
    if (options[idx].is_correct && updated.length > 0) {
      updated[0].is_correct = true;
    }
    setOptions(updated);
  }
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  async function uploadImage(file) {
    setUploadState("uploading");
    setUploadErr(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `questions/draft/${generateUUID()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("course-assets").upload(path, file);
      if (error) throw error;
      const {
        data
      } = supabase.storage.from("course-assets").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadState("error");
    }
  }
  async function submit(e) {
    e.preventDefault();
    setErr(null);
    if (!text.trim()) {
      setErr("نص السؤال مطلوب");
      return;
    }
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
        options: type === "short_text" ? [] : options.filter((o) => o.option_text.trim())
      });
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onClick: (e) => e.stopPropagation(), onSubmit: submit, className: "bg-card border border-border/60 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-elevated my-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: existing ? "تعديل السؤال" : "سؤال جديد" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "size-8 grid place-items-center rounded-lg hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "نوع السؤال" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["mcq", "true_false", "short_text"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => changeType(t), className: `px-3 py-2 rounded-lg text-xs font-medium transition ${type === t ? "bg-gradient-primary text-primary-foreground" : "glass hover:bg-white/10"}`, children: labelForType(t) }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "نص السؤال *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: text, onChange: (e) => setText(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5", children: [
        "صورة السؤال ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(للمعادلات الرياضية أو الرسوم)" })
      ] }),
      imageUrl && uploadState === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, className: "h-24 rounded-lg border border-border/60 object-contain", alt: "صورة السؤال" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setImageUrl("");
          setUploadState("idle");
        }, className: "text-xs text-destructive hover:underline", children: "إزالة الصورة" })
      ] }) : uploadState === "uploading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60 bg-input text-sm text-muted-foreground w-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "جارٍ رفع الصورة..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "px-4 py-2.5 rounded-lg border border-dashed border-border/60 bg-input cursor-pointer text-sm inline-flex items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "رفع صورة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", hidden: true, accept: "image/*", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
        } })
      ] }),
      uploadState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: uploadErr ?? "فشل رفع الصورة، حاول مرة أخرى" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "النقاط" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: points, onChange: (e) => setPoints(Number(e.target.value)), className: "w-24 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm" })
    ] }),
    type === "short_text" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "الإجابة الصحيحة" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: correctText, onChange: (e) => setCorrectText(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm" })
    ] }) : (
      /* ✅ الخيارات مع إضافة/حذف */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-2", children: [
          "الخيارات ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(حدد الإجابة الصحيحة)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: options.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "correct_answer", checked: o.is_correct, onChange: () => {
            const n = options.map((opt, idx) => ({
              ...opt,
              is_correct: idx === i
            }));
            setOptions(n);
          }, className: "accent-primary cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground w-5 text-center", children: String.fromCharCode(65 + i) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: o.option_text, onChange: (e) => {
            const n = [...options];
            n[i] = {
              ...n[i],
              option_text: e.target.value
            };
            setOptions(n);
          }, placeholder: `الخيار ${String.fromCharCode(65 + i)}`, readOnly: type === "true_false", className: "flex-1 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 read-only:opacity-70" }),
          type === "mcq" && options.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeOption(i), className: "text-destructive/70 hover:text-destructive transition-colors", title: "حذف الخيار", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "size-4" }) })
        ] }, i)) }),
        type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addOption, disabled: options.length >= 6, className: "inline-flex items-center gap-1.5 text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-primary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "size-3.5" }),
          "إضافة خيار"
        ] }) }),
        type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-2", children: "انقر على الدائرة بجانب الخيار لتحديده كإجابة صحيحة • يمكن إضافة حتى 6 خيارات" })
      ] })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5", children: [
        "شرح الإجابة ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(اختياري)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: explanation, onChange: (e) => setExplanation(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm" })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg glass text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving || uploadState === "uploading", className: "px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold disabled:opacity-60 inline-flex items-center gap-2", children: [
        saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
        saving ? "جارٍ الحفظ..." : "حفظ السؤال"
      ] })
    ] })
  ] }) });
}
export {
  QuestionBankPage as component
};
