import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Video,
  FileText,
  FileType,
  ArrowRight,
  Save,
  BookOpen,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/teacher/courses/$courseId")({
  component: CourseBuilderPage,
});

type LessonType = "video" | "pdf" | "text";

interface Lesson {
  id: string;
  title: string;
  lesson_type: LessonType;
  video_url?: string;
  attachment_url?: string;
  content?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

function isTempId(id: string) {
  return id.startsWith("tmp_");
}

function CourseBuilderPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { courseId } = Route.useParams();

  const AUTOSAVE_KEY = `course_builder_${courseId}`;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [initialModuleIds, setInitialModuleIds] = useState<string[]>([]);
  const [initialLessonIds, setInitialLessonIds] = useState<string[]>([]);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    cover_image_url: "",
  });

  const [modules, setModules] = useState<Module[]>([]);

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const [openAddLessonForModuleId, setOpenAddLessonForModuleId] = useState<
    string | null
  >(null);
  const addLessonMenuRef = useRef<HTMLDivElement | null>(null);
  const autoSaveTimerRef = useRef<number | null>(null);

  const isNew = courseId === "new";
  const isTeacher = !!user && role === "teacher";

  // Auto-restore (localStorage). Keep before the Supabase load effect.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object") return;

      const data = parsed as {
        course?: {
          title?: unknown;
          description?: unknown;
          cover_image_url?: unknown;
        };
        modules?: unknown;
      };

      if (
        !data.course ||
        typeof data.course !== "object" ||
        !Array.isArray(data.modules)
      ) {
        return;
      }

      const nextCourse = {
        title: typeof data.course.title === "string" ? data.course.title : "",
        description:
          typeof data.course.description === "string"
            ? data.course.description
            : "",
        cover_image_url:
          typeof data.course.cover_image_url === "string"
            ? data.course.cover_image_url
            : "",
      };

      const nextModules = data.modules as Module[];
      setCourse(nextCourse);
      setModules(nextModules);
    } catch (e) {
      console.warn("[CourseBuilder] Autosave restore failed", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AUTOSAVE_KEY]);

  // Auto-save (localStorage) - debounced.
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(
          AUTOSAVE_KEY,
          JSON.stringify({
            course,
            modules,
          })
        );
      } catch (e) {
        console.warn("[CourseBuilder] Autosave write failed", e);
      }
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [AUTOSAVE_KEY, course, modules]);

  // Safety: force-save on refresh/tab close.
  useEffect(() => {
    function forceSave() {
      try {
        localStorage.setItem(
          AUTOSAVE_KEY,
          JSON.stringify({
            course,
            modules,
          })
        );
      } catch (e) {
        console.warn("[CourseBuilder] Autosave beforeunload write failed", e);
      }
    }

    window.addEventListener("beforeunload", forceSave);
    return () => window.removeEventListener("beforeunload", forceSave);
  }, [AUTOSAVE_KEY, course, modules]);

  useEffect(() => {
    if (!openAddLessonForModuleId) return;

    function onPointerDown(e: MouseEvent) {
      const node = addLessonMenuRef.current;
      if (!node) return;
      if (node.contains(e.target as Node)) return;
      setOpenAddLessonForModuleId(null);
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openAddLessonForModuleId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user || role !== "teacher") return;

      setLoadingCourse(true);
      try {
        const { data: aca, error: acaError } = await supabase
          .from("academies")
          .select("id")
          .eq("teacher_id", user.id)
          .maybeSingle();

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
          const hasDraft = localStorage.getItem(AUTOSAVE_KEY);
          if (hasDraft) {
            return;
          }
          // fresh builder state
          setCourse({ title: "", description: "", cover_image_url: "" });
          setModules([]);
          setInitialModuleIds([]);
          setInitialLessonIds([]);
          return;
        }

        const { data: courseRow, error: courseError } = await supabase
          .from("courses")
          .select("id, title, description, cover_image_url, academy_id")
          .eq("id", courseId)
          .maybeSingle();

        if (courseError) {
          console.error("[CourseBuilder] Failed to load course", courseError);
          return;
        }

        if (!courseRow) {
          console.error("[CourseBuilder] Course not found", { courseId });
          return;
        }

        if (courseRow.academy_id !== aca.id) {
          console.error("[CourseBuilder] Course not in teacher academy", {
            courseId,
            courseAcademyId: courseRow.academy_id,
            teacherAcademyId: aca.id,
          });
          navigate({ to: "/dashboard/teacher/courses" });
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
          cover_image_url: courseRow.cover_image_url ?? "",
        });

        const { data: moduleRows, error: moduleError } = await supabase
          .from("modules")
          .select("id, title, sort_order")
          .eq("course_id", courseId)
          .order("sort_order", { ascending: true });

        if (moduleError) {
          console.error("[CourseBuilder] Failed to load modules", moduleError);
          return;
        }

        const moduleIds = (moduleRows ?? []).map((m) => m.id);

        const { data: lessonRows, error: lessonError } = await supabase
          .from("lessons")
          .select(
            "id, module_id, title, lesson_type, content, video_url, attachment_url, sort_order"
          )
          .in("module_id", moduleIds.length ? moduleIds : ["00000000-0000-0000-0000-000000000000"])
          .order("sort_order", { ascending: true });

        if (lessonError) {
          console.error("[CourseBuilder] Failed to load lessons", lessonError);
          return;
        }

        const lessonsByModule = new Map<string, Lesson[]>();
        for (const row of lessonRows ?? []) {
          const lesson: Lesson = {
            id: row.id,
            title: row.title,
            lesson_type: row.lesson_type as LessonType,
            content: row.content ?? "",
            video_url: row.video_url ?? "",
            attachment_url: row.attachment_url ?? "",
          };
          const bucket = lessonsByModule.get(row.module_id) ?? [];
          bucket.push(lesson);
          lessonsByModule.set(row.module_id, bucket);
        }

        const nextModules: Module[] = (moduleRows ?? []).map((m) => ({
          id: m.id,
          title: m.title,
          lessons: lessonsByModule.get(m.id) ?? [],
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
    setModules([
      ...modules,
      {
        id: `tmp_${uid()}`,
        title: `وحدة ${modules.length + 1}`,
        lessons: [],
      },
    ]);
  }

  function deleteModule(moduleId: string) {
    setModules(modules.filter((m) => m.id !== moduleId));

    if (
      activeLesson &&
      modules
        .find((m) => m.id === moduleId)
        ?.lessons.some((l) => l.id === activeLesson.id)
    ) {
      setActiveLessonId(null);
    }
  }

  function updateModuleTitle(moduleId: string, title: string) {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              title,
            }
          : m
      )
    );
  }

  function addLesson(moduleId: string, type: LessonType) {
    const lesson: Lesson = {
      id: `tmp_${uid()}`,
      title: "درس جديد",
      lesson_type: type,
      content: "",
      video_url: "",
      attachment_url: "",
    };

    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [...m.lessons, lesson],
            }
          : m
      )
    );

    setActiveLessonId(lesson.id);
  }

  function updateLesson(updatedLesson: Lesson) {
    setModules(
      modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === updatedLesson.id ? updatedLesson : l
        ),
      }))
    );
  }

  function deleteLesson(moduleId: string, lessonId: string) {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.filter((l) => l.id !== lessonId),
            }
          : m
      )
    );

    if (activeLessonId === lessonId) {
      setActiveLessonId(null);
    }
  }

  const activeLesson =
    modules
      .flatMap((m) => m.lessons)
      .find((l) => l.id === activeLessonId) || null;

  async function saveCourse() {
    console.log("[CourseBuilder] saveCourse()", {
      routeCourseId: courseId,
      isNew,
      isTeacher,
      academyId,
      course,
      modulesCount: modules.length,
    });

    if (!user || role !== "teacher") {
      console.error("[CourseBuilder] Not authorized to save", { user, role });
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
      // 1) Upsert course
      let savedCourseId = courseId;
      if (isNew) {
        const { data, error } = await supabase
          .from("courses")
          .insert({
            academy_id: academyId,
            title: course.title.trim(),
            description: course.description ?? "",
            cover_image_url: course.cover_image_url || null,
            price: 0,
            sort_order: 0,
            is_published: false,
          })
          .select("id")
          .single();

        if (error) {
          console.error("[CourseBuilder] Failed to insert course", error);
          alert("فشل حفظ الكورس. راجع الـ Console للتفاصيل.");
          return;
        }

        savedCourseId = data.id;
      } else {
        const { error } = await supabase
          .from("courses")
          .update({
            title: course.title.trim(),
            description: course.description ?? "",
            cover_image_url: course.cover_image_url || null,
          })
          .eq("id", courseId);

        if (error) {
          console.error("[CourseBuilder] Failed to update course", error);
          alert("فشل تحديث الكورس. راجع الـ Console للتفاصيل.");
          return;
        }
      }

      // 2) Upsert modules + lessons
      const nextModules: Module[] = [];
      const keptModuleIds: string[] = [];
      const keptLessonIds: string[] = [];

      for (let mi = 0; mi < modules.length; mi++) {
        const m = modules[mi];
        const sortOrder = mi;

        let moduleDbId = m.id;
        if (isTempId(m.id)) {
          const { data, error } = await supabase
            .from("modules")
            .insert({
              course_id: savedCourseId,
              title: m.title,
              sort_order: sortOrder,
            })
            .select("id")
            .single();

          if (error) {
            console.error("[CourseBuilder] Failed to insert module", { module: m, error });
            alert("فشل حفظ وحدة. راجع الـ Console للتفاصيل.");
            return;
          }
          moduleDbId = data.id;
        } else {
          const { error } = await supabase
            .from("modules")
            .update({
              title: m.title,
              sort_order: sortOrder,
            })
            .eq("id", m.id)
            .eq("course_id", savedCourseId);

          if (error) {
            console.error("[CourseBuilder] Failed to update module", { module: m, error });
            alert("فشل تحديث وحدة. راجع الـ Console للتفاصيل.");
            return;
          }
        }

        keptModuleIds.push(moduleDbId);

        const nextLessons: Lesson[] = [];
        for (let li = 0; li < m.lessons.length; li++) {
          const l = m.lessons[li];
          const lessonSortOrder = li;
          let lessonDbId = l.id;

          if (isTempId(l.id)) {
            const { data, error } = await supabase
              .from("lessons")
              .insert({
                module_id: moduleDbId,
                title: l.title,
                lesson_type: l.lesson_type,
                content: l.content ?? "",
                video_url: l.video_url || null,
                attachment_url: l.attachment_url || null,
                duration_minutes: 0,
                sort_order: lessonSortOrder,
              })
              .select("id")
              .single();

            if (error) {
              console.error("[CourseBuilder] Failed to insert lesson", { lesson: l, error });
              alert("فشل حفظ درس. راجع الـ Console للتفاصيل.");
              return;
            }

            lessonDbId = data.id;
          } else {
            const { error } = await supabase
              .from("lessons")
              .update({
                title: l.title,
                lesson_type: l.lesson_type,
                content: l.content ?? "",
                video_url: l.video_url || null,
                attachment_url: l.attachment_url || null,
                sort_order: lessonSortOrder,
              })
              .eq("id", l.id)
              .eq("module_id", moduleDbId);

            if (error) {
              console.error("[CourseBuilder] Failed to update lesson", { lesson: l, error });
              alert("فشل تحديث درس. راجع الـ Console للتفاصيل.");
              return;
            }
          }

          keptLessonIds.push(lessonDbId);
          nextLessons.push({ ...l, id: lessonDbId });
        }

        nextModules.push({ ...m, id: moduleDbId, lessons: nextLessons });
      }

      // 3) Deletes (only for existing course)
      if (!isNew) {
        const deletedLessonIds = initialLessonIds.filter((id) => !keptLessonIds.includes(id));
        if (deletedLessonIds.length) {
          const { error } = await supabase.from("lessons").delete().in("id", deletedLessonIds);
          if (error) {
            console.error("[CourseBuilder] Failed to delete lessons", { deletedLessonIds, error });
            alert("فشل حذف بعض الدروس. راجع الـ Console للتفاصيل.");
            return;
          }
        }

        const deletedModuleIds = initialModuleIds.filter((id) => !keptModuleIds.includes(id));
        if (deletedModuleIds.length) {
          const { error } = await supabase.from("modules").delete().in("id", deletedModuleIds);
          if (error) {
            console.error("[CourseBuilder] Failed to delete modules", { deletedModuleIds, error });
            alert("فشل حذف بعض الوحدات. راجع الـ Console للتفاصيل.");
            return;
          }
        }
      }

      // 4) Sync local state IDs (so subsequent edits hit UPDATEs)
      setModules(nextModules);
      setInitialModuleIds(nextModules.map((m) => m.id));
      setInitialLessonIds(nextModules.flatMap((m) => m.lessons.map((l) => l.id)));

      alert("تم حفظ الكورس بنجاح");

      // If it was a new course, replace URL with real id.
      if (isNew) {
        navigate({
          to: "/dashboard/teacher/courses/$courseId",
          params: { courseId: savedCourseId },
          replace: true,
        });
      } else {
        navigate({ to: "/dashboard/teacher/courses" });
      }
    } catch (e) {
      console.error("[CourseBuilder] saveCourse crashed", e);
      alert("حدث خطأ غير متوقع أثناء الحفظ. راجع الـ Console للتفاصيل.");
    } finally {
      setSaving(false);
    }
  }

  // Auth / loading guards AFTER hooks (stable hook order).
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role !== "teacher") return <Navigate to="/dashboard" />;

  return (
    <DashboardShell title={isNew ? "إنشاء كورس" : "تعديل كورس"} roleLabel="Teacher">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">

          <button
            onClick={() =>
              navigate({
                to: "/dashboard/teacher/courses",
              })
            }
            className="flex items-center gap-2 text-sm hover:text-primary transition"
          >
            <ArrowRight className="size-4" />
            العودة للكورسات
          </button>

          <div className="flex flex-wrap items-center gap-3">

            <div
              className={`px-5 py-3 rounded-xl text-sm font-medium transition ${
                step === 1
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              1 - معلومات الكورس
            </div>

            <div
              className={`px-5 py-3 rounded-xl text-sm font-medium transition ${
                step === 2
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              2 - المنهج
            </div>

            <div
              className={`px-5 py-3 rounded-xl text-sm font-medium transition ${
                step === 3
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              3 - المعاينة والحفظ
            </div>

          </div>

        </div>

        {/* STEP 1 */}

        {step === 1 && (
          <div className="grid lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 bg-card border rounded-2xl p-6 space-y-5">

              <div>
                <label className="block mb-2 font-semibold">
                  عنوان الكورس
                </label>

                <input
                  value={course.title}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      title: e.target.value,
                    })
                  }
                  placeholder="مثال: تعلم البرمجة من الصفر"
                  className="w-full border rounded-xl px-4 py-3 bg-background"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  وصف الكورس
                </label>

                <textarea
                  rows={7}
                  value={course.description}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      description: e.target.value,
                    })
                  }
                  placeholder="اكتب وصف الكورس..."
                  className="w-full border rounded-xl px-4 py-3 bg-background"
                />
              </div>

            </div>

            <div className="bg-card border rounded-2xl p-6">

              <ImageUploadField
                label="صورة الكورس"
                value={course.cover_image_url}
                onChange={(url) =>
                  setCourse({
                    ...course,
                    cover_image_url: url || "",
                  })
                }
                folder="courses/covers"
              />

            </div>

            <div className="lg:col-span-3 flex justify-end">

              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-primary text-white font-medium"
              >
                التالي
              </button>

            </div>

          </div>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6">

            {/* SIDEBAR */}

            <div className="bg-card border rounded-2xl p-4 h-fit sticky top-4">

              <button
                onClick={addModule}
                className="w-full py-3 rounded-xl bg-primary text-white flex items-center justify-center gap-2 mb-5"
              >
                <Plus className="size-4" />
                إضافة وحدة جديدة
              </button>

              <div className="space-y-4">

                {modules.length === 0 && (
                  <div className="border border-dashed rounded-2xl p-8 text-center text-muted-foreground">
                    لا توجد وحدات بعد
                  </div>
                )}

                {modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="border rounded-2xl p-4 bg-background/40"
                  >

                    {/* module header */}

                    <div className="flex items-center gap-2 mb-4">

                      <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                        <BookOpen className="size-4" />
                      </div>

                      <input
                        value={module.title}
                        onChange={(e) =>
                          updateModuleTitle(
                            module.id,
                            e.target.value
                          )
                        }
                        className="flex-1 border rounded-xl px-3 py-2 bg-background"
                      />

                      <button
                        onClick={() => deleteModule(module.id)}
                        className="size-9 rounded-xl border flex items-center justify-center text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </button>

                    </div>

                    {/* lessons */}

                    <div className="space-y-2 mb-4">

                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className={`border rounded-xl p-3 cursor-pointer transition ${
                            activeLessonId === lesson.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/40"
                          }`}
                          onClick={() =>
                            setActiveLessonId(lesson.id)
                          }
                        >

                          <div className="flex items-center justify-between gap-2">

                            <div className="flex items-center gap-2 flex-1 min-w-0">

                              {lesson.lesson_type === "video" && (
                                <Video className="size-4 text-blue-500" />
                              )}

                              {lesson.lesson_type === "pdf" && (
                                <FileType className="size-4 text-red-500" />
                              )}

                              {lesson.lesson_type === "text" && (
                                <FileText className="size-4 text-primary" />
                              )}

                              <span className="text-sm truncate">
                                {lessonIndex + 1} - {lesson.title}
                              </span>

                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                deleteLesson(
                                  module.id,
                                  lesson.id
                                );
                              }}
                              className="text-red-500"
                            >
                              <Trash2 className="size-4" />
                            </button>

                          </div>

                        </div>
                      ))}

                    </div>

                    {/* add lesson */}

                    <div
                      className="relative"
                      ref={(node) => {
                        if (module.id === openAddLessonForModuleId) {
                          addLessonMenuRef.current = node;
                        }
                      }}
                    >
                      <button
                        onClick={() =>
                          setOpenAddLessonForModuleId((prev) =>
                            prev === module.id ? null : module.id
                          )
                        }
                        className="w-full border rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-muted/50"
                      >
                        <Plus className="size-4" />
                        إضافة درس
                      </button>

                      {openAddLessonForModuleId === module.id && (
                        <div className="absolute z-20 mt-2 w-full rounded-xl border bg-background shadow-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenAddLessonForModuleId(null);
                              addLesson(module.id, "video");
                            }}
                            className="w-full px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50"
                          >
                            <Video className="size-4 text-blue-500" />
                            فيديو
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenAddLessonForModuleId(null);
                              addLesson(module.id, "pdf");
                            }}
                            className="w-full px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50"
                          >
                            <FileType className="size-4 text-red-500" />
                            PDF
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenAddLessonForModuleId(null);
                              addLesson(module.id, "text");
                            }}
                            className="w-full px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50"
                          >
                            <FileText className="size-4 text-primary" />
                            نص
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* EDITOR */}

            <div className="bg-card border rounded-2xl p-6 min-h-[700px]">

              {!activeLesson ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  اختر درس للتعديل
                </div>
              ) : (
                <div className="space-y-6">

                  <div className="border-b pb-4">

                    <h2 className="text-2xl font-bold">
                      تعديل الدرس
                    </h2>

                    <p className="text-muted-foreground text-sm mt-1">
                      قم بإضافة بيانات ومحتوى الدرس
                    </p>

                  </div>

                  <div>

                    <label className="block mb-2 font-semibold">
                      عنوان الدرس
                    </label>

                    <input
                      value={activeLesson.title}
                      onChange={(e) =>
                        updateLesson({
                          ...activeLesson,
                          title: e.target.value,
                        })
                      }
                      className="w-full border rounded-xl px-4 py-3 bg-background"
                    />

                  </div>

                  {activeLesson.lesson_type === "video" && (
                    <div>

                      <label className="block mb-2 font-semibold">
                        رابط الفيديو
                      </label>

                      <input
                        value={activeLesson.video_url}
                        onChange={(e) =>
                          updateLesson({
                            ...activeLesson,
                            video_url: e.target.value,
                          })
                        }
                        placeholder="https://youtube.com/..."
                        className="w-full border rounded-xl px-4 py-3 bg-background"
                      />

                    </div>
                  )}

                  {activeLesson.lesson_type === "pdf" && (
                    <div>

                      <label className="block mb-2 font-semibold">
                        رابط ملف PDF
                      </label>

                      <input
                        value={activeLesson.attachment_url}
                        onChange={(e) =>
                          updateLesson({
                            ...activeLesson,
                            attachment_url: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full border rounded-xl px-4 py-3 bg-background"
                      />

                    </div>
                  )}

                  <div>

                    <label className="block mb-2 font-semibold">
                      المحتوى النصي
                    </label>

                    <textarea
                      rows={12}
                      value={activeLesson.content}
                      onChange={(e) =>
                        updateLesson({
                          ...activeLesson,
                          content: e.target.value,
                        })
                      }
                      placeholder="اكتب محتوى الدرس..."
                      className="w-full border rounded-xl px-4 py-3 bg-background"
                    />

                  </div>

                </div>
              )}

            </div>

            {/* buttons */}

            <div className="lg:col-span-2 flex justify-between">

              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border"
              >
                السابق
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-primary text-white"
              >
                التالي
              </button>

            </div>

          </div>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <div className="bg-card border rounded-2xl p-8 space-y-8">

            <div>

              <h2 className="text-3xl font-bold mb-2">
                معاينة الكورس
              </h2>

              <p className="text-muted-foreground">
                راجع بيانات الكورس قبل الحفظ
              </p>

            </div>

            {course.cover_image_url && (
              <img
                src={course.cover_image_url}
                alt={course.title}
                className="w-full h-72 object-cover rounded-2xl border"
              />
            )}

            <div>

              <h3 className="text-2xl font-bold">
                {course.title}
              </h3>

              <p className="text-muted-foreground mt-3 leading-7">
                {course.description}
              </p>

            </div>

            <div className="space-y-5">

              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="border rounded-2xl overflow-hidden"
                >

                  <div className="bg-muted/40 px-5 py-4 border-b">

                    <h4 className="font-bold text-lg">
                      الوحدة {index + 1}: {module.title}
                    </h4>

                  </div>

                  <div className="p-4 space-y-3">

                    {module.lessons.length === 0 && (
                      <div className="text-muted-foreground text-sm">
                        لا توجد دروس
                      </div>
                    )}

                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border rounded-xl p-4"
                      >

                        <div className="font-medium mb-2">
                          {lesson.title}
                        </div>

                        <div className="text-sm text-muted-foreground">

                          {lesson.lesson_type === "video" &&
                            "درس فيديو"}

                          {lesson.lesson_type === "pdf" &&
                            "ملف PDF"}

                          {lesson.lesson_type === "text" &&
                            "محتوى نصي"}

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              ))}

            </div>

            <div className="flex justify-between">

              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl border"
              >
                السابق
              </button>

              <button
                onClick={saveCourse}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-primary text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="size-4" />
                {saving ? "جاري الحفظ..." : "حفظ الكورس"}
              </button>

            </div>

          </div>
        )}

      </div>
    </DashboardShell>
  );
}