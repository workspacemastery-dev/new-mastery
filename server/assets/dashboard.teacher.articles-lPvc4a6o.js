import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { F as FileText } from "./file-text-DbtC_hJa.js";
import { S as Search } from "./search-DCkidx3Y.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { T as Tag } from "./tag-DFkolDHM.js";
import { C as Calendar } from "./calendar-BmlfLAjy.js";
import { E as EyeOff, a as Eye } from "./eye-DXgyZ82R.js";
import { P as Pen } from "./pen-CLgFSF3R.js";
import { X } from "./x-yy412flO.js";
import { I as Image } from "./image-DntQ77e3.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { S as Save } from "./save-DaTgwH4R.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
const __iconNode = [
  ["path", { d: "M21 5H3", key: "1fi0y6" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 19H3", key: "z6ezky" }]
];
const TextAlignStart = createLucideIcon("text-align-start", __iconNode);
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function ArticlesPage() {
  const {
    user,
    role
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [articles, setArticles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [editing, setEditing] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const {
        data
      } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (data) {
        setAcademyId(data.id);
        await loadArticles(data.id);
      }
      setLoading(false);
    })();
  }, [user, role]);
  async function loadArticles(aId) {
    const {
      data
    } = await supabase.from("articles").select("*").eq("academy_id", aId).order("created_at", {
      ascending: false
    });
    setArticles(data ?? []);
  }
  async function togglePublish(article) {
    await supabase.from("articles").update({
      is_published: !article.is_published
    }).eq("id", article.id);
    setArticles(articles.map((a) => a.id === article.id ? {
      ...a,
      is_published: !a.is_published
    } : a));
  }
  async function deleteArticle(id) {
    if (!confirm("هل تريد حذف هذا المقال؟")) return;
    await supabase.from("articles").delete().eq("id", id);
    setArticles(articles.filter((a) => a.id !== id));
  }
  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || (a.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" ? true : filterStatus === "published" ? a.is_published : !a.is_published;
    return matchSearch && matchStatus;
  });
  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.is_published).length,
    drafts: articles.filter((a) => !a.is_published).length
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) });
  if (!academyId) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "يجب تعيينك لأكاديمية أولاً." }) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "المقالات", description: "إنشاء وإدارة مقالات الأكاديمية", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      "مقال جديد"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [{
      label: "إجمالي المقالات",
      value: stats.total,
      color: "text-primary",
      bg: "bg-primary/10"
    }, {
      label: "منشور",
      value: stats.published,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10"
    }, {
      label: "مسودة",
      value: stats.drafts,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-12 rounded-xl ${s.bg} grid place-items-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: `size-5 ${s.color}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
      ] })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "ابحث بالعنوان أو التصنيف...", className: "w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["all", "published", "draft"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterStatus(f), className: `px-4 py-2.5 rounded-lg text-sm font-medium transition ${filterStatus === f ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "bg-input border border-border/60 hover:bg-input/80"}`, children: f === "all" ? "الكل" : f === "published" ? "منشور" : "مسودة" }, f)) })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: articles.length === 0 ? "لا توجد مقالات بعد. ابدأ بإنشاء مقالك الأول." : "لا توجد نتائج مطابقة." }),
      articles.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing("new"), className: "mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " إنشاء مقال"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((article) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 shrink-0 rounded-xl overflow-hidden border border-border/60 bg-input/50", children: article.cover_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.cover_image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-6 text-muted-foreground opacity-40" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base line-clamp-1", children: article.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${article.is_published ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`, children: article.is_published ? "منشور" : "مسودة" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-1 mb-3", children: [
          article.content.replace(/<[^>]*>/g, "").slice(0, 120),
          "..."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
          article.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3" }),
            " ",
            article.category
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
            new Date(article.created_at).toLocaleDateString("ar-EG")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => togglePublish(article), title: article.is_published ? "إخفاء" : "نشر", className: `size-8 grid place-items-center rounded-lg transition ${article.is_published ? "hover:bg-amber-500/20 text-amber-500" : "hover:bg-emerald-500/20 text-emerald-500"}`, children: article.is_published ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(article), className: "size-8 grid place-items-center rounded-lg hover:bg-primary/20 text-primary transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteArticle(article.id), className: "size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
      ] })
    ] }, article.id)) }),
    editing !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleModal, { academyId, existing: editing === "new" ? void 0 : editing, onClose: () => setEditing(null), onSaved: async () => {
      await loadArticles(academyId);
      setEditing(null);
    } })
  ] });
}
function ArticleModal({
  academyId,
  existing,
  onClose,
  onSaved
}) {
  const [title, setTitle] = reactExports.useState(existing?.title ?? "");
  const [content, setContent] = reactExports.useState(existing?.content ?? "");
  const [category, setCategory] = reactExports.useState(existing?.category ?? "");
  const [coverUrl, setCoverUrl] = reactExports.useState(existing?.cover_image_url ?? "");
  const [isPublished, setIsPublished] = reactExports.useState(existing?.is_published ?? false);
  const [uploadState, setUploadState] = reactExports.useState("idle");
  const [uploadErr, setUploadErr] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const wordCount = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  async function uploadCover(file) {
    setUploadState("uploading");
    setUploadErr(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `articles/${generateUUID()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("course-assets").upload(path, file);
      if (upErr) throw upErr;
      const {
        data
      } = supabase.storage.from("course-assets").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "فشل رفع الصورة");
      setUploadState("error");
    }
  }
  async function handleSave() {
    setErr(null);
    if (!title.trim()) {
      setErr("عنوان المقال مطلوب");
      return;
    }
    if (!content.trim()) {
      setErr("محتوى المقال مطلوب");
      return;
    }
    if (uploadState === "uploading") {
      setErr("انتظر اكتمال رفع الصورة");
      return;
    }
    setSaving(true);
    try {
      if (existing) {
        const {
          error
        } = await supabase.from("articles").update({
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || null,
          cover_image_url: coverUrl || null,
          is_published: isPublished,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("articles").insert({
          academy_id: academyId,
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || null,
          cover_image_url: coverUrl || null,
          is_published: isPublished
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "bg-card border border-border/60 rounded-2xl w-full max-w-3xl shadow-elevated my-8 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base", children: existing ? "تعديل المقال" : "مقال جديد" }),
          content && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            wordCount,
            " كلمة • ",
            readTime,
            " دقيقة للقراءة"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "size-8 grid place-items-center rounded-lg hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "صورة الغلاف" }),
        coverUrl && uploadState !== "uploading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-40 rounded-xl overflow-hidden border border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: coverUrl, alt: "", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setCoverUrl("");
            setUploadState("idle");
          }, className: "absolute top-2 left-2 size-7 bg-black/60 hover:bg-black/80 rounded-lg grid place-items-center text-white transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
        ] }) : uploadState === "uploading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 rounded-xl border border-border/60 bg-input text-sm text-muted-foreground w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-primary" }),
          "جارٍ رفع الصورة..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-dashed border-border/60 bg-input/50 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "رفع صورة الغلاف" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "PNG, JPG حتى 5MB" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) void uploadCover(f);
          } })
        ] }),
        uploadState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: uploadErr })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "عنوان المقال *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "اكتب عنواناً جذاباً للمقال...", className: "w-full bg-input border border-border/60 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-4 text-primary" }),
          " التصنيف",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(اختياري)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: category, onChange: (e) => setCategory(e.target.value), placeholder: "مثال: رياضيات، فيزياء، نصائح دراسية...", className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5 inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignStart, { className: "size-4 text-primary" }),
          " المحتوى *"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 12, value: content, onChange: (e) => setContent(e.target.value), placeholder: "اكتب محتوى مقالك هنا...", className: "w-full bg-input border border-border/60 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-input/50 border border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "نشر المقال" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isPublished ? "المقال مرئي للطلاب" : "المقال محفوظ كمسودة" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsPublished(!isPublished), className: `relative w-12 h-6 rounded-full transition-colors duration-200 ${isPublished ? "bg-emerald-500" : "bg-border"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${isPublished ? "right-0.5" : "left-0.5"}` }) })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3", children: err })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-6 py-4 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2.5 rounded-lg glass hover:bg-white/10 text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        !existing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: saving, onClick: () => {
          setIsPublished(false);
          void handleSave();
        }, className: "px-4 py-2.5 rounded-lg border border-border/60 hover:bg-input text-sm disabled:opacity-50", children: "حفظ كمسودة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: saving || uploadState === "uploading", onClick: () => void handleSave(), className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary disabled:opacity-60", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
          saving ? "جارٍ الحفظ..." : existing ? "حفظ التعديلات" : "نشر المقال"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  ArticlesPage as component
};
