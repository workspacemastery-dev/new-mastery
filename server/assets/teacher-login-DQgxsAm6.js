import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { R as Route, L as Link } from "./router-BfT70NIy.js";
import { g as getAcademyStyle } from "./academy-styles--YM3WJdx.js";
import { T as TeacherLoginForm } from "./AcademyLoginForms-WXSIiQ_R.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import { S as ShieldCheck } from "./shield-check-ct1nIaTm.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./circle-alert-c7tAyljS.js";
import "./createLucideIcon-DHqPreVB.js";
function TeacherLoginPage() {
  const {
    academy
  } = Route.useLoaderData();
  const style = getAcademyStyle(academy?.slug ?? "math");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", style: {
      background: `radial-gradient(ellipse at top, ${style.cssVar}, transparent 60%)`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: academy ? "/academy/$slug" : "/", params: academy ? {
        slug: academy.slug
      } : void 0, className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 rotate-180" }),
        academy ? "العودة لصفحة الأكاديمية" : "اختيار أكاديمية"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex size-16 rounded-2xl ${style.bgGradientClass} grid place-items-center mb-4 ${style.glowClass}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-8 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "دخول المعلم" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: academy?.name ?? "اختر أكاديمية أولًا من الصفحة الرئيسية" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 shadow-elevated", children: academy ? /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherLoginForm, { academyId: academy.id }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MissingAcademy, {}) })
    ] })
  ] });
}
function MissingAcademy() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "لا يمكن فتح دخول المعلم بدون تحديد الأكاديمية." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", hash: "academies", className: "inline-flex w-full justify-center py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold", children: "اختيار أكاديمية" })
  ] });
}
export {
  TeacherLoginPage as component
};
