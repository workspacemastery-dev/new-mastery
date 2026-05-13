import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useNavigate, L as Link, s as supabase } from "./router-BfT70NIy.js";
import { g as getStoredStudentToken, c as clearStudentSession } from "./useStudentAuth-Mzi_1DBf.js";
import { G as GraduationCap } from "./graduation-cap-CI_zLsIZ.js";
import { L as LogOut } from "./log-out-ajI5jNrW.js";
function DashboardShell({
  title,
  roleLabel,
  children
}) {
  const navigate = useNavigate();
  async function logout() {
    if (getStoredStudentToken()) {
      clearStudentSession();
    } else {
      const isTeacher = roleLabel.toLowerCase().includes("teacher") || roleLabel.includes("معلم");
      if (isTeacher) {
        navigate({ to: "/" });
      }
      await supabase.auth.signOut();
    }
    navigate({ to: "/" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", children: [
          "Edu",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: "Verse" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-3 py-1.5 rounded-full glass text-muted-foreground", children: roleLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: logout,
            className: "inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition text-muted-foreground hover:text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
              "خروج"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl lg:text-4xl font-bold mb-8", children: title }),
      children
    ] })
  ] });
}
function StatCard({
  label,
  value,
  hint,
  accent = "primary"
}) {
  const map = {
    primary: "from-primary to-primary/40",
    math: "from-math to-math/40",
    physics: "from-physics to-physics/40",
    chemistry: "from-chemistry to-chemistry/40",
    gold: "from-gold to-gold/40"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card-premium border border-border/60 rounded-2xl p-6 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -top-12 -left-12 size-32 bg-gradient-to-br ${map[accent]} opacity-20 blur-2xl rounded-full` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-2", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: value }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-2", children: hint })
    ] })
  ] });
}
export {
  DashboardShell as D,
  StatCard as S
};
