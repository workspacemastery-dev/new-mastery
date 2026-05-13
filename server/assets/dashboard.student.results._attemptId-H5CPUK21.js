import { M as useRouter, r as reactExports, T as jsxRuntimeExports, Z as Outlet } from "./worker-entry-cdzVwTsG.js";
import { g as Route, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { T as Trophy } from "./trophy-YWyvm5ya.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { C as CircleX } from "./circle-x-DSbvlbuL.js";
import { C as ChartColumn } from "./chart-column-lL-oaoZ_.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function useRouterState(opts) {
  const contextRouter = useRouter({ warn: opts?.router === void 0 });
  const router = opts?.router || contextRouter;
  {
    const state = router.stores.__store.get();
    return opts?.select ? opts.select(state) : state;
  }
}
function ResultsPage() {
  const {
    session,
    loading
  } = useStudentAuth();
  const {
    attemptId
  } = Route.useParams();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const [attempt, setAttempt] = reactExports.useState(null);
  const [quiz, setQuiz] = reactExports.useState(null);
  const [items, setItems] = reactExports.useState([]);
  const [loadingData, setLoadingData] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    console.log("[ResultsPage] mounted", {
      attemptId,
      hasSession: !!session
    });
  }, [attemptId, session]);
  if (pathname.endsWith("/review")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  reactExports.useEffect(() => {
    if (!session) return;
    void load();
  }, [session, attemptId]);
  async function load() {
    if (!session) return;
    setLoadingData(true);
    const {
      data,
      error: err
    } = await supabase.rpc("student_get_results", {
      _token: session.token,
      _attempt_id: attemptId
    });
    setLoadingData(false);
    if (err) {
      setError(err.message);
      return;
    }
    const payload = data;
    setAttempt(payload.attempt);
    setQuiz(payload.quiz);
    setItems(payload.items ?? []);
  }
  if (loading || loadingData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/40 rounded-2xl p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-10 text-destructive mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium mb-3", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/student", className: "text-sm text-primary underline", children: "العودة للوحة الطالب" })
    ] }) });
  }
  if (!attempt || !quiz) return null;
  const pct = attempt.total_points > 0 ? Math.round(attempt.score / attempt.total_points * 100) : 0;
  const passed = pct >= quiz.passing_score;
  const correctCount = items.filter((i) => i.is_correct).length;
  const wrongCount = items.filter((i) => !i.is_correct && (i.my_option_id || i.my_text && i.my_text.trim())).length;
  const blankCount = items.filter((i) => !i.my_option_id && !(i.my_text && i.my_text.trim())).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `نتيجة: ${quiz.title}`, description: quiz.description || "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative overflow-hidden rounded-3xl p-10 mb-6 text-center border ${passed ? "border-chemistry/40 bg-chemistry/5" : "border-destructive/40 bg-destructive/5"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: `size-16 mx-auto mb-3 ${passed ? "text-gold" : "text-muted-foreground"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-7xl font-extrabold mb-2 ${passed ? "text-chemistry" : "text-destructive"}`, children: [
        pct,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base text-muted-foreground", children: [
        attempt.score,
        " من ",
        attempt.total_points,
        " نقطة"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-block mt-4 text-sm font-semibold px-5 py-2 rounded-full ${passed ? "bg-chemistry/15 text-chemistry" : "bg-destructive/15 text-destructive"}`, children: passed ? "🎉 ناجح" : "للأسف، راسب — حاول مرة أخرى" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: CircleCheck, label: "إجابات صحيحة", value: correctCount, accent: "chemistry" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: CircleX, label: "إجابات خاطئة", value: wrongCount, accent: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: CircleAlert, label: "بدون إجابة", value: blankCount, accent: "gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: ChartColumn, label: "إجمالي الأسئلة", value: items.length, accent: "primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
      attemptId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/results/$attemptId/review", params: {
        attemptId
      }, className: "inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }),
        " مراجعة الاختبار"
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student", className: "inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass hover:bg-white/40 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-4" }),
        " العودة لصفحة الاختبارات"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student", className: "mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5" }),
      " لوحة الطالب"
    ] })
  ] });
}
function StatTile({
  icon: Icon,
  label,
  value,
  accent
}) {
  const cls = {
    chemistry: "bg-chemistry/10 text-chemistry border-chemistry/30",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    gold: "bg-gold/10 text-gold border-gold/30",
    primary: "bg-primary/10 text-primary border-primary/30"
  }[accent];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border p-4 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 mb-2 opacity-80" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-extrabold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80", children: label })
  ] });
}
export {
  ResultsPage as component
};
