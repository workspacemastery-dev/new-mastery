import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  Loader2,
  ArrowRight,
  PlayCircle,
  FileText,
  Video,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/student/courses/$courseId")({
  head: () => ({
    meta: [{ title: "محتوى الكورس — EduVerse" }],
  }),
  component: StudentCoursePage,
});

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string | null;
  duration_minutes: number;
  module_id: string;
  sort_order?: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  sort_order?: number;
}

type CourseContentPayload = {
  course?: Course | null;
  modules?: unknown;
  lessons?: unknown;
};

function normalizeCourseContent(payload: unknown): {
  course: Course | null;
  modules: Module[];
} {
  const p = (payload ?? {}) as CourseContentPayload;

  const course = (p.course ?? null) as Course | null;

  const rawModules = Array.isArray(p.modules)
    ? (p.modules as any[])
    : [];

  const rawLessons = Array.isArray(p.lessons)
    ? (p.lessons as any[])
    : [];

  const lessonsByModule = new Map<string, Lesson[]>();

  for (const row of rawLessons) {
    if (!row?.id) continue;

    const moduleId = String(
      row.module_id ??
      row.course_module_id ??
      ""
    );

    if (!moduleId) continue;

    const lesson: Lesson = {
      id: String(row.id),
      title: String(row.title ?? ""),
      content: String(row.content ?? ""),
      video_url: row.video_url
        ? String(row.video_url)
        : null,
      duration_minutes: Number(
        row.duration_minutes ?? 0
      ),
      module_id: moduleId,
      sort_order:
        row.sort_order == null
          ? undefined
          : Number(row.sort_order),
    };

    const bucket =
      lessonsByModule.get(moduleId) ?? [];

    bucket.push(lesson);

    lessonsByModule.set(moduleId, bucket);
  }

  const modules: Module[] = rawModules
    .filter((m) => m?.id)
    .map((m) => {
      const moduleId = String(m.id);

      // دعم جميع أشكال العلاقات القادمة من Supabase
      const nestedLessons =
        Array.isArray(m.lessons)
          ? (m.lessons as any[])
          : Array.isArray(m.course_lessons)
          ? (m.course_lessons as any[])
          : Array.isArray(m.lessons_data)
          ? (m.lessons_data as any[])
          : [];

      const lessons: Lesson[] =
        nestedLessons.length > 0
          ? nestedLessons
              .filter((l) => l?.id)
              .map((l) => ({
                id: String(l.id),

                title: String(
                  l.title ?? ""
                ),

                content: String(
                  l.content ?? ""
                ),

                video_url: l.video_url
                  ? String(l.video_url)
                  : null,

                duration_minutes: Number(
                  l.duration_minutes ?? 0
                ),

                module_id: String(
                  l.module_id ??
                  l.course_module_id ??
                  moduleId
                ),

                sort_order:
                  l.sort_order == null
                    ? undefined
                    : Number(
                        l.sort_order
                      ),
              }))
          : lessonsByModule.get(moduleId) ??
            [];

      lessons.sort(
        (a, b) =>
          (a.sort_order ?? 0) -
          (b.sort_order ?? 0)
      );

      return {
        id: moduleId,

        title: String(
          m.title ?? ""
        ),

        sort_order:
          m.sort_order == null
            ? undefined
            : Number(m.sort_order),

        lessons,
      };
    })
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) -
        (b.sort_order ?? 0)
    );

  return {
    course,
    modules,
  };
}

