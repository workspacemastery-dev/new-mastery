import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Trophy, Zap, ShieldCheck, BarChart3, GraduationCap } from "lucide-react";
import heroBooks from "@/assets/hero-books.png";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AcademyCard } from "@/components/site/AcademyCard";
import { supabase } from "@/integrations/supabase/client";
import type { Academy } from "@/lib/academies";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { data, error } = await supabase
      .from("academies")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return { academies: (data ?? []) as Academy[] };
  },
  head: () => ({
    meta: [
      { title: "البوابه التعليميه — منصة الأكاديميات التعليمية" },
      { name: "description", content: "منصة تعليمية احترافية متعددة الأكاديميات تجمع نخبة المعلمين في الرياضيات والفيزياء والكيمياء بتجربة تعلم سينمائية." },
      { property: "og:title", content: "EduVerse — منصة الأكاديميات التعليمية" },
      { property: "og:description", content: "نخبة المعلمين، اختبارات تفاعلية، تجربة تعلم سينمائية." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">تعذّر تحميل الصفحة</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <Hero />
      <AcademiesSection />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
      {/* Soft sky background with abstract waves */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.94_0.04_230)] to-background" />
      <svg
        className="absolute inset-0 -z-10 w-full h-full opacity-60"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0,420 C240,360 360,500 720,440 C1080,380 1200,520 1440,460 L1440,600 L0,600 Z" fill="oklch(0.88 0.06 230 / 0.5)" />
        <path d="M0,480 C240,440 480,540 720,500 C960,460 1200,560 1440,520 L1440,600 L0,600 Z" fill="oklch(0.82 0.08 225 / 0.4)" />
        <circle cx="120" cy="180" r="180" fill="oklch(0.86 0.07 225 / 0.35)" />
        <circle cx="1320" cy="120" r="140" fill="oklch(0.86 0.07 225 / 0.35)" />
      </svg>

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-right order-2 lg:order-1"
        >
          <p className="text-xl lg:text-2xl text-slate-700 font-medium mb-3">مرحباً بك في </p>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-primary">
            البوابة التعليمية
          </h1>
          <p className="text-slate-800 lg:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            منصة تعليمية متعددة الأكاديميات تجمع نخبة المعلمين في مكان واحد، مع نظام اختبارات احترافي ومحتوى تفاعلي حديث.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a
              href="#academies"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition"
            >
              استكشف الأكاديميات
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 lg:order-2 flex justify-center"
        >
          <img
            src={heroBooks}
            alt="كتب تعليمية وقبعة تخرج"
            width={1024}
            height={1024}
            className="w-full max-w-md lg:max-w-lg h-auto drop-shadow-[0_20px_40px_oklch(0.5_0.15_240/0.25)] animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
}

function AcademiesSection() {
  const { academies } = Route.useLoaderData();
  const list: Academy[] = academies;
  return (
    <section id="academies" className="py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-4">
            <GraduationCap className="size-3.5" />
            <span>الأكاديميات المتاحة</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            اختر أكاديميتك واغمر في <span className="text-gradient-primary">عالم المعرفة</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            كل أكاديمية بوابة مستقلة بمعلمها الخاص ومحتواها واختباراتها. ابدأ بالأكاديمية التي تهمك.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {list.map((academy, i) => (
            <AcademyCard key={academy.id} academy={academy} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Trophy, title: "اختبارات احترافية", desc: "نظام اختبارات متكامل مع مؤقت، أنواع أسئلة متعددة، ومراجعة مفصلة." },
  { icon: BarChart3, title: "تحليلات الأداء", desc: "تابع تقدمك بإحصائيات دقيقة ولوحات تحكم بصرية واضحة." },
  { icon: ShieldCheck, title: "عزل تام للبيانات", desc: "كل أكاديمية مستقلة بمحتواها وطلابها، أمان من الدرجة الأولى." },
  { icon: Zap, title: "أداء فائق", desc: "تجربة سلسة على جميع الأجهزة مع دعم كامل للوضع الداكن." },
];

function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            لماذا <span className="text-gradient-primary">EduVerse</span>؟
          </h2>
          <p className="text-muted-foreground">كل ما يحتاجه المعلم والطالب في منصة واحدة فاخرة.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card-premium border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mb-4 shadow-glow-primary">
                <f.icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "اختر أكاديميتك", desc: "ادخل بوابة المعلم الذي تريد التعلم منه." },
    { n: "02", title: "أنشئ حسابك", desc: "تسجيل سريع وآمن خاص بكل أكاديمية." },
    { n: "03", title: "ادرس واختبر", desc: "كورسات ودروس واختبارات تفاعلية بمراجعة فورية." },
  ];
  return (
    <section id="how" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">كيف تبدأ في 3 خطوات</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-card-premium border border-border/60 rounded-2xl p-8"
            >
              <div className="text-6xl font-bold text-gradient-primary opacity-80 mb-4">{s.n}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative rounded-3xl overflow-hidden bg-card-premium border border-border p-10 lg:p-14 text-center shadow-elevated">
          <div className="absolute inset-0 bg-gradient-primary opacity-20" />
          <div className="absolute -top-20 -left-20 size-64 bg-primary/40 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -right-20 size-64 bg-accent/40 blur-3xl rounded-full" />
          <div className="relative">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              جاهز لتبدأ رحلة <span className="text-gradient-gold">التفوق</span>؟
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              انضم لآلاف الطلاب الذين يصنعون مستقبلهم اليوم على EduVerse.
            </p>
            <Link
              to="/"
              hash="academies"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg shadow-glow-primary hover:opacity-95 transition"
            >
              اختر أكاديميتك الآن
              <ArrowLeft className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
