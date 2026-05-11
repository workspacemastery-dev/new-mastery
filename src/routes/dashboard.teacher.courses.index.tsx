import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, BookOpen, Eye, EyeOff, Trash2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

import {
  PageContainer,
  PageHeader,
} from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute(
  "/dashboard/teacher/courses/"
)({
  component: TeacherCoursesPage,
});

interface Course {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

function TeacherCoursesPage() {
  const { user, role } = useAuth();

  const navigate = useNavigate();

  const [academyId, setAcademyId] =
    useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user || role !== "teacher") return;

    loadAcademy(user.id);
  }, [user, role]);

  async function loadAcademy(teacherId: string) {
    const { data } = await supabase
      .from("academies")
      .select("id")
      .eq("teacher_id", teacherId)
      .single();

    if (!data) return;

    setAcademyId(data.id);

    loadCourses(data.id);
  }

  async function loadCourses(aId: string) {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("academy_id", aId)
      .order("created_at", {
        ascending: false,
      });

    setCourses(data || []);
  }

  function handleCreate() {
    navigate({
      to: "/dashboard/teacher/courses/$courseId",
      params: {
        courseId: "new",
      },
    });
  }

  async function togglePublish(course: Course) {
    await supabase
      .from("courses")
      .update({
        is_published: !course.is_published,
      })
      .eq("id", course.id);

    if (academyId) {
      loadCourses(academyId);
    }
  }

  async function deleteCourse(id: string) {
    const ok = confirm(
      "هل أنت متأكد من حذف الكورس ؟"
    );

    if (!ok) return;

    await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (academyId) {
      loadCourses(academyId);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="إدارة الكورسات"
        description="إدارة جميع الكورسات الخاصة بك"
        actions={
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white"
          >
            <Plus className="size-4" />
            كورس جديد
          </button>
        }
      />

      {courses.length === 0 ? (
        <div className="bg-card border rounded-2xl p-10 text-center">
          <BookOpen className="size-12 mx-auto mb-4 opacity-50" />

          <p className="text-muted-foreground">
            لا يوجد كورسات بعد
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-card border rounded-2xl p-5"
            >

              <div className="flex items-center justify-between mb-4">

                <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <BookOpen className="size-5" />
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    course.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {course.is_published
                    ? "منشور"
                    : "مسودة"}
                </span>

              </div>

              <h3 className="font-bold mb-2">
                {course.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
                {course.description || "—"}
              </p>

              <div className="flex items-center gap-2">

                <Link
                  to="/dashboard/teacher/courses/$courseId"
                  params={{
                    courseId: course.id,
                  }}
                  className="flex-1 text-center border rounded-lg py-2"
                >
                  إدارة
                </Link>

                <button
                  onClick={() =>
                    togglePublish(course)
                  }
                  className="size-10 border rounded-lg flex items-center justify-center"
                >
                  {course.is_published ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>

                <button
                  onClick={() =>
                    deleteCourse(course.id)
                  }
                  className="size-10 border rounded-lg flex items-center justify-center text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </PageContainer>
  );
}