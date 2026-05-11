import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center" dir="rtl">

        {/* ── Right: Info panel (45%) ── */}
        <div className="hidden lg:flex w-[45%] items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-md"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary shrink-0">
                <GraduationCap className="size-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground">
                  البوابة التعليمية
                </h2>
                <p className="text-sm text-muted-foreground">
                  منصة تعليمية احترافية حديثة
                </p>
              </div>
            </div>

            <h1 className="text-5xl leading-tight font-black mb-6 text-foreground">
              مستقبل التعليم
              <span className="block text-gradient-gold">يبدأ من هنا</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              منصة تعليمية ذكية توفر تجربة حديثة للطلاب والمعلمين
              مع أدوات متقدمة وإدارة احترافية للأكاديميات.
            </p>

            <div className="space-y-4">
              <Feature icon={<ShieldCheck className="size-5" />} text="حماية وأمان كامل للحسابات" />
              <Feature icon={<BookOpen className="size-5" />} text="إدارة الكورسات والاختبارات بسهولة" />
              <Feature icon={<Sparkles className="size-5" />} text="واجهة احترافية وتجربة استخدام فاخرة" />
            </div>
          </motion.div>
        </div>

        {/* ── Left: Form panel (55%) ── */}
        <div className="w-full lg:w-[55%] flex items-center justify-center px-6 py-10 lg:px-16 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl"
          >
            {/* Logo Mobile */}
            <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden justify-center">
              <div className="size-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <GraduationCap className="size-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-black text-gradient-gold">
                البوابة التعليمية
              </span>
            </Link>

            {/* Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/70 backdrop-blur-2xl shadow-2xl">
              <div className="absolute inset-0 rounded-3xl border border-primary/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary" />

              <div className="p-10 lg:p-14">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-gradient-primary shadow-glow-primary mb-5">
                    <GraduationCap className="size-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl font-black text-foreground mb-2">{title}</h1>
                  <p className="text-muted-foreground leading-relaxed">{subtitle}</p>
                </div>

                {children}

                <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-foreground/90">
      <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow-primary shrink-0">
        {icon}
      </div>
      <span className="text-base">{text}</span>
    </div>
  );
}

export function FormField({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange?: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2 text-foreground">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className="
          w-full px-4 py-3.5 rounded-2xl
          bg-input/70 border border-border
          text-foreground placeholder:text-muted-foreground/60
          backdrop-blur-md transition-all duration-300
          focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
          hover:border-primary/40
        "
      />
    </label>
  );
}

