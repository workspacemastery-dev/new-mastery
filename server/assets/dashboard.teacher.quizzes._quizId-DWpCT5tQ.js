import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { e as Route, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { X } from "./x-yy412flO.js";
import { I as Image } from "./image-DntQ77e3.js";
import { L as Lightbulb } from "./lightbulb-n6DgNiTS.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
function QuizAuthorPage() {
  const {
    user,
    role,
    loading
  } = useAuth();
  const {
    quizId
  } = Route.useParams();
  const [quiz, setQuiz] = reactExports.useState(null);
  const [questions, setQuestions] = reactExports.useState([]);
  const [editing, setEditing] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user) void load();
  }, [user, quizId]);
  async function load() {
    const {
      data: q
    } = await supabase.from("quizzes").select("id, title").eq("id", quizId).maybeSingle();
    setQuiz(q);
    const {
      data: qs
    } = await supabase.from("quiz_questions").select("id, question_text, question_type, image_url, points, sort_order, correct_text, explanation").eq("quiz_id", quizId).order("sort_order", {
      ascending: true
    });
    if (!qs) {
      setQuestions([]);
      return;
    }
    const ids = qs.map((x) => x.id);
    const {
      data: opts
    } = ids.length ? await supabase.from("question_options").select("id, question_id, option_text, is_correct, sort_order").in("question_id", ids).order("sort_order", {
      ascending: true
    }) : {
      data: []
    };
    setQuestions(qs.map((x) => ({
      ...x,
      options: (opts ?? []).filter((o) => o.question_id === x.id).map(({
        id,
        option_text,
        is_correct,
        sort_order
      }) => ({
        id,
        option_text,
        is_correct,
        sort_order
      }))
    })));
  }
  async function deleteQuestion(id) {
    if (!confirm("حذف هذا السؤال؟")) return;
    await supabase.from("quiz_questions").delete().eq("id", id);
    await load();
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (role !== "teacher") return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: quiz?.title ?? "أسئلة الاختبار", description: "إنشاء وتعديل أسئلة الاختبار" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/teacher/quizzes", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
        " كل الاختبارات"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " سؤال جديد"
      ] })
    ] }),
    questions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center text-muted-foreground", children: "لا أسئلة بعد. أضف أول سؤال." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-8 shrink-0 rounded-lg bg-primary/20 text-primary text-sm font-bold grid place-items-center", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-1", children: q.question_text }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: labelForType(q.question_type) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                q.points,
                " نقطة"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(q), className: "text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition", children: "تعديل" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteQuestion(q.id), className: "size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
        ] })
      ] }),
      q.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: q.image_url, alt: "", className: "max-h-48 rounded-lg mb-3 border border-border/60" }),
      q.question_type !== "short_text" && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 pr-11", children: q.options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `text-sm flex items-center gap-2 px-3 py-2 rounded-lg ${o.is_correct ? "bg-chemistry/10 text-chemistry" : "bg-white/5 text-muted-foreground"}`, children: [
        o.is_correct && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
        o.option_text
      ] }, o.id)) }),
      q.question_type === "short_text" && q.correct_text && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground pr-11", children: [
        "الإجابة الصحيحة: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-chemistry", children: q.correct_text })
      ] })
    ] }, q.id)) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionModal, { quizId, question: editing === "new" ? void 0 : editing, existingCount: questions.length, onClose: () => setEditing(null), onSaved: async () => {
      setEditing(null);
      await load();
    } })
  ] });
}
function labelForType(t) {
  return t === "mcq" ? "اختيار من متعدد" : t === "true_false" ? "صح / خطأ" : "إجابة نصية";
}
function QuestionModal({
  quizId,
  question,
  existingCount,
  onClose,
  onSaved
}) {
  const [text, setText] = reactExports.useState(question?.question_text ?? "");
  const [type, setType] = reactExports.useState(question?.question_type ?? "mcq");
  const [points, setPoints] = reactExports.useState(question?.points ?? 1);
  const [imageUrl, setImageUrl] = reactExports.useState(question?.image_url ?? "");
  const [correctText, setCorrectText] = reactExports.useState(question?.correct_text ?? "");
  const [explanation, setExplanation] = reactExports.useState(question?.explanation ?? "");
  const [options, setOptions] = reactExports.useState(question?.options.length ? question.options.map((o) => ({
    id: o.id,
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
  }]);
  const [uploading, setUploading] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
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
    } else if (t === "mcq" && options.length < 2) {
      setOptions([{
        option_text: "",
        is_correct: false
      }, {
        option_text: "",
        is_correct: false
      }]);
    }
  }
  async function uploadImage(file) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `questions/${quizId}/${crypto.randomUUID()}.${ext}`;
    const {
      error: upErr
    } = await supabase.storage.from("course-assets").upload(path, file);
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const {
      data: pub
    } = supabase.storage.from("course-assets").getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setUploading(false);
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (type !== "short_text") {
      const hasCorrect = options.some((o) => o.is_correct && o.option_text.trim());
      if (!hasCorrect) {
        setError("يجب تحديد إجابة صحيحة واحدة على الأقل");
        setSaving(false);
        return;
      }
    } else if (!correctText.trim()) {
      setError("يجب إدخال الإجابة الصحيحة");
      setSaving(false);
      return;
    }
    let questionId = question?.id;
    if (question) {
      const {
        error: err
      } = await supabase.from("quiz_questions").update({
        question_text: text,
        question_type: type,
        image_url: imageUrl || null,
        points,
        correct_text: type === "short_text" ? correctText.trim() : null,
        explanation: explanation.trim()
      }).eq("id", question.id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    } else {
      const {
        data: ins,
        error: err
      } = await supabase.from("quiz_questions").insert({
        quiz_id: quizId,
        question_text: text,
        question_type: type,
        image_url: imageUrl || null,
        points,
        sort_order: existingCount,
        correct_text: type === "short_text" ? correctText.trim() : null,
        explanation: explanation.trim()
      }).select("id").single();
      if (err || !ins) {
        setError(err?.message ?? "خطأ");
        setSaving(false);
        return;
      }
      questionId = ins.id;
    }
    if (type !== "short_text" && questionId) {
      await supabase.from("question_options").delete().eq("question_id", questionId);
      const validOptions = options.filter((o) => o.option_text.trim());
      if (validOptions.length) {
        await supabase.from("question_options").insert(validOptions.map((o, i) => ({
          question_id: questionId,
          option_text: o.option_text.trim(),
          is_correct: o.is_correct,
          sort_order: i
        })));
      }
    } else if (type === "short_text" && questionId) {
      await supabase.from("question_options").delete().eq("question_id", questionId);
    }
    setSaving(false);
    onSaved();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onClick: (e) => e.stopPropagation(), onSubmit: save, className: "bg-card border border-border/60 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-elevated my-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: question ? "تعديل السؤال" : "سؤال جديد" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "size-8 grid place-items-center rounded-lg hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "نوع السؤال" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["mcq", "true_false", "short_text"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => changeType(t), className: `px-3 py-2 rounded-lg text-xs font-medium transition ${type === t ? "bg-gradient-primary text-primary-foreground" : "glass hover:bg-white/10"}`, children: labelForType(t) }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "نص السؤال" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 2, value: text, onChange: (e) => setText(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "صورة السؤال (اختياري)" }),
      imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "", className: "h-20 rounded-lg border border-border/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setImageUrl(""), className: "text-xs text-destructive hover:underline", children: "إزالة" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition cursor-pointer text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-4" }),
        uploading ? "جاري الرفع..." : "رفع صورة",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) void uploadImage(f);
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "النقاط" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: points, onChange: (e) => setPoints(Number(e.target.value)), className: "w-24 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }),
    type === "short_text" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "الإجابة الصحيحة (تطابق نصي تام، غير حساس لحالة الأحرف)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: correctText, onChange: (e) => setCorrectText(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "الخيارات (حدد الصحيحة)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        options.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: o.is_correct, onChange: (e) => {
            const next = [...options];
            next[i] = {
              ...o,
              is_correct: e.target.checked
            };
            setOptions(next);
          }, className: "size-4 accent-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: o.option_text, onChange: (e) => {
            const next = [...options];
            next[i] = {
              ...o,
              option_text: e.target.value
            };
            setOptions(next);
          }, placeholder: `خيار ${i + 1}`, disabled: type === "true_false", className: "flex-1 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70" }),
          type === "mcq" && options.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOptions(options.filter((_, k) => k !== i)), className: "size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] }, i)),
        type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOptions([...options, {
          option_text: "",
          is_correct: false
        }]), className: "text-xs text-primary hover:underline inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
          " إضافة خيار"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "size-4 text-primary" }),
        " شرح الإجابة (اختياري — يظهر للطالب في صفحة المراجعة)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: explanation, onChange: (e) => setExplanation(e.target.value), placeholder: "مثال: الإجابة الصحيحة هي ٤ لأن ٢×٢=٤", className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg glass text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm disabled:opacity-50", children: saving ? "جاري الحفظ..." : "حفظ السؤال" })
    ] })
  ] }) });
}
export {
  QuizAuthorPage as component
};
