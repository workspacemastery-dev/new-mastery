import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, Plus, Trash2, Edit2, Megaphone, X, Save,
  Bell, BellOff, Calendar, AlertCircle, Info, CheckCircle, Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/announcements")({
  head: () => ({ meta: [{ title: "الإعلانات — EduVerse" }] }),
  component: AnnouncementsPage,
});

type AnnouncementType = "info" | "warning" | "success" | "urgent";

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

const TYPE_CONFIG: Record<AnnouncementType, { label: string; icon: typeof Info; color: string; bg: string; border: string }> = {
  info:    { label: "معلومة",   icon: Info,         color: "text-blue-500",   bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  warning: { label: "تنبيه",    icon: AlertCircle,  color: "text-amber-500",  bg: "bg-amber-500/10",  border: "border-amber-500/30" },
  success: { label: "إيجابي",   icon: CheckCircle,  color: "text-emerald-500",bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
  urgent:  { label: "عاجل",     icon: Zap,          color: "text-red-500",    bg: "bg-red-500/10",    border: "border-red-500/30" },
};

function AnnouncementsPage() {
  const { user, role } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | "new" | null>(null);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (data) { setAcademyId(data.id); await load(data.id); }
      setLoading(false);
    })();
  }, [user, role]);

  async function load(aId: string) {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("academy_id", aId)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Announcement[]);
  }

  async function toggleActive(item: Announcement) {
    await supabase.from("announcements").update({ is_active: !item.is_active }).eq("id", item.id);
    setItems(items.map((a) => a.id === item.id ? { ...a, is_active: !a.is_active } : a));
  }

  async function remove(id: string) {
    if (!confirm("حذف الإعلان؟")) return;
    await supabase.from("announcements").delete().eq("id", id);
    setItems(items.filter((a) => a.id !== id));
  }

  const active = items.filter((a) => a.is_active);
  const inactive = items.filter((a) => !a.is_active);

  if (loading) return <PageContainer><div className="grid place-items-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div></PageContainer>;
  if (!academyId) return <PageContainer><div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center"><p className="text-muted-foreground">يجب تعيينك لأكاديمية أولاً.</p></div></PageContainer>;

  return (
    <PageContainer>
      <PageHeader
        title="الإعلانات"
        description="إنشاء وإدارة الإعلانات التي تظهر للطلاب عند تسجيل الدخول"
        actions={
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary"
          >
            <Plus className="size-4" /> إعلان جديد
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "إجمالي الإعلانات", value: items.length, icon: Megaphone, color: "text-primary", bg: "bg-primary/10" },
          { label: "نشط الآن",         value: active.length,   icon: Bell,     color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "موقوف",            value: inactive.length, icon: BellOff,  color: "text-muted-foreground", bg: "bg-input" },
        ].map((s) => (
          <div key={s.label} className="bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-4">
            <div className={`size-11 rounded-xl ${s.bg} grid place-items-center shrink-0`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {items.length === 0 && (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-16 text-center">
          <Megaphone className="size-12 mx-auto mb-3 opacity-20" />
          <p className="text-muted-foreground text-sm mb-4">لا توجد إعلانات بعد.</p>
          <button onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary">
            <Plus className="size-4" /> أنشئ أول إعلان
          </button>
        </div>
      )}

      {/* Active announcements */}
      {active.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-emerald-500 mb-3 flex items-center gap-2">
            <Bell className="size-4" /> نشطة ({active.length})
          </h2>
          <div className="space-y-3">
            {active.map((item) => <AnnouncementRow key={item.id} item={item} onToggle={toggleActive} onEdit={() => setEditing(item)} onDelete={() => remove(item.id)} />)}
          </div>
        </div>
      )}

      {/* Inactive announcements */}
      {inactive.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <BellOff className="size-4" /> موقوفة ({inactive.length})
          </h2>
          <div className="space-y-3">
            {inactive.map((item) => <AnnouncementRow key={item.id} item={item} onToggle={toggleActive} onEdit={() => setEditing(item)} onDelete={() => remove(item.id)} />)}
          </div>
        </div>
      )}

      {editing !== null && (
        <AnnouncementModal
          academyId={academyId}
          existing={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { await load(academyId); setEditing(null); }}
        />
      )}
    </PageContainer>
  );
}

