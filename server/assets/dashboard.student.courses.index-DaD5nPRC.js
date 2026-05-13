import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { s as supabase, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { L as Layers } from "./layers-DeLHyVMc.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function StudentCoursesList() {
  const {
    session
  } = useStudentAuth();
  const [courses, setCourses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!session) return;
    void (async () => {
      try {
        setLoading(true);
        const {
          data
        } = await supabase.rpc("student_get_courses", {
          _token: session.token
        });
        setCourses(data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "كورساتي", description: "جميع الكورسات المتاحة لك" }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) : courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-3xl p-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-14 mx-auto mb-4 text-muted-foreground opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold mb-2", children: "لا توجد كورسات بعد" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "لم يقم المعلم بنشر أي كورسات حالياً." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 xl:grid-cols-3 gap-5", children: courses.map((course) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/courses/$courseId", params: {
      courseId: course.id
    }, className: "group bg-card border border-border/60 rounded-3xl p-5 hover:border-primary/40 hover:-translate-y-1 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-2xl bg-primary/15 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs bg-muted rounded-xl px-3 py-1", children: "كورس" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-2 group-hover:text-primary transition", children: course.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-3 leading-6 mb-5", children: course.description || "لا يوجد وصف لهذا الكورس" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4" }),
          "محتوى الكورس"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-sm text-primary font-medium", children: [
          "الدخول للكورس",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
        ] })
      ] })
    ] }, course.id)) })
  ] });
}
export {
  StudentCoursesList as component
};
