import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { S as Search } from "./search-DCkidx3Y.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { T as Tag } from "./tag-DFkolDHM.js";
import { U as User } from "./user-Do_-wygY.js";
import { C as Clock } from "./clock-cIc-Fwqh.js";
import { C as Calendar } from "./calendar-BmlfLAjy.js";
import { A as ArrowLeft } from "./arrow-left-BpTcWOKJ.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function StudentArticlesPage() {
  const {
    session,
    loading: authLoading
  } = useStudentAuth();
  const [articles, setArticles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (authLoading) return;
    if (!session) {
      setLoading(false);
      return;
    }
    void (async () => {
      const {
        data
      } = await supabase.from("articles").select("*, academies(name, teacher_name)").eq("academy_id", session.academy_id).eq("is_published", true).order("created_at", {
        ascending: false
      });
      setArticles(data ?? []);
      setLoading(false);
    })();
  }, [session, authLoading]);
  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];
  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || (a.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    return matchSearch && matchCat;
  });
  function readTime(content) {
    const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }
  if (authLoading || loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "المقالات", description: "اقرأ أحدث المقالات من معلمك" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "ابحث في المقالات...", className: "w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
    ] }) }),
    categories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap mb-6", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveCategory(cat), className: `px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === cat ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "bg-input border border-border/60 hover:border-primary/40 text-muted-foreground"}`, children: cat === "all" ? "الكل" : cat }, cat)) }),
    filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: articles.length === 0 ? "لا توجد مقالات منشورة بعد من معلمك." : "لا توجد نتائج مطابقة لبحثك." })
    ] }),
    filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((article, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article, readTime: readTime(article.content), delay: i * 60, onClick: () => setSelected(article) }, article.id)) }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleReaderModal, { article: selected, readTime: readTime(selected.content), onClose: () => setSelected(null) })
  ] });
}
function ArticleCard({
  article,
  readTime,
  delay,
  onClick
}) {
  const teacher = article.academies?.teacher_name ?? article.academies?.name ?? "المعلم";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick, className: "group cursor-pointer bg-card-premium border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1", style: {
    animationDelay: `${delay}ms`
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-48 overflow-hidden bg-input/50", children: [
      article.cover_image_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.cover_image_url, alt: article.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-12 text-primary/30" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white text-base leading-snug line-clamp-2 drop-shadow-lg", children: article.title }) }),
      article.category && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/80 text-primary-foreground backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3" }),
        article.category
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4", children: [
        article.content.replace(/<[^>]*>/g, "").slice(0, 130),
        "..."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-gradient-primary grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3.5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: teacher })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
            " ",
            readTime,
            " د"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
            new Date(article.created_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "short"
            })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-primary font-semibold group-hover:gap-2 transition-all", children: [
      "اقرأ المقال ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" })
    ] }) })
  ] });
}
function ArticleReaderModal({
  article,
  readTime,
  onClose
}) {
  const teacher = article.academies?.teacher_name ?? article.academies?.name ?? "المعلم";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "bg-card border border-border/60 rounded-2xl w-full max-w-2xl shadow-elevated my-8 overflow-hidden", children: [
    article.cover_image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-56 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.cover_image_url, alt: article.title, className: "w-full h-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-4 left-4 size-9 bg-black/50 hover:bg-black/70 rounded-xl grid place-items-center text-white transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 rotate-180" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-white leading-tight drop-shadow-lg", children: article.title }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      !article.cover_image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black leading-tight flex-1", children: article.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "size-8 grid place-items-center rounded-lg hover:bg-white/10 shrink-0 mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 rotate-180" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 py-4 border-y border-border/60 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-gradient-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: teacher }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "كاتب المقال" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap", children: [
          article.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3" }),
            " ",
            article.category
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5" }),
            new Date(article.created_at).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5" }),
            " ",
            readTime,
            " دقيقة للقراءة"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: article.content.split("\n").filter(Boolean).map((para, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-7", children: para }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-5 border-t border-border/60 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onClose, className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 rotate-180" }),
        "العودة للمقالات"
      ] }) })
    ] })
  ] }) });
}
export {
  StudentArticlesPage as component
};
