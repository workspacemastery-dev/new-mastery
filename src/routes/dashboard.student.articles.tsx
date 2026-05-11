import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, BookOpen, Calendar, User, Tag, Search, ArrowLeft, Clock } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student/articles")({
  head: () => ({ meta: [{ title: "المقالات — EduVerse" }] }),
  component: StudentArticlesPage,
});

interface Article {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  is_published: boolean;
  created_at: string;
  academies?: { name: string; teacher_name: string | null } | null;
}

function StudentArticlesPage() {
  const { session, loading: authLoading } = useStudentAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Article | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session) { setLoading(false); return; }

    void (async () => {
      // الطالب عنده academy_id مباشرة في الـ session
      const { data } = await supabase
        .from("articles")
        .select("*, academies(name, teacher_name)")
        .eq("academy_id", session.academy_id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      setArticles((data ?? []) as Article[]);
      setLoading(false);
    })();
  }, [session, authLoading]);

  const categories = ["all", ...Array.from(new Set(
    articles.map((a) => a.category).filter(Boolean) as string[]
  ))];

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  function readTime(content: string) {
    const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  if (authLoading || loading) return (
    <PageContainer>
      <div className="grid place-items-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <PageHeader title="المقالات" description="اقرأ أحدث المقالات من معلمك" />

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في المقالات..."
            className="w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  : "bg-input border border-border/60 hover:border-primary/40 text-muted-foreground"
              }`}
            >
              {cat === "all" ? "الكل" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-16 text-center">
          <BookOpen className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm">
            {articles.length === 0
              ? "لا توجد مقالات منشورة بعد من معلمك."
              : "لا توجد نتائج مطابقة لبحثك."}
          </p>
        </div>
      )}

      {/* Articles grid */}
      {filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              readTime={readTime(article.content)}
              delay={i * 60}
              onClick={() => setSelected(article)}
            />
          ))}
        </div>
      )}

      {/* Reader modal */}
      {selected && (
        <ArticleReaderModal
          article={selected}
          readTime={readTime(selected.content)}
          onClose={() => setSelected(null)}
        />
      )}
    </PageContainer>
  );
}

/* ══════════════════════════════════════
   Article Card
══════════════════════════════════════ */
function ArticleCard({
  article, readTime, delay, onClick,
}: {
  article: Article;
  readTime: number;
  delay: number;
  onClick: () => void;
}) {
  const teacher = article.academies?.teacher_name ?? article.academies?.name ?? "المعلم";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-card-premium border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Cover image */}
      <div className="relative w-full h-48 overflow-hidden bg-input/50">
        {article.cover_image_url ? (
          <>
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BookOpen className="size-12 text-primary/30" />
          </div>
        )}

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-snug line-clamp-2 drop-shadow-lg">
            {article.title}
          </h3>
        </div>

        {/* Category badge */}
        {article.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/80 text-primary-foreground backdrop-blur-sm">
              <Tag className="size-3" />
              {article.category}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {article.content.replace(/<[^>]*>/g, "").slice(0, 130)}...
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-gradient-primary grid place-items-center shrink-0">
              <User className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold text-foreground">{teacher}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" /> {readTime} د
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(article.created_at).toLocaleDateString("ar-EG", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-1 text-xs text-primary font-semibold group-hover:gap-2 transition-all">
          اقرأ المقال <ArrowLeft className="size-3.5" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Article Reader Modal
══════════════════════════════════════ */
function ArticleReaderModal({
  article, readTime, onClose,
}: {
  article: Article;
  readTime: number;
  onClose: () => void;
}) {
  const teacher = article.academies?.teacher_name ?? article.academies?.name ?? "المعلم";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/60 rounded-2xl w-full max-w-2xl shadow-elevated my-8 overflow-hidden"
      >
        {article.cover_image_url && (
          <div className="relative w-full h-56 overflow-hidden">
            <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 left-4 size-9 bg-black/50 hover:bg-black/70 rounded-xl grid place-items-center text-white transition"
            >
              <ArrowLeft className="size-4 rotate-180" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl font-black text-white leading-tight drop-shadow-lg">{article.title}</h1>
            </div>
          </div>
        )}

        <div className="p-6">
          {!article.cover_image_url && (
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-black leading-tight flex-1">{article.title}</h1>
              <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/10 shrink-0 mr-2">
                <ArrowLeft className="size-4 rotate-180" />
              </button>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between flex-wrap gap-3 py-4 border-y border-border/60 mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-primary grid place-items-center">
                <User className="size-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">{teacher}</p>
                <p className="text-xs text-muted-foreground">كاتب المقال</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              {article.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
                  <Tag className="size-3" /> {article.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(article.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> {readTime} دقيقة للقراءة
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {article.content.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-sm text-foreground/90 leading-7">{para}</p>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-border/60 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow-primary"
            >
              <ArrowLeft className="size-4 rotate-180" />
              العودة للمقالات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

