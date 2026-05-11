import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Award, Play, FileText, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Academy } from "@/lib/academies";
import { getAcademyStyle } from "@/lib/academy-styles";

export const Route = createFileRoute("/academy/$slug")({
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
      ? [
          { title: `${loaderData.academy.name} — EduVerse` },
          { name: "description", content: loaderData.academy.description },
          { property: "og:title", content: loaderData.academy.name },
          { property: "og:description", content: loaderData.academy.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">الأكاديمية غير موجودة</h1>
        <Link to="/" className="text-primary underline">العودة للرئيسية</Link>
      </div>
    </div>
  ),
  component: AcademyPage,
});

function AcademyPage() {
  const { academy } = Route.useLoaderData();
  const s = getAcademyStyle(academy.slug);
  const img = academy.cover_image_url ?? academy.image_url ?? s.image;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(ellipse at top, ${s.cssVar}, transparent 60%)` }}
        />
        <div className="absolute inset-0 grid-bg pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_auto] gap-10 items-center relative">
          {/* Content — right side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
            >
              <ArrowLeft className="size-4 rotate-180" />
              كل الأكاديميات
            </Link>

            <div className={`inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-4 ${s.accentClass}`}>
              {academy.subject}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{academy.name}</h1>

            {academy.teacher_name && (
           <div className="mb-4">
           <p className="text-sm font-medium text-primary/80 mb-1 tracking-wide">
           المعلم
           </p>

           <h2 className="text-3xl lg:text-5xl font-black text-yellow-300 leading-tight">
          {academy.teacher_name}
          </h2>
          </div>
           )}

            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-8">
              {academy.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/student-login"
                search={{ academy: academy.slug }}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl ${s.bgGradientClass} text-white font-semibold ${s.glowClass} hover:brightness-110 transition`}
              >
                دخول الطالب
                <ArrowLeft className="size-4" />
              </Link>
              <Link
                to="/teacher-login"
                search={{ academy: academy.slug }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass font-semibold hover:bg-white/10 transition"
              >
                دخول المعلم
              </Link>
            </div>
          </motion.div>

          {/* Image — left side, large, no border, soft gradient fade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Soft color glow behind image — matches academy color */}
            <div
              className={`absolute -inset-10 ${s.bgGradientClass} opacity-20 blur-3xl rounded-full pointer-events-none`}
            />

            {/* Image — large, no border, no radius, fade edges with mask */}
            <div
              className="relative w-[520px] h-[560px]"
              style={{
                maskImage:
                  "radial-gradient(ellipse 85% 90% at 50% 50%, black 55%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 85% 90% at 50% 50%, black 55%, transparent 100%)",
              }}
            >
              <img
                src={img}
                alt={academy.teacher_name ?? academy.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold mb-8">ما الذي ستجده في الأكاديمية</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Play, title: "دروس فيديو HD", desc: "محتوى مصوّر باحترافية وشروحات متسلسلة." },
              { icon: FileText, title: "اختبارات تفاعلية", desc: "أسئلة اختيار من متعدد ونصية وبالصور مع مراجعة فورية." },
              { icon: MessageCircle, title: "متابعة وتغذية راجعة", desc: "تواصل مباشر مع المعلم وتقارير أداء دورية." },
            ].map((f) => (
              <div key={f.title} className="bg-card-premium border border-border/60 rounded-2xl p-6">
                <div className={`size-12 rounded-xl ${s.bgGradientClass} grid place-items-center mb-4`}>
                  <f.icon className="size-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="size-4 text-gold" />
            شهادة إتمام بعد كل كورس
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

