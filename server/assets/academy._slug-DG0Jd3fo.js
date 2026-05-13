import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { c as Route, L as Link } from "./router-BfT70NIy.js";
import { N as Navbar, F as Footer } from "./Footer-uAbY-eUk.js";
import { g as getAcademyStyle } from "./academy-styles--YM3WJdx.js";
import { m as motion } from "./proxy-CnLLDCS6.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { F as FileText } from "./file-text-DbtC_hJa.js";
import { M as MessageCircle } from "./message-circle-B6I0FyNw.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useAuth-CuQlxuo9.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./layout-dashboard-CTedgaC8.js";
import "./log-out-ajI5jNrW.js";
import "./shield-check-ct1nIaTm.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode);
function AcademyPage() {
  const {
    academy
  } = Route.useLoaderData();
  const s = getAcademyStyle(academy.slug);
  const img = academy.cover_image_url ?? academy.image_url ?? s.image;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-32 pb-16 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-40", style: {
        background: `radial-gradient(ellipse at top, ${s.cssVar}, transparent 60%)`
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_auto] gap-10 items-center relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.6
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 rotate-180" }),
            "كل الأكاديميات"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-4 ${s.accentClass}`, children: academy.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl lg:text-6xl font-bold mb-4", children: academy.name }),
          academy.teacher_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-primary/80 mb-1 tracking-wide", children: "المعلم" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl lg:text-5xl font-black text-yellow-300 leading-tight", children: academy.teacher_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-muted-foreground max-w-2xl leading-relaxed mb-8", children: academy.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/student-login", search: {
              academy: academy.slug
            }, className: `inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${s.bgGradientClass} text-white font-semibold ${s.glowClass} hover:brightness-110 transition`, children: [
              "دخول الطالب",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/teacher-login", search: {
              academy: academy.slug
            }, className: "inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass font-semibold hover:bg-white/10 transition", children: "دخول المعلم" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.95
        }, animate: {
          opacity: 1,
          scale: 1
        }, transition: {
          duration: 0.7,
          delay: 0.2
        }, className: "relative hidden lg:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -inset-10 ${s.bgGradientClass} opacity-20 blur-3xl rounded-full pointer-events-none` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-[520px] h-[560px]", style: {
            maskImage: "radial-gradient(ellipse 85% 90% at 50% 50%, black 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 90% at 50% 50%, black 55%, transparent 100%)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: academy.teacher_name ?? academy.name, className: "w-full h-full object-cover object-top" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-8", children: "ما الذي ستجده في الأكاديمية" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: [{
        icon: Play,
        title: "دروس فيديو HD",
        desc: "محتوى مصوّر باحترافية وشروحات متسلسلة."
      }, {
        icon: FileText,
        title: "اختبارات تفاعلية",
        desc: "أسئلة اختيار من متعدد ونصية وبالصور مع مراجعة فورية."
      }, {
        icon: MessageCircle,
        title: "متابعة وتغذية راجعة",
        desc: "تواصل مباشر مع المعلم وتقارير أداء دورية."
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-12 rounded-xl ${s.bgGradientClass} grid place-items-center mb-4`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "size-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: f.desc })
      ] }, f.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4 text-gold" }),
        "شهادة إتمام بعد كل كورس"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  AcademyPage as component
};
