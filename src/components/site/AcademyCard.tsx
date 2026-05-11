import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Academy } from "@/lib/academies";
import { getAcademyStyle } from "@/lib/academy-styles";

export function AcademyCard({ academy, index }: { academy: Academy; index: number }) {
  const s = getAcademyStyle(academy.slug);
  const img = academy.image_url ?? s.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`group relative block rounded-3xl overflow-hidden bg-card-premium border border-border/60 ${s.glowClass} hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500`}
      >
        <div className={`h-1.5 ${s.bgGradientClass}`} />

        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity"
            style={{ background: `radial-gradient(circle at center, ${s.cssVar}, transparent 70%)` }}
          />
          <img
            src={img}
            alt={academy.teacher_name ?? academy.name}
            loading="lazy"
            width={768}
            height={768}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs font-medium">
            {academy.subject}
          </div>
        </div>

        <div className="p-6 -mt-8 relative">
          <h3 className="text-2xl font-bold mb-1">{academy.name}</h3>
          {academy.teacher_name && (
            <p className={`text-sm font-medium mb-3 ${s.accentClass}`}>{academy.teacher_name}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 min-h-[3rem]">
            {academy.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4" />
              محتوى تفاعلي
            </span>
          </div>

          <Link
            to="/academy/$slug"
            params={{ slug: academy.slug }}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${s.bgGradientClass} text-white text-sm font-semibold hover:brightness-110 transition`}
          >
            <span>عرض صفحة الأكاديمية</span>
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
