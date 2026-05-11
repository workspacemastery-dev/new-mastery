import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, Plus, Trash2, Edit2, Eye, EyeOff, Search,
  FileText, Calendar, Tag, BookOpen, X, Save, ImageIcon, AlignLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/articles")({
  head: () => ({ meta: [{ title: "المقالات — EduVerse" }] }),
  component: ArticlesPage,
});

interface Article {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// UUID بديل
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ArticlesPage() {
  const { user, role } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<Article | null | "new">(null);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data } = await supabase
        .from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (data) { setAcademyId(data.id); await loadArticles(data.id); }
      setLoading(false);
    })();
  }, [user, role]);

  async function loadArticles(aId: string) {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("academy_id", aId)
      .order("created_at", { ascending: false });
    setArticles((data ?? []) as Article[]);
  }

  async function togglePublish(article: Article) {
    await supabase.from("articles").update({ is_published: !article.is_published }).eq("id", article.id);
    setArticles(articles.map((a) => a.id === article.id ? { ...a, is_published: !a.is_published } : a));
  }

  async function deleteArticle(id: string) {
    if (!confirm("هل تريد حذف هذا المقال؟")) return;
    await supabase.from("articles").delete().eq("id", id);
    setArticles(articles.filter((a) => a.id !== id));
  }

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "published" ? a.is_published :
      !a.is_published;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.is_published).length,
    drafts: articles.filter((a) => !a.is_published).length,
  };

  if (loading) return (
    <PageContainer>
      <div className="grid place-items-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    </PageContainer>
  );

  if (!academyId) return (
    <PageContainer>
      <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">يجب تعيينك لأكاديمية أولاً.</p>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <PageHeader
        title="المقالات"
        description="إنشاء وإدارة مقالات الأكاديمية"
        actions={
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary"
          >
            <Plus className="size-4" />
            مقال جديد
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "إجمالي المقالات", value: stats.total, color: "text-primary", bg: "bg-primary/10" },
          { label: "منشور", value: stats.published, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "مسودة", value: stats.drafts, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-4">
            <div className={`size-12 rounded-xl ${s.bg} grid place-items-center`}>
              <FileText className={`size-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالعنوان أو التصنيف..."
            className="w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                filterStatus === f
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  : "bg-input border border-border/60 hover:bg-input/80"
              }`}
            >
              {f === "all" ? "الكل" : f === "published" ? "منشور" : "مسودة"}
            </button>
          ))}
        </div>
      </div>

      {/* Articles list */}
      {filtered.length === 0 ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-16 text-center">
          <BookOpen className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm">
            {articles.length === 0 ? "لا توجد مقالات بعد. ابدأ بإنشاء مقالك الأول." : "لا توجد نتائج مطابقة."}
          </p>
          {articles.length === 0 && (
            <button
              onClick={() => setEditing("new")}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary"
            >
              <Plus className="size-4" /> إنشاء مقال
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="bg-card-premium border border-border/60 rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors"
            >
              {/* Cover thumbnail */}
              <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-border/60 bg-input/50">
                {article.cover_image_url ? (
                  <img src={article.cover_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <FileText className="size-6 text-muted-foreground opacity-40" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-bold text-base line-clamp-1">{article.title}</h3>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                    article.is_published
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}>
                    {article.is_published ? "منشور" : "مسودة"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3">
                  {article.content.replace(/<[^>]*>/g, "").slice(0, 120)}...
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  {article.category && (
                    <span className="inline-flex items-center gap-1">
                      <Tag className="size-3" /> {article.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(article.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => togglePublish(article)}
                  title={article.is_published ? "إخفاء" : "نشر"}
                  className={`size-8 grid place-items-center rounded-lg transition ${
                    article.is_published
                      ? "hover:bg-amber-500/20 text-amber-500"
                      : "hover:bg-emerald-500/20 text-emerald-500"
                  }`}
                >
                  {article.is_published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
                <button
                  onClick={() => setEditing(article)}
                  className="size-8 grid place-items-center rounded-lg hover:bg-primary/20 text-primary transition"
                >
                  <Edit2 className="size-4" />
                </button>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing !== null && (
        <ArticleModal
          academyId={academyId}
          existing={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { await loadArticles(academyId); setEditing(null); }}
        />
      )}
    </PageContainer>
  );
}

/* ═══════════════════════════════════
   Article Editor Modal
═══════════════════════════════════ */
function ArticleModal({
  academyId,
  existing,
  onClose,
  onSaved,
}: {
  academyId: string;
  existing?: Article;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [coverUrl, setCoverUrl] = useState(existing?.cover_image_url ?? "");
  const [isPublished, setIsPublished] = useState(existing?.is_published ?? false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const wordCount = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  async function uploadCover(file: File) {
    setUploadState("uploading");
    setUploadErr(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `articles/${generateUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("course-assets").upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("course-assets").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadState("error");
    }
  }

  async function handleSave() {
    setErr(null);
    if (!title.trim()) { setErr("عنوان المقال مطلوب"); return; }
    if (!content.trim()) { setErr("محتوى المقال مطلوب"); return; }
    if (uploadState === "uploading") { setErr("انتظر اكتمال رفع الصورة"); return; }

    setSaving(true);
    try {
      if (existing) {
        const { error } = await supabase.from("articles").update({
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || null,
          cover_image_url: coverUrl || null,
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert({
          academy_id: academyId,
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || null,
          cover_image_url: coverUrl || null,
          is_published: isPublished,
        });
        if (error) throw error;
      }
      await onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/60 rounded-2xl w-full max-w-3xl shadow-elevated my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/15 grid place-items-center">
              <FileText className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base">{existing ? "تعديل المقال" : "مقال جديد"}</h3>
              {content && (
                <p className="text-[11px] text-muted-foreground">
                  {wordCount} كلمة • {readTime} دقيقة للقراءة
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium mb-2">صورة الغلاف</label>
            {coverUrl && uploadState !== "uploading" ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border/60">
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setCoverUrl(""); setUploadState("idle"); }}
                  className="absolute top-2 left-2 size-7 bg-black/60 hover:bg-black/80 rounded-lg grid place-items-center text-white transition"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : uploadState === "uploading" ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-input text-sm text-muted-foreground w-fit">
                <Loader2 className="size-4 animate-spin text-primary" />
                جارٍ رفع الصورة...
              </div>
            ) : (
              <label className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-dashed border-border/60 bg-input/50 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors w-fit">
                <ImageIcon className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">رفع صورة الغلاف</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG حتى 5MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadCover(f); }} />
              </label>
            )}
            {uploadState === "error" && (
              <p className="text-xs text-destructive mt-1">{uploadErr}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">عنوان المقال *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنواناً جذاباً للمقال..."
              className="w-full bg-input border border-border/60 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5">
              <Tag className="size-4 text-primary" /> التصنيف
              <span className="text-muted-foreground text-xs">(اختياري)</span>
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="مثال: رياضيات، فيزياء، نصائح دراسية..."
              className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5">
              <AlignLeft className="size-4 text-primary" /> المحتوى *
            </label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب محتوى مقالك هنا..."
              className="w-full bg-input border border-border/60 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-input/50 border border-border/60">
            <div>
              <p className="text-sm font-semibold">نشر المقال</p>
              <p className="text-xs text-muted-foreground">
                {isPublished ? "المقال مرئي للطلاب" : "المقال محفوظ كمسودة"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isPublished ? "bg-emerald-500" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${isPublished ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          {err && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
              {err}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg glass hover:bg-white/10 text-sm"
          >
            إلغاء
          </button>
          <div className="flex items-center gap-2">
            {/* Save as draft */}
            {!existing && (
              <button
                type="button"
                disabled={saving}
                onClick={() => { setIsPublished(false); void handleSave(); }}
                className="px-4 py-2.5 rounded-lg border border-border/60 hover:bg-input text-sm disabled:opacity-50"
              >
                حفظ كمسودة
              </button>
            )}
            {/* Save & publish */}
            <button
              type="button"
              disabled={saving || uploadState === "uploading"}
              onClick={() => void handleSave()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? "جارٍ الحفظ..." : existing ? "حفظ التعديلات" : "نشر المقال"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

