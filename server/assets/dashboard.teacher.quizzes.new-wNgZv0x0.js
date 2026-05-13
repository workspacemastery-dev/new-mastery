import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useNavigate, s as supabase, L as Link } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { F as FileText } from "./file-text-DbtC_hJa.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { C as Check } from "./check-VMC00cdB.js";
import { C as Calendar } from "./calendar-BmlfLAjy.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import { S as Save } from "./save-DaTgwH4R.js";
import { X } from "./x-yy412flO.js";
import { I as Image } from "./image-DntQ77e3.js";
import { C as CircleMinus, a as CirclePlus } from "./circle-plus-B654U3bs.js";
import { L as Lightbulb } from "./lightbulb-n6DgNiTS.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
const __iconNode = [
  ["path", { d: "M10 2v8l3-3 3 3V2", key: "sqw3rj" }],
  [
    "path",
    {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ]
];
const BookMarked = createLucideIcon("book-marked", __iconNode);
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function NewQuizWizard() {
  const {
    user,
    role,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [step, setStep] = reactExports.useState(1);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [endsAt, setEndsAt] = reactExports.useState("");
  const [duration, setDuration] = reactExports.useState(30);
  const [maxScore, setMaxScore] = reactExports.useState(100);
  const [passing, setPassing] = reactExports.useState(50);
  const [questions, setQuestions] = reactExports.useState([]);
  const [editing, setEditing] = reactExports.useState(null);
  const [bankOpen, setBankOpen] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const {
        data
      } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (data) setAcademyId(data.id);
    })();
  }, [user, role]);
  function nextStep() {
    setError(null);
    if (step === 1) {
      if (!title.trim()) {
        setError("اسم الاختبار مطلوب");
        return;
      }
      if (duration < 1) {
        setError("مدة الاختبار يجب أن تكون 1 دقيقة على الأقل");
        return;
      }
    }
    if (step === 2 && questions.length === 0) {
      setError("أضف سؤالاً واحداً على الأقل");
      return;
    }
    setStep(step + 1);
  }
  async function submitQuiz() {
    if (!academyId) return;
    setSubmitting(true);
    setError(null);
    const {
      data: quiz,
      error: qErr
    } = await supabase.from("quizzes").insert({
      academy_id: academyId,
      title: title.trim(),
      description: description.trim(),
      duration_minutes: duration,
      passing_score: passing,
      is_published: true
    }).select("id").single();
    if (qErr || !quiz) {
      setError(qErr?.message ?? "خطأ");
      setSubmitting(false);
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const {
        data: insQ,
        error: qqErr
      } = await supabase.from("quiz_questions").insert({
        quiz_id: quiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        image_url: q.image_url,
        points: q.points,
        sort_order: i,
        correct_text: q.question_type === "short_text" ? q.correct_text : null,
        explanation: q.explanation
      }).select("id").single();
      if (qqErr || !insQ) {
        setError(qqErr?.message ?? "خطأ في حفظ السؤال");
        setSubmitting(false);
        return;
      }
      if (q.question_type !== "short_text" && q.options.length) {
        await supabase.from("question_options").insert(q.options.map((o, oi) => ({
          question_id: insQ.id,
          option_text: o.option_text.trim(),
          is_correct: o.is_correct,
          sort_order: oi
        })));
      }
    }
    setSubmitting(false);
    navigate({
      to: "/dashboard/teacher/quizzes"
    });
  }
  if (authLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) });
  if (!academyId) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "لم يتم تعيينك لأكاديمية بعد." }) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "إنشاء اختبار جديد", description: "معالج 3 مراحل لإنشاء اختبار احترافي", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/teacher/quizzes", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
      " العودة للاختبارات"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-8 max-w-2xl mx-auto", children: [{
      n: 1,
      label: "المعلومات",
      icon: FileText
    }, {
      n: 2,
      label: "الأسئلة",
      icon: ClipboardList
    }, {
      n: 3,
      label: "المراجعة والتسليم",
      icon: Check
    }].map((s, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-12 rounded-full grid place-items-center font-bold transition ${step > s.n ? "bg-green-500 text-white" : step === s.n ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "bg-input text-muted-foreground"}`, children: step > s.n ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${step >= s.n ? "text-foreground" : "text-muted-foreground"}`, children: s.label })
      ] }),
      i < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 h-0.5 mx-2 -mt-6 ${step > s.n ? "bg-green-500" : "bg-border"}` })
    ] }, s.n)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 lg:p-8", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-5 text-primary" }),
          " معلومات الاختبار"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "اسم الاختبار *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "مثال: اختبار الفصل الأول", className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "وصف الاختبار" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: description, onChange: (e) => setDescription(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-2 inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }),
              " تاريخ الانتهاء (اختياري)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: endsAt, onChange: (e) => setEndsAt(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "مدة الاختبار (دقيقة)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: duration, onChange: (e) => setDuration(Number(e.target.value)), className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "الدرجة العظمى" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: maxScore, onChange: (e) => setMaxScore(Number(e.target.value)), className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "علامة النجاح (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, max: 100, value: passing, onChange: (e) => setPassing(Number(e.target.value)), className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-primary" }),
            " الأسئلة (",
            questions.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setBankOpen(true), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "size-4" }),
              " إدراج من بنك الأسئلة"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
              idx: "new"
            }), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " سؤال جديد"
            ] })
          ] })
        ] }),
        questions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl", children: 'لم تضف أي سؤال بعد. اضغط "سؤال جديد" أو "إدراج من بنك الأسئلة".' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-input/50 border border-border/60 rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-7 shrink-0 rounded-lg bg-primary/20 text-primary text-xs font-bold grid place-items-center", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm mb-1", children: q.question_text }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-3 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: labelForType(q.question_type) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  q.points,
                  " نقطة"
                ] }),
                q.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "📷 صورة" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
              idx: i
            }), className: "text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10", children: "تعديل" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuestions(questions.filter((_, k) => k !== i)), className: "size-7 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
          ] })
        ] }) }, i)) })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-5 text-primary" }),
          " مراجعة وتسليم"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-input/50 border border-border/60 rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "اسم الاختبار" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "عدد الأسئلة", value: questions.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "المدة", value: `${duration} د` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "الدرجة العظمى", value: maxScore }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "النجاح", value: `${passing}%` })
          ] }),
          endsAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "ينتهي في: ",
            new Date(endsAt).toLocaleString("ar-EG")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "inline size-4 text-primary me-1.5" }),
          "عند التسليم سيتم نشر الاختبار فوراً ويظهر للطلاب المسجلين في أكاديميتك."
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-8 pt-6 border-t border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStep(Math.max(1, step - 1)), disabled: step === 1, className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm disabled:opacity-40 disabled:cursor-not-allowed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
          " السابق"
        ] }),
        step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: nextStep, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium", children: [
          "التالي ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submitQuiz, disabled: submitting, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold disabled:opacity-60", children: [
          submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
          submitting ? "جاري التسليم..." : "تسليم ونشر الاختبار"
        ] })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionDraftModal, { existing: editing.idx === "new" ? void 0 : questions[editing.idx], onClose: () => setEditing(null), onSave: (q) => {
      if (editing.idx === "new") setQuestions([...questions, q]);
      else {
        const next = [...questions];
        next[editing.idx] = q;
        setQuestions(next);
      }
      setEditing(null);
    } }),
    bankOpen && academyId && /* @__PURE__ */ jsxRuntimeExports.jsx(BankModal, { academyId, onClose: () => setBankOpen(false), onImport: (items) => {
      setQuestions([...questions, ...items]);
      setBankOpen(false);
    } })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-input/50 border border-border/60 rounded-xl p-3 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: value })
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
  const [uploadState, setUploadState] = reactExports.useState("idle");
  const [uploadErr, setUploadErr] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [options, setOptions] = reactExports.useState(existing?.options && existing.options.length > 0 ? existing.options.map((o) => ({
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
    if (options[idx].is_correct && updated.length > 0) updated[0].is_correct = true;
    setOptions(updated);
  }
  async function uploadImage(file) {
    setUploadState("uploading");
    setUploadErr(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `questions/draft/${generateUUID()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("course-assets").upload(path, file);
      if (upErr) throw upErr;
      const {
        data: pub
      } = supabase.storage.from("course-assets").getPublicUrl(path);
      setImageUrl(pub.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadState("error");
    }
  }
  function submit(e) {
    e.preventDefault();
    setErr(null);
    if (!text.trim()) {
      setErr("نص السؤال مطلوب");
      return;
    }
    if (type !== "short_text") {
      const filled = options.filter((o) => o.option_text.trim());
      if (filled.length < 2) {
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
    onSave({
      question_text: text.trim(),
      question_type: type,
      image_url: imageUrl || null,
      points,
      correct_text: type === "short_text" ? correctText.trim() : null,
      explanation: explanation.trim(),
      options: type === "short_text" ? [] : options.filter((o) => o.option_text.trim())
    });
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 2, value: text, onChange: (e) => setText(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5", children: [
        "صورة السؤال ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(للمعادلات الرياضية أو الرسوم)" })
      ] }),
      imageUrl && uploadState === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "", className: "h-24 rounded-lg border border-border/60 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setImageUrl("");
          setUploadState("idle");
        }, className: "text-xs text-destructive hover:underline", children: "إزالة الصورة" })
      ] }) : uploadState === "uploading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60 bg-input text-sm text-muted-foreground w-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "جارٍ رفع الصورة..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border/60 bg-input cursor-pointer text-sm hover:border-primary/50 hover:bg-primary/5 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "رفع صورة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) void uploadImage(f);
        } })
      ] }),
      uploadState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: uploadErr ?? "فشل رفع الصورة، حاول مرة أخرى" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "النقاط" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: points, onChange: (e) => setPoints(Number(e.target.value)), className: "w-24 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }),
    type === "short_text" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "الإجابة الصحيحة (تطابق نصي)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: correctText, onChange: (e) => setCorrectText(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }) : (
      /* الخيارات */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-2", children: [
          "الخيارات ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(حدد الإجابة الصحيحة)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: options.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "correct_answer", checked: o.is_correct, onChange: () => setOptions(options.map((opt, idx) => ({
            ...opt,
            is_correct: idx === i
          }))), className: "accent-primary cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground w-5 text-center", children: String.fromCharCode(65 + i) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: o.option_text, onChange: (e) => {
            const n = [...options];
            n[i] = {
              ...o,
              option_text: e.target.value
            };
            setOptions(n);
          }, placeholder: `الخيار ${String.fromCharCode(65 + i)}`, readOnly: type === "true_false", className: "flex-1 bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 read-only:opacity-70" }),
          type === "mcq" && options.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeOption(i), className: "text-destructive/70 hover:text-destructive transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "size-4" }) })
        ] }, i)) }),
        type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addOption, disabled: options.length >= 6, className: "inline-flex items-center gap-1.5 text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-primary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "size-3.5" }),
          "إضافة خيار"
        ] }) })
      ] })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "size-4 text-primary" }),
        " شرح الإجابة",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(اختياري)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: explanation, onChange: (e) => setExplanation(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end pt-2 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving || uploadState === "uploading", className: "px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2", children: [
        saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
        saving ? "جارٍ الحفظ..." : "حفظ السؤال"
      ] })
    ] })
  ] }) });
}
function BankModal({
  academyId,
  onClose,
  onImport
}) {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    void (async () => {
      const {
        data
      } = await supabase.from("questions").select("id, type, question_text, question_image, options, correct_answer").eq("academy_id", academyId).order("created_at", {
        ascending: false
      });
      setItems(data ?? []);
      setLoading(false);
    })();
  }, [academyId]);
  function toggle(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }
  function importSelected() {
    const drafts = items.filter((it) => selected.has(it.id)).map((it) => {
      const rawOpts = Array.isArray(it.options) ? it.options : [];
      const opts = rawOpts.map((o, i) => {
        const text = typeof o === "string" ? o : o.option_text ?? o.text ?? "";
        const isCorrect = typeof o === "object" && o !== null && "is_correct" in o ? Boolean(o.is_correct) : i === it.correct_answer;
        return {
          option_text: String(text),
          is_correct: isCorrect
        };
      });
      const qType = it.type === "true_false" ? "true_false" : it.type === "short_text" || it.type === "essay" ? "short_text" : "mcq";
      return {
        question_text: it.question_text ?? "(بدون نص)",
        question_type: qType,
        image_url: it.question_image,
        points: 1,
        correct_text: null,
        explanation: "",
        options: qType === "short_text" ? [] : opts
      };
    });
    onImport(drafts);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "bg-card border border-border/60 rounded-2xl p-6 max-w-3xl w-full space-y-4 shadow-elevated my-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "size-5 text-primary" }),
        " بنك الأسئلة"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "size-8 grid place-items-center rounded-lg hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin text-primary" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl", children: "بنك الأسئلة فارغ. أضف أسئلة من قسم بنك الأسئلة أولاً." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "حدد الأسئلة المراد إدراجها (",
        selected.size,
        " محدد)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[50vh] overflow-y-auto space-y-2 pr-1", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${selected.has(it.id) ? "border-primary bg-primary/5" : "border-border/60 hover:bg-white/5"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selected.has(it.id), onChange: () => toggle(it.id), className: "mt-1 size-4 accent-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-1 line-clamp-2", children: it.question_text ?? "(بدون نص)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-input", children: it.type }),
            it.question_image && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "📷" })
          ] })
        ] })
      ] }, it.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end pt-3 border-t border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm", children: "إلغاء" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: importSelected, disabled: selected.size === 0, className: "px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-50", children: [
          "إدراج (",
          selected.size,
          ")"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  NewQuizWizard as component
};
