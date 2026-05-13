import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { s as supabase, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function StudentQuizzesList() {
  const {
    session
  } = useStudentAuth();
  const [quizzes, setQuizzes] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!session) return;
    void (async () => {
      const {
        data
      } = await supabase.rpc("student_get_quizzes", {
        _token: session.token
      });
      setQuizzes(data ?? []);
    })();
  }, [session]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "الاختبارات", description: "الاختبارات المتاحة لك" }),
    quizzes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-10 text-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-10 mx-auto mb-3 opacity-40" }),
      "لا اختبارات متاحة الآن."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: quizzes.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/quiz/$quizId", params: {
      quizId: q.id
    }, className: "block bg-card-premium border border-border/60 rounded-2xl p-5 hover:border-primary/40 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-gradient-primary grid place-items-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: q.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "المدة: ",
        q.duration_minutes,
        " دقيقة"
      ] })
    ] }, q.id)) })
  ] });
}
export {
  StudentQuizzesList as component
};
