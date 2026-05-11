import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  BookOpen,
  ArrowLeft,
  Loader2,
  Layers3,
} from "lucide-react";

import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";

import {
  PageContainer,
  PageHeader,
} from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute(
  "/dashboard/student/courses/"
)({
  head: () => ({
    meta: [{ title: "كورساتي — EduVerse" }],
  }),
  component: StudentCoursesList,
});

interface CourseRow {
  id: string;
  title: string;
  description: string;
}

function StudentCoursesList() {
  const { session } = useStudentAuth();

  const [courses, setCourses] = useState<
    CourseRow[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!session) return;

    void (async () => {
      try {
        setLoading(true);

        const { data } = await supabase.rpc(
          "student_get_courses",
          {
            _token: session.token,
          }
        );

        setCourses(
          ((data ?? []) as unknown) as CourseRow[]
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  return (
    <PageContainer>

      <PageHeader
        title="كورساتي"
        description="جميع الكورسات المتاحة لك"
      />

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-3xl p-14 text-center">

          <BookOpen className="size-14 mx-auto mb-4 text-muted-foreground opacity-40" />

          <h3 className="font-bold mb-2">
            لا توجد كورسات بعد
          </h3>

          <p className="text-sm text-muted-foreground">
            لم يقم المعلم بنشر أي كورسات حالياً.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {courses.map((course) => (
            <Link
              key={course.id}
              to="/dashboard/student/courses/$courseId"
              params={{
                courseId: course.id,
              }}
              className="group bg-card border border-border/60 rounded-3xl p-5 hover:border-primary/40 hover:-translate-y-1 transition"
            >

              <div className="flex items-start justify-between gap-4 mb-4">

                <div className="size-14 rounded-2xl bg-primary/15 text-primary grid place-items-center">
                  <BookOpen className="size-7" />
                </div>

                <div className="text-xs bg-muted rounded-xl px-3 py-1">
                  كورس
                </div>
              </div>

              <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition">
                {course.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-3 leading-6 mb-5">
                {course.description ||
                  "لا يوجد وصف لهذا الكورس"}
              </p>

              <div className="flex items-center justify-between">

                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers3 className="size-4" />
                  محتوى الكورس
                </div>

                <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                  الدخول للكورس
                  <ArrowLeft className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}