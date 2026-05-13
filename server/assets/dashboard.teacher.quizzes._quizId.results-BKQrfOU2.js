import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { k as Route, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { U as User } from "./user-Do_-wygY.js";
import { T as Trophy } from "./trophy-YWyvm5ya.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function QuizResultsPage() {
  const {
    user,
    role,
    loading
  } = useAuth();
  const {
    quizId
  } = Route.useParams();
  const [quizTitle, setQuizTitle] = reactExports.useState("");
  const [passing, setPassing] = reactExports.useState(50);
  const [rows, setRows] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (user) void load();
  }, [user, quizId]);
  async function load() {
    const {
      data: q
    } = await supabase.from("quizzes").select("title, passing_score").eq("id", quizId).maybeSingle();
    setQuizTitle(q?.title ?? "");
    setPassing(q?.passing_score ?? 50);
    const {
      data: attempts
    } = await supabase.from("quiz_attempts").select("id, user_id, student_id, score, total_points, submitted_at, status").eq("quiz_id", quizId).order("submitted_at", {
      ascending: false
    });
    if (!attempts?.length) {
      setRows([]);
      return;
    }
    const userIds = [...new Set(attempts.map((a) => a.user_id).filter((x) => !!x))];
    const studentIds = [...new Set(attempts.map((a) => a.student_id).filter((x) => !!x))];
    const profilesP = userIds.length ? supabase.from("profiles").select("user_id, full_name, student_id").in("user_id", userIds) : Promise.resolve({
      data: []
    });
    const studentsP = studentIds.length ? supabase.from("students").select("id, full_name, student_code").in("id", studentIds) : Promise.resolve({
      data: []
    });
    const [{
      data: profiles
    }, {
      data: students
    }] = await Promise.all([profilesP, studentsP]);
    const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
    const studentMap = new Map((students ?? []).map((s) => [s.id, s]));
    setRows(attempts.map((a) => {
      const p = a.user_id ? profileMap.get(a.user_id) : void 0;
      const s = a.student_id ? studentMap.get(a.student_id) : void 0;
      return {
        ...a,
        full_name: s?.full_name ?? p?.full_name,
        display_code: s?.student_code ?? p?.student_id ?? void 0
      };
    }));
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (role !== "teacher") return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `نتائج: ${quizTitle}`, description: "جميع محاولات الطلاب" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/teacher/quizzes", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
      " كل الاختبارات"
    ] }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center text-muted-foreground", children: "لم يقم أي طالب بحل هذا الاختبار بعد." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-4", children: "الطالب" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-4", children: "رقم الطالب" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-4", children: "النتيجة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-4", children: "النسبة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-4", children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-4", children: "تاريخ التسليم" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: rows.map((r) => {
        const pct = r.total_points > 0 ? Math.round(r.score / r.total_points * 100) : 0;
        const passed = pct >= passing;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-primary/20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3.5 text-primary" }) }),
            r.full_name || "—"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-muted-foreground", children: r.display_code ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4 font-medium", children: [
            r.score,
            " / ",
            r.total_points
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold ${passed ? "text-chemistry" : "text-destructive"}`, children: [
            pct,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: r.status === "submitted" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${passed ? "bg-chemistry/20 text-chemistry" : "bg-destructive/20 text-destructive"}`, children: [
            passed && /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-3" }),
            passed ? "ناجح" : "راسب"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "قيد الحل" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-muted-foreground text-xs", children: r.submitted_at ? new Date(r.submitted_at).toLocaleString("ar-EG") : "—" })
        ] }, r.id);
      }) })
    ] }) })
  ] });
}
export {
  QuizResultsPage as component
};