function StudentCoursePage() {
  const { session, loading } =
    useStudentAuth();

  const { courseId } =
    Route.useParams();

  const [course, setCourse] =
    useState<Course | null>(null);

  const [modules, setModules] =
    useState<Module[]>([]);

  const [
    activeModuleIndex,
    setActiveModuleIndex,
  ] = useState(0);

  const [
    activeLessonId,
    setActiveLessonId,
  ] = useState<string | null>(
    null
  );

  const [loadingData, setLoadingData] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    void (async () => {
      try {
        setLoadingData(true);
        setError(null);

        const { data, error } =
          await supabase.rpc(
            "student_get_course_content",
            {
              _token: session.token,
              _course_id: courseId,
            }
          );

        console.log(
          "student_get_course_content =>",
          data
        );

        console.log(
          "FIRST MODULE =>",
          data?.modules?.[0]
        );

        if (error) {
          console.error(error);

          setError(error.message);

          setCourse(null);

          setModules([]);

          return;
        }

        const normalized =
          normalizeCourseContent(data);

        console.log(
          "NORMALIZED =>",
          normalized
        );

        setCourse(normalized.course);

        setModules(normalized.modules);

        const firstModuleIndex =
          normalized.modules.findIndex(
            (m) =>
              m.lessons.length > 0
          );

        const safeIndex =
          firstModuleIndex === -1
            ? 0
            : firstModuleIndex;

        setActiveModuleIndex(
          safeIndex
        );

        const firstLesson =
          normalized.modules[
            safeIndex
          ]?.lessons?.[0];

        setActiveLessonId(
          firstLesson?.id ?? null
        );
      } catch (err) {
        console.error(err);

        setError(
          "حدث خطأ أثناء تحميل الكورس"
        );
      } finally {
        setLoadingData(false);
      }
    })();
  }, [session, courseId]);

  const activeModule =
    modules[activeModuleIndex] ??
    null;

  useEffect(() => {
    if (!activeModule) return;

    const firstLesson =
      activeModule.lessons?.[0];

    setActiveLessonId(
      firstLesson?.id ?? null
    );
  }, [activeModule?.id]);

  const activeLesson =
    useMemo(() => {
      if (!activeModule) return null;

      return (
        activeModule.lessons.find(
          (l) =>
            l.id === activeLessonId
        ) ??
        activeModule.lessons[0]
      );
    }, [
      activeModule,
      activeLessonId,
    ]);

  const totalLessons =
    modules.reduce(
      (acc, module) =>
        acc + module.lessons.length,
      0
    );

  if (loading || loadingData) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardShell
      title={
        course?.title ??
        "الكورس"
      }
      roleLabel="Student"
    >
      <div className="space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-4">

          <Link
            to="/dashboard/student/courses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowRight className="size-4" />
            الرجوع للكورسات
          </Link>

          <div className="text-sm text-muted-foreground">
            عدد الوحدات:
            {" "}
            {modules.length}
            {" "}
            —
            {" "}
            عدد الدروس:
            {" "}
            {totalLessons}
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-3xl p-6">
          <div className="flex items-start gap-4">

            <div className="size-14 rounded-2xl bg-primary/15 text-primary grid place-items-center shrink-0">
              <BookOpen className="size-7" />
            </div>

            <div className="flex-1">

              <h1 className="text-3xl font-bold mb-2">
                {course?.title}
              </h1>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {course?.description ||
                  "لا يوجد وصف لهذا الكورس"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!course ? (
          <div className="bg-card border border-border/60 rounded-2xl p-12 text-center text-muted-foreground">
            الكورس غير متاح حالياً.
          </div>
        ) : (
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">

            <aside className="bg-card border border-border/60 rounded-3xl p-4 h-fit sticky top-4">

              <h3 className="font-bold mb-4">
                وحدات الكورس
              </h3>

              <div className="space-y-3">

                {modules.map(
                  (
                    module,
                    index
                  ) => {
                    const isActive =
                      index ===
                      activeModuleIndex;

                    return (
                      <div
                        key={
                          module.id
                        }
                        className={`rounded-2xl border transition overflow-hidden ${
                          isActive
                            ? "border-primary bg-primary/5"
                            : "border-border/60"
                        }`}
                      >

                        <button
                          onClick={() =>
                            setActiveModuleIndex(
                              index
                            )
                          }
                          className="w-full p-4 text-right"
                        >
                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <div className="font-semibold text-sm">
                                الوحدة{" "}
                                {index + 1}
                              </div>

                              <div className="text-sm text-muted-foreground mt-1">
                                {
                                  module.title
                                }
                              </div>
                            </div>

                            <div className="text-xs bg-muted px-2 py-1 rounded-lg">
                              {
                                module.lessons
                                  .length
                              }
                            </div>
                          </div>
                        </button>

                        {isActive && (
                          <div className="border-t border-border/60 p-2 space-y-1">

                            {module.lessons
                              .length ===
                            0 ? (
                              <div className="text-xs text-muted-foreground p-3 text-center">
                                لا توجد
                                دروس
                              </div>
                            ) : (
                              module.lessons.map(
                                (
                                  lesson,
                                  lessonIndex
                                ) => {
                                  const selected =
                                    activeLesson?.id ===
                                    lesson.id;

                                  return (
                                    <button
                                      key={
                                        lesson.id
                                      }
                                      onClick={() =>
                                        setActiveLessonId(
                                          lesson.id
                                        )
                                      }
                                      className={`w-full flex items-center gap-2 text-right rounded-xl px-3 py-2 transition ${
                                        selected
                                          ? "bg-primary text-primary-foreground"
                                          : "hover:bg-muted"
                                      }`}
                                    >

                                      {lesson.video_url ? (
                                        <Video className="size-4 shrink-0" />
                                      ) : (
                                        <FileText className="size-4 shrink-0" />
                                      )}

                                      <div className="flex-1 overflow-hidden">
                                        <div className="truncate text-xs font-medium">
                                          {lessonIndex + 1}
                                          .
                                          {" "}
                                          {
                                            lesson.title
                                          }
                                        </div>
                                      </div>

                                      {selected && (
                                        <CheckCircle2 className="size-4 shrink-0" />
                                      )}
                                    </button>
                                  );
                                }
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </aside>

            <div className="space-y-4">

              <div className="bg-card border border-border/60 rounded-2xl p-4">

                <div className="text-xs text-muted-foreground mb-1">
                  الوحدة الحالية
                </div>

                <div className="text-xl font-bold">
                  {activeModule?.title ??
                    "لا توجد وحدات"}
                </div>
              </div>

              {!activeLesson ? (
                <div className="bg-card border border-border/60 rounded-3xl p-16 text-center text-muted-foreground">
                  لا توجد دروس داخل هذه الوحدة.
                </div>
              ) : (
                <div className="bg-card border border-border/60 rounded-3xl overflow-hidden">

                  {activeLesson.video_url ? (
                    <VideoEmbed
                      url={
                        activeLesson.video_url
                      }
                    />
                  ) : (
                    <div className="aspect-video bg-black/40 grid place-items-center">
                      <PlayCircle className="size-16 text-white/40" />
                    </div>
                  )}

                  <div className="p-6">

                    <div className="flex items-center justify-between gap-4 flex-wrap mb-5">

                      <div>

                        <div className="text-xs text-muted-foreground mb-1">
                          الدرس الحالي
                        </div>

                        <h2 className="text-2xl font-bold">
                          {
                            activeLesson.title
                          }
                        </h2>
                      </div>

                      {activeLesson.duration_minutes >
                        0 && (
                        <div className="bg-muted rounded-xl px-3 py-2 text-sm">
                          ⏱{" "}
                          {
                            activeLesson.duration_minutes
                          }{" "}
                          دقيقة
                        </div>
                      )}
                    </div>

                    <div className="prose prose-invert max-w-none text-sm leading-8 whitespace-pre-wrap">
                      {activeLesson.content ||
                        "لا يوجد محتوى نصي لهذا الدرس."}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">

                <button
                  onClick={() =>
                    setActiveModuleIndex(
                      (prev) =>
                        Math.max(
                          prev - 1,
                          0
                        )
                    )
                  }
                  disabled={
                    activeModuleIndex ===
                    0
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition"
                >
                  <ChevronRight className="size-4" />
                  السابق
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-center">

                  {modules.map(
                    (
                      m,
                      index
                    ) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setActiveModuleIndex(
                            index
                          )
                        }
                        className={`size-10 rounded-xl text-sm font-bold transition ${
                          index ===
                          activeModuleIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border hover:bg-muted"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setActiveModuleIndex(
                      (prev) =>
                        Math.min(
                          prev + 1,
                          modules.length -
                            1
                        )
                    )
                  }
                  disabled={
                    activeModuleIndex >=
                    modules.length - 1
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition"
                >
                  التالي
                  <ChevronLeft className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function VideoEmbed({
  url,
}: {
  url: string;
}) {
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?\s]+)/
  );

  if (ytMatch) {
    return (
      <div className="aspect-video">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="lesson-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const vimMatch = url.match(
    /vimeo\.com\/(\d+)/
  );

  if (vimMatch) {
    return (
      <div className="aspect-video">
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${vimMatch[1]}`}
          title="lesson-video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      controls
      className="w-full aspect-video bg-black"
    >
      <source src={url} />
    </video>
  );
}