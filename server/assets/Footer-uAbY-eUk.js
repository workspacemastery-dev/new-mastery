import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { L as Link, s as supabase } from "./router-BfT70NIy.js";
import { u as useAuth, d as dashboardPathForRole } from "./useAuth-CuQlxuo9.js";
import { G as GraduationCap } from "./graduation-cap-CI_zLsIZ.js";
import { L as LayoutDashboard } from "./layout-dashboard-CTedgaC8.js";
import { L as LogOut } from "./log-out-ajI5jNrW.js";
import { S as ShieldCheck } from "./shield-check-ct1nIaTm.js";
function Navbar() {
  const { user, role, loading } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 inset-x-0 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-6 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold tracking-tight", children: [
        "البوابة",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: "التعليمية" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#academies", className: "hover:text-foreground transition-colors", children: "الأكاديميات" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#features", className: "hover:text-foreground transition-colors", children: "المميزات" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#how", className: "hover:text-foreground transition-colors", children: "كيف نعمل" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-white/5 animate-pulse" }) : user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: dashboardPathForRole(role),
          className: "text-sm px-3 py-2 rounded-lg glass hover:bg-white/10 transition inline-flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "size-4" }),
            "لوحتي"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => supabase.auth.signOut(),
          className: "text-sm px-3 py-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5",
          "aria-label": "تسجيل الخروج",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/login",
        className: "text-sm px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors inline-flex items-center gap-1.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-primary" }),
          "دخول الإدارة"
        ]
      }
    ) })
  ] }) }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/60 mt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-gradient-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: "EduVerse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md leading-relaxed", children: "منصة تعليمية احترافية متعددة الأكاديميات، تجمع نخبة المعلمين تحت سقف واحد بتجربة تعلم سينمائية حديثة." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-3", children: "الأكاديميات" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "الرياضيات" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "الفيزياء" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "الكيمياء" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-3", children: "المنصة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "عن EduVerse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "المدونة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "تواصل معنا" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 py-6 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " EduVerse. جميع الحقوق محفوظة."
    ] })
  ] });
}
export {
  Footer as F,
  Navbar as N
};
