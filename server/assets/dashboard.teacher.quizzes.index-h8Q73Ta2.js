import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { s as supabase, L as Link } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { U as Users } from "./users-BIEQI_yv.js";
import { E as EyeOff, a as Eye } from "./eye-DXgyZ82R.js";
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
function TeacherQuizzesPage() {
  const {
    user,
    role
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [quizzes, setQuizzes] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    (async () => {
      const {
        data: aca
      } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (!aca) return;
      setAcademyId(aca.id);
      await loadQuizzes(aca.id);
    })();
  }, [user, role]);
  async function loadQuizzes(aId) {
    const {
      data
    } = await supabase.from("quizzes").select("id, title, description, duration_minutes, passing_score, is_published").eq("academy_id", aId).order("created_at", {
      ascending: false
    });
    const list = data ?? [];
    const ids = list.map((q) => q.id);
    if (ids.length) {
      const {
        data: attempts
      } = await supabase.from("quiz_attempts").select("quiz_id").in("quiz_id", ids).eq("status", "submitted");
      const counts = {};
      (attempts ?? []).forEach((a) => {
        counts[a.quiz_id] = (counts[a.quiz_id] ?? 0) + 1;
      });
      setQuizzes(list.map((q) => ({
        ...q,
        attempt_count: counts[q.id] ?? 0
      })));
    } else setQuizzes([]);
  }
  async function togglePublish(q) {
    if (!academyId) return;
    await supabase.from("quizzes").update({
      is_published: !q.is_published
    }).eq("id", q.id);
    await loadQuizzes(academyId);
  }
  async function deleteQuiz(id) {
    if (!academyId) return;
    if (!confirm("حذف هذا الاختبار وجميع أسئلته؟")) return;
    await supabase.from("quizzes").delete().eq("id", id);
    await loadQuizzes(academyId);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "إدارة الاختبارات", description: "أنشئ اختبارات وتابع نتائج الطلاب", actions: academyId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/teacher/quizzes/new", className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm shadow-glow-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      " اختبار جديد"
    ] }) : void 0 }),
    !academyId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "يجب تعيينك لأكاديمية أولاً." }) }) : quizzes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-12 text-muted-foreground mx-auto mb-3 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "لا اختبارات بعد. ابدأ بإنشاء أول اختبار." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-5", children: quizzes.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-gradient-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-1 rounded-full ${q.is_published ? "bg-chemistry/20 text-chemistry" : "bg-muted text-muted-foreground"}`, children: q.is_published ? "منشور" : "مسودة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: q.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-3", children: q.description || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "⏱ ",
          q.duration_minutes,
          " د"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "✓ ",
          q.passing_score,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3" }),
          " ",
          q.attempt_count ?? 0
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/teacher/quizzes/$quizId", params: {
          quizId: q.id
        }, className: "flex-1 text-center text-sm py-2 rounded-lg glass hover:bg-white/10 transition", children: "الأسئلة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/teacher/quizzes/$quizId/results", params: {
          quizId: q.id
        }, className: "flex-1 text-center text-sm py-2 rounded-lg glass hover:bg-white/10 transition", children: "النتائج" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => togglePublish(q), className: "size-9 grid place-items-center rounded-lg glass hover:bg-white/10 transition", children: q.is_published ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteQuiz(q.id), className: "size-9 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
      ] })
    ] }, q.id)) })
  ] });
}
export {
  TeacherQuizzesPage as component
};