function AnnouncementRow({ item, onToggle, onEdit, onDelete }: {
  item: Announcement;
  onToggle: (a: Announcement) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.icon;
  const expired = item.expires_at && new Date(item.expires_at) < new Date();

  return (
    <div className={`bg-card-premium border rounded-2xl p-4 flex items-start gap-4 transition-all ${item.is_active ? cfg.border : "border-border/40 opacity-60"}`}>
      <div className={`size-10 rounded-xl ${cfg.bg} grid place-items-center shrink-0 mt-0.5`}>
        <Icon className={`size-5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-bold text-sm">{item.title}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
          {expired && <span className="text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">منتهي الصلاحية</span>}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.body}</p>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(item.created_at).toLocaleDateString("ar-EG")}
          </span>
          {item.expires_at && (
            <span className="inline-flex items-center gap-1">
              ينتهي: {new Date(item.expires_at).toLocaleDateString("ar-EG")}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={() => onToggle(item)} title={item.is_active ? "إيقاف" : "تفعيل"}
          className={`size-8 grid place-items-center rounded-lg transition ${item.is_active ? "hover:bg-amber-500/20 text-amber-500" : "hover:bg-emerald-500/20 text-emerald-500"}`}>
          {item.is_active ? <BellOff className="size-4" /> : <Bell className="size-4" />}
        </button>
        <button onClick={onEdit} className="size-8 grid place-items-center rounded-lg hover:bg-primary/20 text-primary transition">
          <Edit2 className="size-4" />
        </button>
        <button onClick={onDelete} className="size-8 grid place-items-center rounded-lg hover:bg-destructive/20 text-destructive transition">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function AnnouncementModal({ academyId, existing, onClose, onSaved }: {
  academyId: string;
  existing?: Announcement;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [type, setType] = useState<AnnouncementType>(existing?.type ?? "info");
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);
  const [expiresAt, setExpiresAt] = useState(existing?.expires_at ? existing.expires_at.slice(0, 16) : "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    if (!title.trim()) { setErr("عنوان الإعلان مطلوب"); return; }
    if (!body.trim()) { setErr("نص الإعلان مطلوب"); return; }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        type,
        is_active: isActive,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      };
      if (existing) {
        const { error } = await supabase.from("announcements").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("announcements").insert({ ...payload, academy_id: academyId });
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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/60 rounded-2xl w-full max-w-lg shadow-elevated my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/15 grid place-items-center">
              <Megaphone className="size-4 text-primary" />
            </div>
            <h3 className="font-bold">{existing ? "تعديل الإعلان" : "إعلان جديد"}</h3>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-white/10"><X className="size-4" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview */}
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${TYPE_CONFIG[type].border} ${TYPE_CONFIG[type].bg}`}>
            <PreviewIcon className={`size-5 shrink-0 mt-0.5 ${TYPE_CONFIG[type].color}`} />
            <div className="min-w-0">
              <p className={`text-sm font-bold ${TYPE_CONFIG[type].color}`}>{title || "معاينة الإعلان"}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{body || "نص الإعلان سيظهر هنا..."}</p>
            </div>
          </div>

          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium mb-2">نوع الإعلان</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(TYPE_CONFIG) as [AnnouncementType, typeof TYPE_CONFIG.info][]).map(([key, cfg]) => {
                const Ic = cfg.icon;
                return (
                  <button key={key} type="button" onClick={() => setType(key)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition ${type === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "border-border/60 hover:bg-input text-muted-foreground"}`}>
                    <Ic className="size-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">عنوان الإعلان *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: اختبار الأسبوع القادم"
              className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium mb-1.5">نص الإعلان *</label>
            <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="اكتب تفاصيل الإعلان هنا..."
              className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-4 text-primary" /> تاريخ انتهاء الإعلان
              <span className="text-muted-foreground text-xs">(اختياري)</span>
            </label>
            <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-input/50 border border-border/60">
            <div>
              <p className="text-sm font-semibold">نشر الإعلان فوراً</p>
              <p className="text-xs text-muted-foreground">{isActive ? "سيظهر للطلاب عند دخولهم" : "لن يظهر للطلاب"}</p>
            </div>
            <button type="button" onClick={() => setIsActive(!isActive)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isActive ? "bg-emerald-500" : "bg-border"}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${isActive ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          {err && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">{err}</div>}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/60">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg glass hover:bg-white/10 text-sm">إلغاء</button>
          <button onClick={() => void save()} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow-primary disabled:opacity-60">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "جارٍ الحفظ..." : "حفظ الإعلان"}
          </button>
        </div>
      </div>
    </div>
  );
}
