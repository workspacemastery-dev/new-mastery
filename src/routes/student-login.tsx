import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Academy } from "@/lib/academies";
import { getAcademyStyle } from "@/lib/academy-styles";
import { StudentLoginForm } from "@/components/auth/AcademyLoginForms";

export const Route = createFileRoute("/student-login")({
  validateSearch: (search) => ({
    academy: typeof search.academy === "string" ? search.academy : "",
  }),
  loaderDeps: ({ search }) => ({ academy: search.academy }),
  loader: async ({ deps }) => {
    if (!deps.academy) return { academy: null };
    const { data, error } = await supabase
      .from("academies")
      .select("*")
      .eq("slug", deps.academy)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { academy: data as Academy };
  },
  head: () => ({ meta: [{ title: "دخول الطالب — EduVerse" }] }),
  errorComponent: ({ error }) => <LoginError message={error.message} />,
  notFoundComponent: () => <LoginError message="الأكاديمية المطلوبة غير موجودة أو غير منشورة." />,
  component: StudentLoginPage,
});

function StudentLoginPage() {
  const { academy } = Route.useLoaderData();
  const style = getAcademyStyle(academy?.slug ?? "math");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at top, ${style.cssVar}, transparent 60%)` }} />
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-md mx-auto px-6 py-16">
        <Link to={academy ? "/academy/$slug" : "/"} params={academy ? { slug: academy.slug } : undefined} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
          <ArrowLeft className="size-4 rotate-180" />
          {academy ? "العودة لصفحة الأكاديمية" : "اختيار أكاديمية"}
        </Link>

        <div className="text-center mb-8">
          <div className={`inline-flex size-16 rounded-2xl ${style.bgGradientClass} grid place-items-center mb-4 ${style.glowClass}`}>
            <GraduationCap className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">دخول الطالب</h1>
          <p className="text-muted-foreground text-sm">{academy?.name ?? "اختر أكاديمية أولًا من الصفحة الرئيسية"}</p>
        </div>

        <div className="bg-card-premium border border-border/60 rounded-2xl p-6 shadow-elevated">
          {academy ? <StudentLoginForm slug={academy.slug} /> : <MissingAcademy />}
        </div>
      </div>
    </div>
  );
}

function MissingAcademy() {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-muted-foreground">لا يمكن فتح دخول الطالب بدون تحديد الأكاديمية.</p>
      <Link to="/" hash="academies" className="inline-flex w-full justify-center py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold">
        اختيار أكاديمية
      </Link>
    </div>
  );
}

function LoginError({ message }: { message: string }) {
  console.error("[student-login-route]", message);
  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">تعذّر فتح دخول الطالب</h1>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <Link to="/" className="text-primary underline">العودة للرئيسية</Link>
      </div>
    </div>
  );
}