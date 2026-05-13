import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { M as Megaphone } from "./megaphone-CBplyzyM.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { Z as Zap } from "./zap-B6eok_kT.js";
import { C as CircleCheckBig, I as Info } from "./info-DRB-b5T2.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { C as Calendar } from "./calendar-BmlfLAjy.js";
import { P as Pen } from "./pen-CLgFSF3R.js";
import { X } from "./x-yy412flO.js";
import { S as Save } from "./save-DaTgwH4R.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode);
const TYPE_CONFIG = {
  info: {
    label: "معلومة",
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30"
  },
  warning: {
    label: "تنبيه",
    icon: CircleAlert,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30"
  },
  success: {
    label: "إيجابي",
    icon: CircleCheckBig,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30"
  },
  urgent: {
    label: "عاجل",
    icon: Zap,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30"
  }
};
function AnnouncementsPage() {
  const {
    user,
    role
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [editing, setEditing] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const {
        data
      } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (data) {
        setAcademyId(data.id);
        await load(data.id);
      }
      setLoading(false);
    })();
  }, [user, role]);
  async function load(aId) {
    const {
      data
    } = await supabase.from("announcements").select("*").eq("academy_id", aId).order("created_at", {
      ascending: false
    });
    setItems(data ?? []);
  }
  async function toggleActive(item) {
    await supabase.from("announcements").update({
      is_active: !item.is_active
    }).eq("id", item.id);
    setItems(items.map((a) => a.id === item.id ? {
      ...a,
      is_active: !a.is_active
    } : a));
  }
  async function remove(id) {
    if (!confirm("حذف الإعلان؟")) return;
    await supabase.from("announcements").delete().eq("id", id);
    setItems(items.filter((a) => a.id !== id));
  }
  const active = items.filter((a) => a.is_active);
  const inactive = items.filter((a) => !a.is_active);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) });
  if (!academyId) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "يجب تعيينك لأكاديمية أولاً." }) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "الإعلانات", description: "إنشاء وإدارة الإعلانات التي تظهر للطلاب عند تسجيل الدخول", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      " إعلان جديد"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [{
      label: "إجمالي الإعلانات",
      value: items.length,
      icon: Megaphone,
      color: "text-primary",
      bg: "bg-primary/10"
    }, {
      label: "نشط الآن",
      value: active.length,
      icon: Bell,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }, {
      label: "موقوف",
      value: inactive.length,
      icon: BellOff,
      color: "text-muted-foreground",
      bg: "bg-input"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-11 rounded-xl ${s.bg} grid place-items-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: `size-5 ${s.color}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
      ] })
    ] }, s.label)) }),
    items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "size-12 mx-auto mb-3 opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "لا توجد إعلانات بعد." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " أنشئ أول إعلان"
      ] })
    ] }),
    active.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold text-emerald-500 mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
        " نشطة (",
        active.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: active.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementRow, { item, onToggle: toggleActive, onEdit: () => setEditing(item), onDelete: () => remove(item.id) }, item.id)) })
    ] }),
    inactive.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "size-4" }),
        " موقوفة (",
        inactive.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: inactive.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementRow, { item, onToggle: toggleActive, onEdit: () => setEditing(item), onDelete: () => remove(item.id) }, item.id)) })
    ] }),
    editing !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementModal, { academyId, existing: editing === "new" ? void 0 : editing, onClose: () => setEditing(null), onSaved: async () => {
      await load(academyId);
      setEditing(null);
    } })
  ] });
}
function AnnouncementRow({
  item,
  onToggle,
  onEdit,
  onDelete
}) {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.icon;
  const expired = item.expires_at && new Date(item.expires_at) < /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card-premium border rounded-2xl p-4 flex items-start gap-4 transition-all ${item.is_active ? cfg.border : "border-border/40 opacity-60"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-xl ${cfg.bg} grid place-items-center shrink-0 mt-0.5`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-5 ${cfg.color}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", children: item.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`, children: cfg.label }),
        expired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold", children: "منتهي الصلاحية" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-2", children: item.body }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
          new Date(item.created_at).toLocaleDateString("ar-EG")
        ] }),
        item.expires_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          "ينتهي: ",
          new Date(item.expires_at).toLocaleDateString("ar-EG")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onToggle(item), title: item.is_active ? "إيقاف" : "تفعيل", className: `size-8 grid place-items-center rounded-lg transition ${item.is_active ? "hover:bg-amber-500/20 text-amber-500" : "hover:bg-emerald-500/20 text-emerald-500"}`, children: item.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "size-8 grid place-items-center rounded-lg hover:bg-primary/20 text-primary transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
    ] })
  ] });
}
function AnnouncementModal({
  academyId,
  existing,
  onClose,
  onSaved
}) {
  const [title, setTitle] = reactExports.useState(existing?.title ?? "");
  const [body, setBody] = reactExports.useState(existing?.body ?? "");
  const [type, setType] = reactExports.useState(existing?.type ?? "info");
  const [isActive, setIsActive] = reactExports.useState(existing?.is_active ?? true);
  const [expiresAt, setExpiresAt] = reactExports.useState(existing?.expires_at ? existing.expires_at.slice(0, 16) : "");
  const [saving, setSaving] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  async function save() {
    setErr(null);
    if (!title.trim()) {
      setErr("عنوان الإعلان مطلوب");
      return;
    }
    if (!body.trim()) {
      setErr("نص الإعلان مطلوب");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        type,
        is_active: isActive,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
      };
      if (existing) {
        const {
          error
        } = await supabase.from("announcements").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("announcements").insert({
          ...payload,
          academy_id: academyId
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
  const PreviewIcon = TYPE_CONFIG[type].icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "bg-card border border-border/60 rounded-2xl w-full max-w-lg shadow-elevated my-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "size-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: existing ? "تعديل الإعلان" : "إعلان جديد" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "size-8 grid place-items-center rounded-lg hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-start gap-3 p-4 rounded-xl border ${TYPE_CONFIG[type].border} ${TYPE_CONFIG[type].bg}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewIcon, { className: `size-5 shrink-0 mt-0.5 ${TYPE_CONFIG[type].color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold ${TYPE_CONFIG[type].color}`, children: title || "معاينة الإعلان" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: body || "نص الإعلان سيظهر هنا..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: "نوع الإعلان" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
          const Ic = cfg.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setType(key), className: `flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition ${type === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "border-border/60 hover:bg-input text-muted-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ic, { className: "size-4" }),
            cfg.label
          ] }, key);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "عنوان الإعلان *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "مثال: اختبار الأسبوع القادم", className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1.5", children: "نص الإعلان *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, value: body, onChange: (e) => setBody(e.target.value), placeholder: "اكتب تفاصيل الإعلان هنا...", className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-1.5 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 text-primary" }),
          " تاريخ انتهاء الإعلان",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(اختياري)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: expiresAt, onChange: (e) => setExpiresAt(e.target.value), className: "w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-input/50 border border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "نشر الإعلان فوراً" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isActive ? "سيظهر للطلاب عند دخولهم" : "لن يظهر للطلاب" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsActive(!isActive), className: `relative w-12 h-6 rounded-full transition-colors duration-200 ${isActive ? "bg-emerald-500" : "bg-border"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${isActive ? "right-0.5" : "left-0.5"}` }) })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3", children: err })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 px-6 py-4 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2.5 rounded-lg glass hover:bg-white/10 text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void save(), disabled: saving, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary disabled:opacity-60", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
        saving ? "جارٍ الحفظ..." : "حفظ الإعلان"
      ] })
    ] })
  ] }) });
}
export {
  AnnouncementsPage as component
};
