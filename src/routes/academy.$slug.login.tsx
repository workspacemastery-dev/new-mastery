import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Users, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAcademyStyle } from "@/lib/academy-styles";
import type { Academy } from "@/lib/academies";
import { StudentLoginForm, TeacherLoginForm } from "@/components/auth/AcademyLoginForms";

export const Route = createFileRoute("/academy/$slug/login")({
  validateSearch: (search) => ({
    tab: search.tab === "teacher" ? "teacher" : "student",
  }),
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("academies")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { academy: data as Academy };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `دخول ${loaderData.academy.name} — EduVerse` }]
      : [],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">تعذّر فتح صفحة الدخول</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="mt-4 inline-flex text-primary underline">العودة للرئيسية</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">الأكاديمية غير موجودة</h1>
        <Link to="/" className="text-primary underline">العودة للرئيسية</Link>
      </div>
    </div>
  ),
  component: AcademyLoginPage,
});

function AcademyLoginPage() {
  const { academy } = Route.useLoaderData();
  const search = Route.useSearch();
  const s = getAcademyStyle(academy.slug);
  const cover = academy.cover_image_url ?? academy.image_url ?? s.image;
  const [tab, setTab] = useState<"student" | "teacher">(search.tab as "student" | "teacher");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse at top, ${s.cssVar}, transparent 60%)` }}
      />
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-md mx-auto px-6 py-16">
        <Link to="/academy/$slug" params={{ slug: academy.slug }} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
          <ArrowLeft className="size-4 rotate-180" />
          العودة لصفحة الأكاديمية
        </Link>

        <div className="text-center mb-8">
          <div className={`inline-block size-24 rounded-2xl overflow-hidden mb-4 border-2 border-border ${s.glowClass}`}>
            <img src={cover} alt={academy.name} className="w-full h-full object-cover" width={96} height={96} />
          </div>
          <h1 className="text-3xl font-bold mb-2">{academy.name}</h1>
          {academy.teacher_name && <p className="text-sm text-muted-foreground mb-1">مع {academy.teacher_name}</p>}
          <p className="text-muted-foreground text-sm">اختر طريقة الدخول المناسبة</p>
        </div>

        <div className="bg-card-premium border border-border/60 rounded-2xl p-6 shadow-elevated">
          <div className="grid grid-cols-2 gap-2 p-1 bg-input rounded-xl mb-6">
            <button
              onClick={() => setTab("student")}
              className={`py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center justify-center gap-1.5 ${
                tab === "student" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-4" />
              دخول الطالب
            </button>
            <button
              onClick={() => setTab("teacher")}
              className={`py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center justify-center gap-1.5 ${
                tab === "teacher" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="size-4" />
              دخول المعلم
            </button>
          </div>

          {tab === "student" ? <StudentLoginForm slug={academy.slug} /> : <TeacherLoginForm academyId={academy.id} />}
        </div>
      </div>
    </div>
  );
}
