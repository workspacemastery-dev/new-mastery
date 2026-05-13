import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { j as Route, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { D as DashboardShell } from "./DashboardShell-C8RF7EdW.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { C as CirclePlay } from "./circle-play-uSCpGRvi.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
function StudentAcademyPage() {
  const {
    user,
    role,
    loading
  } = useAuth();
  const {
    academyId
  } = Route.useParams();
  const [academyName, setAcademyName] = reactExports.useState("");
  const [courses, setCourses] = reactExports.useState([]);
  const [quizzes, setQuizzes] = reactExports.useState([]);
  const [attempts, setAttempts] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (user) void load();
  }, [user, academyId]);
  async function load() {
    const {
      data: a
    } = await supabase.from("academies").select("name").eq("id", academyId).maybeSingle();
    setAcademyName(a?.name ?? "");
    const {
      data: c
    } = await supabase.from("courses").select("id, title, description, cover_image_url").eq("academy_id", academyId).eq("is_published", true).order("sort_order", {
      ascending: true
    });
    setCourses(c ?? []);
    const {
      data: q
    } = await supabase.from("quizzes").select("id, title, description, duration_minutes, passing_score").eq("academy_id", academyId).eq("is_published", true).order("created_at", {
      ascending: false
    });
    setQuizzes(q ?? []);
    if (q?.length && user) {
      const {
        data: att
      } = await supabase.from("quiz_attempts").select("id, quiz_id, status, score, total_points").in("quiz_id", q.map((x) => x.id)).eq("user_id", user.id).order("submitted_at", {
        ascending: false
      });
      const map = {};
      (att ?? []).forEach((x) => {
        if (!map[x.quiz_id]) map[x.quiz_id] = x;
      });
      setAttempts(map);
    }
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (role !== "student") return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: academyName, roleLabel: "Student", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
      " لوحة الطالب"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-primary" }),
        " الكورسات"
      ] }),
      courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "لا توجد كورسات منشورة بعد." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: courses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/courses/$courseId", params: {
        courseId: c.id
      }, className: "bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] transition group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-gradient-primary grid place-items-center mb-3 group-hover:shadow-glow-primary transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: c.description })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-accent" }),
        " الاختبارات"
      ] }),
      quizzes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "لا توجد اختبارات منشورة بعد." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-5", children: quizzes.map((q) => {
        const att = attempts[q.id];
        const submitted = att?.status === "submitted";
        const pct = submitted && att.total_points > 0 ? Math.round(att.score / att.total_points * 100) : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-accent/20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-accent" }) }),
            submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs px-2 py-1 rounded-full ${pct >= q.passing_score ? "bg-chemistry/20 text-chemistry" : "bg-destructive/20 text-destructive"}`, children: [
              pct,
              "% — ",
              pct >= q.passing_score ? "ناجح" : "راسب"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: q.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-3", children: q.description || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "⏱ ",
              q.duration_minutes,
              " دقيقة"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "✓ نجاح ",
              q.passing_score,
              "%"
            ] })
          ] }),
          submitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/student/results/$attemptId", params: {
            attemptId: att.id
          }, className: "block text-center w-full py-2 rounded-lg glass hover:bg-white/10 transition text-sm", children: "مراجعة الإجابات" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/quiz/$quizId", params: {
            quizId: q.id
          }, className: "inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-4" }),
            att?.status === "in_progress" ? "متابعة الحل" : "بدء الاختبار"
          ] })
        ] }, q.id);
      }) })
    ] })
  ] });
}
export {
  StudentAcademyPage as component
};
