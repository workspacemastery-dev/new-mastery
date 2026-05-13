import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { d as Route, L as Link } from "./router-BfT70NIy.js";
import { g as getAcademyStyle } from "./academy-styles--YM3WJdx.js";
import { S as StudentLoginForm, T as TeacherLoginForm } from "./AcademyLoginForms-WXSIiQ_R.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import { U as Users } from "./users-BIEQI_yv.js";
import { S as ShieldCheck } from "./shield-check-ct1nIaTm.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./circle-alert-c7tAyljS.js";
import "./createLucideIcon-DHqPreVB.js";
function AcademyLoginPage() {
  const {
    academy
  } = Route.useLoaderData();
  const search = Route.useSearch();
  const s = getAcademyStyle(academy.slug);
  const cover = academy.cover_image_url ?? academy.image_url ?? s.image;
  const [tab, setTab] = reactExports.useState(search.tab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", style: {
      background: `radial-gradient(ellipse at top, ${s.cssVar}, transparent 60%)`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/academy/$slug", params: {
        slug: academy.slug
      }, className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 rotate-180" }),
        "العودة لصفحة الأكاديمية"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-block size-24 rounded-2xl overflow-hidden mb-4 border-2 border-border ${s.glowClass}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cover, alt: academy.name, className: "w-full h-full object-cover", width: 96, height: 96 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: academy.name }),
        academy.teacher_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [
          "مع ",
          academy.teacher_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "اختر طريقة الدخول المناسبة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 p-1 bg-input rounded-xl mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("student"), className: `py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center justify-center gap-1.5 ${tab === "student" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
            "دخول الطالب"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("teacher"), className: `py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center justify-center gap-1.5 ${tab === "teacher" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
            "دخول المعلم"
          ] })
        ] }),
        tab === "student" ? /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLoginForm, { slug: academy.slug }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherLoginForm, { academyId: academy.id })
      ] })
    ] })
  ] });
}
export {
  AcademyLoginPage as component
};
