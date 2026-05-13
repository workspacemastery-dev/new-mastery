import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { l as Route, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { C as CircleX } from "./circle-x-DSbvlbuL.js";
import { L as Lightbulb } from "./lightbulb-n6DgNiTS.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
const styles = {
  correct: {
    border: "border-chemistry/40",
    badge: "bg-chemistry/20 text-chemistry",
    text: "text-chemistry",
    label: "✓ صحيحة"
  },
  wrong: {
    border: "border-destructive/40",
    badge: "bg-destructive/20 text-destructive",
    text: "text-destructive",
    label: "✗ خاطئة"
  },
  blank: {
    border: "border-gold/40",
    badge: "bg-gold/20 text-gold",
    text: "text-gold",
    label: "⊘ لم تجب"
  }
};
function hasAnswer(q) {
  return !!(q.my_option_id || q.my_text && q.my_text.trim().length > 0);
}
function ReviewPage() {
  const {
    session,
    loading
  } = useStudentAuth();
  const {
    attemptId
  } = Route.useParams();
  const [quiz, setQuiz] = reactExports.useState(null);
  const [items, setItems] = reactExports.useState([]);
  const [loadingData, setLoadingData] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    console.log("[ReviewPage] mounted", {
      attemptId,
      hasSession: !!session
    });
  }, [attemptId, session]);
  reactExports.useEffect(() => {
    if (!session) return;
    (async () => {
      setLoadingData(true);
      const {
        data,
        error: err
      } = await supabase.rpc("student_get_results", {
        _token: session.token,
        _attempt_id: attemptId
      });
      console.log("[ReviewPage] student_get_results", {
        attemptId,
        hasError: !!err,
        data
      });
      setLoadingData(false);
      if (err) {
        setError(err.message);
        return;
      }
      const payload = data;
      setQuiz(payload.quiz);
      setItems(payload.items ?? []);
    })();
  }, [session, attemptId]);
  if (loading || loadingData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/40 rounded-2xl p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-10 text-destructive mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium", children: error })
    ] }) });
  }
  if (!quiz) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `مراجعة: ${quiz.title}`, description: "عرض تفصيلي لكل سؤال وإجابتك" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/results/$attemptId", params: {
        attemptId
      }, className: "inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg glass hover:bg-white/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
        " صفحة النتيجة"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student", className: "inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg glass hover:bg-white/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-4" }),
        " صفحة الاختبارات"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: items.map((q, i) => {
      const blank = !hasAnswer(q);
      const status = q.is_correct ? "correct" : blank ? "blank" : "wrong";
      const s = styles[status];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card border rounded-2xl p-5 ${s.border}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-10 shrink-0 rounded-xl text-sm font-bold grid place-items-center ${s.badge}`, children: status === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5" }) : status === "wrong" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold mb-1", children: [
              i + 1,
              ". ",
              q.question_text
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold ${s.text}`, children: [
              q.points_earned,
              " / ",
              q.points,
              " نقطة · ",
              s.label
            ] })
          ] })
        ] }),
        q.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: q.image_url, alt: "", className: "max-h-64 rounded-xl mb-3 border border-border/60 mx-auto" }),
        q.question_type === "short_text" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-lg border ${q.is_correct ? "bg-chemistry/10 border-chemistry/30" : "bg-destructive/10 border-destructive/30"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: "إجابتك:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${q.is_correct ? "text-chemistry" : "text-destructive"}`, children: q.my_text || "— لم تجب —" })
          ] }),
          !q.is_correct && q.correct_text && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-chemistry/10 border border-chemistry/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-1", children: "الإجابة الصحيحة:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-chemistry font-medium", children: q.correct_text })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: q.options.map((o) => {
          const isMine = q.my_option_id === o.id;
          const isRight = o.is_correct;
          let cls = "bg-muted/40 text-muted-foreground border-border/30";
          let icon = null;
          if (isRight) {
            cls = "bg-chemistry/15 text-chemistry border-chemistry/40";
            icon = /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 shrink-0" });
          } else if (isMine) {
            cls = "bg-destructive/15 text-destructive border-destructive/40";
            icon = /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 shrink-0" });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `text-sm flex items-center gap-2 px-3 py-2.5 rounded-lg border ${cls}`, children: [
            icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: o.option_text }),
            isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-80 font-bold uppercase", children: "إجابتك" })
          ] }, o.id);
        }) }),
        q.explanation && q.explanation.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-4 rounded-xl bg-primary/8 border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "size-4 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary block mb-1", children: "شرح الإجابة" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: q.explanation })
          ] })
        ] }) })
      ] }, q.id);
    }) })
  ] });
}
export {
  ReviewPage as component
};
