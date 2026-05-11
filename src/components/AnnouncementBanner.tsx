import { useEffect, useState } from "react";
import { X, AlertCircle, Info, CheckCircle, Zap, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStudentAuth } from "@/hooks/useStudentAuth";

type AnnouncementType = "info" | "warning" | "success" | "urgent";

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  expires_at: string | null;
}

const TYPE_CONFIG: Record<AnnouncementType, {
  icon: typeof Info;
  bg: string;
  border: string;
  text: string;
  badge: string;
  glow: string;
}> = {
  info:    { icon: Info,         bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-600 dark:text-blue-400",    badge: "bg-blue-500/20 text-blue-600 dark:text-blue-300",    glow: "" },
  warning: { icon: AlertCircle,  bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-600 dark:text-amber-400",  badge: "bg-amber-500/20 text-amber-600 dark:text-amber-300", glow: "" },
  success: { icon: CheckCircle,  bg: "bg-emerald-500/10",border: "border-emerald-500/30",text: "text-emerald-600 dark:text-emerald-400",badge:"bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",glow:"" },
  urgent:  { icon: Zap,          bg: "bg-red-500/10",    border: "border-red-500/40",    text: "text-red-600 dark:text-red-400",      badge: "bg-red-500/20 text-red-600 dark:text-red-300",       glow: "shadow-[0_0_20px_-4px_rgba(239,68,68,0.3)]" },
};

const DISMISSED_KEY = "eduverse_dismissed_announcements";

// ✅ كل دوال localStorage محمية من SSR
function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]"); } catch { return []; }
}
function addDismissed(id: string) {
  if (typeof window === "undefined") return;
  const d = getDismissed();
  if (!d.includes(id)) localStorage.setItem(DISMISSED_KEY, JSON.stringify([...d, id]));
}

export function AnnouncementBanner() {
  const { session, loading } = useStudentAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ✅ تأكد إننا على الـ client قبل أي حاجة
  useEffect(() => {
    setMounted(true);
    setDismissed(getDismissed());
  }, []);

  useEffect(() => {
    if (!mounted || loading || !session?.academy_id) return;
    void (async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("announcements")
        .select("id, title, body, type, expires_at")
        .eq("academy_id", session.academy_id)
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order("created_at", { ascending: false });
      setAnnouncements((data ?? []) as Announcement[]);
    })();
  }, [session, loading, mounted]);

  // ✅ لا تعرض أي شيء قبل الـ mount على الـ client
  if (!mounted) return null;

  const visible = announcements.filter((a) => !dismissed.includes(a.id));

  function dismiss(id: string) {
    addDismissed(id);
    setDismissed((prev) => [...prev, id]);
    setCurrent((c) => Math.max(0, c - 1));
  }

  if (visible.length === 0) return null;

  const ann = visible[current] ?? visible[0];
  const cfg = TYPE_CONFIG[ann.type];
  const Icon = cfg.icon;

  return (
    <div className={`w-full rounded-2xl border ${cfg.bg} ${cfg.border} ${cfg.glow} p-4 mb-5`}>
      <div className="flex items-start gap-3">
        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.badge}`}>
          <Icon className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              <Megaphone className="size-3" /> إعلان
            </span>
            {ann.type === "urgent" && (
              <span className="text-[11px] font-bold text-red-500 animate-pulse">● عاجل</span>
            )}
            {visible.length > 1 && (
              <span className="text-[11px] text-muted-foreground">{current + 1} / {visible.length}</span>
            )}
          </div>
          <p className={`text-sm font-bold mb-0.5 ${cfg.text}`}>{ann.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{ann.body}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {visible.length > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrent((c) => (c - 1 + visible.length) % visible.length)}
                className="size-7 grid place-items-center rounded-lg hover:bg-white/10 text-muted-foreground text-xs font-bold">›</button>
              <button onClick={() => setCurrent((c) => (c + 1) % visible.length)}
                className="size-7 grid place-items-center rounded-lg hover:bg-white/10 text-muted-foreground text-xs font-bold">‹</button>
            </div>
          )}
          <button onClick={() => dismiss(ann.id)}
            className="size-7 grid place-items-center rounded-lg hover:bg-white/10 text-muted-foreground transition">
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {visible.length > 1 && (
        <div className="flex items-center gap-1.5 mt-3 justify-center">
          {visible.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${i === current ? `w-5 h-1.5 ${cfg.text.replace("text-", "bg-")}` : "w-1.5 h-1.5 bg-border"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

