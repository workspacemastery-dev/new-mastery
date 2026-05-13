import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { s as supabase, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { S as StatCard } from "./DashboardShell-C8RF7EdW.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { g as getAcademyStyle } from "./academy-styles--YM3WJdx.js";
import { Z as Zap } from "./zap-B6eok_kT.js";
import { C as CircleCheckBig, I as Info } from "./info-DRB-b5T2.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { M as Megaphone } from "./megaphone-CBplyzyM.js";
import { X } from "./x-yy412flO.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
const TYPE_CONFIG = {
  info: { icon: Info, bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-500/20 text-blue-600 dark:text-blue-300", glow: "" },
  warning: { icon: CircleAlert, bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/20 text-amber-600 dark:text-amber-300", glow: "" },
  success: { icon: CircleCheckBig, bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300", glow: "" },
  urgent: { icon: Zap, bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-600 dark:text-red-400", badge: "bg-red-500/20 text-red-600 dark:text-red-300", glow: "shadow-[0_0_20px_-4px_rgba(239,68,68,0.3)]" }
};
const DISMISSED_KEY = "eduverse_dismissed_announcements";
function getDismissed() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function addDismissed(id) {
  if (typeof window === "undefined") return;
  const d = getDismissed();
  if (!d.includes(id)) localStorage.setItem(DISMISSED_KEY, JSON.stringify([...d, id]));
}
function AnnouncementBanner() {
  const { session, loading } = useStudentAuth();
  const [announcements, setAnnouncements] = reactExports.useState([]);
  const [dismissed, setDismissed] = reactExports.useState([]);
  const [current, setCurrent] = reactExports.useState(0);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
    setDismissed(getDismissed());
  }, []);
  reactExports.useEffect(() => {
    if (!mounted || loading || !session?.academy_id) return;
    void (async () => {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const { data } = await supabase.from("announcements").select("id, title, body, type, expires_at").eq("academy_id", session.academy_id).eq("is_active", true).or(`expires_at.is.null,expires_at.gt.${now}`).order("created_at", { ascending: false });
      setAnnouncements(data ?? []);
    })();
  }, [session, loading, mounted]);
  if (!mounted) return null;
  const visible = announcements.filter((a) => !dismissed.includes(a.id));
  function dismiss(id) {
    addDismissed(id);
    setDismissed((prev) => [...prev, id]);
    setCurrent((c) => Math.max(0, c - 1));
  }
  if (visible.length === 0) return null;
  const ann = visible[current] ?? visible[0];
  const cfg = TYPE_CONFIG[ann.type];
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full rounded-2xl border ${cfg.bg} ${cfg.border} ${cfg.glow} p-4 mb-5`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.badge}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "size-3" }),
            " إعلان"
          ] }),
          ann.type === "urgent" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-red-500 animate-pulse", children: "● عاجل" }),
          visible.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
            current + 1,
            " / ",
            visible.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold mb-0.5 ${cfg.text}`, children: ann.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: ann.body })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        visible.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setCurrent((c) => (c - 1 + visible.length) % visible.length),
              className: "size-7 grid place-items-center rounded-lg hover:bg-white/10 text-muted-foreground text-xs font-bold",
              children: "›"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setCurrent((c) => (c + 1) % visible.length),
              className: "size-7 grid place-items-center rounded-lg hover:bg-white/10 text-muted-foreground text-xs font-bold",
              children: "‹"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => dismiss(ann.id),
            className: "size-7 grid place-items-center rounded-lg hover:bg-white/10 text-muted-foreground transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
          }
        )
      ] })
    ] }),
    visible.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mt-3 justify-center", children: visible.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setCurrent(i),
        className: `rounded-full transition-all duration-200 ${i === current ? `w-5 h-1.5 ${cfg.text.replace("text-", "bg-")}` : "w-1.5 h-1.5 bg-border"}`
      },
      i
    )) })
  ] });
}
function StudentDashboardIndex() {
  const {
    session
  } = useStudentAuth();
  const [courses, setCourses] = reactExports.useState([]);
  const [quizzes, setQuizzes] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!session) return;
    void (async () => {
      const [{
        data: c
      }, {
        data: q
      }] = await Promise.all([supabase.rpc("student_get_courses", {
        _token: session.token
      }), supabase.rpc("student_get_quizzes", {
        _token: session.token
      })]);
      setCourses(c ?? []);
      setQuizzes(q ?? []);
    })();
  }, [session]);
  if (!session) return null;
  const s = getAcademyStyle(session.academy_slug);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `أهلاً، ${session.full_name} 👋`, description: session.academy_name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mb-8 rounded-2xl p-5 ${s.bgGradientClass} text-white shadow-elevated`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-90 mb-1", children: "أكاديميتك" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: session.academy_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs opacity-80 mt-2", children: [
        "Student ID: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-white/20 px-2 py-0.5 rounded", children: session.student_code })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-5 mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "الكورسات", value: courses.length, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "الاختبارات المتاحة", value: quizzes.length, accent: "math" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "الإشعارات", value: 0, accent: "gold", hint: "لا جديد" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-primary" }),
        " كورساتك"
      ] }),
      courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "لا توجد كورسات منشورة بعد." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: courses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/courses/$courseId", params: {
        courseId: c.id
      }, className: "block bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 rounded-full ${s.bgGradientClass} mb-4` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: c.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 inline-flex items-center gap-1 text-xs text-primary", children: [
          "ابدأ ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3" })
        ] })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-4 inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-primary" }),
        " الاختبارات"
      ] }),
      quizzes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "لا توجد اختبارات متاحة الآن." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: quizzes.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/quiz/$quizId", params: {
        quizId: q.id
      }, className: "block bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: q.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "المدة: ",
          q.duration_minutes,
          " دقيقة"
        ] })
      ] }, q.id)) })
    ] })
  ] });
}
export {
  StudentDashboardIndex as component
};
