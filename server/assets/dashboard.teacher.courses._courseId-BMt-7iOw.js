import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useNavigate, f as Route, N as Navigate, s as supabase } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { D as DashboardShell } from "./DashboardShell-C8RF7EdW.js";
import { I as ImageUploadField } from "./ImageUploadField-B6wfmL7r.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { V as Video } from "./video-AtJvo0FV.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { F as FileText } from "./file-text-DbtC_hJa.js";
import { S as Save } from "./save-DaTgwH4R.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
import "./image-DntQ77e3.js";
import "./loader-circle-B8rYq1WK.js";
import "./x-yy412flO.js";
const __iconNode = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M11 18h2", key: "12mj7e" }],
  ["path", { d: "M12 12v6", key: "3ahymv" }],
  ["path", { d: "M9 13v-.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v.5", key: "qbrxap" }]
];
const FileType = createLucideIcon("file-type", __iconNode);
function uid() {
  return Math.random().toString(36).substring(2, 9);
}
function isTempId(id) {
  return id.startsWith("tmp_");
}
function CourseBuilderPage() {
  const {
    user,
    role,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    courseId
  } = Route.useParams();
  const AUTOSAVE_KEY = `course_builder_${courseId}`;
  const [step, setStep] = reactExports.useState(1);
  const [saving, setSaving] = reactExports.useState(false);
  const [loadingCourse, setLoadingCourse] = reactExports.useState(false);
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [initialModuleIds, setInitialModuleIds] = reactExports.useState([]);
  const [initialLessonIds, setInitialLessonIds] = reactExports.useState([]);
  const [course, setCourse] = reactExports.useState({
    title: "",
    description: "",
    cover_image_url: ""
  });
  const [modules, setModules] = reactExports.useState([]);
  const [activeLessonId, setActiveLessonId] = reactExports.useState(null);
  const [openAddLessonForModuleId, setOpenAddLessonForModuleId] = reactExports.useState(null);
  const addLessonMenuRef = reactExports.useRef(null);
  const autoSaveTimerRef = reactExports.useRef(null);
  const isNew = courseId === "new";
  const isTeacher = !!user && role === "teacher";
  reactExports.useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      const data = parsed;
      if (!data.course || typeof data.course !== "object" || !Array.isArray(data.modules)) {
        return;
      }
      const nextCourse = {
        title: typeof data.course.title === "string" ? data.course.title : "",
        description: typeof data.course.description === "string" ? data.course.description : "",
        cover_image_url: typeof data.course.cover_image_url === "string" ? data.course.cover_image_url : ""
      };
      const nextModules = data.modules;
      setCourse(nextCourse);
      setModules(nextModules);
    } catch (e) {
      console.warn("[CourseBuilder] Autosave restore failed", e);
    }
  }, [AUTOSAVE_KEY]);
  reactExports.useEffect(() => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
          course,
          modules
        }));
      } catch (e) {
        console.warn("[CourseBuilder] Autosave write failed", e);
      }
    }, 1e3);
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [AUTOSAVE_KEY, course, modules]);
  reactExports.useEffect(() => {
    function forceSave() {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
          course,
          modules
        }));
      } catch (e) {
        console.warn("[CourseBuilder] Autosave beforeunload write failed", e);
      }
    }
    window.addEventListener("beforeunload", forceSave);
    return () => window.removeEventListener("beforeunload", forceSave);
  }, [AUTOSAVE_KEY, course, modules]);
  reactExports.useEffect(() => {
    if (!openAddLessonForModuleId) return;
    function onPointerDown(e) {
      const node = addLessonMenuRef.current;
      if (!node) return;
      if (node.contains(e.target)) return;
      setOpenAddLessonForModuleId(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openAddLessonForModuleId]);
  reactExports.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user || role !== "teacher") return;
      setLoadingCourse(true);
      try {
        const {
          data: aca,
          error: acaError
        } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
        if (acaError) {
          console.error("[CourseBuilder] Failed to load academy", acaError);
          return;
        }
        if (!aca?.id) {
          console.error("[CourseBuilder] No academy found for teacher");
          return;
        }
        if (cancelled) return;
        setAcademyId(aca.id);
        if (isNew) {
          const hasDraft2 = localStorage.getItem(AUTOSAVE_KEY);
          if (hasDraft2) {
            return;
          }
          setCourse({
            title: "",
            description: "",
            cover_image_url: ""
          });
          setModules([]);
          setInitialModuleIds([]);
          setInitialLessonIds([]);
          return;
        }
        const {
          data: courseRow,
          error: courseError
        } = await supabase.from("courses").select("id, title, description, cover_image_url, academy_id").eq("id", courseId).maybeSingle();
        if (courseError) {
          console.error("[CourseBuilder] Failed to load course", courseError);
          return;
        }
        if (!courseRow) {
          console.error("[CourseBuilder] Course not found", {
            courseId
          });
          return;
        }
        if (courseRow.academy_id !== aca.id) {
          console.error("[CourseBuilder] Course not in teacher academy", {
            courseId,
            courseAcademyId: courseRow.academy_id,
            teacherAcademyId: aca.id
          });
          navigate({
            to: "/dashboard/teacher/courses"
          });
          return;
        }
        const hasDraft = localStorage.getItem(AUTOSAVE_KEY);
        if (hasDraft) {
          return;
        }
        if (cancelled) return;
        setCourse({
          title: courseRow.title ?? "",
          description: courseRow.description ?? "",
          cover_image_url: courseRow.cover_image_url ?? ""
        });
        const {
          data: moduleRows,
          error: moduleError
        } = await supabase.from("modules").select("id, title, sort_order").eq("course_id", courseId).order("sort_order", {
          ascending: true
        });
        if (moduleError) {
          console.error("[CourseBuilder] Failed to load modules", moduleError);
          return;
        }
        const moduleIds = (moduleRows ?? []).map((m) => m.id);
        const {
          data: lessonRows,
          error: lessonError
        } = await supabase.from("lessons").select("id, module_id, title, lesson_type, content, video_url, attachment_url, sort_order").in("module_id", moduleIds.length ? moduleIds : ["00000000-0000-0000-0000-000000000000"]).order("sort_order", {
          ascending: true
        });
        if (lessonError) {
          console.error("[CourseBuilder] Failed to load lessons", lessonError);
          return;
        }
        const lessonsByModule = /* @__PURE__ */ new Map();
        for (const row of lessonRows ?? []) {
          const lesson = {
            id: row.id,
            title: row.title,
            lesson_type: row.lesson_type,
            content: row.content ?? "",
            video_url: row.video_url ?? "",
            attachment_url: row.attachment_url ?? ""
          };
          const bucket = lessonsByModule.get(row.module_id) ?? [];
          bucket.push(lesson);
          lessonsByModule.set(row.module_id, bucket);
        }
        const nextModules = (moduleRows ?? []).map((m) => ({
          id: m.id,
          title: m.title,
          lessons: lessonsByModule.get(m.id) ?? []
        }));
        if (cancelled) return;
        setModules(nextModules);
        setInitialModuleIds(nextModules.map((m) => m.id));
        setInitialLessonIds(nextModules.flatMap((m) => m.lessons.map((l) => l.id)));
      } finally {
        if (!cancelled) setLoadingCourse(false);
      }
    }
    load().catch((e) => console.error("[CourseBuilder] load() crashed", e));
    return () => {
      cancelled = true;
    };
  }, [user, role, courseId, isNew, navigate]);
  function addModule() {
    setModules([...modules, {
      id: `tmp_${uid()}`,
      title: `وحدة ${modules.length + 1}`,
      lessons: []
    }]);
  }
  function deleteModule(moduleId) {
    setModules(modules.filter((m) => m.id !== moduleId));
    if (activeLesson && modules.find((m) => m.id === moduleId)?.lessons.some((l) => l.id === activeLesson.id)) {
      setActiveLessonId(null);
    }
  }
  function updateModuleTitle(moduleId, title) {
    setModules(modules.map((m) => m.id === moduleId ? {
      ...m,
      title
    } : m));
  }
  function addLesson(moduleId, type) {
    const lesson = {
      id: `tmp_${uid()}`,
      title: "درس جديد",
      lesson_type: type,
      content: "",
      video_url: "",
      attachment_url: ""
    };
    setModules(modules.map((m) => m.id === moduleId ? {
      ...m,
      lessons: [...m.lessons, lesson]
    } : m));
    setActiveLessonId(lesson.id);
  }
  function updateLesson(updatedLesson) {
    setModules(modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => l.id === updatedLesson.id ? updatedLesson : l)
    })));
  }
  function deleteLesson(moduleId, lessonId) {
    setModules(modules.map((m) => m.id === moduleId ? {
      ...m,
      lessons: m.lessons.filter((l) => l.id !== lessonId)
    } : m));
    if (activeLessonId === lessonId) {
      setActiveLessonId(null);
    }
  }
  const activeLesson = modules.flatMap((m) => m.lessons).find((l) => l.id === activeLessonId) || null;
  async function saveCourse() {
    console.log("[CourseBuilder] saveCourse()", {
      routeCourseId: courseId,
      isNew,
      isTeacher,
      academyId,
      course,
      modulesCount: modules.length
    });
    if (!user || role !== "teacher") {
      console.error("[CourseBuilder] Not authorized to save", {
        user,
        role
      });
      alert("غير مصرح لك بحفظ هذا الكورس");
      return;
    }
    if (!academyId) {
      console.error("[CourseBuilder] Missing academyId; cannot save");
      alert("تعذر حفظ الكورس: لم يتم تحديد الأكاديمية");
      return;
    }
    if (!course.title.trim()) {
      alert("من فضلك أدخل عنوان الكورس");
      return;
    }
    setSaving(true);
    try {
      let savedCourseId = courseId;
      if (isNew) {
        const {
          data,
          error
        } = await supabase.from("courses").insert({
          academy_id: academyId,
          title: course.title.trim(),
          description: course.description ?? "",
          cover_image_url: course.cover_image_url || null,
          price: 0,
          sort_order: 0,
          is_published: false
        }).select("id").single();
        if (error) {
          console.error("[CourseBuilder] Failed to insert course", error);
          alert("فشل حفظ الكورس. راجع الـ Console للتفاصيل.");
          return;
        }
        savedCourseId = data.id;
      } else {
        const {
          error
        } = await supabase.from("courses").update({
          title: course.title.trim(),
          description: course.description ?? "",
          cover_image_url: course.cover_image_url || null
        }).eq("id", courseId);
        if (error) {
          console.error("[CourseBuilder] Failed to update course", error);
          alert("فشل تحديث الكورس. راجع الـ Console للتفاصيل.");
          return;
        }
      }
      const nextModules = [];
      const keptModuleIds = [];
      const keptLessonIds = [];
      for (let mi = 0; mi < modules.length; mi++) {
        const m = modules[mi];
        const sortOrder = mi;
        let moduleDbId = m.id;
        if (isTempId(m.id)) {
          const {
            data,
            error
          } = await supabase.from("modules").insert({
            course_id: savedCourseId,
            title: m.title,
            sort_order: sortOrder
          }).select("id").single();
          if (error) {
            console.error("[CourseBuilder] Failed to insert module", {
              module: m,
              error
            });
            alert("فشل حفظ وحدة. راجع الـ Console للتفاصيل.");
            return;
          }
          moduleDbId = data.id;
        } else {
          const {
            error
          } = await supabase.from("modules").update({
            title: m.title,
            sort_order: sortOrder
          }).eq("id", m.id).eq("course_id", savedCourseId);
          if (error) {
            console.error("[CourseBuilder] Failed to update module", {
              module: m,
              error
            });
            alert("فشل تحديث وحدة. راجع الـ Console للتفاصيل.");
            return;
          }
        }
        keptModuleIds.push(moduleDbId);
        const nextLessons = [];
        for (let li = 0; li < m.lessons.length; li++) {
          const l = m.lessons[li];
          const lessonSortOrder = li;
          let lessonDbId = l.id;
          if (isTempId(l.id)) {
            const {
              data,
              error
            } = await supabase.from("lessons").insert({
              module_id: moduleDbId,
              title: l.title,
              lesson_type: l.lesson_type,
              content: l.content ?? "",
              video_url: l.video_url || null,
              attachment_url: l.attachment_url || null,
              duration_minutes: 0,
              sort_order: lessonSortOrder
            }).select("id").single();
            if (error) {
              console.error("[CourseBuilder] Failed to insert lesson", {
                lesson: l,
                error
              });
              alert("فشل حفظ درس. راجع الـ Console للتفاصيل.");
              return;
            }
            lessonDbId = data.id;
          } else {
            const {
              error
            } = await supabase.from("lessons").update({
              title: l.title,
              lesson_type: l.lesson_type,
              content: l.content ?? "",
              video_url: l.video_url || null,
              attachment_url: l.attachment_url || null,
              sort_order: lessonSortOrder
            }).eq("id", l.id).eq("module_id", moduleDbId);
            if (error) {
              console.error("[CourseBuilder] Failed to update lesson", {
                lesson: l,
                error
              });
              alert("فشل تحديث درس. راجع الـ Console للتفاصيل.");
              return;
            }
          }
          keptLessonIds.push(lessonDbId);
          nextLessons.push({
            ...l,
            id: lessonDbId
          });
        }
        nextModules.push({
          ...m,
          id: moduleDbId,
          lessons: nextLessons
        });
      }
      if (!isNew) {
        const deletedLessonIds = initialLessonIds.filter((id) => !keptLessonIds.includes(id));
        if (deletedLessonIds.length) {
          const {
            error
          } = await supabase.from("lessons").delete().in("id", deletedLessonIds);
          if (error) {
            console.error("[CourseBuilder] Failed to delete lessons", {
              deletedLessonIds,
              error
            });
            alert("فشل حذف بعض الدروس. راجع الـ Console للتفاصيل.");
            return;
          }
        }
        const deletedModuleIds = initialModuleIds.filter((id) => !keptModuleIds.includes(id));
        if (deletedModuleIds.length) {
          const {
            error
          } = await supabase.from("modules").delete().in("id", deletedModuleIds);
          if (error) {
            console.error("[CourseBuilder] Failed to delete modules", {
              deletedModuleIds,
              error
            });
            alert("فشل حذف بعض الوحدات. راجع الـ Console للتفاصيل.");
            return;
          }
        }
      }
      setModules(nextModules);
      setInitialModuleIds(nextModules.map((m) => m.id));
      setInitialLessonIds(nextModules.flatMap((m) => m.lessons.map((l) => l.id)));
      alert("تم حفظ الكورس بنجاح");
      if (isNew) {
        navigate({
          to: "/dashboard/teacher/courses/$courseId",
          params: {
            courseId: savedCourseId
          },
          replace: true
        });
      } else {
        navigate({
          to: "/dashboard/teacher/courses"
        });
      }
    } catch (e) {
      console.error("[CourseBuilder] saveCourse crashed", e);
      alert("حدث خطأ غير متوقع أثناء الحفظ. راجع الـ Console للتفاصيل.");
    } finally {
      setSaving(false);
    }
  }
  if (loading) return null;
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (role !== "teacher") return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: isNew ? "إنشاء كورس" : "تعديل كورس", roleLabel: "Teacher", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/dashboard/teacher/courses"
      }), className: "flex items-center gap-2 text-sm hover:text-primary transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
        "العودة للكورسات"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-5 py-3 rounded-xl text-sm font-medium transition ${step === 1 ? "bg-primary text-white" : "bg-muted"}`, children: "1 - معلومات الكورس" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-5 py-3 rounded-xl text-sm font-medium transition ${step === 2 ? "bg-primary text-white" : "bg-muted"}`, children: "2 - المنهج" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-5 py-3 rounded-xl text-sm font-medium transition ${step === 3 ? "bg-primary text-white" : "bg-muted"}`, children: "3 - المعاينة والحفظ" })
      ] })
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-card border rounded-2xl p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-2 font-semibold", children: "عنوان الكورس" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: course.title, onChange: (e) => setCourse({
            ...course,
            title: e.target.value
          }), placeholder: "مثال: تعلم البرمجة من الصفر", className: "w-full border rounded-xl px-4 py-3 bg-background" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-2 font-semibold", children: "وصف الكورس" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 7, value: course.description, onChange: (e) => setCourse({
            ...course,
            description: e.target.value
          }), placeholder: "اكتب وصف الكورس...", className: "w-full border rounded-xl px-4 py-3 bg-background" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border rounded-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploadField, { label: "صورة الكورس", value: course.cover_image_url, onChange: (url) => setCourse({
        ...course,
        cover_image_url: url || ""
      }), folder: "courses/covers" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "px-6 py-3 rounded-xl bg-primary text-white font-medium", children: "التالي" }) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[360px_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-2xl p-4 h-fit sticky top-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addModule, className: "w-full py-3 rounded-xl bg-primary text-white flex items-center justify-center gap-2 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          "إضافة وحدة جديدة"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          modules.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed rounded-2xl p-8 text-center text-muted-foreground", children: "لا توجد وحدات بعد" }),
          modules.map((module, moduleIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-2xl p-4 bg-background/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: module.title, onChange: (e) => updateModuleTitle(module.id, e.target.value), className: "flex-1 border rounded-xl px-3 py-2 bg-background" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteModule(module.id), className: "size-9 rounded-xl border flex items-center justify-center text-red-500 hover:bg-red-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: module.lessons.map((lesson, lessonIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `border rounded-xl p-3 cursor-pointer transition ${activeLessonId === lesson.id ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`, onClick: () => setActiveLessonId(lesson.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                lesson.lesson_type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4 text-blue-500" }),
                lesson.lesson_type === "pdf" && /* @__PURE__ */ jsxRuntimeExports.jsx(FileType, { className: "size-4 text-red-500" }),
                lesson.lesson_type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm truncate", children: [
                  lessonIndex + 1,
                  " - ",
                  lesson.title
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                e.stopPropagation();
                deleteLesson(module.id, lesson.id);
              }, className: "text-red-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
            ] }) }, lesson.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: (node) => {
              if (module.id === openAddLessonForModuleId) {
                addLessonMenuRef.current = node;
              }
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenAddLessonForModuleId((prev) => prev === module.id ? null : module.id), className: "w-full border rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-muted/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                "إضافة درس"
              ] }),
              openAddLessonForModuleId === module.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-20 mt-2 w-full rounded-xl border bg-background shadow-lg overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setOpenAddLessonForModuleId(null);
                  addLesson(module.id, "video");
                }, className: "w-full px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4 text-blue-500" }),
                  "فيديو"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setOpenAddLessonForModuleId(null);
                  addLesson(module.id, "pdf");
                }, className: "w-full px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileType, { className: "size-4 text-red-500" }),
                  "PDF"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setOpenAddLessonForModuleId(null);
                  addLesson(module.id, "text");
                }, className: "w-full px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-primary" }),
                  "نص"
                ] })
              ] })
            ] })
          ] }, module.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border rounded-2xl p-6 min-h-[700px]", children: !activeLesson ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground", children: "اختر درس للتعديل" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "تعديل الدرس" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "قم بإضافة بيانات ومحتوى الدرس" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-2 font-semibold", children: "عنوان الدرس" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: activeLesson.title, onChange: (e) => updateLesson({
            ...activeLesson,
            title: e.target.value
          }), className: "w-full border rounded-xl px-4 py-3 bg-background" })
        ] }),
        activeLesson.lesson_type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-2 font-semibold", children: "رابط الفيديو" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: activeLesson.video_url, onChange: (e) => updateLesson({
            ...activeLesson,
            video_url: e.target.value
          }), placeholder: "https://youtube.com/...", className: "w-full border rounded-xl px-4 py-3 bg-background" })
        ] }),
        activeLesson.lesson_type === "pdf" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-2 font-semibold", children: "رابط ملف PDF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: activeLesson.attachment_url, onChange: (e) => updateLesson({
            ...activeLesson,
            attachment_url: e.target.value
          }), placeholder: "https://...", className: "w-full border rounded-xl px-4 py-3 bg-background" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-2 font-semibold", children: "المحتوى النصي" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 12, value: activeLesson.content, onChange: (e) => updateLesson({
            ...activeLesson,
            content: e.target.value
          }), placeholder: "اكتب محتوى الدرس...", className: "w-full border rounded-xl px-4 py-3 bg-background" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "px-6 py-3 rounded-xl border", children: "السابق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), className: "px-6 py-3 rounded-xl bg-primary text-white", children: "التالي" })
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-2xl p-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-2", children: "معاينة الكورس" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "راجع بيانات الكورس قبل الحفظ" })
      ] }),
      course.cover_image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: course.cover_image_url, alt: course.title, className: "w-full h-72 object-cover rounded-2xl border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold", children: course.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 leading-7", children: course.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: modules.map((module, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 px-5 py-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-lg", children: [
          "الوحدة ",
          index + 1,
          ": ",
          module.title
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          module.lessons.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "لا توجد دروس" }),
          module.lessons.map((lesson) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-2", children: lesson.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              lesson.lesson_type === "video" && "درس فيديو",
              lesson.lesson_type === "pdf" && "ملف PDF",
              lesson.lesson_type === "text" && "محتوى نصي"
            ] })
          ] }, lesson.id))
        ] })
      ] }, module.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "px-6 py-3 rounded-xl border", children: "السابق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: saveCourse, disabled: saving, className: "px-6 py-3 rounded-xl bg-primary text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
          saving ? "جاري الحفظ..." : "حفظ الكورس"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  CourseBuilderPage as component
};
