import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { L as Link } from "./router-BfT70NIy.js";
import { m as motion } from "./proxy-CnLLDCS6.js";
import { G as GraduationCap } from "./graduation-cap-CI_zLsIZ.js";
import { S as ShieldCheck } from "./shield-check-ct1nIaTm.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { S as Sparkles } from "./sparkles-vouD53p5.js";
function AuthShell({
  title,
  subtitle,
  children,
  footer
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 blur-3xl rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 blur-3xl rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08),transparent_40%)]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 min-h-screen flex items-center", dir: "rtl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex w-[45%] items-center justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.7 },
          className: "max-w-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-7 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-foreground", children: "البوابة التعليمية" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "منصة تعليمية احترافية حديثة" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl leading-tight font-black mb-6 text-foreground", children: [
              "مستقبل التعليم",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-gradient-gold", children: "يبدأ من هنا" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground leading-relaxed mb-8", children: "منصة تعليمية ذكية توفر تجربة حديثة للطلاب والمعلمين مع أدوات متقدمة وإدارة احترافية للأكاديميات." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5" }), text: "حماية وأمان كامل للحسابات" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5" }), text: "إدارة الكورسات والاختبارات بسهولة" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }), text: "واجهة احترافية وتجربة استخدام فاخرة" })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-[55%] flex items-center justify-center px-6 py-10 lg:px-16 min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "w-full max-w-xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 mb-8 lg:hidden justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black text-gradient-gold", children: "البوابة التعليمية" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-border/50 bg-card/70 backdrop-blur-2xl shadow-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-3xl border border-primary/20 pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 lg:p-14", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center size-20 rounded-3xl bg-gradient-primary shadow-glow-primary mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-10 text-primary-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-foreground mb-2", children: title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: subtitle })
                ] }),
                children,
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center text-sm text-muted-foreground", children: footer })
              ] })
            ] })
          ]
        }
      ) })
    ] })
  ] });
}
function Feature({ icon, text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-foreground/90", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow-primary shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: text })
  ] });
}
function FormField({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-semibold mb-2 text-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        name,
        placeholder,
        value,
        onChange: (e) => onChange?.(e.target.value),
        required,
        className: "\n          w-full px-4 py-3.5 rounded-2xl\n          bg-input/70 border border-border\n          text-foreground placeholder:text-muted-foreground/60\n          backdrop-blur-md transition-all duration-300\n          focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20\n          hover:border-primary/40\n        "
      }
    )
  ] });
}
export {
  AuthShell as A,
  FormField as F
};
