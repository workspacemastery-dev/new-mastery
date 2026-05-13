import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { L as Link, N as Navigate, b as Route } from "./router-BfT70NIy.js";
import { N as Navbar, F as Footer } from "./Footer-uAbY-eUk.js";
import { g as getAcademyStyle } from "./academy-styles--YM3WJdx.js";
import { m as motion } from "./proxy-CnLLDCS6.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { G as GraduationCap } from "./graduation-cap-CI_zLsIZ.js";
import { T as Trophy } from "./trophy-YWyvm5ya.js";
import { C as ChartColumn } from "./chart-column-lL-oaoZ_.js";
import { S as ShieldCheck } from "./shield-check-ct1nIaTm.js";
import { Z as Zap } from "./zap-B6eok_kT.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./layout-dashboard-CTedgaC8.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
const heroBooks = "/assets/hero-books-CWD48Uq_.png";
function AcademyCard({ academy, index }) {
  const s = getAcademyStyle(academy.slug);
  const img = academy.image_url ?? s.image;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `group relative block rounded-3xl overflow-hidden bg-card-premium border border-border/60 ${s.glowClass} hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 ${s.bgGradientClass}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-64 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity",
                  style: { background: `radial-gradient(circle at center, ${s.cssVar}, transparent 70%)` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: img,
                  alt: academy.teacher_name ?? academy.name,
                  loading: "lazy",
                  width: 768,
                  height: 768,
                  className: "w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs font-medium", children: academy.subject })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 -mt-8 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-1", children: academy.name }),
              academy.teacher_name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium mb-3 ${s.accentClass}`, children: academy.teacher_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5 min-h-[3rem]", children: academy.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 text-xs text-muted-foreground mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }),
                "محتوى تفاعلي"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/academy/$slug",
                  params: { slug: academy.slug },
                  className: `flex items-center justify-between rounded-xl px-4 py-3 ${s.bgGradientClass} text-white text-sm font-semibold hover:brightness-110 transition`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "عرض صفحة الأكاديمية" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function Index() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return null;
  if (user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AcademiesSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorks, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.94_0.04_230)] to-background" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute inset-0 -z-10 w-full h-full opacity-60", viewBox: "0 0 1440 600", preserveAspectRatio: "none", "aria-hidden": true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,420 C240,360 360,500 720,440 C1080,380 1200,520 1440,460 L1440,600 L0,600 Z", fill: "oklch(0.88 0.06 230 / 0.5)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,480 C240,440 480,540 720,500 C960,460 1200,560 1440,520 L1440,600 L0,600 Z", fill: "oklch(0.82 0.08 225 / 0.4)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "120", cy: "180", r: "180", fill: "oklch(0.86 0.07 225 / 0.35)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "1320", cy: "120", r: "140", fill: "oklch(0.86 0.07 225 / 0.35)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }, className: "text-center lg:text-right order-2 lg:order-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl lg:text-2xl text-slate-700 font-medium mb-3", children: "مرحباً بك في " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-primary", children: "البوابة التعليمية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-800 lg:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8", children: "منصة تعليمية متعددة الأكاديميات تجمع نخبة المعلمين في مكان واحد، مع نظام اختبارات احترافي ومحتوى تفاعلي حديث." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center lg:justify-start gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#academies", className: "group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition", children: [
          "استكشف الأكاديميات",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 group-hover:-translate-x-1 transition-transform" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        duration: 0.9,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative order-1 lg:order-2 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroBooks, alt: "كتب تعليمية وقبعة تخرج", width: 1024, height: 1024, className: "w-full max-w-md lg:max-w-lg h-auto drop-shadow-[0_20px_40px_oklch(0.5_0.15_240/0.25)] animate-float" }) })
    ] })
  ] });
}
function AcademiesSection() {
  const {
    academies
  } = Route.useLoaderData();
  const list = academies;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "academies", className: "py-20 lg:py-28 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, whileInView: {
      opacity: 1,
      y: 0
    }, viewport: {
      once: true
    }, transition: {
      duration: 0.6
    }, className: "text-center mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "الأكاديميات المتاحة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl lg:text-5xl font-bold mb-4", children: [
        "اختر أكاديميتك واغمر في ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: "عالم المعرفة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: "كل أكاديمية بوابة مستقلة بمعلمها الخاص ومحتواها واختباراتها. ابدأ بالأكاديمية التي تهمك." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-7", children: list.map((academy, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AcademyCard, { academy, index: i }, academy.id)) })
  ] }) });
}
const features = [{
  icon: Trophy,
  title: "اختبارات احترافية",
  desc: "نظام اختبارات متكامل مع مؤقت، أنواع أسئلة متعددة، ومراجعة مفصلة."
}, {
  icon: ChartColumn,
  title: "تحليلات الأداء",
  desc: "تابع تقدمك بإحصائيات دقيقة ولوحات تحكم بصرية واضحة."
}, {
  icon: ShieldCheck,
  title: "عزل تام للبيانات",
  desc: "كل أكاديمية مستقلة بمحتواها وطلابها، أمان من الدرجة الأولى."
}, {
  icon: Zap,
  title: "أداء فائق",
  desc: "تجربة سلسة على جميع الأجهزة مع دعم كامل للوضع الداكن."
}];
function Features() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "features", className: "py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl lg:text-5xl font-bold mb-4", children: [
        "لماذا ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: "EduVerse" }),
        "؟"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "كل ما يحتاجه المعلم والطالب في منصة واحدة فاخرة." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, whileInView: {
      opacity: 1,
      y: 0
    }, viewport: {
      once: true
    }, transition: {
      duration: 0.5,
      delay: i * 0.08
    }, className: "bg-card-premium border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-gradient-primary grid place-items-center mb-4 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "size-6 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: f.desc })
    ] }, f.title)) })
  ] }) });
}
function HowItWorks() {
  const steps = [{
    n: "01",
    title: "اختر أكاديميتك",
    desc: "ادخل بوابة المعلم الذي تريد التعلم منه."
  }, {
    n: "02",
    title: "أنشئ حسابك",
    desc: "تسجيل سريع وآمن خاص بكل أكاديمية."
  }, {
    n: "03",
    title: "ادرس واختبر",
    desc: "كورسات ودروس واختبارات تفاعلية بمراجعة فورية."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "how", className: "py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl lg:text-5xl font-bold mb-4", children: "كيف تبدأ في 3 خطوات" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, whileInView: {
      opacity: 1,
      y: 0
    }, viewport: {
      once: true
    }, transition: {
      duration: 0.5,
      delay: i * 0.1
    }, className: "relative bg-card-premium border border-border/60 rounded-2xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl font-bold text-gradient-primary opacity-80 mb-4", children: s.n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold mb-2", children: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: s.desc })
    ] }, s.n)) })
  ] }) });
}
function CTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-5xl px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl overflow-hidden bg-card-premium border border-border p-10 lg:p-14 text-center shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-primary opacity-20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -left-20 size-64 bg-primary/40 blur-3xl rounded-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -right-20 size-64 bg-accent/40 blur-3xl rounded-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl lg:text-5xl font-bold mb-4", children: [
        "جاهز لتبدأ رحلة ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "التفوق" }),
        "؟"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-xl mx-auto", children: "انضم لآلاف الطلاب الذين يصنعون مستقبلهم اليوم على EduVerse." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", hash: "academies", className: "inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg shadow-glow-primary hover:opacity-95 transition", children: [
        "اختر أكاديميتك الآن",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-5" })
      ] })
    ] })
  ] }) }) });
}
export {
  Index as component
};
