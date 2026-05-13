import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { h as Route, u as useNavigate, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { C as Clock } from "./clock-cIc-Fwqh.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { S as Send } from "./send-CcIDUjiL.js";
import { S as Save } from "./save-DaTgwH4R.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { C as ChevronRight, a as ChevronLeft } from "./chevron-right-CCkD_CJy.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
const __iconNode$1 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const QUESTIONS_PER_PAGE = 3;
function TakeQuizPage() {
  const {
    session,
    loading
  } = useStudentAuth();
  const {
    quizId
  } = Route.useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = reactExports.useState(null);
  const [questions, setQuestions] = reactExports.useState([]);
  const [attempt, setAttempt] = reactExports.useState(null);
  const [answers, setAnswers] = reactExports.useState({});
  const [page, setPage] = reactExports.useState(0);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [confirming, setConfirming] = reactExports.useState(false);
  const [pageLoading, setPageLoading] = reactExports.useState(true);
  const [loadError, setLoadError] = reactExports.useState(null);
  const [now, setNow] = reactExports.useState(Date.now());
  const [savingMap, setSavingMap] = reactExports.useState({});
  const initialized = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!session || initialized.current) return;
    initialized.current = true;
    void start();
  }, [session]);
  reactExports.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, []);
  async function start() {
    if (!session) return;
    setPageLoading(true);
    setLoadError(null);
    try {
      const {
        data: quizPayload,
        error: e1
      } = await supabase.rpc("student_get_quiz", {
        _token: session.token,
        _quiz_id: quizId
      });
      if (e1) throw e1;
      const payload = quizPayload;
      setQuiz(payload.quiz);
      setQuestions(payload.questions ?? []);
      const {
        data: attemptPayload,
        error: e2
      } = await supabase.rpc("student_start_or_resume_attempt", {
        _token: session.token,
        _quiz_id: quizId
      });
      if (e2) throw e2;
      const ap = attemptPayload;
      setAttempt(ap.attempt);
      const map = {};
      ap.answers.forEach((a) => {
        map[a.question_id] = {
          optionId: a.selected_option_id,
          text: a.text_answer
        };
      });
      setAnswers(map);
    } catch (err) {
      console.error("[student-quiz] start failed", err);
      setLoadError(err?.message ?? "تعذّر فتح الاختبار");
    } finally {
      setPageLoading(false);
    }
  }
  const remainingSec = reactExports.useMemo(() => {
    if (!attempt || !quiz) return 0;
    const end = new Date(attempt.started_at).getTime() + quiz.duration_minutes * 6e4;
    return Math.max(0, Math.floor((end - now) / 1e3));
  }, [attempt, quiz, now]);
  reactExports.useEffect(() => {
    if (attempt && quiz && remainingSec === 0 && !submitting && attempt.status === "in_progress") {
      void submit();
    }
  }, [remainingSec]);
  async function saveAnswer(questionId, val) {
    if (!attempt || !session) return;
    setAnswers((a) => ({
      ...a,
      [questionId]: val
    }));
    setSavingMap((s) => ({
      ...s,
      [questionId]: true
    }));
    const {
      error
    } = await supabase.rpc("student_save_answer", {
      _token: session.token,
      _attempt_id: attempt.id,
      _question_id: questionId,
      _option_id: val.optionId ?? null,
      _text: val.text ?? null
    });
    setSavingMap((s) => ({
      ...s,
      [questionId]: false
    }));
    if (error) console.error("[student-quiz] save answer failed", error);
  }
  async function submit() {
    if (!attempt || !session || submitting) return;
    setSubmitting(true);
    const {
      data,
      error
    } = await supabase.rpc("student_submit_attempt", {
      _token: session.token,
      _attempt_id: attempt.id
    });
    setSubmitting(false);
    if (error) {
      console.error("[student-quiz] submit failed", error);
      return;
    }
    const result = data;
    void navigate({
      to: "/dashboard/student/results/$attemptId",
      params: {
        attemptId: result.attempt_id
      }
    });
  }
  if (loading || pageLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" });
  if (loadError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/40 rounded-2xl p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-10 text-destructive mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium mb-3", children: loadError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/student", className: "text-sm text-primary underline", children: "العودة للوحة الطالب" })
    ] }) });
  }
  if (!quiz) return null;
  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const pageQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).filter((k) => {
    const a = answers[k];
    return a.optionId && a.optionId.length > 0 || a.text && a.text.trim().length > 0;
  }).length;
  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const lowTime = remainingSec < 60;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: quiz.title, description: quiz.description || "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-2 z-10 bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${lowTime ? "bg-destructive/20 text-destructive animate-pulse" : "bg-primary/15 text-primary"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-5" }),
          mins.toString().padStart(2, "0"),
          ":",
          secs.toString().padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "تمت الإجابة على ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: answeredCount }),
          " من ",
          questions.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student", className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass hover:bg-white/40 text-sm", title: "العودة دون تسليم — سيتم استئناف الاختبار لاحقًا بنفس التوقيت والإجابات", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
          " العودة"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setConfirming(true), disabled: submitting, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
          " تسليم الاختبار"
        ] })
      ] })
    ] }),
    questions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center text-muted-foreground", children: "لا توجد أسئلة في هذا الاختبار." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: pageQuestions.map((q, idx) => {
        const globalIdx = page * QUESTIONS_PER_PAGE + idx;
        const ans = answers[q.id] ?? {};
        const saving = savingMap[q.id];
        const isAnswered = ans.optionId && ans.optionId.length > 0 || ans.text && ans.text.trim().length > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 shadow-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-10 shrink-0 rounded-xl text-sm font-bold grid place-items-center ${isAnswered ? "bg-chemistry/20 text-chemistry" : "bg-primary/15 text-primary"}`, children: globalIdx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium leading-relaxed", children: q.question_text }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  q.points,
                  " نقطة"
                ] }),
                saving && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-3 animate-pulse" }),
                  " يتم الحفظ..."
                ] }),
                !saving && isAnswered && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-chemistry", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
                  " تم الحفظ"
                ] })
              ] })
            ] })
          ] }),
          q.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: q.image_url, alt: "", className: "max-h-80 rounded-xl mb-4 border border-border/60 mx-auto" }),
          q.question_type === "short_text" ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: ans.text ?? "", onChange: (e) => saveAnswer(q.id, {
            text: e.target.value
          }), placeholder: "اكتب إجابتك هنا...", className: "w-full bg-input border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: q.options.map((o) => {
            const selected = ans.optionId === o.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center gap-3 px-4 py-3 rounded-xl border transition cursor-pointer ${selected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border/40 hover:bg-white/5"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: `q-${q.id}`, checked: selected, onChange: () => saveAnswer(q.id, {
                optionId: o.id
              }), className: "accent-primary size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-1", children: o.option_text }),
              selected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-primary" })
            ] }, o.id);
          }) })
        ] }, q.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-card-premium border border-border/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPage((p) => Math.max(0, p - 1)), disabled: page === 0, className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg glass hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }),
          " السابق"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5 justify-center", children: Array.from({
          length: totalPages
        }, (_, i) => {
          const start2 = i * QUESTIONS_PER_PAGE;
          const slice = questions.slice(start2, start2 + QUESTIONS_PER_PAGE);
          const allAnswered = slice.every((q) => {
            const a = answers[q.id];
            return a && (a.optionId && a.optionId.length > 0 || a.text && a.text.trim().length > 0);
          });
          const partiallyAnswered = !allAnswered && slice.some((q) => {
            const a = answers[q.id];
            return a && (a.optionId && a.optionId.length > 0 || a.text && a.text.trim().length > 0);
          });
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage(i), className: `size-9 rounded-lg text-xs font-bold transition ${i === page ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : allAnswered ? "bg-chemistry/20 text-chemistry hover:bg-chemistry/30" : partiallyAnswered ? "bg-gold/20 text-gold hover:bg-gold/30" : "glass hover:bg-white/10"}`, title: `الصفحة ${i + 1}`, children: i + 1 }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)), disabled: page === totalPages - 1, className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg glass hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-sm", children: [
          "التالي ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-3 rounded bg-chemistry/40" }),
          " صفحة مكتملة"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-3 rounded bg-gold/40" }),
          " غير مكتملة"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "size-3" }),
          " لم تبدأ"
        ] })
      ] })
    ] }),
    confirming && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4", onClick: () => setConfirming(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "bg-card border border-border/60 rounded-2xl p-6 max-w-md w-full text-center shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-12 text-gold mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-2", children: "تأكيد التسليم" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "هل أنت متأكد من تسليم الاختبار؟ لن تتمكن من تعديل إجاباتك بعد ذلك." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-5", children: [
        "تمت الإجابة على ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: answeredCount }),
        " من ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: questions.length }),
        " سؤال",
        answeredCount < questions.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 text-gold", children: [
          "⚠ يوجد ",
          questions.length - answeredCount,
          " سؤال بدون إجابة"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirming(false), className: "flex-1 px-4 py-2.5 rounded-lg glass", children: "إلغاء" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setConfirming(false);
          void submit();
        }, disabled: submitting, className: "flex-1 px-4 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-medium disabled:opacity-50", children: submitting ? "جاري التسليم..." : "تسليم نهائي" })
      ] })
    ] }) })
  ] });
}
export {
  TakeQuizPage as component
};
