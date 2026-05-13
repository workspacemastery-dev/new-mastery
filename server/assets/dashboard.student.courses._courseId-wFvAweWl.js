import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { i as Route, s as supabase, N as Navigate, L as Link } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { D as DashboardShell } from "./DashboardShell-C8RF7EdW.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { V as Video } from "./video-AtJvo0FV.js";
import { F as FileText } from "./file-text-DbtC_hJa.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { C as CirclePlay } from "./circle-play-uSCpGRvi.js";
import { C as ChevronRight, a as ChevronLeft } from "./chevron-right-CCkD_CJy.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
function normalizeCourseContent(payload) {
  const p = payload ?? {};
  const course = p.course ?? null;
  const rawModules = Array.isArray(p.modules) ? p.modules : [];
  const rawLessons = Array.isArray(p.lessons) ? p.lessons : [];
  const lessonsByModule = /* @__PURE__ */ new Map();
  for (const row of rawLessons) {
    if (!row?.id) continue;
    const moduleId = String(row.module_id ?? row.course_module_id ?? "");
    if (!moduleId) continue;
    const lesson = {
      id: String(row.id),
      title: String(row.title ?? ""),
      content: String(row.content ?? ""),
      video_url: row.video_url ? String(row.video_url) : null,
      duration_minutes: Number(row.duration_minutes ?? 0),
      module_id: moduleId,
      sort_order: row.sort_order == null ? void 0 : Number(row.sort_order)
    };
    const bucket = lessonsByModule.get(moduleId) ?? [];
    bucket.push(lesson);
    lessonsByModule.set(moduleId, bucket);
  }
  const modules = rawModules.filter((m) => m?.id).map((m) => {
    const moduleId = String(m.id);
    const nestedLessons = Array.isArray(m.lessons) ? m.lessons : Array.isArray(m.course_lessons) ? m.course_lessons : Array.isArray(m.lessons_data) ? m.lessons_data : [];
    const lessons = nestedLessons.length > 0 ? nestedLessons.filter((l) => l?.id).map((l) => ({
      id: String(l.id),
      title: String(l.title ?? ""),
      content: String(l.content ?? ""),
      video_url: l.video_url ? String(l.video_url) : null,
      duration_minutes: Number(l.duration_minutes ?? 0),
      module_id: String(l.module_id ?? l.course_module_id ?? moduleId),
      sort_order: l.sort_order == null ? void 0 : Number(l.sort_order)
    })) : lessonsByModule.get(moduleId) ?? [];
    lessons.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return {
      id: moduleId,
      title: String(m.title ?? ""),
      sort_order: m.sort_order == null ? void 0 : Number(m.sort_order),
      lessons
    };
  }).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return {
    course,
    modules
  };
}
function StudentCoursePage() {
  const {
    session,
    loading
  } = useStudentAuth();
  const {
    courseId
  } = Route.useParams();
  const [course, setCourse] = reactExports.useState(null);
  const [modules, setModules] = reactExports.useState([]);
  const [activeModuleIndex, setActiveModuleIndex] = reactExports.useState(0);
  const [activeLessonId, setActiveLessonId] = reactExports.useState(null);
  const [loadingData, setLoadingData] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!session) return;
    void (async () => {
      try {
        setLoadingData(true);
        setError(null);
        const {
          data,
          error: error2
        } = await supabase.rpc("student_get_course_content", {
          _token: session.token,
          _course_id: courseId
        });
        console.log("student_get_course_content =>", data);
        console.log("FIRST MODULE =>", data?.modules?.[0]);
        if (error2) {
          console.error(error2);
          setError(error2.message);
          setCourse(null);
          setModules([]);
          return;
        }
        const normalized = normalizeCourseContent(data);
        console.log("NORMALIZED =>", normalized);
        setCourse(normalized.course);
        setModules(normalized.modules);
        const firstModuleIndex = normalized.modules.findIndex((m) => m.lessons.length > 0);
        const safeIndex = firstModuleIndex === -1 ? 0 : firstModuleIndex;
        setActiveModuleIndex(safeIndex);
        const firstLesson = normalized.modules[safeIndex]?.lessons?.[0];
        setActiveLessonId(firstLesson?.id ?? null);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل الكورس");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [session, courseId]);
  const activeModule = modules[activeModuleIndex] ?? null;
  reactExports.useEffect(() => {
    if (!activeModule) return;
    const firstLesson = activeModule.lessons?.[0];
    setActiveLessonId(firstLesson?.id ?? null);
  }, [activeModule?.id]);
  const activeLesson = reactExports.useMemo(() => {
    if (!activeModule) return null;
    return activeModule.lessons.find((l) => l.id === activeLessonId) ?? activeModule.lessons[0];
  }, [activeModule, activeLessonId]);
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  if (loading || loadingData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: course?.title ?? "الكورس", roleLabel: "Student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/student/courses", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
        "الرجوع للكورسات"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "عدد الوحدات:",
        " ",
        modules.length,
        " ",
        "—",
        " ",
        "عدد الدروس:",
        " ",
        totalLessons
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60 rounded-3xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-2xl bg-primary/15 text-primary grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: course?.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: course?.description || "لا يوجد وصف لهذا الكورس" })
      ] })
    ] }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-sm text-destructive", children: error }),
    !course ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60 rounded-2xl p-12 text-center text-muted-foreground", children: "الكورس غير متاح حالياً." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[320px_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-card border border-border/60 rounded-3xl p-4 h-fit sticky top-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold mb-4", children: "وحدات الكورس" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: modules.map((module, index) => {
          const isActive = index === activeModuleIndex;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border transition overflow-hidden ${isActive ? "border-primary bg-primary/5" : "border-border/60"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveModuleIndex(index), className: "w-full p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm", children: [
                  "الوحدة",
                  " ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: module.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs bg-muted px-2 py-1 rounded-lg", children: module.lessons.length })
            ] }) }),
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 p-2 space-y-1", children: module.lessons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground p-3 text-center", children: "لا توجد دروس" }) : module.lessons.map((lesson, lessonIndex) => {
              const selected = activeLesson?.id === lesson.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveLessonId(lesson.id), className: `w-full flex items-center gap-2 text-right rounded-xl px-3 py-2 transition ${selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`, children: [
                lesson.video_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-xs font-medium", children: [
                  lessonIndex + 1,
                  ".",
                  " ",
                  lesson.title
                ] }) }),
                selected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 shrink-0" })
              ] }, lesson.id);
            }) })
          ] }, module.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "الوحدة الحالية" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: activeModule?.title ?? "لا توجد وحدات" })
        ] }),
        !activeLesson ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60 rounded-3xl p-16 text-center text-muted-foreground", children: "لا توجد دروس داخل هذه الوحدة." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-3xl overflow-hidden", children: [
          activeLesson.video_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(VideoEmbed, { url: activeLesson.video_url }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-black/40 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-16 text-white/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "الدرس الحالي" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: activeLesson.title })
              ] }),
              activeLesson.duration_minutes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted rounded-xl px-3 py-2 text-sm", children: [
                "⏱",
                " ",
                activeLesson.duration_minutes,
                " ",
                "دقيقة"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-invert max-w-none text-sm leading-8 whitespace-pre-wrap", children: activeLesson.content || "لا يوجد محتوى نصي لهذا الدرس." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveModuleIndex((prev) => Math.max(prev - 1, 0)), disabled: activeModuleIndex === 0, className: "inline-flex items-center gap-2 px-5 py-3 rounded-2xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }),
            "السابق"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap justify-center", children: modules.map((m, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveModuleIndex(index), className: `size-10 rounded-xl text-sm font-bold transition ${index === activeModuleIndex ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"}`, children: index + 1 }, m.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveModuleIndex((prev) => Math.min(prev + 1, modules.length - 1)), disabled: activeModuleIndex >= modules.length - 1, className: "inline-flex items-center gap-2 px-5 py-3 rounded-2xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition", children: [
            "التالي",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function VideoEmbed({
  url
}) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?\s]+)/);
  if (ytMatch) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { className: "w-full h-full", src: `https://www.youtube.com/embed/${ytMatch[1]}`, title: "lesson-video", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) });
  }
  const vimMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimMatch) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { className: "w-full h-full", src: `https://player.vimeo.com/video/${vimMatch[1]}`, title: "lesson-video", allow: "autoplay; fullscreen; picture-in-picture", allowFullScreen: true }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("video", { controls: true, className: "w-full aspect-video bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: url }) });
}
export {
  StudentCoursePage as component
};
